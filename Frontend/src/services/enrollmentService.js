// src/services/enrollmentService.js
import api from './api';

export const enrollInCourse = async (courseId) => {
  try {
    const response = await api.post('/api/enrollments', { courseId });
    return response.data;
  } catch (error) {
    console.error('Enrollment error:', error.response);

    if (error.response?.status === 403) {
      throw new Error('No tienes permiso para inscribirte en este curso');
    }
    if (error.response?.status === 401) {
      throw new Error('Debes iniciar sesión para inscribirte');
    }

    throw new Error('Error de servidor. Inténtalo más tarde');
  }
};

export const getActiveEnrollments = async () => {
  try {
    const response = await api.get(`/api/enrollments/my-courses`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los cursos activos:", error);
    throw new Error(
      error.response?.data?.message || "No se pudieron cargar los cursos activos. Por favor, inténtalo de nuevo."
    );
  }
};

export const getCompletedEnrollments = async () => {
  try {
    const response = await api.get(`/api/enrollments/my-courses/completed`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los cursos completados:", error);
    throw new Error(
      error.response?.data?.message || "No se pudieron cargar los cursos completados. Por favor, inténtalo de nuevo."
    );
  }
};

export const getAllEnrollments = async () => {
  try {
    const response = await api.get(`/api/enrollments/my-courses/all`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener todos los cursos:", error);
    throw new Error(
      error.response?.data?.message || "No se pudo cargar todos los cursos. Por favor, inténtalo de nuevo."
    );
  }
};

export const getEnrolledCourses = async () => {
  try {
    const response = await api.get(`/api/enrollments/my-courses`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los cursos a los cuales estoy inscrito:", error);
    throw new Error(
      error.response?.data?.message || "No se pudo cargar los cursos. Por favor, inténtalo de nuevo."
    );
  }
};

export const checkEnrollment = async (courseId) => {
  try {
    const response = await api.get(`/api/enrollments/check/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Error al verificar inscripción:", error);
    // Si hay error, asumimos que no está inscrito
    return { isEnrolled: false };
  }
};

/**
 * Desinscribirse de un curso
 * @param {number} enrollmentId - ID de la inscripción
 * @returns {Promise<Object>} Resultado de la desinscripción
 */
export const unenrollFromCourse = async (enrollmentId) => {
  try {
    const response = await api.delete(`/api/enrollments/${enrollmentId}`);
    return response.data;
  } catch (error) {
    console.error("Error al desinscribirse del curso:", error);

    if (error.response?.status === 404) {
      throw new Error("No se encontró la inscripción");
    }
    if (error.response?.status === 403) {
      throw new Error("No tienes permiso para desinscribirte de este curso");
    }
    if (error.response?.status === 401) {
      throw new Error("Debes iniciar sesión para realizar esta acción");
    }

    throw new Error(
      error.response?.data?.message ||
      "Error al desinscribirse del curso. Inténtalo más tarde"
    );
  }
};

/**
 * Actualizar el progreso de un curso
 * @param {number} enrollmentId - ID de la inscripción
 * @param {number} progress - Progreso del curso (0-100)
 * @returns {Promise<Object>} Resultado de la actualización
 */
export const updateCourseProgress = async (enrollmentId, progress) => {
  try {
    const response = await api.put(`/api/enrollments/${enrollmentId}/progress`, {
      progressPercentage: progress
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el progreso:", error);

    if (error.response?.status === 404) {
      throw new Error("No se encontró la inscripción");
    }
    if (error.response?.status === 403) {
      throw new Error("No tienes permiso para actualizar este curso");
    }
    if (error.response?.status === 400) {
      throw new Error("El progreso debe estar entre 0 y 100");
    }

    throw new Error(
      error.response?.data?.message ||
      "Error al actualizar el progreso. Inténtalo más tarde"
    );
  }
};

/**
 * Marcar un curso como completado
 * @param {number} enrollmentId - ID de la inscripción
 * @returns {Promise<Object>} Resultado de la operación
 */
export const markCourseAsCompleted = async (enrollmentId) => {
  try {
    const response = await api.put(`/api/enrollments/${enrollmentId}/complete`);
    return response.data;
  } catch (error) {
    console.error("Error al marcar curso como completado:", error);

    if (error.response?.status === 404) {
      throw new Error("No se encontró la inscripción");
    }
    if (error.response?.status === 403) {
      throw new Error("No tienes permiso para completar este curso");
    }
    if (error.response?.status === 400) {
      throw new Error("No se puede completar el curso en este momento");
    }

    throw new Error(
      error.response?.data?.message ||
      "Error al completar el curso. Inténtalo más tarde"
    );
  }
};