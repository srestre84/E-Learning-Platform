// src/services/courseService.js
import api from './api';

/**
 * Servicio para operaciones relacionadas con cursos
 * Maneja todas las operaciones CRUD de cursos
 */
class CourseService {
  /**
   * Obtiene todos los cursos disponibles
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Array>} Lista de cursos
   */
  async getCourses(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.category) params.append('category', filters.category);
      if (filters.level) params.append('level', filters.level);
      if (filters.price) params.append('price', filters.price);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/api/courses?${params.toString()}`);
      return {
        success: true,
        courses: response.data.courses || response.data,
        pagination: response.data.pagination
      };

    } catch (error) {
      console.error('Error al obtener cursos:', error);
      throw error;
    }
  }

  /**
   * Obtiene un curso por ID
   * @param {string} courseId - ID del curso
   * @returns {Promise<Object>} Datos del curso
   */
  async getCourseById(courseId) {
    try {
      const response = await api.get(`/api/courses/${courseId}`);
      return {
        success: true,
        course: response.data
      };

    } catch (error) {
      console.error('Error al obtener curso:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo curso
   * @param {Object} courseData - Datos del curso
   * @returns {Promise<Object>} Curso creado
   */
  async createCourse(courseData) {
    try {
      const response = await api.post('/api/courses', courseData);
      return {
        success: true,
        course: response.data,
        message: 'Curso creado exitosamente'
      };

    } catch (error) {
      console.error('Error al crear curso:', error);
      throw error;
    }
  }

  /**
   * Actualiza un curso existente
   * @param {string} courseId - ID del curso
   * @param {Object} courseData - Datos actualizados
   * @returns {Promise<Object>} Curso actualizado
   */
  async updateCourse(courseId, courseData) {
    try {
      const response = await api.put(`/api/courses/${courseId}`, courseData);
      return {
        success: true,
        course: response.data,
        message: 'Curso actualizado exitosamente'
      };

    } catch (error) {
      console.error('Error al actualizar curso:', error);
      throw error;
    }
  }

  /**
   * Elimina un curso
   * @param {string} courseId - ID del curso
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteCourse(courseId) {
    try {
      await api.delete(`/api/courses/${courseId}`);
      return {
        success: true,
        message: 'Curso eliminado exitosamente'
      };

    } catch (error) {
      console.error('Error al eliminar curso:', error);
      throw error;
    }
  }

  /**
   * Obtiene los cursos del instructor actual
   * @returns {Promise<Array>} Lista de cursos del instructor
   */
  async getInstructorCourses() {
    try {
      const response = await api.get('/api/courses/instructor');
      return {
        success: true,
        courses: response.data
      };

    } catch (error) {
      console.error('Error al obtener cursos del instructor:', error);
      throw error;
    }
  }

  /**
   * Obtiene los cursos comprados por el estudiante
   * @returns {Promise<Array>} Lista de cursos comprados
   */
  async getPurchasedCourses() {
    try {
      const response = await api.get('/api/courses/purchased');
      return {
        success: true,
        courses: response.data
      };

    } catch (error) {
      console.error('Error al obtener cursos comprados:', error);
      throw error;
    }
  }

  /**
   * Compra un curso
   * @param {string} courseId - ID del curso
   * @param {Object} paymentData - Datos de pago
   * @returns {Promise<Object>} Resultado de la compra
   */
  async purchaseCourse(courseId, paymentData) {
    try {
      const response = await api.post(`/api/courses/${courseId}/purchase`, paymentData);
      return {
        success: true,
        purchase: response.data,
        message: 'Curso comprado exitosamente'
      };

    } catch (error) {
      console.error('Error al comprar curso:', error);
      throw error;
    }
  }

  /**
   * Obtiene el progreso del estudiante en un curso
   * @param {string} courseId - ID del curso
   * @returns {Promise<Object>} Progreso del curso
   */
  async getCourseProgress(courseId) {
    try {
      const response = await api.get(`/api/courses/${courseId}/progress`);
      return {
        success: true,
        progress: response.data
      };

    } catch (error) {
      console.error('Error al obtener progreso del curso:', error);
      throw error;
    }
  }

  /**
   * Marca una lección como completada
   * @param {string} courseId - ID del curso
   * @param {string} lessonId - ID de la lección
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async completeLesson(courseId, lessonId) {
    try {
      const response = await api.post(`/api/courses/${courseId}/lessons/${lessonId}/complete`);
      return {
        success: true,
        progress: response.data,
        message: 'Lección marcada como completada'
      };

    } catch (error) {
      console.error('Error al completar lección:', error);
      throw error;
    }
  }

  /**
   * Obtiene las categorías de cursos
   * @returns {Promise<Array>} Lista de categorías
   */
  async getCategories() {
    try {
      const response = await api.get('/api/courses/categories');
      return {
        success: true,
        categories: response.data
      };

    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }

  /**
   * Sube una imagen para el curso
   * @param {string} courseId - ID del curso
   * @param {File} imageFile - Archivo de imagen
   * @returns {Promise<Object>} URL de la imagen subida
   */
  async uploadCourseImage(courseId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post(`/api/courses/${courseId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: true,
        imageUrl: response.data.imageUrl,
        message: 'Imagen subida exitosamente'
      };

    } catch (error) {
      console.error('Error al subir imagen del curso:', error);
      throw error;
    }
  }
}

// Exportar instancia única del servicio
export default new CourseService();