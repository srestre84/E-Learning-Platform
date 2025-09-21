// Servicio temporal para simular videos del curso
// Esto se puede eliminar cuando el backend esté funcionando correctamente

export const getMockCourseVideos = (courseId) => {
  // Simular videos basados en el ID del curso
  const mockVideos = [
    {
      id: 1,
      title: "Introducción al Curso",
      description: "Bienvenida y presentación del curso",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      durationSeconds: 180,
      orderIndex: 1,
      completed: false,
      moduleId: 1
    },
    {
      id: 2,
      title: "Conceptos Básicos",
      description: "Fundamentos y conceptos principales",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      durationSeconds: 240,
      orderIndex: 2,
      completed: false,
      moduleId: 1
    },
    {
      id: 3,
      title: "Ejemplos Prácticos",
      description: "Casos de uso y ejemplos reales",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      durationSeconds: 300,
      orderIndex: 3,
      completed: false,
      moduleId: 2
    },
    {
      id: 4,
      title: "Ejercicios y Práctica",
      description: "Actividades para reforzar el aprendizaje",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      durationSeconds: 360,
      orderIndex: 4,
      completed: false,
      moduleId: 2
    },
    {
      id: 5,
      title: "Conclusión y Siguientes Pasos",
      description: "Resumen y recomendaciones",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      durationSeconds: 120,
      orderIndex: 5,
      completed: false,
      moduleId: 3
    }
  ];

  // Simular delay de red
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockVideos);
    }, 500);
  });
};

export const getMockVideoDetails = (videoId) => {
  const mockVideo = {
    id: videoId,
    title: "Video de Ejemplo",
    description: "Descripción del video",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    durationSeconds: 180,
    orderIndex: 1,
    completed: false,
    moduleId: 1
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockVideo);
    }, 300);
  });
};
