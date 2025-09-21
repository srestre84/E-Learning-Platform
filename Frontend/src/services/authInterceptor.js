// src/services/authInterceptor.js
import api from "./api";

// Track if interceptors have been set up to prevent duplicates
let responseInterceptorId = null;

export const setupAuthInterceptor = () => {
  api.interceptors.request.use((config) => {
    // No agregar token a las peticiones de login/register
    if (config.url?.includes('/auth/login') || config.url?.includes('/auth/register')) {
      return config;
    }
    
    // Obtener token del localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

export const setupResponseInterceptors = (logoutCallback) => {
  // Remove existing interceptor if it exists
  if (responseInterceptorId !== null) {
    api.interceptors.response.eject(responseInterceptorId);
  }
  
  // Set up new interceptor
  responseInterceptorId = api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Call the logout callback if provided
        if (logoutCallback && typeof logoutCallback === 'function') {
          try {
            logoutCallback();
          } catch (callbackError) {
            console.warn('Error in logout callback:', callbackError);
          }
        }
      }
      return Promise.reject(error);
    }
  );
};

export const removeResponseInterceptors = () => {
  if (responseInterceptorId !== null) {
    api.interceptors.response.eject(responseInterceptorId);
    responseInterceptorId = null;
  }
};
  
