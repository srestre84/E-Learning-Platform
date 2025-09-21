import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2, AlertCircle, BookOpen, Play, User, Clock } from "lucide-react";

const CourseContentUltraSimple = () => {
  const { id: courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  console.log("🎯 CourseContentUltraSimple - courseId:", courseId);

  useEffect(() => {
    const loadData = async () => {
      console.log("🔄 Iniciando carga ultra simple...");
      setLoading(true);
      setError(null);

      try {
        // Obtener token del localStorage
        const token = localStorage.getItem('token');
        console.log("🔑 Token encontrado:", token ? "Sí" : "No");

        if (!token) {
          throw new Error("No hay token de autenticación");
        }

        // Cargar curso directamente con fetch
        console.log("📚 Cargando curso con fetch...");
        const courseResponse = await fetch(`http://localhost:8081/api/courses/${courseId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("📊 Respuesta del curso:", courseResponse.status);

        if (!courseResponse.ok) {
          throw new Error(`Error al cargar curso: ${courseResponse.status} ${courseResponse.statusText}`);
        }

        const course = await courseResponse.json();
        console.log("✅ Curso cargado exitosamente:", course);

        // Cargar videos directamente con fetch
        console.log("🎬 Cargando videos con fetch...");
        const videosResponse = await fetch(`http://localhost:8081/api/course-videos/course/${courseId}/lessons`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("📊 Respuesta de videos:", videosResponse.status);

        if (!videosResponse.ok) {
          console.warn("⚠️ Error al cargar videos:", videosResponse.status);
          // No lanzar error, solo usar array vacío
        }

        const videos = videosResponse.ok ? await videosResponse.json() : [];
        console.log("✅ Videos cargados:", videos);
        
        // Verificar que los videos tengan la estructura correcta
        if (Array.isArray(videos)) {
          console.log("✅ Videos es un array válido con", videos.length, "elementos");
        } else {
          console.warn("⚠️ Videos no es un array:", typeof videos);
        }

        setData({
          course,
          videos,
          loadedAt: new Date().toISOString()
        });

        console.log("🎉 Datos cargados exitosamente!");

      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message);
      } finally {
        console.log("🏁 Finalizando carga - setLoading(false)");
        setLoading(false);
      }
    };

    if (courseId) {
      loadData();
    } else {
      setError("No se proporcionó ID de curso");
      setLoading(false);
    }
  }, [courseId]);

  console.log("🎭 Estado actual:", { loading, error, data: !!data });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Cargando contenido del curso...</p>
            <p className="text-sm text-gray-500 mt-2">CourseId: {courseId}</p>
            <p className="text-xs text-gray-400 mt-1">Versión Ultra Simple</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">CourseId: {courseId}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin datos</h2>
          <p className="text-gray-600">No se pudieron cargar los datos del curso</p>
        </div>
      </div>
    );
  }

  const { course, videos } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header del curso */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {course.title || "Curso"}
              </h1>
              <p className="text-gray-600 mb-4">
                {course.description || "Sin descripción disponible"}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>{course.instructor?.userName || "Instructor"}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{course.estimatedHours || 0} horas</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>{course.level || "Nivel no especificado"}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-500">
                ${course.price || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido del curso */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de videos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Contenido del Curso ({videos.length} videos)
              </h2>
              
              {videos.length > 0 ? (
                <div className="space-y-3">
                  {videos.map((video, index) => (
                    <div key={video.id || index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
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
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {video.durationSeconds ? `${Math.floor(video.durationSeconds / 60)}:${(video.durationSeconds % 60).toString().padStart(2, '0')}` : "0:00"}
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

          {/* Información adicional */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Información del Curso</h3>
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

            {/* Acciones */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Acciones</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  <div className="flex items-center justify-center">
                    <Play className="w-4 h-4 mr-2" />
                    Comenzar Curso
                  </div>
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex items-center justify-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Ver Contenido
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con información de debug */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Versión Ultra Simple - Cargado: {data.loadedAt}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseContentUltraSimple;
