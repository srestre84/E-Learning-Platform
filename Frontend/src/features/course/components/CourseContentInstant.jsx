import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, Play, User, Clock, ArrowLeft, CheckCircle, Star, Award } from "lucide-react";

const CourseContentInstant = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  console.log("🚀 CourseContentInstant - INICIANDO");
  console.log("📋 CourseId:", courseId);

  // Datos estáticos completos para el curso
  const courseData = {
    id: courseId,
    title: "Spring Boot Avanzado",
    description: "Domina Spring Boot con técnicas avanzadas y mejores prácticas para el desarrollo de aplicaciones empresariales. Aprende desde conceptos básicos hasta arquitecturas complejas.",
    shortDescription: "Curso completo de Spring Boot para desarrolladores avanzados",
    price: 69.99,
    estimatedHours: 50,
    level: "ADVANCED",
    instructor: {
      id: 1,
      userName: "Juan",
      lastName: "Pérez",
      email: "juan@example.com",
      profileImageUrl: null
    },
    category: {
      id: 1,
      name: "Backend",
      description: "Desarrollo de backend y APIs"
    },
    subcategory: {
      id: 1,
      name: "Spring Boot",
      description: "Framework Spring Boot"
    },
    isPremium: false,
    isPublished: true,
    isActive: true,
    thumbnailUrl: null,
    youtubeUrls: null,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z"
  };

  const videosData = [
    {
      id: 1,
      title: "Introducción a Spring Boot",
      description: "¿Qué es Spring Boot y por qué es tan popular?",
      moduleTitle: "Fundamentos de Spring Boot",
      moduleId: 1,
      moduleDescription: "Conceptos básicos y fundamentos del framework",
      moduleOrderIndex: 1,
      orderIndex: 1,
      type: "VIDEO",
      durationSeconds: 720,
      youtubeUrl: "https://www.youtube.com/watch?v=example1",
      youtubeVideoId: "example1",
      thumbnailUrl: null,
      content: "Contenido del video de introducción",
      isActive: true,
      isPreview: true
    },
    {
      id: 2,
      title: "Configuración del Entorno",
      description: "Cómo configurar tu entorno de desarrollo",
      moduleTitle: "Fundamentos de Spring Boot",
      moduleId: 1,
      moduleDescription: "Conceptos básicos y fundamentos del framework",
      moduleOrderIndex: 1,
      orderIndex: 2,
      type: "VIDEO",
      durationSeconds: 900,
      youtubeUrl: "https://www.youtube.com/watch?v=example2",
      youtubeVideoId: "example2",
      thumbnailUrl: null,
      content: "Contenido del video de configuración",
      isActive: true,
      isPreview: false
    },
    {
      id: 3,
      title: "Creando tu Primera Aplicación",
      description: "Spring Initializr y Hello World",
      moduleTitle: "Primeros Pasos",
      moduleId: 2,
      moduleDescription: "Creando tu primera aplicación Spring Boot",
      moduleOrderIndex: 2,
      orderIndex: 1,
      type: "VIDEO",
      durationSeconds: 840,
      youtubeUrl: "https://www.youtube.com/watch?v=example3",
      youtubeVideoId: "example3",
      thumbnailUrl: null,
      content: "Contenido del video de primera aplicación",
      isActive: true,
      isPreview: false
    },
    {
      id: 4,
      title: "Controllers y RequestMapping",
      description: "Manejo de requests HTTP con Spring Boot",
      moduleTitle: "REST APIs",
      moduleId: 3,
      moduleDescription: "Desarrollo de APIs REST con Spring Boot",
      moduleOrderIndex: 3,
      orderIndex: 1,
      type: "VIDEO",
      durationSeconds: 1080,
      youtubeUrl: "https://www.youtube.com/watch?v=example4",
      youtubeVideoId: "example4",
      thumbnailUrl: null,
      content: "Contenido del video de controllers",
      isActive: true,
      isPreview: false
    },
    {
      id: 5,
      title: "CRUD Operations",
      description: "Create, Read, Update, Delete con Spring Boot",
      moduleTitle: "REST APIs",
      moduleId: 3,
      moduleDescription: "Desarrollo de APIs REST con Spring Boot",
      moduleOrderIndex: 3,
      orderIndex: 2,
      type: "VIDEO",
      durationSeconds: 1200,
      youtubeUrl: "https://www.youtube.com/watch?v=example5",
      youtubeVideoId: "example5",
      thumbnailUrl: null,
      content: "Contenido del video de CRUD",
      isActive: true,
      isPreview: false
    }
  ];

  const modulesData = [
    {
      id: 1,
      title: "Fundamentos de Spring Boot",
      description: "Conceptos básicos y fundamentos del framework",
      orderIndex: 1,
      isActive: true,
      courseId: courseId
    },
    {
      id: 2,
      title: "Primeros Pasos",
      description: "Creando tu primera aplicación Spring Boot",
      orderIndex: 2,
      isActive: true,
      courseId: courseId
    },
    {
      id: 3,
      title: "REST APIs",
      description: "Desarrollo de APIs REST con Spring Boot",
      orderIndex: 3,
      isActive: true,
      courseId: courseId
    }
  ];

  const enrollmentData = {
    id: 1,
    studentId: 1,
    courseId: courseId,
    status: "ACTIVE",
    progressPercentage: 25,
    enrolledAt: "2024-01-16T09:00:00Z",
    completedAt: null,
    paymentId: "pay_123456789",
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-18T14:30:00Z",
    isEnrolled: true
  };

  // Simular carga instantánea
  useEffect(() => {
    console.log("⏳ Simulando carga instantánea...");
    const timer = setTimeout(() => {
      setIsLoaded(true);
      console.log("✅ Carga completada instantáneamente!");
    }, 100); // Solo 100ms para simular carga

    return () => clearTimeout(timer);
  }, [courseId]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando contenido del curso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header del curso */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </button>
              <div className="text-right">
                <div className="text-3xl font-bold text-red-500">
                  ${courseData.price}
                </div>
                <div className="text-sm text-gray-500">Precio</div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {courseData.title}
            </h1>
            
            <p className="text-lg text-gray-700 mb-6">
              {courseData.description}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-500" />
                <span>{courseData.instructor.userName} {courseData.instructor.lastName}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-green-500" />
                <span>{courseData.estimatedHours} horas</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
                <span>{courseData.level}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                <span>4.8 (124 reseñas)</span>
              </div>
            </div>

            {/* Estado de inscripción */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-700 font-medium">
                  Estás inscrito en este curso
                </span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-green-600 mb-1">
                  <span>Progreso</span>
                  <span>{enrollmentData.progressPercentage}%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${enrollmentData.progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido del curso */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de videos por módulos */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Play className="w-6 h-6 mr-3 text-red-500" />
                  Contenido del Curso ({videosData.length} videos)
                </h2>
                
                {modulesData.map((module, moduleIndex) => {
                  const moduleVideos = videosData.filter(video => video.moduleId === module.id);
                  
                  return (
                    <div key={module.id} className="mb-8">
                      <div className="border-b border-gray-200 pb-3 mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Módulo {module.orderIndex}: {module.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {module.description}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span>{moduleVideos.length} videos</span>
                          <span className="mx-2">•</span>
                          <span>
                            {Math.floor(moduleVideos.reduce((acc, video) => acc + video.durationSeconds, 0) / 60)} min
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {moduleVideos.map((video, videoIndex) => (
                          <div key={video.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                    <Play className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-1">
                                    {video.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {video.description}
                                  </p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span>Video {video.orderIndex}</span>
                                    <span>•</span>
                                    <span>{formatDuration(video.durationSeconds)}</span>
                                    {video.isPreview && (
                                      <>
                                        <span>•</span>
                                        <span className="text-blue-600 font-medium">Vista previa</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex-shrink-0 ml-4">
                                <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors">
                                  Reproducir
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panel lateral */}
            <div className="lg:col-span-1">
              {/* Información del curso */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Curso</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Categoría:</span>
                    <span className="ml-2 text-gray-600">{courseData.category.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Subcategoría:</span>
                    <span className="ml-2 text-gray-600">{courseData.subcategory.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tipo:</span>
                    <span className="ml-2 text-gray-600">
                      {courseData.isPremium ? "Premium" : "Gratuito"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Estado:</span>
                    <span className="ml-2 text-gray-600">
                      {courseData.isPublished ? "Publicado" : "Borrador"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Creado:</span>
                    <span className="ml-2 text-gray-600">{formatDate(courseData.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Progreso del curso */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tu Progreso</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso General</span>
                      <span>{enrollmentData.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollmentData.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Videos completados:</span>
                      <span>1 de {videosData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Módulos completados:</span>
                      <span>0 de {modulesData.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones</h3>
                <div className="space-y-3">
                  <button className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-semibold">
                    <div className="flex items-center justify-center">
                      <Play className="w-4 h-4 mr-2" />
                      Continuar Curso
                    </div>
                  </button>
                  <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    <div className="flex items-center justify-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Ver Contenido
                    </div>
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                    <div className="flex items-center justify-center">
                      <Award className="w-4 h-4 mr-2" />
                      Marcar como Completado
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con información de debug */}
          <div className="mt-8 text-center text-xs text-gray-400">
            <p>Versión Instantánea - Cargado: {new Date().toLocaleString()}</p>
            <p>Videos: {videosData.length} | Módulos: {modulesData.length} | CourseId: {courseId}</p>
            <p className="text-green-600 font-semibold">✅ Datos estáticos completos - Sin carga de API</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentInstant;
