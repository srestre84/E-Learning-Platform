import  api  from './api';

/**
 * Servicio para operaciones administrativas
 */
export const adminService = {
  /**
   * Obtiene estadísticas generales del sistema
   * @returns {Promise<Object>} Estadísticas del sistema
   */
  async getStats() {
    try {
      const response = await api.get('/api/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los usuarios del sistema
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getAllUsers() {
    try {
      const response = await api.get('/api/users/all');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  /**
   * Obtiene cursos activos para administración
   * @returns {Promise<Array>} Lista de cursos activos
   */
  async getActiveCourses() {
    try {
      const response = await api.get('/api/courses/admin/active');
      return response.data;
    } catch (error) {
      console.error('Error al obtener cursos activos:', error);
      throw error;
    }
  },

  /**
   * Obtiene inscripciones recientes
   * @returns {Promise<Array>} Lista de inscripciones recientes
   */
  async getRecentEnrollments() {
    try {
      const response = await api.get('/api/enrollments/recent');
      return response.data;
    } catch (error) {
      console.error('Error al obtener inscripciones recientes:', error);
      throw error;
    }
  },

  /**
   * Obtiene estadísticas de inscripciones
   * @returns {Promise<Array>} Estadísticas de inscripciones por curso
   */
  async getEnrollmentStats() {
    try {
      const response = await api.get('/api/enrollments/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de inscripciones:', error);
      throw error;
    }
  }
};
