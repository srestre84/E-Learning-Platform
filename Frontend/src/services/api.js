import axios from 'axios';

/**
 * Configuración base de la API
 * Usamos rutas relativas ya que el proxy manejará el prefijo
 */
const API_PREFIX = '/api';

// Tiempo máximo de espera para las peticiones (30 segundos)
const REQUEST_TIMEOUT = 30000;

// Crear una instancia de Axios con configuración base
const api = axios.create({
  baseURL: API_PREFIX,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Importante para mantener las cookies de autenticación
});

/**
 * Maneja el cierre de sesión y la limpieza
 * @param {Function} logout - Función opcional de cierre de sesión
 */
const handleLogout = (logout) => {
  if (typeof logout === 'function') {
    logout();
  } else {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  }
  
  // Redirigir al login si no estamos ya en esa ruta
  if (window.location.pathname !== '/auth') {
    window.location.href = '/auth';
  }
};

/**
 * Interceptor para manejar errores globales
 */
const setupResponseInterceptors = (logout) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error?.config;
      
      // Si no hay configuración de la petición, rechazamos con el error original
      if (!originalRequest) {
        return Promise.reject(error);
      }
      
      // Si el error es por tiempo de espera y no hemos reintentado aún
      if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
        originalRequest._retry = true;
        return api(originalRequest);
      }

      // Manejar errores de red
      if (error.code === 'ERR_NETWORK') {
        return Promise.reject(new Error('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.'));
      }

      // Si no hay respuesta del servidor
      if (!error.response) {
        return Promise.reject(new Error('No se pudo conectar con el servidor. Por favor intente nuevamente más tarde.'));
      }

      const { status, data } = error.response;
      
      // Manejar errores de autenticación
      if (status === 401) {
        // Si ya intentamos refrescar el token y falló, cerramos sesión
        if (originalRequest.url.includes('/auth/refresh-token') || originalRequest._retry) {
          handleLogout(logout);
          return Promise.reject(new Error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.'));
        }
        
        // Intentar refrescar el token
        try {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (!refreshToken) {
            handleLogout(logout);
            return Promise.reject(new Error('No se encontró el token de actualización. Por favor inicia sesión nuevamente.'));
          }
          
          // Llamar al endpoint de refresh token
          const response = await api.post('/auth/refresh-token', { refreshToken });
          const { token } = response.data;
          
          // Actualizar el token en localStorage
          localStorage.setItem('token', token);
          
          // Actualizar el header de autorización
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // Reintentar la petición original
          return api(originalRequest);
        } catch (refreshError) {
          handleLogout(logout);
          return Promise.reject(new Error('Error al renovar la sesión. Por favor inicia sesión nuevamente.'));
        }
      }
      
      // Mapeo de códigos de error a mensajes
      const errorMessages = {
        400: 'Solicitud incorrecta',
        403: 'No tienes permisos para realizar esta acción',
        404: 'Recurso no encontrado',
        500: 'Error interno del servidor. Por favor intente más tarde.'
      };
      
      // Obtener el mensaje de error o usar uno por defecto
      const errorMessage = data?.message || errorMessages[status] || 'Ha ocurrido un error inesperado';
      
      return Promise.reject(new Error(errorMessage));
    }
  );
};

/**
 * Configura el interceptor de autenticación
 * @param {Function} logout - Función para cerrar sesión
 */
const setupAuthInterceptor = (logout) => {
  // Interceptor para agregar el token a las peticiones
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Configurar interceptor de respuestas
  setupResponseInterceptors(logout);
};

export { api, setupAuthInterceptor, setupResponseInterceptors };
export default api;
