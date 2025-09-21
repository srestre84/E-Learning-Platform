import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Play,
  Clock,
  Award,
  BookOpen,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { getCourseById } from "@/services/courseService";
import { getCourseVideos } from "@/services/courseVideoService";
import {
  checkEnrollment,
  updateCourseProgress,
  markCourseAsCompleted,
} from "@/services/enrollmentService";
import CourseModules from "@/shared/components/CourseModules";
import VideoPlayer from "@/shared/components/VideoPlayer";
import StudentVideoViewer from "@/features/student/components/StudentVideoViewer";
// import { useAuth } from "@/shared/hooks/useAuth"; // No se usa actualmente
import { toast } from "sonner";

const RETRY_INTERVAL = 2000; // ms
const MAX_RETRIES = 10;

const CourseContent = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  // const { user } = useAuth(); // No se usa actualmente

  console.log("🎯 CourseContent - courseId recibido:", courseId);

  // Estados para datos del curso
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [retryingEnrollment, setRetryingEnrollment] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para UI
  const [isClient, setIsClient] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [expandedModules, setExpandedModules] = useState([1]);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  const loadCourseData = useCallback(async () => {
    console.log("🔄 CourseContent - Iniciando carga de datos para courseId:", courseId);
    setLoading(true);
    setError(null);
    
    try {
      // Cargar curso
      console.log("📚 Cargando curso...");
      const courseResponse = await getCourseById(courseId);
      console.log("✅ Curso cargado:", courseResponse);
      setCourse(courseResponse);

      // Cargar videos
      console.log("🎬 Cargando videos...");
      const videosResponse = await getCourseVideos(courseId);
      console.log("✅ Videos cargados:", videosResponse);
      setVideos(videosResponse || []);

      // Verificar inscripción
      console.log("📋 Verificando inscripción...");
      const enrollmentResponse = await checkEnrollment(courseId);
      console.log("✅ Inscripción verificada:", enrollmentResponse);
      setEnrollment(enrollmentResponse);

    } catch (err) {
      console.error("❌ Error al cargar datos del curso:", err);
      setError(err.message || "Error al cargar el curso");
    } finally {
      console.log("🏁 Finalizando carga de datos - setLoading(false)");
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    console.log("🚀 useEffect ejecutado - courseId:", courseId);
    setIsClient(true);
    if (courseId) {
      loadCourseData();
      
      // Timeout de seguridad - si después de 10 segundos sigue cargando, mostrar error
      const safetyTimeout = setTimeout(() => {
        console.warn("⚠️ Timeout de seguridad activado - forzando setLoading(false)");
        setLoading(false);
        setError("Tiempo de espera agotado. Por favor, recarga la página.");
      }, 10000);
      
      return () => clearTimeout(safetyTimeout);
    }
  }, [courseId, loadCourseData]);

  // Comentado temporalmente para evitar bucles infinitos
  // useEffect(() => {
  //   if (
  //     course &&
  //     enrollment &&
  //     !enrollment.isEnrolled &&
  //     retryCount < MAX_RETRIES &&
  //     !retryingEnrollment
  //   ) {
  //     console.log(`🔄 Reintentando verificación de inscripción (${retryCount + 1}/${MAX_RETRIES})`);
  //     setRetryingEnrollment(true);
  //     retryTimeoutRef.current = setTimeout(() => {
  //       setRetryCount((prev) => prev + 1);
  //       loadCourseData(true);
  //     }, RETRY_INTERVAL);
  //   }
  //   if (enrollment && enrollment.isEnrolled) {
  //     setRetryingEnrollment(false);
  //     setRetryCount(0);
  //   }
  // }, [course, enrollment, retryCount, retryingEnrollment]);



  const toggleModule = (moduleId) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleVideoClick = (video) => {
    setActiveVideo(video);
    setCurrentVideo(video.videoUrl);
  };

  const handleVideoComplete = async (videoId) => {
    if (!enrollment?.isEnrolled || !enrollment?.enrollmentId) {
      toast.error(
        "Debes estar inscrito en el curso para marcar videos como completados"
      );
      return;
    }

    try {
      setUpdatingProgress(true);

      // Calcular nuevo progreso basado en videos completados
      const totalVideos = videos.length;
      const completedVideos = videos.filter((v) => v.completed).length + 1; // +1 por el video actual
      const newProgress = Math.round((completedVideos / totalVideos) * 100);

      // Actualizar progreso en la API
      await updateCourseProgress(enrollment.enrollmentId, newProgress);

      // Actualizar estado local
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, completed: true } : v))
      );

      // Si es el último video, marcar curso como completado
      if (newProgress >= 100) {
        await markCourseAsCompleted(enrollment.enrollmentId);
        toast.success("¡Felicidades! Has completado el curso");
      } else {
        toast.success(`Progreso actualizado: ${newProgress}%`);
      }
    } catch (err) {
      console.error("Error al actualizar progreso:", err);
      toast.error("Error al actualizar el progreso");
    } finally {
      setUpdatingProgress(false);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const isYoutubeUrl = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYoutubeEmbedUrl = (url) => {
    const videoId = url.includes("youtu.be")
      ? url.split("youtu.be/")[1]?.split("?")[0]
      : url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  console.log("🎭 CourseContent - Estado actual:", { loading, error, course: !!course, videos: videos.length, enrollment: !!enrollment });

  if (loading) {
    console.log("⏳ Mostrando pantalla de carga...");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Cargando contenido del curso...</p>
            <p className="text-sm text-gray-500 mt-2">CourseId: {courseId}</p>
            <button
              onClick={() => {
                console.log("🔄 Recarga manual iniciada");
                setLoading(false);
                setError("Recarga manual - intentando nuevamente...");
                setTimeout(() => {
                  setError(null);
                  loadCourseData();
                }, 1000);
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Recargar
            </button>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar el curso
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <Button onClick={() => loadCourseData()} variant="outline">
              Reintentar
            </Button>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Curso no encontrado
          </h2>
          <p className="text-gray-600 mb-4">
            El curso que buscas no existe o no está disponible.
          </p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  // Verificar si el usuario está inscrito
  if (!enrollment?.isEnrolled) {
    // Si estamos reintentando, mostrar mensaje de espera
    if (retryingEnrollment && retryCount < MAX_RETRIES) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Procesando acceso al curso...
            </h2>
            <p className="text-gray-600 mb-4">
              Estamos confirmando tu inscripción. Esto puede tardar unos segundos tras el pago exitoso.
            </p>
            <p className="text-gray-400 text-sm">Intento {retryCount + 1} de {MAX_RETRIES}</p>
          </div>
        </div>
      );
    }
    // Si ya se agotaron los reintentos, mostrar acceso restringido
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 mb-4">
            Debes estar inscrito en este curso para acceder al contenido.
          </p>
          <div className="space-x-4">
            <Button onClick={() => navigate(`/curso/${courseId}`)}>
              Ver Detalles del Curso
            </Button>
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calcular progreso del curso
  const completedVideos = videos.filter((v) => v.completed).length;
  const totalVideos = videos.length;
  const progressPercentage =
    totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contenido del Curso</CardTitle>
              <p className="text-sm text-gray-600">
                {totalVideos} videos • {completedVideos} completados
              </p>
            </CardHeader>
            <CardContent>
              <CourseModules 
                courseId={courseId} 
                isEnrolled={enrollment?.isEnrolled}
                onVideoClick={handleVideoClick}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                <p className="text-gray-600">
                  Instructor: {course.instructor?.userName}{" "}
                  {course.instructor?.lastName}
                </p>
              </div>
              <Button
                onClick={() => navigate(`/curso/${courseId}`)}
                variant="outline"
                size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ver Detalles
              </Button>
            </div>

            {/* Barra de Progreso */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progreso del Curso
                </span>
                <span className="text-sm text-gray-600">
                  {progressPercentage}% completado
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>
                  {completedVideos} de {totalVideos} videos completados
                </span>
                {progressPercentage === 100 && (
                  <span className="flex items-center text-green-600">
                    <Award className="h-3 w-3 mr-1" />
                    ¡Curso Completado!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Video Player */}
          <StudentVideoViewer
            courseId={courseId}
            courseTitle={course?.title || "Curso"}
            enrollmentData={enrollment}
            onProgressUpdate={(newProgress) => {
              // Actualizar progreso local si es necesario
              console.log("Progress updated:", newProgress);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
