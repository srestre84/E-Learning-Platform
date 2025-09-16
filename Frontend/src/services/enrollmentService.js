// src/services/enrollmentService.js
import api from './api';

export const enrollInCourse = async (courseId) => {
  try {
    const response = await api.post(`/api/enrollments`, { courseId });
    return response.data;
  } catch (error) {
    console.error("Error al inscribirse en el curso:", error);
    throw new Error(
      error.response?.data?.message || "No se pudo completar la inscripción. Por favor, inténtalo de nuevo."
    );
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


