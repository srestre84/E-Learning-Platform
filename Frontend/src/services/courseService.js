// Obtener subcategorías por categoría (para edición de curso)
export const getSubcategoriesByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/api/categories/${categoryId}/subcategories`);
    return ensureArray(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al cargar subcategorías:", error);
    throw handleApiError(error, "No tienes permiso para esta acción");
  }
};
// Eliminar curso (versión develop)
export const deleteCourse = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.delete(`/api/courses/${courseId}`, { headers });
    return response.data;
  } catch (error) {
    let errorMessage = "Error al eliminar el curso. Por favor, inténtalo de nuevo.";
    if (error.response?.status === 401) {
      errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
    } else if (error.response?.status === 403) {
      errorMessage = "No tienes permisos para eliminar este curso.";
    } else if (error.response?.status === 404) {
      errorMessage = "El curso no fue encontrado.";
    } else if (error.response?.status === 400) {
      errorMessage = "No se puede eliminar un curso con estudiantes inscritos.";
    } else if (error.response?.status === 500) {
      errorMessage = "Error interno del servidor. Verifica tu conexión e inténtalo de nuevo.";
    } else if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    }
    throw new Error(errorMessage);
  }
};
// src/services/courseService.js
import api from "./api";
import { processApiResponse, ensureArray, ensureObject, handleApiError } from "./apiUtils";

export const getCourses = async () => {
  try {
    const response = await api.get("/api/courses");
    return ensureArray(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al cargar los cursos:", error);
    throw handleApiError(error, "Error al cargar los cursos");
  }
};


export const getCategories = async () => {
  try {
    const response = await api.get("/api/categories");
    return ensureArray(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
    throw handleApiError(error, "No tienes permiso para esta acción");
  }
};

export const getLevels = async () => {
  try {
    const response = await api.get("/api/levels");
    return ensureArray(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al cargar los niveles:", error);
    throw handleApiError(error, "No tienes permiso para esta acción");
  }
};

export const updateCourse = async (id, courseData) => {
  try {
    const response = await api.put(`/api/courses/${id}`, courseData);
    return ensureObject(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al actualizar el curso:", error);
    throw handleApiError(error, "Error al actualizar el curso. Por favor, inténtalo de nuevo.");
  }
}

export const getCourseById = async (id) => {
  try {
    const response = await api.get(`/api/courses/${id}`);
    return ensureObject(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al obtener el curso:", error);
    throw handleApiError(error, "Error al obtener el curso. Por favor, inténtalo de nuevo.");
  }
}

export const createCourse = async (courseData) => {
  try {
    const response = await api.post("/api/courses", courseData);
    return ensureObject(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al crear el curso:", error);
    throw handleApiError(error, "Error al crear el curso. Por favor, inténtalo de nuevo.");
  }
};

export const getCoursesByInstructorId = async (instructorId) => {
  try {
    const response = await api.get(`/api/courses/instructor/${instructorId}`);
    return ensureArray(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al obtener los cursos del instructor:", error);
    throw handleApiError(error, "Error al obtener los cursos del instructor. Por favor, inténtalo de nuevo.");
  }
}


export const getStudentsByCourseId = async (courseId) => {
  try {
    const response = await api.get(`/api/courses/${courseId}/students`);
    return ensureArray(processApiResponse(response.data));
  } catch (error) {
    console.error(`Error al obtener estudiantes para el curso ${courseId}:`, error);
    throw handleApiError(error, "Error al obtener los estudiantes del curso. Por favor, inténtalo de nuevo.");
  }
};