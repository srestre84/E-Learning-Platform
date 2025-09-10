import axios from 'axios';

// Crear una instancia de Axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL base de tu API
  timeout: 30000, // Aumentar el timeout a 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Si el error es por tiempo de espera y no hemos reintentado aún
    if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
      originalRequest._retry = true;
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

// Interceptor para agregar el token de autenticación a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
export const setupResponseInterceptors = (logout) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Si el servidor responde con un error de autenticación
        if (error.response.status === 401) {
          // Si hay un callback de logout, lo ejecutamos
          if (logout) {
            logout();
          } else {
            // Si no hay callback, limpiamos el localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          
          // Redirigir al login si no estamos ya en esa ruta
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        
        // Manejar otros códigos de error comunes
        switch (error.response.status) {
          case 403:
            console.error('Acceso denegado: No tienes permisos para realizar esta acción');
            break;
          case 404:
            console.error('Recurso no encontrado');
            break;
          case 500:
            console.error('Error interno del servidor');
            break;
          default:
            console.error(`Error ${error.response.status}: ${error.response.data?.message || 'Error desconocido'}`);
        }
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        console.error('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.');
      } else {
        // Algo ocurrió en la configuración de la petición que generó un error
        console.error('Error al configurar la petición:', error.message);
      }
      
      return Promise.reject(error);
    }
  );
};

export default api;
