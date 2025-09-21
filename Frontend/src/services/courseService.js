// src/services/courseService.js
import api from "./api";
import { processApiResponse, ensureArray, ensureObject, handleApiError } from "./apiUtils";
import { getAllCourses, getCourseById as getMockCourseById, getCoursesByInstructor as getMockCoursesByInstructor, getCoursesByInstructorEmail as getMockCoursesByInstructorEmail } from "./mockDataService";
import { validateCourseData, normalizeCourseData } from "./courseValidationService";

// Función para limpiar JSON malformado
const cleanMalformedJson = (jsonString) => {
  let cleaned = jsonString;
  
  console.log("🔧 Iniciando limpieza de JSON malformado...");
  console.log("🔍 Longitud del JSON:", cleaned.length);
  
  // Patrones de corrupción específicos observados
  const corruptionPatterns = [
    /\]\}\}\}\]\}\}\}\]\}\}\}\]\}\}\}\]/g,
    /\]\}\}\}\]\}\}\}\]\}\}\}\]/g,
    /\]\}\}\}\]\}\}\}\]/g,
    /\]\}\}\}\]/g,
    /\]\}\}\]/g,
    /\]\}\}/g,
    /\]\}/g,
    /"enrollments":\]\}\}\}\]/g,
    /"enrollments":\]\}\}\]/g,
    /"enrollments":\]\}\}/g,
    /"enrollments":\]\}/g,
    /"enrollments":\]/g,
    /"ollments":\]\}\}\}\]\}\}\}\]/g,
    /"ollments":\]\}\}\}\]/g,
    /"ollments":\]\}/g,
    /"ollments":\]/g
  ];
  
  // Aplicar cada patrón de corrupción
  corruptionPatterns.forEach((pattern, index) => {
    const before = cleaned;
    cleaned = cleaned.replace(pattern, '[]');
    if (before !== cleaned) {
      console.log(`🔧 Patrón ${index + 1} aplicado:`, pattern);
    }
  });
  
  // Manejo específico para el patrón de corrupción observado
  const specificCorruptionPatterns = [
    { pattern: /"enrollments":\]\}\}\}\]\}\}\}\]/g, replacement: '"enrollments":[]' },
    { pattern: /"enrollments":\]\}\}\}\]/g, replacement: '"enrollments":[]' },
    { pattern: /"enrollments":\]\}/g, replacement: '"enrollments":[]' },
    { pattern: /"enrollments":\]/g, replacement: '"enrollments":[]' },
    { pattern: /"ollments":\]\}\}\}\]\}\}\}\]/g, replacement: '"enrollments":[]' },
    { pattern: /"ollments":\]\}\}\}\]/g, replacement: '"enrollments":[]' },
    { pattern: /"ollments":\]\}/g, replacement: '"enrollments":[]' },
    { pattern: /"ollments":\]/g, replacement: '"enrollments":[]' }
  ];
  
  specificCorruptionPatterns.forEach(({ pattern, replacement }) => {
    const before = cleaned;
    cleaned = cleaned.replace(pattern, replacement);
    if (before !== cleaned) {
      console.log("🔧 Patrón específico corregido:", pattern);
    }
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
    const before = cleaned;
    cleaned = cleaned.replace(pattern, replacement);
    if (before !== cleaned) {
      console.log("🔧 Array malformado corregido:", pattern);
    }
  });
  
  // Buscar el último objeto válido y truncar ahí
  const lastValidObject = cleaned.lastIndexOf('}');
  if (lastValidObject !== -1) {
    let truncatePoint = lastValidObject + 1;
    const remaining = cleaned.substring(truncatePoint);
    if (remaining.includes(']}}]') || remaining.includes(']}}]}}]') || remaining.includes(']}}]}}]}}]')) {
      cleaned = cleaned.substring(0, truncatePoint) + '}';
      console.log("🔧 JSON truncado después del último objeto válido");
    }
  }
  
  // Asegurar que el JSON termine correctamente
  if (!cleaned.endsWith('}') && !cleaned.endsWith(']')) {
    cleaned += '}';
  }
  
  console.log("🔧 JSON limpiado. Longitud final:", cleaned.length);
  return cleaned;
};
// Obtener subcategorías por categoría (para edición de curso)
export const getSubcategoriesByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/api/subcategories/category/${categoryId}`);
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

// Obtener los cursos de la API DE MANERA PUBLICA
export const getCourses = async () => {
  try {
    // Intentar obtener cursos del backend
    const response = await api.get("/api/courses");
    const backendCourses = ensureArray(processApiResponse(response.data));
    console.log("📚 Cursos del backend:", backendCourses.length);
    
    // Combinar con datos mock
    const mockCourses = getAllCourses();
    console.log("🎯 Cursos mock:", mockCourses.length);
    
    // Combinar ambos arrays, evitando duplicados por ID
    const allCourses = [...mockCourses];
    backendCourses.forEach(backendCourse => {
      if (!allCourses.find(course => course.id === backendCourse.id)) {
        allCourses.push(backendCourse);
      }
    });
    
    console.log("✅ Total de cursos:", allCourses.length);
    return allCourses;
  } catch (error) {
    console.error("Error al cargar los cursos del backend:", error);
    console.log("🔄 Backend no disponible, usando solo datos mock...");
    return getAllCourses();
  }
};

// Obtener las categorías de la API
export const getCategories = async () => {
  try {
    const response = await api.get("/api/categories");
    return ensureArray(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
    throw handleApiError(error, "No tienes permiso para esta acción");
  }
};
// Obtener los niveles de la API
export const getLevels = async () => {
  try {
    const response = await api.get("/api/levels");
    return ensureArray(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al cargar los niveles:", error);
    throw handleApiError(error, "No tienes permiso para esta acción");
  }
};
// Actualizar un curso de la API
export const updateCourse = async (id, courseData) => {
  try {
    const response = await api.put(`/api/courses/${id}`, courseData);
    return ensureObject(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al actualizar el curso:", error);
    
    // Manejar errores de validación específicamente
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        const validationErrors = errorData.errors.map(err => err.message || err).join(', ');
        throw new Error(`Errores de validación: ${validationErrors}`);
      } else if (errorData?.message) {
        throw new Error(errorData.message);
      }
    }
    
    throw handleApiError(error, "Error al actualizar el curso. Por favor, inténtalo de nuevo.");
  }
}
// Obtener un curso de la API por su id
export const getCourseById = async (id) => {
  try {
    // Intentar obtener del backend primero
    const response = await api.get(`/api/courses/${id}`);
    console.log("📚 Curso obtenido del backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el curso del backend:", error);
    console.log("🔄 Backend no disponible, buscando en datos mock...");
    
    // Si falla el backend, buscar en datos mock
    const mockCourse = getMockCourseById(id);
    if (mockCourse) {
      console.log("✅ Curso encontrado en datos mock:", mockCourse.title);
      return mockCourse;
    }
    
    throw new Error(`Curso con ID ${id} no encontrado`);
  }
  
  /* Código original del backend comentado
  try {
    const response = await api.get(`/api/courses/${id}`);
    console.log("📊 Respuesta completa del backend:", response.data);

    // Si la respuesta es un string JSON muy largo, extraer solo los datos esenciales
    if (typeof response.data === 'string') {
      try {
        // Intentar parsear el JSON completo primero
        const parsed = JSON.parse(response.data);
        console.log("✅ JSON parseado exitosamente");
        return parsed;
      } catch (error) {
        console.log("⚠️ JSON malformado, extrayendo datos esenciales...");
        console.error("❌ Error al parsear JSON:", error);

        // Limpiar el JSON malformado
        let cleanedJson = cleanMalformedJson(response.data);
        
        try {
          const parsed = JSON.parse(cleanedJson);
          console.log("✅ JSON limpiado y parseado exitosamente");
          return parsed;
        } catch (cleanError) {
          console.log("⚠️ Aún con problemas, intentando reconstrucción manual...");
          
          // Intentar reconstruir el JSON manualmente
          try {
            // Buscar el último objeto válido completo
            const lastCompleteObject = response.data.lastIndexOf('}');
            if (lastCompleteObject !== -1) {
              // Extraer solo la parte válida del JSON
              const validPart = response.data.substring(0, lastCompleteObject + 1);
              const parsed = JSON.parse(validPart);
              console.log("✅ JSON reconstruido exitosamente");
              return parsed;
            }
          } catch (reconstructError) {
            console.log("⚠️ Reconstrucción falló, extrayendo datos esenciales...");
          }
          
          // Extraer solo los datos esenciales del curso usando regex
          const extractField = (pattern) => {
            const match = response.data.match(pattern);
            return match ? match[1] : null;
          };
          
          const courseData = {
            id: extractField(/"id":(\d+)/) ? parseInt(extractField(/"id":(\d+)/)) : null,
            title: extractField(/"title":"([^"]+)"/) || '',
            description: extractField(/"description":"([^"]+)"/) || '',
            shortDescription: extractField(/"shortDescription":"([^"]+)"/) || '',
            youtubeUrls: [],
            thumbnailUrl: extractField(/"thumbnailUrl":"([^"]+)"/) || '',
            price: extractField(/"price":([\d.]+)/) ? parseFloat(extractField(/"price":([\d.]+)/)) : 0,
            isPremium: extractField(/"isPremium":(true|false)/) === 'true',
            isPublished: extractField(/"isPublished":(true|false)/) === 'true',
            isActive: extractField(/"isActive":(true|false)/) === 'true',
            estimatedHours: extractField(/"estimatedHours":(\d+)/) ? parseInt(extractField(/"estimatedHours":(\d+)/)) : 0,
            createdAt: extractField(/"createdAt":"([^"]+)"/) || '',
            updatedAt: extractField(/"updatedAt":"([^"]+)"/) || '',
            modules: [],
            enrollments: []
          };

          console.log("✅ Datos del curso extraídos:", courseData);
          return courseData;
        }
      }
    }

    // Si la respuesta tiene un campo 'message' con JSON string, parsearlo
    if (response.data && typeof response.data === 'object' && response.data.message) {
      try {
        const parsed = JSON.parse(response.data.message);
        console.log("✅ JSON parseado desde message:", parsed);
        return parsed;
      } catch (error) {
        console.error("❌ Error al parsear message:", error);
        return response.data;
      }
    }

    // Si ya es un objeto, devolverlo
    return response.data;
  } catch (error) {
    console.error("Error al obtener el curso:", error);
    console.log("🔄 Backend no disponible, devolviendo datos mock reales...");
    const mockCourse = getMockCourseById(id);
    if (mockCourse) {
      return mockCourse;
    }
    throw handleApiError(error, "Error al obtener el curso. Por favor, inténtalo de nuevo.");
  }
  */
};
// Crear un curso de la API
export const createCourse = async (courseData) => {
  try {
    console.log("📤 Datos del curso recibidos:", courseData);
    
    // Normalizar datos
    const normalizedData = normalizeCourseData(courseData);
    console.log("📤 Datos normalizados:", normalizedData);
    
    // Validar datos antes de enviar
    const validation = validateCourseData(normalizedData);
    if (!validation.isValid) {
      console.error("❌ Errores de validación:", validation.errors);
      throw new Error(`Errores de validación: ${validation.errors.join(', ')}`);
    }
    
    console.log("✅ Validación exitosa, enviando al backend...");
    const response = await api.post("/api/courses", normalizedData);
    console.log("✅ Curso creado exitosamente:", response.data);
    return ensureObject(processApiResponse(response.data));
  } catch (error) {
    console.error("❌ Error al crear el curso:", error);
    
    // Manejar errores de validación específicamente
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      console.error("🔍 Detalles del error 400:", errorData);
      
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        const validationErrors = errorData.errors.map(err => err.message || err).join(', ');
        throw new Error(`Errores de validación del servidor: ${validationErrors}`);
      } else if (errorData?.message) {
        throw new Error(`Error del servidor: ${errorData.message}`);
      } else {
        throw new Error(`Error de validación: ${JSON.stringify(errorData)}`);
      }
    }
    
    throw handleApiError(error, "Error al crear el curso. Por favor, inténtalo de nuevo.");
  }
};

// Obtener los cursos de un instructor de la API
export const getCoursesByInstructorId = async (instructorId) => {
  try {
    console.log("📚 Obteniendo cursos del instructor ID:", instructorId);
    
    // Verificar si es el instructor de ejemplo por email
    const userEmail = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : null;
    console.log("📧 Email del usuario logueado:", userEmail);
    
    // Solo usar cursos reales del backend, sin datos mock
    console.log("🎯 Obteniendo cursos reales del backend para instructor:", instructorId);
    
    // Obtener cursos reales del backend
    const response = await api.get(`/api/courses/instructor/${instructorId}`);
    const backendCourses = ensureArray(processApiResponse(response.data));
    console.log("📚 Cursos del instructor desde backend:", backendCourses.length);
    
    console.log("✅ Total de cursos (solo backend):", backendCourses.length);
    return backendCourses;
  } catch (error) {
    console.error("Error al obtener los cursos del instructor:", error);
    console.log("🔄 Backend no disponible, devolviendo array vacío...");
    
    // Si el backend no está funcionando, devolver array vacío
    return [];
  }
}

// Obtener los cursos de un instructor por email (fallback)
export const getCoursesByInstructorEmail = async (email) => {
  try {
    console.log("📚 Obteniendo cursos del instructor email:", email);
    
    // Intentar obtener cursos del backend usando email
    const response = await api.get(`/api/courses/instructor/email/${email}`);
    const backendCourses = ensureArray(processApiResponse(response.data));
    console.log("📚 Cursos del instructor desde backend:", backendCourses.length);
    
    // Combinar con datos mock
    const mockCourses = getMockCoursesByInstructorEmail(email);
    console.log("🎯 Cursos mock del instructor:", mockCourses.length);
    
    // Combinar ambos arrays, evitando duplicados por ID
    const allCourses = [...mockCourses];
    backendCourses.forEach(backendCourse => {
      if (!allCourses.find(course => course.id === backendCourse.id)) {
        allCourses.push(backendCourse);
      }
    });
    
    console.log("✅ Total de cursos del instructor:", allCourses.length);
    return allCourses;
  } catch (error) {
    console.error("Error al obtener los cursos del instructor por email:", error);
    console.log("🔄 Backend no disponible, usando solo datos mock...");
    
    // Si el backend no está funcionando, devolver datos mock
    const mockCourses = getMockCoursesByInstructorEmail(email);
    console.log("🎯 Cursos mock del instructor:", mockCourses.length);
    return mockCourses;
  }
}

// Obtener los estudiantes de un curso de la API
export const getStudentsByCourseId = async (courseId) => {
  try {
    const response = await api.get(`/api/enrollments/course/${courseId}`);
    return ensureArray(processApiResponse(response.data));
  } catch (error) {
    console.error(`Error al obtener estudiantes para el curso ${courseId}:`, error);
    throw handleApiError(error, "Error al obtener los estudiantes del curso. Por favor, inténtalo de nuevo.");
  }
};

// Función para obtener el número de estudiantes inscritos en un curso
export const getStudentCountByCourseId = async (courseId) => {
  try {
    const response = await api.get(`/api/enrollments/course/${courseId}`);
    const enrollments = ensureArray(processApiResponse(response.data));
    return enrollments.length;
  } catch (error) {
    console.error(`Error al obtener número de estudiantes para el curso ${courseId}:`, error);
    return 0; // Retornar 0 en caso de error
  }
};

// Función para obtener el número de estudiantes inscritos en múltiples cursos
export const getStudentCountsForCourses = async (courseIds) => {
  try {
    const promises = courseIds.map(courseId => getStudentCountByCourseId(courseId));
    const counts = await Promise.all(promises);
    
    // Crear un mapa de courseId -> count
    const countMap = {};
    courseIds.forEach((courseId, index) => {
      countMap[courseId] = counts[index];
    });
    
    return countMap;
  } catch (error) {
    console.error("Error al obtener conteos de estudiantes:", error);
    return {};
  }
};

// Función para obtener cursos con información de inscripción
export const getCoursesWithEnrollmentInfo = async (userId) => {
  try {
    console.log("🔄 Obteniendo cursos con información de inscripción para usuario:", userId);
    
    // Obtener todos los cursos
    const courses = await getCourses();
    
    // Obtener inscripciones del usuario
    const enrollments = await getAllEnrollments();
    const userEnrollments = enrollments.filter(enrollment => 
      enrollment.user && enrollment.user.id === userId
    );
    
    // Crear un mapa de inscripciones por curso
    const enrollmentMap = new Map();
    userEnrollments.forEach(enrollment => {
      if (enrollment.course && enrollment.course.id) {
        enrollmentMap.set(enrollment.course.id, {
          isEnrolled: true,
          enrollmentId: enrollment.id,
          progress: enrollment.progressPercentage || 0,
          status: enrollment.status,
          enrolledAt: enrollment.enrolledAt
        });
      }
    });
    
    // Agregar información de inscripción a cada curso
    const coursesWithEnrollment = courses.map(course => ({
      ...course,
      isEnrolled: enrollmentMap.has(course.id),
      enrollmentInfo: enrollmentMap.get(course.id) || {
        isEnrolled: false,
        progress: 0,
        status: null
      }
    }));
    
    console.log("✅ Cursos con información de inscripción obtenidos:", coursesWithEnrollment.length);
    return coursesWithEnrollment;
    
  } catch (error) {
    console.error("❌ Error al obtener cursos con información de inscripción:", error);
    throw error;
  }
};