import React, { useState, useEffect, useCallback } from "react";
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
  Save,
  CheckCircle2,
} from "lucide-react";
import { getCourseById } from "@/services/courseService";
import { getCourseVideos } from "@/services/courseVideoService";
import {
  checkEnrollment,
  updateCourseProgress,
  markCourseAsCompleted,
} from "@/services/enrollmentService";
import { useAuth } from "@/shared/hooks/useAuth";
import { toast } from "sonner";

const EnhancedCourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados para datos del curso
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para UI
  const [expandedModules, setExpandedModules] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [currentVideo, setCurrentVideo] = useState("");
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  // Cargar datos del curso
  const loadCourseData = useCallback(async () => {
    if (!courseId || !user) return;

    try {
      setLoading(true);
      setError(null);

      console.log("📚 Cargando contenido del curso:", courseId);

      // Cargar curso y videos en paralelo
      const [courseData, videosData] = await Promise.all([
        getCourseById(courseId),
        getCourseVideos(courseId),
      ]);

      setCourse(courseData);
      setVideos(videosData);

      // Verificar inscripción
      try {
        const enrollmentData = await checkEnrollment(courseId);
        setEnrollment(enrollmentData);
        console.log("✅ Inscripción verificada:", enrollmentData);
      } catch (enrollmentError) {
        console.warn("⚠️ No se pudo verificar inscripción:", enrollmentError.message);
        setEnrollment({ isEnrolled: false });
      }
    } catch (err) {
      console.error("❌ Error al cargar el curso:", err);
      setError(err.message || "No se pudo cargar el curso. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [courseId, user]);

  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

  // Verificar que el usuario esté inscrito
  useEffect(() => {
    if (!loading && course && enrollment && !enrollment.isEnrolled) {
      toast.error("No estás inscrito en este curso");
      navigate(`/curso/${courseId}`);
    }
  }, [loading, course, enrollment, navigate, courseId]);

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

  // Función mejorada para marcar video como completado y guardar progreso
  const handleVideoComplete = async (videoId) => {
    if (!enrollment?.isEnrolled || !enrollment?.enrollmentId) {
      toast.error("Debes estar inscrito en el curso para marcar videos como completados");
      return;
    }

    try {
      setSavingProgress(true);

      // Marcar video como completado localmente
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, completed: true } : v))
      );

      // Calcular nuevo progreso basado en videos completados
      const totalVideos = videos.length;
      const completedVideos = videos.filter((v) => v.completed).length + 1; // +1 por el video actual
      const newProgress = Math.round((completedVideos / totalVideos) * 100);

      console.log(`📊 Progreso actualizado: ${completedVideos}/${totalVideos} videos (${newProgress}%)`);

      // Actualizar progreso en la API
      await updateCourseProgress(enrollment.enrollmentId, newProgress);

      // Actualizar estado de inscripción local
      setEnrollment((prev) => ({
        ...prev,
        progressPercentage: newProgress,
        status: newProgress === 100 ? "COMPLETED" : "ACTIVE",
      }));

      // Si es el último video, marcar curso como completado
      if (newProgress === 100) {
        await markCourseAsCompleted(enrollment.enrollmentId);
        toast.success("¡Felicidades! Has completado el curso 🎉");
        
        // Opcional: mostrar certificado o redirigir
        setTimeout(() => {
          toast.info("¡Puedes descargar tu certificado desde tu perfil!");
        }, 2000);
      } else {
        toast.success(`Progreso guardado: ${newProgress}% completado`);
      }

    } catch (error) {
      console.error("❌ Error al guardar progreso:", error);
      toast.error("Error al guardar el progreso. Inténtalo de nuevo.");
      
      // Revertir cambios locales en caso de error
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, completed: false } : v))
      );
    } finally {
      setSavingProgress(false);
    }
  };

  // Función para guardar progreso manualmente
  const handleManualSaveProgress = async () => {
    if (!enrollment?.isEnrolled || !enrollment?.enrollmentId) {
      toast.error("No se puede guardar el progreso sin inscripción");
      return;
    }

    try {
      setUpdatingProgress(true);

      // Calcular progreso basado en videos completados
      const completedVideos = videos.filter((v) => v.completed).length;
      const totalVideos = videos.length;
      const progress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

      await updateCourseProgress(enrollment.enrollmentId, progress);
      
      setEnrollment((prev) => ({
        ...prev,
        progressPercentage: progress,
      }));

      toast.success(`Progreso guardado: ${progress}% completado`);
    } catch (error) {
      console.error("❌ Error al guardar progreso manual:", error);
      toast.error("Error al guardar el progreso");
    } finally {
      setUpdatingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando contenido del curso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error al cargar el curso</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate("/cursos")} variant="outline">
              Volver a cursos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Curso no encontrado</p>
        </div>
      </div>
    );
  }

  const completedVideos = videos.filter((v) => v.completed).length;
  const totalVideos = videos.length;
  const progressPercentage = enrollment?.progressPercentage || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del curso */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/curso/${courseId}`)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver al curso</span>
              </Button>
            </div>
            
            {/* Indicador de progreso */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Progreso del curso</p>
                <p className="text-lg font-semibold">{progressPercentage}%</p>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <Button
                onClick={handleManualSaveProgress}
                disabled={updatingProgress || savingProgress}
                size="sm"
                variant="outline"
                className="flex items-center space-x-2"
              >
                {updatingProgress ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>Guardar</span>
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="mt-2 text-gray-600">{course.description}</p>
            
            {/* Estadísticas del curso */}
            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>{totalVideos} videos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{course.estimatedHours || 0} horas estimadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{completedVideos} completados</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido del video */}
          <div className="lg:col-span-2">
            {activeVideo ? (
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <StudentVideoViewer
                      videoUrl={currentVideo}
                      title={activeVideo.title}
                      onVideoComplete={() => handleVideoComplete(activeVideo.id)}
                      savingProgress={savingProgress}
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold">{activeVideo.title}</h3>
                    <p className="text-gray-600 mt-2">{activeVideo.description}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Selecciona un video para comenzar</h3>
                  <p className="text-gray-600">
                    Elige un video de la lista para empezar a aprender
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Lista de módulos y videos */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Contenido del curso</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {course.modules?.map((module) => (
                    <div key={module.id}>
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {expandedModules.includes(module.id) ? (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                            <div>
                              <h4 className="font-medium text-gray-900">{module.title}</h4>
                              <p className="text-sm text-gray-500">{module.description}</p>
                            </div>
                          </div>
                        </div>
                      </button>
                      
                      {expandedModules.includes(module.id) && (
                        <div className="bg-gray-50">
                          {module.lessons?.map((lesson) => {
                            const isCompleted = lesson.completed || false;
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => handleVideoClick({
                                  id: lesson.id,
                                  title: lesson.title,
                                  videoUrl: lesson.youtubeUrl || lesson.content,
                                  description: lesson.description,
                                  completed: isCompleted,
                                })}
                                className={`w-full px-8 py-3 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors ${
                                  activeVideo?.id === lesson.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  {isCompleted ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Play className="h-4 w-4 text-gray-400" />
                                  )}
                                  <div className="flex-1">
                                    <h5 className="text-sm font-medium text-gray-900">{lesson.title}</h5>
                                    {lesson.durationSeconds && (
                                      <p className="text-xs text-gray-500">
                                        {Math.round(lesson.durationSeconds / 60)} min
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Botón de completar curso */}
            {progressPercentage >= 100 && (
              <Card className="mt-4">
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">¡Curso Completado!</h3>
                  <p className="text-gray-600 mb-4">
                    Has completado todos los videos de este curso
                  </p>
                  <Button
                    onClick={() => navigate("/estudiante/certificados")}
                    className="w-full"
                  >
                    Ver certificados
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCourseContent;
