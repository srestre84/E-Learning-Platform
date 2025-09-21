import api from './api';
import { getCourseVideos as getMockCourseVideos, getCourseModules as getMockCourseModules } from './mockDataService';

// Función auxiliar para extraer el ID de video de YouTube
const extractYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

// Usar datos mock reales del servicio mockDataService
const getMockModulesForCourse = (courseId) => {
  return getMockCourseModules(courseId);
};

// Función para generar videos de prueba cuando el backend no está disponible
const getMockVideosForCourse = (courseId) => {
  const mockVideos = [
    {
      id: 1,
      title: "Introducción a la Programación",
      description: "Conceptos básicos de programación y algoritmos",
      youtubeUrl: "https://www.youtube.com/watch?v=zOjov-2OZ0E",
      youtubeVideoId: "zOjov-2OZ0E",
      orderIndex: 1,
      durationSeconds: 420,
      thumbnailUrl: null,
      isActive: true,
      courseId: courseId,
      moduleId: 1,
      moduleTitle: "Fundamentos de Programación",
      moduleOrderIndex: 1,
      completed: false
    },
    {
      id: 2,
      title: "Variables y Tipos de Datos",
      description: "Aprendiendo sobre variables, constantes y tipos de datos en programación",
      youtubeUrl: "https://www.youtube.com/watch?v=8jLOx1hD3_o",
      youtubeVideoId: "8jLOx1hD3_o",
      orderIndex: 2,
      durationSeconds: 380,
      thumbnailUrl: null,
      isActive: true,
      courseId: courseId,
      moduleId: 1,
      moduleTitle: "Fundamentos de Programación",
      moduleOrderIndex: 1,
      completed: false
    },
    {
      id: 3,
      title: "Estructuras de Control",
      description: "Condicionales, bucles y control de flujo en programación",
      youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
      youtubeVideoId: "rfscVS0vtbw",
      orderIndex: 3,
      durationSeconds: 520,
      thumbnailUrl: null,
      isActive: true,
      courseId: courseId,
      moduleId: 2,
      moduleTitle: "Lógica de Programación",
      moduleOrderIndex: 2,
      completed: false
    },
    {
      id: 4,
      title: "Funciones y Métodos",
      description: "Creación y uso de funciones para organizar el código",
      youtubeUrl: "https://www.youtube.com/watch?v=9Os0o3wzS_I",
      youtubeVideoId: "9Os0o3wzS_I",
      orderIndex: 4,
      durationSeconds: 450,
      thumbnailUrl: null,
      isActive: true,
      courseId: courseId,
      moduleId: 2,
      moduleTitle: "Lógica de Programación",
      moduleOrderIndex: 2,
      completed: false
    },
    {
      id: 5,
      title: "Programación Orientada a Objetos",
      description: "Clases, objetos, herencia y encapsulación",
      youtubeUrl: "https://www.youtube.com/watch?v=WZQc7RUAg18",
      youtubeVideoId: "WZQc7RUAg18",
      orderIndex: 5,
      durationSeconds: 600,
      thumbnailUrl: null,
      isActive: true,
      courseId: courseId,
      moduleId: 3,
      moduleTitle: "Programación Avanzada",
      moduleOrderIndex: 3,
      completed: false
    },
    {
      id: 6,
      title: "Manejo de Errores y Debugging",
      description: "Técnicas para identificar y corregir errores en el código",
      youtubeUrl: "https://www.youtube.com/watch?v=GqbygVLIob4",
      youtubeVideoId: "GqbygVLIob4",
      orderIndex: 6,
      durationSeconds: 480,
      thumbnailUrl: null,
      isActive: true,
      courseId: courseId,
      moduleId: 3,
      moduleTitle: "Programación Avanzada",
      moduleOrderIndex: 3,
      completed: false
    },
    {
      id: 7,
      title: "Proyecto Práctico: Calculadora",
      description: "Desarrollo de una calculadora completa desde cero",
      youtubeUrl: "https://www.youtube.com/watch?v=Jj4MtJzA0v0",
      youtubeVideoId: "Jj4MtJzA0v0",
      orderIndex: 7,
      durationSeconds: 720,
      thumbnailUrl: null,
      isActive: true,
      courseId: courseId,
      moduleId: 4,
      moduleTitle: "Proyecto Final",
      moduleOrderIndex: 4,
      completed: false
    }
  ];

  return mockVideos;
};

/**
 * Obtener videos de un curso organizados por módulos
 * @param {number} courseId - ID del curso
 * @returns {Promise<Array>} Lista de videos del curso organizados por módulos
 */
export const getCourseVideos = async (courseId) => {
  try {
    console.log("🎬 Obteniendo videos para el curso:", courseId);
    
    // Primero intentar obtener el curso completo para extraer módulos y lecciones
    console.log("📚 Intentando obtener curso completo...");
    const courseResponse = await api.get(`/api/courses/${courseId}`);
    const course = courseResponse.data;
    console.log("📚 Curso obtenido:", course);
    
    if (course?.modules?.length > 0) {
      console.log("📚 Procesando módulos del curso...");
      const videos = [];
      
      course.modules.forEach((module, moduleIndex) => {
        if (module.lessons?.length > 0) {
          module.lessons
            .filter(lesson => lesson.type === 'VIDEO' && lesson.youtubeUrl)
            .forEach((lesson, lessonIndex) => {
              videos.push({
                id: lesson.id || `${courseId}-${moduleIndex}-${lessonIndex}`,
                title: lesson.title,
                description: lesson.description || '',
                youtubeUrl: lesson.youtubeUrl,
                youtubeVideoId: extractYouTubeVideoId(lesson.youtubeUrl),
                orderIndex: lesson.orderIndex || lessonIndex + 1,
                durationSeconds: lesson.durationSeconds || 0,
                thumbnailUrl: null,
                isActive: lesson.isActive !== false,
                courseId: courseId,
                moduleId: module.id || `module-${moduleIndex}`,
                moduleTitle: module.title,
                moduleOrderIndex: module.orderIndex || moduleIndex + 1,
                completed: false
              });
            });
        }
      });
      
      if (videos.length > 0) {
        console.log("✅ Videos extraídos del curso:", videos);
        return videos;
      }
    }
    
    // Si no hay módulos en el curso, intentar obtener módulos directamente
    console.log("📚 No hay módulos en el curso, intentando endpoint de módulos...");
    const modulesResponse = await api.get(`/api/modules/course/${courseId}`);
    console.log("📚 Módulos obtenidos del backend:", modulesResponse.data);
    
    if (modulesResponse.data && modulesResponse.data.length > 0) {
      const videos = [];
      modulesResponse.data.forEach(module => {
        if (module.lessons && module.lessons.length > 0) {
          module.lessons
            .filter(lesson => lesson.type === 'VIDEO' && lesson.youtubeUrl)
            .forEach((lesson, index) => {
              videos.push({
                id: lesson.id,
                title: lesson.title,
                description: lesson.description || '',
                youtubeUrl: lesson.youtubeUrl,
                youtubeVideoId: extractYouTubeVideoId(lesson.youtubeUrl),
                orderIndex: lesson.orderIndex || index + 1,
                durationSeconds: lesson.durationSeconds || 0,
                thumbnailUrl: null,
                isActive: lesson.isActive !== false,
                courseId: courseId,
                moduleId: module.id,
                moduleTitle: module.title,
                moduleOrderIndex: module.orderIndex || 1,
                completed: false
              });
            });
        }
      });
      
      if (videos.length > 0) {
        console.log("✅ Videos convertidos de módulos:", videos);
        return videos;
      }
    }
    
    // Si no hay videos en el backend, devolver videos de prueba
    console.log("⚠️ No se encontraron videos reales, devolviendo videos de prueba...");
    const mockVideos = getMockVideosForCourse(courseId);
    console.log("🎬 Videos de prueba generados:", mockVideos);
    return mockVideos;
    
  } catch (error) {
    console.error("❌ Error al obtener videos del curso:", error);

    // Si el backend no está funcionando, devolver videos de prueba inmediatamente
    console.log("🔄 Backend no disponible, devolviendo videos de prueba...");
    const mockVideos = getMockVideosForCourse(courseId);
    console.log("🎬 Videos de prueba generados:", mockVideos);
    return mockVideos;
  }
};

// Nueva función para obtener módulos completos del curso
export const getCourseModules = async (courseId) => {
  try {
    console.log("📚 Obteniendo módulos para el curso:", courseId);
    
    // Intentar obtener el curso completo con módulos y lecciones
    const courseResponse = await api.get(`/api/courses/${courseId}`);
    const course = courseResponse.data;
    console.log("📚 Curso obtenido:", course);
    
    if (course?.modules?.length > 0) {
      console.log("✅ Módulos extraídos del curso:", course.modules);
      return course.modules;
    }
    
    // Si no hay módulos en el curso, intentar obtener módulos directamente
    console.log("📚 No hay módulos en el curso, intentando endpoint de módulos...");
    const modulesResponse = await api.get(`/api/modules/course/${courseId}`);
    console.log("📚 Módulos obtenidos del backend:", modulesResponse.data);
    
    if (modulesResponse.data && modulesResponse.data.length > 0) {
      console.log("✅ Módulos obtenidos del endpoint:", modulesResponse.data);
      return modulesResponse.data;
    }
    
    // Si no hay módulos, devolver módulos de prueba
    console.log("⚠️ No se encontraron módulos reales, devolviendo módulos de prueba...");
    const mockModules = getMockModulesForCourse(courseId);
    console.log("📚 Módulos de prueba generados:", mockModules);
    return mockModules;
    
  } catch (error) {
    console.error("❌ Error al obtener módulos del curso:", error);

    // Si el backend no está funcionando, devolver módulos de prueba inmediatamente
    console.log("🔄 Backend no disponible, devolviendo módulos de prueba...");
    const mockModules = getMockModulesForCourse(courseId);
    console.log("📚 Módulos de prueba generados:", mockModules);
    return mockModules;
  }
};

/**
 * Obtener detalles de un video específico
 * @param {number} videoId - ID del video
 * @returns {Promise<Object>} Detalles del video
 */
export const getVideoDetails = async (videoId) => {
  try {
    const response = await api.get(`/api/course-videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener detalles del video:", error);

    // Si falla el backend, usar datos simulados temporalmente
    console.log("Usando datos simulados para el video:", videoId);
    return await getMockVideoDetails(videoId);

  }
};

/**
 * Verificar si el usuario puede gestionar videos de un curso
 * @param {number} courseId - ID del curso
 * @returns {Promise<Object>} Permisos de gestión
 */
export const checkVideoManagementPermissions = async (courseId) => {
  try {
    const response = await api.get(`/api/course-videos/course/${courseId}/can-manage`);
    return response.data;
  } catch (error) {
    console.error("Error al verificar permisos de gestión:", error);
    return { canManage: false };
  }
};
