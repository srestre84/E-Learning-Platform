import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, BookOpen, Play, User, Clock, ArrowLeft } from "lucide-react";

const CourseContentDirect = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);

  console.log("🚀 CourseContentDirect - INICIANDO");
  console.log("📋 CourseId:", courseId);

  useEffect(() => {
    console.log("🔄 useEffect ejecutado");
    
    // Función síncrona simple
    const loadData = () => {
      console.log("⏳ Iniciando carga de datos...");
      
      try {
        const token = localStorage.getItem('token');
        console.log("🔑 Token:", token ? "ENCONTRADO" : "NO ENCONTRADO");
        
        if (!token) {
          setError("No hay token de autenticación. Por favor inicia sesión.");
          setLoading(false);
          return;
        }

        console.log("📚 Cargando curso...");
        
        // Fetch directo sin async/await
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
        .then(data => {
          console.log("✅ Curso cargado:", data);
          setCourse(data);
          
          console.log("🎬 Cargando videos...");
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
            console.warn("⚠️ Error videos:", response.status);
            return [];
          }
          return response.json();
        })
        .then(data => {
          console.log("✅ Videos cargados:", data);
          setVideos(Array.isArray(data) ? data : []);
          setLoading(false);
          console.log("🎉 Carga completada!");
        })
        .catch(err => {
          console.error("❌ Error:", err);
          setError(err.message);
          setLoading(false);
        });
        
      } catch (err) {
        console.error("❌ Error síncrono:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (courseId) {
      // Delay mínimo para evitar problemas de timing
      setTimeout(loadData, 100);
    } else {
      setError("No se proporcionó ID de curso");
      setLoading(false);
    }
  }, [courseId]);

  console.log("🎭 Estado actual:", { loading, error, course: !!course, videos: videos.length });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Cargando Curso</h2>
            <p className="text-gray-600 mb-4">Por favor espera mientras cargamos el contenido...</p>
            <p className="text-sm text-gray-500">CourseId: {courseId}</p>
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔄 Recargar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error al Cargar</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => navigate("/authentication/login")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔑 Iniciar Sesión
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

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Curso No Encontrado</h2>
            <p className="text-gray-600 mb-4">No se pudo cargar la información del curso</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🏠 Ir al Dashboard
            </button>
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
                  ${course.price}
                </div>
                <div className="text-sm text-gray-500">Precio</div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>
            
            <p className="text-lg text-gray-700 mb-6">
              {course.description}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-500" />
                <span>{course.instructor?.userName} {course.instructor?.lastName}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-green-500" />
                <span>{course.estimatedHours} horas</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
                <span>{course.level}</span>
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
                  Contenido del Curso ({videos.length} videos)
                </h2>
                
                {videos.length > 0 ? (
                  <div className="space-y-4">
                    {videos.map((video, index) => (
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
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Curso</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Categoría:</span>
                    <span className="ml-2 text-gray-600">
                      {course.category?.name || "No especificada"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Subcategoría:</span>
                    <span className="ml-2 text-gray-600">
                      {course.subcategory?.name || "No especificada"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tipo:</span>
                    <span className="ml-2 text-gray-600">
                      {course.isPremium ? "Premium" : "Gratuito"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Estado:</span>
                    <span className="ml-2 text-gray-600">
                      {course.isPublished ? "Publicado" : "Borrador"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con información de debug */}
          <div className="mt-8 text-center text-xs text-gray-400">
            <p>Versión Directa - Cargado: {new Date().toLocaleString()}</p>
            <p>Videos: {videos.length} | Módulos: {course.modules?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentDirect;
