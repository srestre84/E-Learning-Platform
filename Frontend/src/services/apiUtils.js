// src/services/apiUtils.js

// 🧹 Función para limpiar JSON malformado del backend
const cleanMalformedJson = (jsonString) => {
  if (!jsonString || typeof jsonString !== 'string') {
    return jsonString;
  }

  let cleaned = jsonString;
  
  // Patrones específicos de corrupción que hemos observado
  const corruptionPatterns = [
    // Patrones de enrollments corruptos
    /"enrollments":\]\}\}\}\]\}\}\}\]\}\}\}\]/g,
    /"enrollments":\]\}\}\}\]\}\}\}\]/g,
    /"enrollments":\]\}\}\}\]/g,
    /"enrollments":\]\}\}\]/g,
    /"enrollments":\]\}\}/g,
    /"enrollments":\]\}/g,
    /"enrollments":\]/g,
    
    // Patrones de payments corruptos
    /"payments":\]\}\}\}\]\}\}\}\]\}\}\}\]/g,
    /"payments":\]\}\}\}\]\}\}\}\]/g,
    /"payments":\]\}\}\}\]/g,
    /"payments":\]\}\}\]/g,
    /"payments":\]\}\}/g,
    /"payments":\]\}/g,
    /"payments":\]/g,
    
    // Patrones de paymentSessions corruptos
    /"paymentSessions":\]\}\}\}\]\}\}\}\]\}\}\}\]/g,
    /"paymentSessions":\]\}\}\}\]\}\}\}\]/g,
    /"paymentSessions":\]\}\}\}\]/g,
    /"paymentSessions":\]\}\}\]/g,
    /"paymentSessions":\]\}\}/g,
    /"paymentSessions":\]\}/g,
    /"paymentSessions":\]/g,
    
    // Patrones de modules corruptos
    /"modules":\]\}\}\}\]\}\}\}\]\}\}\}\]/g,
    /"modules":\]\}\}\}\]\}\}\}\]/g,
    /"modules":\]\}\}\}\]/g,
    /"modules":\]\}\}\]/g,
    /"modules":\]\}\}/g,
    /"modules":\]\}/g,
    /"modules":\]/g,
    
    // Patrones de youtubeUrls corruptos
    /"youtubeUrls":\]\}\}\}\]\}\}\}\]\}\}\}\]/g,
    /"youtubeUrls":\]\}\}\}\]\}\}\}\]/g,
    /"youtubeUrls":\]\}\}\}\]/g,
    /"youtubeUrls":\]\}\}\]/g,
    /"youtubeUrls":\]\}\}/g,
    /"youtubeUrls":\]\}/g,
    /"youtubeUrls":\]/g,
  ];
  
  // Aplicar cada patrón de corrupción
  corruptionPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '[]');
  });
  
  // Buscar y corregir arrays malformados específicos
  const malformedArrays = [
    { pattern: /"enrollments":\]/g, replacement: '"enrollments":[]' },
    { pattern: /"payments":\]/g, replacement: '"payments":[]' },
    { pattern: /"paymentSessions":\]/g, replacement: '"paymentSessions":[]' },
    { pattern: /"modules":\]/g, replacement: '"modules":[]' },
    { pattern: /"youtubeUrls":\]/g, replacement: '"youtubeUrls":[]' }
  ];
  
  malformedArrays.forEach(({ pattern, replacement }) => {
    cleaned = cleaned.replace(pattern, replacement);
  });
  
  // Buscar el último objeto válido y truncar ahí si es necesario
  const lastValidObject = cleaned.lastIndexOf('}');
  if (lastValidObject !== -1) {
    // Buscar el siguiente carácter después del último }
    let truncatePoint = lastValidObject + 1;
    
    // Si hay caracteres malformados después, truncar ahí
    const remaining = cleaned.substring(truncatePoint);
    if (remaining.includes(']}}]') || remaining.includes(']}}]}}]')) {
      cleaned = cleaned.substring(0, truncatePoint) + '}';
      console.log("🔧 JSON truncado después del último objeto válido");
    }
  }
  
  // Asegurar que el JSON termine correctamente
  if (!cleaned.endsWith('}') && !cleaned.endsWith(']')) {
    cleaned += '}';
  }
  
  return cleaned;
};

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
  console.log("🔍 processApiResponse - Datos de entrada:", data);
  console.log("🔍 Tipo de datos:", typeof data);
  console.log("🔍 Es objeto:", typeof data === 'object');
  console.log("🔍 Tiene message:", data && data.message);
  console.log("�� Message es string:", data && typeof data.message === 'string');

  // Si los datos están en un campo 'message' como string JSON, parsearlos
  if (data && typeof data === 'object' && data.message && typeof data.message === 'string') {
    // Verificar si el message parece ser JSON válido
    const message = data.message.trim();
    if (message.startsWith('{') || message.startsWith('[')) {
      try {
        // Limpiar el JSON antes de parsearlo
        const cleanedMessage = cleanMalformedJson(data.message);
        const parsedData = JSON.parse(cleanedMessage);
        console.log("📊 Datos parseados desde message:", parsedData);
        return parsedData;
      } catch (error) {
        console.error("❌ Error al parsear JSON del message:", error);
        // Si no es JSON válido, devolver el mensaje como texto plano
        return { message: data.message, ...data };
      }
    } else {
      // Si no parece ser JSON, devolver el mensaje como texto plano
      return { message: data.message, ...data };
    }
  }

  console.log("�� Devolviendo datos sin procesar:", data);
  return data;
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
  console.log("🔍 ensureObject - Datos de entrada:", data);
  console.log("🔍 Tipo de datos:", typeof data);
  console.log("🔍 Longitud del string:", typeof data === 'string' ? data.length : 'N/A');
  console.log("�� Es objeto:", typeof data === 'object');
  console.log("🔍 Es array:", Array.isArray(data));

  // Si es un string JSON, parsearlo
  if (typeof data === 'string') {
    try {
      // Verificar si el string parece ser JSON válido
      const trimmed = data.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        const parsed = JSON.parse(trimmed);
        console.log("✅ String JSON parseado exitosamente");
        return parsed;
      } else {
        console.log("⚠️ String no parece ser JSON válido, devolviendo objeto vacío");
        return {};
      }
    } catch (error) {
      console.error("❌ Error al parsear JSON:", error);
      console.error("❌ Primeros 100 caracteres:", data.substring(0, 100));
      console.error("❌ Últimos 100 caracteres:", data.substring(data.length - 100));

      // Intentar extraer solo los datos del curso sin las relaciones anidadas
      try {
        const courseMatch = data.match(/"id":\d+,"title":"[^"]+","description":"[^"]+","shortDescription":"[^"]+","youtubeUrls":\[[^\]]+\],"thumbnailUrl":"[^"]+","price":[\d.]+,"isPremium":(true|false),"isPublished":(true|false),"isActive":(true|false),"estimatedHours":\d+/);
        if (courseMatch) {
          const courseData = JSON.parse('{' + courseMatch[0] + '}');
          console.log("✅ Datos del curso extraídos exitosamente:", courseData);
          return courseData;
        }
      } catch (extractError) {
        console.error("❌ Error al extraer datos del curso:", extractError);
      }

      return {};
    }
  }

  // Si ya es un objeto, devolverlo
  if (typeof data === 'object' && data !== null) {
    console.log("✅ Ya es un objeto, devolviendo:", data);
    return data;
  }

  // Si es un array, devolverlo
  if (Array.isArray(data)) {
    console.log("✅ Es un array, devolviendo:", data);
    return data;
  }

  // Si no es nada de lo anterior, devolver objeto vacío
  console.log("⚠️ No se pudo procesar, devolviendo objeto vacío");
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
