import api from './api';

const courseService = {
  /**
   * Obtiene la lista de cursos con opciones de filtrado
   * @param {Object} filters - Filtros opcionales (search, category, level, etc.)
   * @returns {Promise<Array>} Lista de cursos
   */
  async getCourses(filters = {}) {
    try {
      const response = await api.get('/api/courses', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error al obtener la lista de cursos:', error.message);
      throw error;
    }
  },

  /**
   * Obtiene los detalles de un curso específico
   * @param {string|number} courseId - ID del curso
   * @returns {Promise<Object>} Detalles del curso
   */
  async getCourseById(courseId) {
    try {
      const response = await api.get(`/api/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener los detalles del curso (ID: ${courseId}):`, error.message);
      throw error;
    }
  },

  /**
   * Obtiene las categorías de cursos disponibles
   * @returns {Promise<Array>} Lista de categorías
   */
  async getCategories() {
    try {
      const response = await api.get('/api/categories');
      return response.data;
    } catch (error) {
      console.error('Error al cargar las categorías de cursos:', error.message);
      // Retornar categorías por defecto en caso de error
      return [
        { id: 'todos', name: 'Todos los cursos' },
        { id: 'frontend', name: 'Frontend Development' },
        { id: 'backend', name: 'Backend Development' },
        { id: 'fullstack', name: 'Full Stack Development' },
        { id: 'mobile', name: 'Mobile Development' },
        { id: 'data', name: 'Data Science & AI' },
        { id: 'design', name: 'UI/UX Design' },
        { id: 'devops', name: 'DevOps & Cloud' },
      ];
    }
  },

  /**
   * Obtiene los niveles de dificultad disponibles
   * @returns {Promise<Array>} Lista de niveles
   */
  async getLevels() {
    try {
      const response = await api.get('/api/levels');
      return response.data;
    } catch (error) {
      console.error('Error al cargar los niveles de dificultad:', error.message);
      // Retornar niveles por defecto en caso de error
      return [
        { id: 'todos', name: 'Todos los niveles' },
        { id: 'principiante', name: 'Principiante' },
        { id: 'intermedio', name: 'Intermedio' },
        { id: 'avanzado', name: 'Avanzado' },
      ];
    }
  },
};

export default courseService;
