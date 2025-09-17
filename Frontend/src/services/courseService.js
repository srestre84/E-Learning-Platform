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