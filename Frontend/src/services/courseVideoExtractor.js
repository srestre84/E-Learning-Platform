// Servicio para extraer videos de los módulos de un curso
// Esto es una solución temporal hasta que el backend maneje correctamente los videos

export const extractVideosFromCourse = (course) => {
  const videos = [];
  let videoId = 1;

  // Primero intentar extraer de los módulos si existen
  if (course?.modules) {
    course.modules.forEach((module, moduleIndex) => {
      if (module?.lessons) {
        module.lessons.forEach((lesson, lessonIndex) => {
          // Verificar si la lección tiene video
          const videoUrl = lesson.youtubeUrl || lesson.video?.url;
          if (videoUrl && videoUrl.trim()) {
            videos.push({
              id: videoId++,
              title: lesson.title || `Lección ${lessonIndex + 1}`,
              description: lesson.description || '',
              youtubeUrl: videoUrl,
              youtubeVideoId: extractYouTubeVideoId(videoUrl),
              orderIndex: videos.length + 1,
              durationSeconds: lesson.duration || lesson.durationSeconds || 0,
              thumbnailUrl: null,
              isActive: true,
              courseId: course.id,
              moduleId: module.id || moduleIndex + 1,
              completed: lesson.completed || false
            });
          }
        });
      }
    });
  }

  // Si no hay videos de módulos, intentar extraer de youtubeUrls
  if (videos.length === 0 && course?.youtubeUrls && course.youtubeUrls.length > 0) {
    course.youtubeUrls.forEach((url, index) => {
      if (url && url.trim()) {
        videos.push({
          id: videoId++,
          title: `Video ${index + 1}`,
          description: `Video del curso: ${course.title}`,
          youtubeUrl: url,
          youtubeVideoId: extractYouTubeVideoId(url),
          orderIndex: index + 1,
          durationSeconds: 0,
          thumbnailUrl: null,
          isActive: true,
          courseId: course.id,
          moduleId: Math.floor(index / 5) + 1, // Agrupar cada 5 videos en un módulo
          completed: false
        });
      }
    });
  }

  return videos;
};

const extractYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const organizeVideosIntoModules = (videos) => {
  const modulesMap = new Map();
  let moduleIndex = 0;
  let currentModuleVideosCount = 0;

  videos.forEach((video, index) => {
    if (currentModuleVideosCount === 0 || currentModuleVideosCount >= 5) {
      moduleIndex++;
      modulesMap.set(moduleIndex, {
        id: moduleIndex,
        title: `Módulo ${moduleIndex}`,
        videos: [],
        totalDuration: 0,
      });
      currentModuleVideosCount = 0;
    }

    const currentModule = modulesMap.get(moduleIndex);
    currentModule.videos.push(video);
    currentModule.totalDuration += video.durationSeconds || 0;
    currentModuleVideosCount++;
  });

  return Array.from(modulesMap.values());
};
