import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, BookOpen, Play, User, Clock, ArrowLeft, Trophy, CheckCircle } from "lucide-react";

const CourseContentFinal = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [courseData, setCourseData] = useState(null);
  const [videosData, setVideosData] = useState([]);
  const [error, setError] = useState(null);

  console.log("🚀 CourseContentFinal - INICIANDO");
  console.log("📋 CourseId:", courseId);

  useEffect(() => {
    console.log("🔄 useEffect ejecutado");
    
    const loadCourseData = () => {
      try {
        console.log("⏳ Paso 1: Verificando token...");
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError("No hay token de autenticación");
          setStatus("error");
          return;
        }
        
        console.log("✅ Token encontrado");
        setStatus("loading_course");
        
        // Cargar curso
        fetch(`http://localhost:8081/api/courses/${courseId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log("📊 Respuesta curso:", response.status);
          
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }
          
          return response.json();
        })
        .then(course => {
          console.log("✅ Curso cargado:", course);
          setCourseData(course);
          setStatus("loading_videos");
          
          // Cargar videos
          return fetch(`http://localhost:8081/api/course-videos/course/${courseId}/lessons`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        })
        .then(response => {
          console.log("📊 Respuesta videos:", response.status);
          
          if (!response.ok) {
            console.warn("⚠️ Error al cargar videos:", response.status);
            return [];
          }
          
          return response.json();
        })
        .then(videos => {
          console.log("✅ Videos cargados:", videos);
          setVideosData(Array.isArray(videos) ? videos : []);
          setStatus("success");
        })
        .catch(err => {
          console.error("❌ Error:", err);
          setError(err.message);
          setStatus("error");
        });
        
      } catch (err) {
        console.error("❌ Error síncrono:", err);
        setError(err.message);
        setStatus("error");
      }
    };

    if (courseId) {
      loadCourseData();
    } else {
      setError("No se proporcionó ID de curso");
      setStatus("error");
    }
  }, [courseId]);

  const getStatusColor = () => {
    switch (status) {
      case "loading": return "text-blue-600";
      case "loading_course": return "text-yellow-600";
      case "loading_videos": return "text-orange-600";
      case "success": return "text-green-600";
      case "error": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "loading": return "⏳";
      case "loading_course": return "📚";
      case "loading_videos": return "🎬";
      case "success": return "✅";
      case "error": return "❌";
      default: return "❓";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "loading": return "Verificando autenticación...";
      case "loading_course": return "Cargando información del curso...";
      case "loading_videos": return "Cargando videos del curso...";
      case "success": return "¡Curso cargado exitosamente!";
      case "error": return "Error al cargar el curso";
      default: return "Estado desconocido";
    }
  };

  if (status === "error") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al Cargar el Curso</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2 inline" />
                Volver
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                🔄 Recargar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status !== "success" || !courseData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className={`text-6xl mb-4 ${getStatusColor()}`}>{getStatusIcon()}</div>
            <h2 className="text-2xl font-semibold mb-2">{getStatusText()}</h2>
            <p className="text-sm text-gray-500 mb-4">Estado: {status}</p>
            <p className="text-sm text-gray-500">CourseId: {courseId}</p>
          </div>
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
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-500" />
                <span>{courseData.instructor?.userName} {courseData.instructor?.lastName}</span>
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
                <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                <span>{courseData.modules?.length || 0} módulos</span>
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
                  Contenido del Curso
                </h2>
                
                {videosData.length > 0 ? (
                  <div className="space-y-4">
                    {videosData.map((video, index) => (
                      <div key={video.id || index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {video.title || `Video ${index + 1}`}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {video.moduleTitle || "Módulo no especificado"}
                            </p>
                            {video.description && (
                              <p className="text-sm text-gray-500">
                                {video.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right text-sm text-gray-500 ml-4">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {video.durationSeconds ? 
                                `${Math.floor(video.durationSeconds / 60)}:${(video.durationSeconds % 60).toString().padStart(2, '0')}` : 
                                "0:00"
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Play className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay videos disponibles para este curso</p>
                  </div>
                )}
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
                    <span className="ml-2 text-gray-600">
                      {courseData.category?.name || "No especificada"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Subcategoría:</span>
                    <span className="ml-2 text-gray-600">
                      {courseData.subcategory?.name || "No especificada"}
                    </span>
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
            <p>Versión Final - Cargado: {new Date().toLocaleString()}</p>
            <p>Videos: {videosData.length} | Módulos: {courseData.modules?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentFinal;
