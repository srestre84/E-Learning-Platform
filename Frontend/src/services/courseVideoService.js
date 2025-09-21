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
           
           // Intentar obtener videos del nuevo endpoint que incluye lecciones
           const videosResponse = await api.get(`/course-videos/course/${courseId}/lessons`);
           const videos = videosResponse.data;
           console.log("🎬 Videos obtenidos del backend:", videos);
           
           if (videos && videos.length > 0) {
             console.log("✅ Videos extraídos del backend:", videos.length);
             return videos;
           } else {
             console.log("⚠️ No se encontraron videos en el backend");
           }
           
           // Si no hay videos en el backend, usar datos mock
           console.log("⚠️ No se encontraron videos en el backend, usando datos mock...");
           const mockVideos = getMockCourseVideos(courseId);
           console.log("🎬 Videos mock generados:", mockVideos);
           return mockVideos;
           
         } catch (error) {
           console.error("❌ Error al obtener videos del curso:", error);

           // Si el backend no está funcionando, devolver datos mock
           console.log("🔄 Backend no disponible, devolviendo datos mock...");
           const mockVideos = getMockCourseVideos(courseId);
           console.log("🎬 Videos mock generados:", mockVideos);
           return mockVideos;
         }
       };

// Nueva función para obtener módulos completos del curso
export const getCourseModules = async (courseId) => {
  try {
    console.log("📚 Obteniendo módulos para el curso:", courseId);
    
    // Intentar obtener el curso completo con módulos y lecciones
    const courseResponse = await api.get(`/courses/${courseId}`);
    const course = courseResponse.data;
    console.log("📚 Curso obtenido:", course);
    
    if (course?.modules?.length > 0) {
      console.log("✅ Módulos extraídos del curso:", course.modules);
      return course.modules;
    }
    
    // Si no hay módulos en el curso, intentar obtener módulos directamente
    console.log("📚 No hay módulos en el curso, intentando endpoint de módulos...");
    const modulesResponse = await api.get(`/modules/course/${courseId}`);
    console.log("📚 Módulos obtenidos del backend:", modulesResponse.data);
    
    // Manejar diferentes formatos de respuesta
    let modules = modulesResponse.data;
    if (modules && modules.value && Array.isArray(modules.value)) {
      modules = modules.value;
    } else if (!Array.isArray(modules)) {
      modules = [];
    }
    
    if (modules && modules.length > 0) {
      console.log("✅ Módulos obtenidos del endpoint:", modules);
      return modules;
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
    const response = await api.get(`/course-videos/${videoId}`);
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
    const response = await api.get(`/course-videos/course/${courseId}/can-manage`);
    return response.data;
  } catch (error) {
    console.error("Error al verificar permisos de gestión:", error);
    return { canManage: false };
  }
};
