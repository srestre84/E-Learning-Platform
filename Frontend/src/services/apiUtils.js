// src/services/apiUtils.js
import { validateApiResponse, cleanApiData } from './api';

/**
 * Utilidades para manejar respuestas de la API
 * Proporciona funciones para validar, limpiar y transformar datos de la API
 */

/**
 * Valida y limpia una respuesta de la API
 * @param {any} data - Datos de la respuesta
 * @returns {any} Datos validados y limpios
 */
export const processApiResponse = (data) => {
  return cleanApiData(data);
};

/**
 * Valida que los datos sean un array válido
 * @param {any} data - Datos a validar
 * @returns {Array} Array válido o array vacío
 */
export const ensureArray = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === 'object') {
    // Si es un objeto con una propiedad que contiene el array
    const possibleArray = Object.values(data).find(value => Array.isArray(value));
    if (possibleArray) {
      return possibleArray;
    }
  }

  console.warn('⚠️ Datos no son un array válido:', data);
  return [];
};

/**
 * Valida que los datos sean un objeto válido
 * @param {any} data - Datos a validar
 * @returns {Object} Objeto válido o objeto vacío
 */
export const ensureObject = (data) => {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data;
  }

  console.warn('⚠️ Datos no son un objeto válido:', data);
  return {};
};

/**
 * Extrae un mensaje de error de la respuesta
 * @param {any} error - Error de la API
 * @returns {string} Mensaje de error
 */
export const extractErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data) {
    const data = processApiResponse(error.response.data);
    return data?.message || 'Error desconocido';
  }

  return 'Error desconocido';
};

/**
 * Valida la estructura de un usuario
 * @param {any} user - Datos del usuario
 * @returns {Object} Usuario validado
 */
export const validateUser = (user) => {
  if (!user || typeof user !== 'object') {
    return null;
  }

  return {
    id: user.id || null,
    userName: user.userName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    role: user.role || 'STUDENT',
    isActive: user.isActive ?? true,
    profileImageUrl: user.profileImageUrl || null,
    createdAt: user.createdAt || null,
    updatedAt: user.updatedAt || null
  };
};

/**
 * Valida la estructura de un curso
 * @param {any} course - Datos del curso
 * @returns {Object} Curso validado
 */
export const validateCourse = (course) => {
  if (!course || typeof course !== 'object') {
    return null;
  }

  return {
    id: course.id || null,
    title: course.title || '',
    description: course.description || '',
    shortDescription: course.shortDescription || '',
    instructor: course.instructor || null,
    category: course.category || null,
    subcategory: course.subcategory || null,
    youtubeUrls: Array.isArray(course.youtubeUrls) ? course.youtubeUrls : [],
    thumbnailUrl: course.thumbnailUrl || null,
    price: course.price || 0,
    isPremium: course.isPremium ?? false,
    isPublished: course.isPublished ?? false,
    isActive: course.isActive ?? true,
    estimatedHours: course.estimatedHours || null,
    createdAt: course.createdAt || null,
    updatedAt: course.updatedAt || null
  };
};

/**
 * Valida la estructura de una inscripción
 * @param {any} enrollment - Datos de la inscripción
 * @returns {Object} Inscripción validada
 */
export const validateEnrollment = (enrollment) => {
  if (!enrollment || typeof enrollment !== 'object') {
    return null;
  }

  return {
    id: enrollment.id || null,
    student: enrollment.student || null,
    course: enrollment.course || null,
    enrollmentDate: enrollment.enrollmentDate || null,
    status: enrollment.status || 'ACTIVE',
    progressPercentage: enrollment.progressPercentage || 0,
    completedAt: enrollment.completedAt || null,
    createdAt: enrollment.createdAt || null,
    updatedAt: enrollment.updatedAt || null
  };
};

/**
 * Maneja errores de la API de manera consistente
 * @param {any} error - Error de la API
 * @param {string} defaultMessage - Mensaje por defecto
 * @returns {Error} Error procesado
 */
export const handleApiError = (error, defaultMessage = 'Error de la API') => {
  const message = extractErrorMessage(error);
  const processedError = new Error(message || defaultMessage);

  // Agregar información adicional del error
  if (error?.response?.status) {
    processedError.status = error.response.status;
  }

  if (error?.response?.data) {
    processedError.data = processApiResponse(error.response.data);
  }

  return processedError;
};

export default {
  processApiResponse,
  ensureArray,
  ensureObject,
  extractErrorMessage,
  validateUser,
  validateCourse,
  validateEnrollment,
  handleApiError
};
