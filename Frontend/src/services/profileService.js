import api from "./api";
//import { getUser as getStoredUser, setUser, removeUser } from './authStorage';

/**
 * Obtiene los datos del usuario actualmente autenticado
 * @param {boolean} forceRefresh - Si es true, fuerza la actualización desde el servidor
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
const getCurrentUser = async (forceRefresh = false) => {
  try {
    if (!forceRefresh) {
      // Primero intentamos obtener los datos del almacenamiento local
      const userData = getStoredUser();
      if (userData) {
        return userData;
      }
    }

    // Si se fuerza la actualización o no hay datos locales, los solicitamos al servidor
    const response = await api.get('/api/users/profile');
    
    if (response.data) {
      const userData = {
        id: response.data.id,
        userName: response.data.userName,
        lastName: response.data.lastName,
        email: response.data.email,
        role: response.data.role,
        isActive: response.data.isActive,
        profileImageUrl: response.data.profileImageUrl,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt
      };
      
      setUser(userData);
      return userData;
    }
  } catch (error) {
    console.error('Error al cargar el perfil del usuario:', error.message);
    if (error.response?.status === 401) {
      // Token inválido o expirado
      removeUser();
    }
    throw error.response?.data || { message: 'Error al obtener el perfil del usuario' };
  }
};

/**
 * Actualiza el perfil del usuario actual
 * @param {Object} userData - Datos actualizados del usuario
 * @returns {Promise<Object>} Datos actualizados del usuario
 */
const updateProfile = async (userData) => {
  try {
    const response = await api.put('/api/users/profile', {
      userName: userData.userName,
      lastName: userData.lastName,
      email: userData.email,
      profileImageUrl: userData.profileImageUrl
    });
    
    if (response.data) {
      const updatedUser = {
        id: response.data.id,
        userName: response.data.userName,
        lastName: response.data.lastName,
        email: response.data.email,
        role: response.data.role,
        isActive: response.data.isActive,
        profileImageUrl: response.data.profileImageUrl,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt
      };
      
      setUser(updatedUser);
      return updatedUser;
    }
  } catch (error) {
    console.error('Error al guardar los cambios del perfil:', error.message);
    throw error.response?.data || { message: 'Error al actualizar el perfil' };
  }
};

/**
 * Actualiza la contraseña del usuario
 * @param {string} currentPassword - Contraseña actual
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<Object>} Resultado de la operación
 */
const updatePassword = async ({ currentPassword, newPassword }) => {
  try {
    const response = await api.put('/api/users/me/password', {
      currentPassword,
      newPassword
    });
    
    return { success: true, message: 'Contraseña actualizada correctamente' };
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error.message);
    throw error.response?.data || { 
      message: error.response?.data?.message || 'Error al actualizar la contraseña' 
    };
  }
};

export default {
  getCurrentUser,
  updateProfile,
  updatePassword
};
