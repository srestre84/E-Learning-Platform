import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { getCourses } from "@/services/courseService";
import { getCourseVideos } from "@/services/courseVideoService";
import VideoPreview from "@/shared/components/VideoPreview";
import CourseCardHover from "@/shared/components/CourseCardHover";

export default function CursoDisponible() {
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [courses, setCourses] = useState([]); // ✅ Estado para los cursos de la API
  const [loading, setLoading] = useState(true); // ✅ Estado de carga
  const [error, setError] = useState(null); // ✅ Estado de error
  const [previewVideo, setPreviewVideo] = useState(null);
  const [courseVideos, setCourseVideos] = useState({});

  //TODO: Cargar los curso desde la api
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Agregar timeout para evitar carga infinita
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Timeout: La solicitud tardó demasiado")),
            10000
          )
        );

        const dataPromise = getCourses();
        const data = await Promise.race([dataPromise, timeoutPromise]);

        console.log("Datos recibidos de la API:", data);

        // Forzar la conversión a array si tiene forma de array
        if (data && typeof data === "object" && data.length >= 0) {
          setCourses([...data]);
        } else {
          console.error("Formato de datos desconocido:", data);
          setCourses([]);
        }
      } catch (err) {
        console.error("Error al cargar los cursos:", err);
        if (err.message.includes("Timeout")) {
          setError(
            "El servidor tardó demasiado en responder. Por favor, recarga la página."
          );
        } else if (err.message.includes("500")) {
          setError("Error interno del servidor. Por favor, intenta más tarde.");
        } else {
          setError(
            "Error al cargar los cursos. Por favor, inténtalo de nuevo más tarde."
          );
        }
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);


  // Función para cargar videos de un curso específico
  const loadCourseVideos = async (courseId) => {
    if (courseVideos[courseId]) return courseVideos[courseId];
    
    try {
      const videos = await getCourseVideos(courseId);
      setCourseVideos(prev => ({ ...prev, [courseId]: videos }));
      return videos;
    } catch (error) {
      console.error('Error al cargar videos del curso:', error);
      // Si hay error, devolver array vacío para que se use la imagen por defecto
      return [];
    }
  };

  // Función para mostrar preview de video
  const handleVideoPreview = async (courseId) => {
    try {
      const videos = await loadCourseVideos(courseId);
      if (videos && videos.length > 0) {
        const firstVideo = videos[0];
        setPreviewVideo({
          videoUrl: firstVideo.youtubeUrl,
          thumbnailUrl: firstVideo.thumbnailUrl || `https://img.youtube.com/vi/${firstVideo.youtubeVideoId}/maxresdefault.jpg`,
          title: firstVideo.title,
          duration: firstVideo.durationSeconds
        });
      }
    } catch (error) {
      console.error('Error al cargar videos para preview:', error);
    }
  };

  // Función para cerrar preview
  const closeVideoPreview = () => {
    setPreviewVideo(null);
  };

  // ✅ Renderizado condicional basado en el estado
  if (loading) {
    return (
      <section id="Cursos" className="py-12 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xl text-gray-600">Cargando cursos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="Cursos" className="py-12 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg-md:px-8">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="Cursos" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cursos Disponibles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Haz clic en "Ver detalles" para expandir la información completa de
            cada curso
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <CourseCardHover
                key={course.id}
                course={course}
                onPreview={(course, videoThumbnail) => {
                  if (videoThumbnail) {
                    setPreviewVideo({
                      videoUrl: `https://www.youtube.com/watch?v=${videoThumbnail.videoId}`,
                      thumbnailUrl: videoThumbnail.url,
                      title: videoThumbnail.title,
                      duration: videoThumbnail.duration
                    });
                  } else {
                    handleVideoPreview(course.id);
                  }
                }}
                onEnroll={(course) => {
                  // Redirigir al detalle del curso para inscripción
                  window.location.href = `/curso/${course.id}`;
                }}
                className="h-full"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <BookOpen className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-xl text-gray-600 mb-2">No hay cursos disponibles</p>
              <p className="text-gray-500">Vuelve pronto para ver nuevos cursos</p>
            </div>
          )}
        </div>
      </div>

      {/* Video Preview Modal */}
      {previewVideo && (
        <VideoPreview
          videoUrl={previewVideo.videoUrl}
          thumbnailUrl={previewVideo.thumbnailUrl}
          title={previewVideo.title}
          duration={previewVideo.duration}
          isVisible={!!previewVideo}
          onClose={closeVideoPreview}
        />
      )}
    </section>
  );
}
