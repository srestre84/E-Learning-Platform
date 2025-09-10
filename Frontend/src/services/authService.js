import api from "./api";

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} true si el usuario está autenticado, false en caso contrario
 */
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Devuelve true si existe un token, false si no
};

/**
 * Registra un nuevo usuario
 * @param {Object} userData - Datos del usuario a registrar
 * @param {string} userData.firstName - Nombre del usuario
 * @param {string} userData.lastName - Apellido del usuario
 * @param {string} userData.email - Email del usuario (debe ser único)
 * @param {string} userData.password - Contraseña del usuario (mínimo 6 caracteres)
 * @param {string} userData.role - Rol del usuario (STUDENT, INSTRUCTOR, ADMIN)
 * @returns {Promise<Object>} Datos del usuario registrado
 */
const register = async ({ firstName, lastName, email, password, role }) => {
  try {
    const response = await api.post('/api/users/register', {
      userName: firstName,
      lastName,
      email,
      password,
      role: role || 'STUDENT' // Por defecto STUDENT si no se especifica
    });

    // Si el registro es exitoso, hacemos login automáticamente
  
    return response.data;
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error.response?.data || { message: 'Error al registrar el usuario' };
  }
};

/**
 * Inicia sesión de usuario
 * @param {Object} credentials - Credenciales de inicio de sesión
 * @param {string} credentials.email - Email del usuario
 * @param {string} credentials.password - Contraseña del usuario
 * @returns {Promise<Object>} Datos del usuario y token de autenticación
 */
const login = async ({ email, password }) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password
    });

    // Guardar el token en localStorage
    localStorage.setItem('token', response.data.token);
    
    // Guardar datos del usuario en localStorage
    const userData = {
      id: response.data.userId,
      userName: response.data.userName,
      email: response.data.email,
      role: response.data.role,
      isActive: response.data.isActive
    };
    localStorage.setItem('user', JSON.stringify(userData));

    return userData;
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    throw error.response?.data || { message: 'Error al iniciar sesión' };
  }
};

/**
 * Cierra la sesión del usuario
 * @returns {void}
 */
const logout = () => {
  // Eliminar el token y los datos del usuario del localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Obtiene los datos del usuario actualmente autenticado
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
const getCurrentUser = async () => {
  try {
    // Primero intentamos obtener los datos del localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData);
    }

    // Si no hay datos en localStorage, los solicitamos al servidor
    const response = await api.get('/api/users/profile');
    
    // Guardamos los datos en localStorage para futuras solicitudes
    localStorage.setItem('user', JSON.stringify(response.data));
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
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
    const response = await api.get(`/auth/validate?token=${token}`);
    return response.data.valid === true;
  } catch (error) {
    console.error('Error al validar el token:', error);
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
    const response = await api.put('/api/users/profile', userData);
    
    // Actualizar los datos del usuario en localStorage
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    throw error.response?.data || { message: 'Error al actualizar el perfil' };
  }
};

const authService = {
  isAuthenticated,
  register,
  login,
  logout,
  getCurrentUser,
  validateToken,
  updateProfile
};

export default authService;
