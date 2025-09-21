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
    
    // Si no hay videos en el backend, usar datos mock reales
    console.log("⚠️ No se encontraron videos reales, devolviendo datos mock reales...");
    const mockVideos = getMockCourseVideos(courseId);
    console.log("🎬 Videos mock reales generados:", mockVideos);
    return mockVideos;
    
  } catch (error) {
    console.error("❌ Error al obtener videos del curso:", error);

    // Si el backend no está funcionando, devolver datos mock reales inmediatamente
    console.log("🔄 Backend no disponible, devolviendo datos mock reales...");
    const mockVideos = getMockCourseVideos(courseId);
    console.log("🎬 Videos mock reales generados:", mockVideos);
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
    const mockModules = getMockCourseModules(courseId);
    console.log("📚 Módulos de prueba generados:", mockModules);
    return mockModules;
    
  } catch (error) {
    console.error("❌ Error al obtener módulos del curso:", error);

    // Si el backend no está funcionando, devolver módulos de prueba inmediatamente
    console.log("🔄 Backend no disponible, devolviendo módulos de prueba...");
    const mockModules = getMockCourseModules(courseId);
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
    return null;
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
