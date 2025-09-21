import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, Play, User, Clock, ArrowLeft, CheckCircle } from "lucide-react";

const CourseContentStatic = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  console.log("🚀 CourseContentStatic - INICIANDO");
  console.log("📋 CourseId:", courseId);

  // Datos estáticos para prueba
  const staticCourse = {
    id: courseId,
    title: "Spring Boot Avanzado",
    description: "Domina Spring Boot con técnicas avanzadas y mejores prácticas para el desarrollo de aplicaciones empresariales.",
    price: 69.99,
    estimatedHours: 50,
    level: "ADVANCED",
    instructor: {
      userName: "Juan",
      lastName: "Pérez"
    },
    category: {
      name: "Backend"
    },
    subcategory: {
      name: "Spring Boot"
    },
    isPremium: false,
    isPublished: true
  };

  const staticVideos = [
    {
      id: 1,
      title: "¿Qué es Spring Boot?",
      description: "Introducción al framework Spring Boot",
      moduleTitle: "Introducción a Spring Boot",
      durationSeconds: 720
    },
    {
      id: 2,
      title: "Creando tu primera aplicación",
      description: "Spring Initializr y Hello World",
      moduleTitle: "Introducción a Spring Boot",
      durationSeconds: 900
    },
    {
      id: 3,
      title: "Controllers y RequestMapping",
      description: "Manejo de requests HTTP",
      moduleTitle: "REST APIs con Spring Boot",
      durationSeconds: 840
    },
    {
      id: 4,
      title: "CRUD Operations",
      description: "Create, Read, Update, Delete",
      moduleTitle: "REST APIs con Spring Boot",
      durationSeconds: 1080
    }
  ];

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
                  ${staticCourse.price}
                </div>
                <div className="text-sm text-gray-500">Precio</div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {staticCourse.title}
            </h1>
            
            <p className="text-lg text-gray-700 mb-6">
              {staticCourse.description}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-500" />
                <span>{staticCourse.instructor.userName} {staticCourse.instructor.lastName}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-green-500" />
                <span>{staticCourse.estimatedHours} horas</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
                <span>{staticCourse.level}</span>
              </div>
            </div>
          </div>

          {/* Contenido del curso */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de videos */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Play className="w-6 h-6 mr-3 text-red-500" />
                  Contenido del Curso ({staticVideos.length} videos)
                </h2>
                
                <div className="space-y-4">
                  {staticVideos.map((video, index) => (
                    <div key={video.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {video.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {video.moduleTitle}
                          </p>
                          <p className="text-sm text-gray-500">
                            {video.description}
                          </p>
                        </div>
                        <div className="text-right text-sm text-gray-500 ml-4">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDuration(video.durationSeconds)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel lateral */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Curso</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Categoría:</span>
                    <span className="ml-2 text-gray-600">
                      {staticCourse.category.name}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Subcategoría:</span>
                    <span className="ml-2 text-gray-600">
                      {staticCourse.subcategory.name}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tipo:</span>
                    <span className="ml-2 text-gray-600">
                      {staticCourse.isPremium ? "Premium" : "Gratuito"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Estado:</span>
                    <span className="ml-2 text-gray-600">
                      {staticCourse.isPublished ? "Publicado" : "Borrador"}
                    </span>
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
                      Comenzar Curso
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
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Completado
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con información de debug */}
          <div className="mt-8 text-center text-xs text-gray-400">
            <p>Versión Estática - Cargado: {new Date().toLocaleString()}</p>
            <p>Videos: {staticVideos.length} | CourseId: {courseId}</p>
            <p className="text-green-600 font-semibold">✅ Datos estáticos - Sin carga de API</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentStatic;
