// Servicio de validación para asegurar compatibilidad con el backend
export const validateCourseData = (courseData) => {
  const errors = [];
  
  // Validaciones requeridas del CourseCreateDto
  if (!courseData.title || courseData.title.trim().length === 0) {
    errors.push("El título es obligatorio");
  } else if (courseData.title.length > 200) {
    errors.push("El título no puede exceder 200 caracteres");
  }
  
  if (!courseData.description || courseData.description.trim().length === 0) {
    errors.push("La descripción es obligatoria");
  } else if (courseData.description.length > 1000) {
    errors.push("La descripción no puede exceder 1000 caracteres");
  }
  
  if (courseData.shortDescription && courseData.shortDescription.length > 255) {
    errors.push("La descripción corta no puede exceder 255 caracteres");
  }
  
  if (!courseData.instructorId) {
    errors.push("El ID del instructor es obligatorio");
  }
  
  if (!courseData.categoryId) {
    errors.push("El ID de la categoría es obligatorio");
  }
  
  if (!courseData.subcategoryId) {
    errors.push("El ID de la subcategoría es obligatorio");
  }
  
  // Validar precio
  if (courseData.price === undefined || courseData.price === null) {
    errors.push("El precio es obligatorio");
  } else if (courseData.price < 0) {
    errors.push("El precio no puede ser negativo");
  } else if (courseData.price > 999999.99) {
    errors.push("El precio no puede exceder 999999.99");
  }
  
  // Validar horas estimadas
  if (courseData.estimatedHours !== undefined && courseData.estimatedHours !== null) {
    if (courseData.estimatedHours < 1) {
      errors.push("Las horas estimadas deben ser al menos 1");
    } else if (courseData.estimatedHours > 1000) {
      errors.push("Las horas estimadas no pueden exceder 1000");
    }
  }
  
  // Validar URL de thumbnail
  if (courseData.thumbnailUrl) {
    const thumbnailPattern = /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i;
    if (!thumbnailPattern.test(courseData.thumbnailUrl)) {
      errors.push("URL de thumbnail debe ser una imagen válida (jpg, jpeg, png, gif, webp)");
    }
  }
  
  // Validar URLs de YouTube
  if (courseData.youtubeUrls && Array.isArray(courseData.youtubeUrls)) {
    const youtubePattern = /^https:\/\/(?:www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+$/;
    courseData.youtubeUrls.forEach((url, index) => {
      if (url && !youtubePattern.test(url)) {
        errors.push(`URL de YouTube ${index + 1} inválida: ${url}`);
      }
    });
  }
  
  // Validar módulos
  if (courseData.modules && Array.isArray(courseData.modules)) {
    courseData.modules.forEach((module, moduleIndex) => {
      if (!module.title || module.title.trim().length === 0) {
        errors.push(`El título del módulo ${moduleIndex + 1} es obligatorio`);
      } else if (module.title.length > 200) {
        errors.push(`El título del módulo ${moduleIndex + 1} no puede exceder 200 caracteres`);
      }
      
      if (module.description && module.description.length > 1000) {
        errors.push(`La descripción del módulo ${moduleIndex + 1} no puede exceder 1000 caracteres`);
      }
      
      if (!module.orderIndex || module.orderIndex < 1) {
        errors.push(`El índice de orden del módulo ${moduleIndex + 1} debe ser un número positivo`);
      }
      
      // Validar lecciones
      if (module.lessons && Array.isArray(module.lessons)) {
        module.lessons.forEach((lesson, lessonIndex) => {
          if (!lesson.title || lesson.title.trim().length === 0) {
            errors.push(`El título de la lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} es obligatorio`);
          } else if (lesson.title.length > 200) {
            errors.push(`El título de la lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} no puede exceder 200 caracteres`);
          }
          
          if (!lesson.type || !['video', 'text', 'quiz'].includes(lesson.type.toLowerCase())) {
            errors.push(`El tipo de la lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} debe ser video, text o quiz`);
          }
          
          if (lesson.type === 'video' && lesson.youtubeUrl) {
            const youtubePattern = /^https:\/\/(?:www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+$/;
            if (!youtubePattern.test(lesson.youtubeUrl)) {
              errors.push(`URL de YouTube de la lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} inválida`);
            }
          }
          
          if (lesson.description && lesson.description.length > 1000) {
            errors.push(`La descripción de la lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} no puede exceder 1000 caracteres`);
          }
          
          if (!lesson.orderIndex || lesson.orderIndex < 1) {
            errors.push(`El índice de orden de la lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} debe ser un número positivo`);
          }
          
          if (lesson.durationSeconds !== undefined && lesson.durationSeconds !== null && lesson.durationSeconds < 0) {
            errors.push(`La duración de la lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} debe ser un número positivo`);
          }
        });
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// Función para normalizar los datos del curso antes de enviarlos al backend
export const normalizeCourseData = (courseData) => {
  const normalized = { ...courseData };
  
  // Asegurar que los campos requeridos estén presentes
  normalized.isPremium = normalized.isPremium || false;
  normalized.isPublished = normalized.isPublished || false;
  normalized.isActive = normalized.isActive !== false;
  normalized.estimatedHours = normalized.estimatedHours || 1;
  normalized.price = normalized.price || 0;
  
  // Normalizar módulos
  if (normalized.modules && Array.isArray(normalized.modules)) {
    normalized.modules = normalized.modules.map((module, index) => ({
      ...module,
      orderIndex: module.orderIndex || index + 1,
      isActive: module.isActive !== false,
      lessons: module.lessons ? module.lessons.map((lesson, lessonIndex) => ({
        ...lesson,
        type: lesson.type ? lesson.type.toLowerCase() : 'video',
        orderIndex: lesson.orderIndex || lessonIndex + 1,
        isActive: lesson.isActive !== false,
        durationSeconds: lesson.durationSeconds || 0
      })) : []
    }));
  }
  
  // Normalizar URLs de YouTube
  if (normalized.youtubeUrls && Array.isArray(normalized.youtubeUrls)) {
    normalized.youtubeUrls = normalized.youtubeUrls.filter(url => url && url.trim().length > 0);
  }
  
  return normalized;
};

// Función para crear un curso con validación completa
export const createCourseWithValidation = async (courseData, createCourseFunction) => {
  // Normalizar datos
  const normalizedData = normalizeCourseData(courseData);
  
  // Validar datos
  const validation = validateCourseData(normalizedData);
  
  if (!validation.isValid) {
    throw new Error(`Errores de validación: ${validation.errors.join(', ')}`);
  }
  
  // Crear curso
  return await createCourseFunction(normalizedData);
};
