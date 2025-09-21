// Servicio de datos mock con cursos reales de programación
export const MOCK_INSTRUCTORS = [
  {
    id: 1,
    name: "Profesor Test",
    email: "instructor@test.com",
    role: "INSTRUCTOR"
  },
  {
    id: 2,
    name: "María García",
    email: "maria.garcia@example.com",
    role: "INSTRUCTOR"
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@example.com",
    role: "INSTRUCTOR"
  }
];

export const MOCK_COURSES = [
  {
    id: 1,
    title: "JavaScript Moderno: De Principiante a Avanzado",
    description: "Aprende JavaScript desde cero hasta conceptos avanzados como ES6+, async/await, módulos y más. Incluye proyectos prácticos y las mejores prácticas de la industria.",
    shortDescription: "Curso completo de JavaScript moderno con proyectos reales",
    price: 89.99,
    level: "INTERMEDIATE",
    categoryId: 2, // Lenguajes de Programación
    subcategoryId: 6, // JavaScript
    estimatedHours: 25,
    thumbnailUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=600&fit=crop&crop=center",
    courseUrl: "javascript-moderno-completo",
    instructorId: 1, // Profesor Test
    isPublished: true,
    isPremium: true,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
    modules: [
      {
        id: 1,
        title: "Fundamentos de JavaScript",
        description: "Conceptos básicos del lenguaje JavaScript",
        orderIndex: 1,
        lessons: [
          {
            id: 1,
            title: "Introducción a JavaScript",
            description: "¿Qué es JavaScript y por qué es importante?",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
            durationSeconds: 420,
            orderIndex: 1,
            isActive: true
          },
          {
            id: 2,
            title: "Variables y Tipos de Datos",
            description: "Declaración de variables y tipos primitivos",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=8jLOx1hD3_o",
            durationSeconds: 380,
            orderIndex: 2,
            isActive: true
          },
          {
            id: 3,
            title: "Funciones en JavaScript",
            description: "Creación y uso de funciones",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=N8ap4k_1QEQ",
            durationSeconds: 450,
            orderIndex: 3,
            isActive: true
          }
        ]
      },
      {
        id: 2,
        title: "ES6+ y Características Modernas",
        description: "Nuevas características de JavaScript moderno",
        orderIndex: 2,
        lessons: [
          {
            id: 4,
            title: "Arrow Functions y Template Literals",
            description: "Sintaxis moderna de funciones y strings",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=h33Srr5J9nY",
            durationSeconds: 520,
            orderIndex: 1,
            isActive: true
          },
          {
            id: 5,
            title: "Destructuring y Spread Operator",
            description: "Desestructuración y operador spread",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=NIq3qLaHCIs",
            durationSeconds: 480,
            orderIndex: 2,
            isActive: true
          },
          {
            id: 6,
            title: "Promises y Async/Await",
            description: "Programación asíncrona moderna",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=PoRJizFvM7s",
            durationSeconds: 600,
            orderIndex: 3,
            isActive: true
          }
        ]
      },
      {
        id: 3,
        title: "DOM y Manipulación de Elementos",
        description: "Interacción con el Document Object Model",
        orderIndex: 3,
        lessons: [
          {
            id: 7,
            title: "Selección de Elementos DOM",
            description: "Métodos para seleccionar elementos",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=0ik6X4DJKCc",
            durationSeconds: 400,
            orderIndex: 1,
            isActive: true
          },
          {
            id: 8,
            title: "Event Listeners y Event Handling",
            description: "Manejo de eventos en JavaScript",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=XF1_MlZ5l6M",
            durationSeconds: 450,
            orderIndex: 2,
            isActive: true
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "React.js Completo: Construye Aplicaciones Modernas",
    description: "Domina React.js desde cero. Aprende hooks, context, routing, state management y construye aplicaciones web modernas y escalables.",
    shortDescription: "Curso completo de React.js con proyectos prácticos",
    price: 129.99,
    level: "INTERMEDIATE",
    categoryId: 3, // Frameworks y Librerías
    subcategoryId: 14, // React
    estimatedHours: 30,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop&crop=center",
    courseUrl: "react-completo-aplicaciones-modernas",
    instructorId: 1, // Profesor Test
    isPublished: false, // BORRADOR
    isPremium: true,
    isActive: true,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T14:20:00Z",
    modules: [
      {
        id: 4,
        title: "Introducción a React",
        description: "Conceptos fundamentales de React",
        orderIndex: 1,
        lessons: [
          {
            id: 9,
            title: "¿Qué es React y por qué usarlo?",
            description: "Introducción a la librería React",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
            durationSeconds: 480,
            orderIndex: 1,
            isActive: true
          },
          {
            id: 10,
            title: "Componentes y JSX",
            description: "Creación de componentes y sintaxis JSX",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=9hb_0TZ_MVI",
            durationSeconds: 520,
            orderIndex: 2,
            isActive: true
          },
          {
            id: 11,
            title: "Props y State",
            description: "Manejo de datos en componentes",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=4pO-HcG2igk",
            durationSeconds: 450,
            orderIndex: 3,
            isActive: true
          }
        ]
      },
      {
        id: 5,
        title: "Hooks y Estado Avanzado",
        description: "Hooks modernos de React",
        orderIndex: 2,
        lessons: [
          {
            id: 12,
            title: "useState y useEffect",
            description: "Hooks básicos de React",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=TNhaISOUy6Q",
            durationSeconds: 600,
            orderIndex: 1,
            isActive: true
          },
          {
            id: 13,
            title: "useContext y useReducer",
            description: "Hooks para manejo de estado complejo",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=6RhOzQciVwI",
            durationSeconds: 550,
            orderIndex: 2,
            isActive: true
          },
          {
            id: 14,
            title: "Custom Hooks",
            description: "Creación de hooks personalizados",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=6ThXsUwLWvc",
            durationSeconds: 480,
            orderIndex: 3,
            isActive: true
          }
        ]
      },
      {
        id: 6,
        title: "Routing y Navegación",
        description: "React Router y navegación en SPA",
        orderIndex: 3,
        lessons: [
          {
            id: 15,
            title: "React Router Setup",
            description: "Configuración básica de React Router",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=59IXY5IDrBA",
            durationSeconds: 420,
            orderIndex: 1,
            isActive: true
          },
          {
            id: 16,
            title: "Navegación Programática",
            description: "Navegación mediante código",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=SLfhMt5OUPI",
            durationSeconds: 380,
            orderIndex: 2,
            isActive: true
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Python para Ciencia de Datos",
    description: "Aprende Python desde cero aplicado a ciencia de datos. Incluye pandas, numpy, matplotlib, scikit-learn y proyectos reales de análisis de datos.",
    shortDescription: "Python aplicado a ciencia de datos con librerías especializadas",
    price: 149.99,
    level: "ADVANCED",
    categoryId: 6, // Ciencia de Datos e IA
    subcategoryId: 35, // Machine Learning
    estimatedHours: 35,
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center",
    courseUrl: "python-ciencia-datos-completo",
    instructorId: 1, // Profesor Test
    isPublished: false, // BORRADOR
    isPremium: true,
    isActive: true,
    createdAt: "2024-01-12T11:30:00Z",
    updatedAt: "2024-01-19T16:45:00Z",
    modules: [
      {
        id: 7,
        title: "Fundamentos de Python",
        description: "Sintaxis básica y conceptos fundamentales",
        orderIndex: 1,
        lessons: [
          {
            id: 17,
            title: "Introducción a Python",
            description: "¿Por qué Python para ciencia de datos?",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=kqtD5dpb9h8",
            durationSeconds: 450,
            orderIndex: 1,
            isActive: true
          },
          {
            id: 18,
            title: "Variables y Estructuras de Datos",
            description: "Listas, diccionarios, tuplas y sets",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=ZDa-Z5JzLYM",
            durationSeconds: 520,
            orderIndex: 2,
            isActive: true
          },
          {
            id: 19,
            title: "Control de Flujo y Funciones",
            description: "Condicionales, bucles y funciones",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
            durationSeconds: 600,
            orderIndex: 3,
            isActive: true
          }
        ]
      },
      {
        id: 8,
        title: "Pandas y Manipulación de Datos",
        description: "Análisis y manipulación de datos con pandas",
        orderIndex: 2,
        lessons: [
          {
            id: 20,
            title: "Introducción a Pandas",
            description: "DataFrames y Series en pandas",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=vmEHCJofslg",
            durationSeconds: 480,
            orderIndex: 1,
            isActive: true
          },
          {
            id: 21,
            title: "Filtrado y Agrupación de Datos",
            description: "Técnicas avanzadas de manipulación",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=txMdrV1Ut64",
            durationSeconds: 550,
            orderIndex: 2,
            isActive: true
          },
          {
            id: 22,
            title: "Limpieza y Preprocesamiento",
            description: "Preparación de datos para análisis",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=5JnMutdy6Fw",
            durationSeconds: 500,
            orderIndex: 3,
            isActive: true
          }
        ]
      },
      {
        id: 9,
        title: "Visualización de Datos",
        description: "Creación de gráficos y visualizaciones",
        orderIndex: 3,
        lessons: [
          {
            id: 23,
            title: "Matplotlib Básico",
            description: "Creación de gráficos con matplotlib",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=3Xc3CA655Y4",
            durationSeconds: 420,
            orderIndex: 1,
            isActive: true
          },
          {
            id: 24,
            title: "Seaborn para Visualizaciones Avanzadas",
            description: "Gráficos estadísticos con seaborn",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=6_2hzRopPbQ",
            durationSeconds: 480,
            orderIndex: 2,
            isActive: true
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Node.js y Express: Backend Completo",
    description: "Desarrolla APIs robustas con Node.js y Express. Incluye autenticación, bases de datos, testing y despliegue en la nube.",
    shortDescription: "Desarrollo de backend con Node.js y Express",
    price: 99.99,
    level: "INTERMEDIATE",
    categoryId: 3, // Frameworks y Librerías
    subcategoryId: 17, // Node.js
    estimatedHours: 20,
    thumbnailUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop&crop=center",
    courseUrl: "nodejs-express-backend-completo",
    instructorId: 1, // Profesor Test
    isPublished: true,
    isPremium: true,
    isActive: true,
    createdAt: "2024-01-08T08:15:00Z",
    updatedAt: "2024-01-17T12:30:00Z",
    modules: [
      {
        id: 10,
        title: "Fundamentos de Node.js",
        description: "Introducción al entorno de ejecución Node.js",
        orderIndex: 1,
        lessons: [
          {
            id: 25,
            title: "¿Qué es Node.js?",
            description: "Introducción al runtime de JavaScript",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE",
            durationSeconds: 400,
            orderIndex: 1,
            isActive: true
          },
          {
            id: 26,
            title: "Módulos y NPM",
            description: "Sistema de módulos y gestión de paquetes",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=JLOkFqoFgJY",
            durationSeconds: 450,
            orderIndex: 2,
            isActive: true
          }
        ]
      },
      {
        id: 11,
        title: "Express.js Framework",
        description: "Creación de APIs con Express",
        orderIndex: 2,
        lessons: [
          {
            id: 27,
            title: "Configuración de Express",
            description: "Setup inicial y middleware",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=L72fhGm1tfE",
            durationSeconds: 480,
            orderIndex: 1,
            isActive: true
          },
          {
            id: 28,
            title: "Rutas y Controladores",
            description: "Creación de endpoints y lógica de negocio",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=pKd0Rpw7O48",
            durationSeconds: 520,
            orderIndex: 2,
            isActive: true
          },
          {
            id: 29,
            title: "Middleware Personalizado",
            description: "Creación de middleware custom",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=9H9j2DaL73c",
            durationSeconds: 400,
            orderIndex: 3,
            isActive: true
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Docker y Kubernetes: Contenedores en Producción",
    description: "Domina Docker y Kubernetes para despliegue de aplicaciones. Aprende containerización, orquestación y DevOps moderno.",
    shortDescription: "Containerización y orquestación con Docker y Kubernetes",
    price: 179.99,
    level: "ADVANCED",
    categoryId: 5, // Cloud y DevOps
    subcategoryId: 31, // Docker
    estimatedHours: 28,
    thumbnailUrl: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&h=600&fit=crop&crop=center",
    courseUrl: "docker-kubernetes-produccion",
    instructorId: 1, // Profesor Test
    isPublished: false, // BORRADOR
    isPremium: true,
    isActive: true,
    createdAt: "2024-01-14T13:45:00Z",
    updatedAt: "2024-01-21T09:15:00Z",
    modules: [
      {
        id: 12,
        title: "Introducción a Docker",
        description: "Conceptos básicos de containerización",
        orderIndex: 1,
        lessons: [
          {
            id: 30,
            title: "¿Qué es Docker?",
            description: "Introducción a la containerización",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=pTFZFxd4hOI",
            durationSeconds: 450,
            orderIndex: 1,
            isActive: true
          },
          {
            id: 31,
            title: "Dockerfile y Imágenes",
            description: "Creación de imágenes personalizadas",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=Wm99C_f7Kxw",
            durationSeconds: 500,
            orderIndex: 2,
            isActive: true
          },
          {
            id: 32,
            title: "Docker Compose",
            description: "Orquestación de múltiples contenedores",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=HG6yIjZapSA",
            durationSeconds: 480,
            orderIndex: 3,
            isActive: true
          }
        ]
      },
      {
        id: 13,
        title: "Kubernetes Fundamentals",
        description: "Orquestación de contenedores con Kubernetes",
        orderIndex: 2,
        lessons: [
          {
            id: 33,
            title: "Introducción a Kubernetes",
            description: "Conceptos básicos de K8s",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=X48VuDVv0do",
            durationSeconds: 520,
            orderIndex: 1,
            isActive: true
          },
          {
            id: 34,
            title: "Pods y Services",
            description: "Unidades básicas de Kubernetes",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=PH-2FfFD2PU",
            durationSeconds: 480,
            orderIndex: 2,
            isActive: true
          }
        ]
      }
    ]
  }
];

// Función para obtener un curso por ID
export const getCourseById = (courseId) => {
  return MOCK_COURSES.find(course => course.id === parseInt(courseId));
};

// Función para obtener todos los cursos
export const getAllCourses = () => {
  return MOCK_COURSES;
};

// Función para obtener módulos de un curso
export const getCourseModules = (courseId) => {
  const course = getCourseById(courseId);
  return course ? course.modules : [];
};

// Función para obtener videos de un curso
export const getCourseVideos = (courseId) => {
  const modules = getCourseModules(courseId);
  const videos = [];
  
  modules.forEach(module => {
    module.lessons.forEach(lesson => {
      if (lesson.type === 'VIDEO') {
        videos.push({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          youtubeUrl: lesson.youtubeUrl,
          youtubeVideoId: extractYouTubeVideoId(lesson.youtubeUrl),
          durationSeconds: lesson.durationSeconds,
          orderIndex: lesson.orderIndex,
          isActive: lesson.isActive,
          courseId: courseId,
          moduleId: module.id,
          moduleTitle: module.title,
          moduleOrderIndex: module.orderIndex,
          completed: false
        });
      }
    });
  });
  
  return videos;
};

// Función auxiliar para extraer ID de video de YouTube
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

// Función para buscar cursos
export const searchCourses = (query) => {
  const searchTerm = query.toLowerCase();
  return MOCK_COURSES.filter(course => 
    course.title.toLowerCase().includes(searchTerm) ||
    course.description.toLowerCase().includes(searchTerm) ||
    course.shortDescription.toLowerCase().includes(searchTerm)
  );
};

// Función para filtrar cursos por categoría
export const getCoursesByCategory = (categoryId) => {
  return MOCK_COURSES.filter(course => course.categoryId === parseInt(categoryId));
};

// Función para filtrar cursos por nivel
export const getCoursesByLevel = (level) => {
  return MOCK_COURSES.filter(course => course.level.toLowerCase() === level.toLowerCase());
};

// Función para obtener todos los instructores
export const getAllInstructors = () => {
  return MOCK_INSTRUCTORS;
};

// Función para obtener un instructor por ID
export const getInstructorById = (instructorId) => {
  return MOCK_INSTRUCTORS.find(instructor => instructor.id === parseInt(instructorId));
};

// Función para obtener cursos por instructor
export const getCoursesByInstructor = (instructorId) => {
  console.log("🔍 Buscando cursos para instructor ID:", instructorId);
  console.log("📚 Cursos disponibles:", MOCK_COURSES.map(c => ({ id: c.id, title: c.title, instructorId: c.instructorId })));
  
  const courses = MOCK_COURSES.filter(course => course.instructorId === parseInt(instructorId));
  console.log("✅ Cursos encontrados:", courses.length);
  
  return courses;
};

// Función para obtener cursos por email del instructor
export const getCoursesByInstructorEmail = (email) => {
  console.log("🔍 Buscando cursos para instructor email:", email);
  
  // Solo el instructor de ejemplo (instructor@test.com) tiene cursos mock
  if (email === "instructor@test.com") {
    console.log("✅ Email coincide con instructor@test.com (instructor de ejemplo), devolviendo todos los cursos mock");
    return MOCK_COURSES;
  }
  
  // Para todos los demás instructores, devolver array vacío (empiezan limpios)
  console.log("📝 Instructor nuevo detectado, devolviendo array vacío (empieza limpio)");
  return [];
};
