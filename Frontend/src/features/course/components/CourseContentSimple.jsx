import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { getCourseById } from "@/services/courseService";
import { getCourseVideos } from "@/services/courseVideoService";
import { checkEnrollment } from "@/services/enrollmentService";

const CourseContentSimple = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("🎯 CourseContentSimple - courseId recibido:", courseId);

  useEffect(() => {
    const loadData = async () => {
      console.log("🔄 Iniciando carga de datos...");
      setLoading(true);
      setError(null);

      try {
        // Cargar curso
        console.log("📚 Cargando curso...");
        const courseData = await getCourseById(courseId);
        console.log("✅ Curso cargado:", courseData);
        setCourse(courseData);

        // Cargar videos
        console.log("🎬 Cargando videos...");
        const videosData = await getCourseVideos(courseId);
        console.log("✅ Videos cargados:", videosData);
        setVideos(videosData || []);

        // Verificar inscripción
        console.log("📋 Verificando inscripción...");
        const enrollmentData = await checkEnrollment(courseId);
        console.log("✅ Inscripción verificada:", enrollmentData);
        setEnrollment(enrollmentData);

        console.log("🎉 Todos los datos cargados exitosamente!");
      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message || "Error al cargar los datos");
      } finally {
        console.log("🏁 Finalizando carga - setLoading(false)");
        setLoading(false);
      }
    };

    if (courseId) {
      loadData();
    }
  }, [courseId]);

  console.log("🎭 Estado actual:", { loading, error, course: !!course, videos: videos.length, enrollment: !!enrollment });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Cargando contenido del curso...</p>
            <p className="text-sm text-gray-500 mt-2">CourseId: {courseId}</p>
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
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {course?.title || "Curso"}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información del curso */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Información del Curso</h2>
              <div className="space-y-3">
                <p><strong>Descripción:</strong> {course?.description || "Sin descripción"}</p>
                <p><strong>Instructor:</strong> {course?.instructor?.userName || "No disponible"}</p>
                <p><strong>Nivel:</strong> {course?.level || "No especificado"}</p>
                <p><strong>Horas estimadas:</strong> {course?.estimatedHours || 0}h</p>
                <p><strong>Estado de inscripción:</strong> {enrollment?.isEnrolled ? "Inscrito" : "No inscrito"}</p>
                {enrollment?.progressPercentage !== undefined && (
                  <p><strong>Progreso:</strong> {enrollment.progressPercentage}%</p>
                )}
              </div>
            </div>
          </div>

          {/* Contenido del curso */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Contenido del Curso</h2>
              
              {videos.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Videos ({videos.length})</h3>
                  <div className="space-y-2">
                    {videos.map((video, index) => (
                      <div key={video.id || index} className="border rounded-lg p-4">
                        <h4 className="font-medium">{video.title}</h4>
                        <p className="text-sm text-gray-600">Módulo: {video.moduleTitle}</p>
                        <p className="text-sm text-gray-500">Duración: {video.durationSeconds || 0} segundos</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No hay videos disponibles para este curso.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentSimple;
