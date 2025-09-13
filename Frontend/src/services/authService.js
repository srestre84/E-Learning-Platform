import api, { setupAuthInterceptor } from "./api";

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} true si el usuario está autenticado, false en caso contrario
 */
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

/**
 * Registra un nuevo usuario
 * @param {Object} userData - Datos del usuario a registrar
 * @param {string} userData.firstName - Nombre del usuario
 * @param {string} userData.lastName - Apellido del usuario
 * @param {string} userData.email - Email del usuario (debe ser único)
 * @param {string} userData.password - Contraseña del usuario (mínimo 6 caracteres)
 * @param {string} [userData.role=STUDENT] - Rol del usuario (STUDENT, INSTRUCTOR, ADMIN)
 * @returns {Promise<Object>} Datos del usuario registrado
 */
const register = async ({ firstName, lastName, email, password, role = 'STUDENT' }) => {
  try {
    const response = await api.post('/users/register', {
      userName: firstName,
      lastName,
      email,
      password,
      role
    });

    // Si el registro es exitoso, hacemos login automáticamente
    if (response.data) {
      return await login({ email, password });
    }
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al registrar el usuario';
    throw new Error(errorMessage);
  }
};

/**
 * Inicia sesión de usuario
 * @param {Object} credentials - Credenciales de inicio de sesión
 * @param {string} credentials.email - Email del usuario
 * @param {string} credentials.password - Contraseña del usuario
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
const login = async ({ email, password }) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    if (!response.data?.token) {
      throw new Error('No se recibió el token de autenticación');
    }

    const { token, refreshToken, user } = response.data;
    
    // Guardar tokens y datos del usuario
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    const userData = {
      id: user?.id || response.data.userId,
      userName: user?.userName || response.data.userName,
      email: user?.email || email,
      role: user?.role || response.data.role,
      isActive: user?.isActive ?? true
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Configurar interceptor de autenticación
    setupAuthInterceptor(logout);
    
    return userData;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
    throw new Error(errorMessage);
  }
};

/**
 * Cierra la sesión del usuario
 * @returns {void}
 */
const logout = () => {
  // Limpiar datos de autenticación
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Redirigir al login
  if (window.location.pathname !== '/auth') {
    window.location.href = '/auth';
  }
};

/**
 * Obtiene los datos del usuario actualmente autenticado
 * @returns {Promise<Object|null>} Datos del usuario autenticado o null si no está autenticado
 */
const getCurrentUser = async () => {
  try {
    // Primero intentamos obtener los datos del localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData);
    }

    // Si no hay datos en localStorage, los solicitamos al servidor
    const response = await api.get('/users/profile');
    
    if (response.data) {
      // Guardamos los datos en localStorage para futuras solicitudes
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
    
    return null;
  } catch (error) {
    // Si hay un error (por ejemplo, token inválido), cerramos la sesión
    logout();
    return null;
  }
};

/**
 * Valida si el token actual es válido
 * @returns {Promise<boolean>} true si el token es válido, false en caso contrario
 */
const validateToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    // Verificar formato básico del token
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      logout();
      return false;
    }

    // Verificar expiración local
    try {
      const tokenData = JSON.parse(atob(tokenParts[1]));
      if (tokenData.exp && tokenData.exp * 1000 < Date.now()) {
        logout();
        return false;
      }
    } catch (e) {
      // Si hay un error al decodificar, consideramos el token inválido
      logout();
      return false;
    }

    // Validar con el servidor
    const response = await api.get('/auth/validate');
    return response.data?.valid || false;
  } catch (error) {
    // Si hay un error en la validación, cerramos sesión
    logout();
    return false;
  }
};

/**
 * Verifica si un token es válido
 * @param {string} token - Token a verificar
 * @returns {Promise<boolean>} true si el token es válido, false en caso contrario
 */
const verifyToken = async (token) => {
  try {
    if (!token) return false;
    
    const response = await api.get('/auth/validate', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data?.valid || false;
  } catch (error) {
    return false;
  }
};

/**
 * Actualiza el perfil del usuario actual
 * @param {Object} userData - Datos actualizados del usuario
 * @returns {Promise<Object>} Datos actualizados del usuario
 */
const updateProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    
    // Actualizar datos del usuario en localStorage
    if (response.data) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al actualizar el perfil';
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene el token de autenticación actual
 * @returns {string|null} Token de autenticación o null si no existe o es inválido
 */
const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  // Verificar si el token está a punto de expirar
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const tokenData = JSON.parse(atob(tokenParts[1]));
      const now = Date.now() / 1000;
      
      // Si el token expira en menos de 5 minutos, considerarlo inválido
      if (tokenData.exp && tokenData.exp - now < 300) {
        logout();
        return null;
      }
    }
  } catch (e) {
    return null;
  }
  
  return token;
};

/**
 * Establece el token de autenticación
 * @param {string} token - Token de autenticación
 * @param {string} [refreshToken] - Token de actualización (opcional)
 * @returns {void}
 */
const setToken = (token, refreshToken) => {
  if (token) {
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};

/**
 * Servicio de autenticación
 */
const authService = {
  isAuthenticated,
  verifyToken,
  register,
  login,
  logout,
  getCurrentUser,
  validateToken,
  updateProfile,
  getToken,
  setToken,
};

export default authService;
