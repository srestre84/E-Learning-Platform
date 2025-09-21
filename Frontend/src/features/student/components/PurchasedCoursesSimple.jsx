import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Button } from "@/ui/Button";
import { Progress } from "@/ui/progress";
import { Badge } from "@/ui/badge";
import { useAuth } from "@/contexts/useAuth";
import { toast } from "sonner";
import {
  BookOpen,
  Clock,
  Award,
  PlayCircle,
  Loader2,
  AlertCircle,
  User,
  Calendar,
  Eye,
} from "lucide-react";
import { getActiveEnrollments } from "@/services/enrollmentService";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function PurchasedCoursesSimple() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados principales
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentPath = location.pathname;

  // Cargar cursos
  useEffect(() => {
    const loadCourses = async () => {
      try {
        console.log("📚 Cargando cursos...");
        setLoading(true);
        setError("");

        const enrollments = await getActiveEnrollments();
        console.log(`📚 Encontradas ${enrollments?.length || 0} inscripciones`);

        if (!enrollments || enrollments.length === 0) {
          setCourses([]);
          return;
        }

        // Los datos del curso ya vienen incluidos en las inscripciones
        const coursesWithData = enrollments.map(enrollment => ({
          ...enrollment,
          enrollmentDate: enrollment.enrollmentDate
            ? new Date(enrollment.enrollmentDate)
            : new Date(),
          lastAccessed: enrollment.lastAccessed
            ? new Date(enrollment.lastAccessed)
            : null,
          completedAt: enrollment.completedAt
            ? new Date(enrollment.completedAt)
            : null,
        }));

        console.log(`✅ Cargados ${coursesWithData.length} cursos`);
        setCourses(coursesWithData);
      } catch (error) {
        console.error("❌ Error al cargar cursos:", error);
        setError("Error al cargar los cursos. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []); // Solo ejecutar una vez

  const handleContinueCourse = (courseId) => {
    try {
      console.log("▶️ Continuando curso:", courseId);
      navigate(`/curso/${courseId}/content`);
    } catch (err) {
      console.error("❌ Error al continuar curso:", err);
      toast.error("Error al continuar el curso");
    }
  };

  // Estadísticas
  const stats = {
    total: courses.length,
    active: courses.filter((c) => c.status === "ACTIVE").length,
    completed: courses.filter((c) => c.status === "COMPLETED").length,
    avgProgress: courses.length > 0
      ? Math.round(
          courses.reduce((sum, c) => sum + (c.progressPercentage || 0), 0) /
            courses.length
        )
      : 0,
  };

  // Componente de tarjeta de curso
  const CourseCard = ({ course, index }) => {
    const progressPercentage = course.progressPercentage || 0;
    const status = course.status || "ACTIVE";

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
        {/* Imagen del curso */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={
              course.courseThumbnailUrl ||
              `https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=${encodeURIComponent(course.courseTitle || 'Curso')}`
            }
            alt={course.courseTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Status badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Badge
              className={`${
                status === "COMPLETED" ? "bg-green-500" : "bg-blue-500"
              } text-white px-3 py-1 text-xs font-semibold shadow-lg`}>
              {status === "COMPLETED" ? "Completado" : "En Progreso"}
            </Badge>

            {progressPercentage > 0 && (
              <Badge className="bg-red-500 text-white px-3 py-1 text-xs font-semibold shadow-lg">
                {progressPercentage}%
              </Badge>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Título y descripción */}
          <div className="flex-1 mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 break-words">
              {course.courseTitle}
            </h3>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2 break-words">
              {course.courseDescription || "Sin descripción disponible"}
            </p>

            {/* Instructor */}
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <User className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="break-words">
                {course.instructorName} {course.instructorLastName}
              </span>
            </div>
          </div>

          {/* Progreso */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progreso
              </span>
              <span className="text-sm font-bold text-gray-900">
                {progressPercentage}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Metadatos */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>
                {course.enrollmentDate
                  ? formatDistanceToNow(course.enrollmentDate, {
                      addSuffix: true,
                      locale: es,
                    })
                  : "Fecha no disponible"}
              </span>
            </div>

            {course.lastAccessed && (
              <div className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                <span>
                  {formatDistanceToNow(course.lastAccessed, {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Botón de acción */}
          <Button
            onClick={() => handleContinueCourse(course.courseId)}
            className={`flex-1 ${
              status === "COMPLETED"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            } text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105`}>
            {status === "COMPLETED" ? (
              <>
                <Award className="w-4 h-4 mr-2" />
                Ver de Nuevo
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4 mr-2" />
                {progressPercentage === 0 ? "Comenzar" : "Continuar"}
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  // Estados de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar cursos
          </h3>
          <p className="text-gray-600 mb-6 break-words">{error}</p>
          <div className="flex gap-3">
            <Button
              onClick={() => window.location.reload()}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white">
              Reintentar
            </Button>
            <Button
              onClick={() => navigate("/cursos")}
              variant="outline"
              className="flex-1">
              <BookOpen className="w-4 h-4 mr-2" />
              Explorar Cursos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Estado sin cursos
  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg w-full text-center border border-gray-100">
          <BookOpen className="w-20 h-20 mx-auto mb-6 text-gray-300" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4 break-words">
            No tienes cursos inscritos
          </h3>
          <p className="text-lg text-gray-600 mb-8 break-words">
            Explora nuestros cursos disponibles y comienza tu viaje de aprendizaje.
          </p>
          <Link
            to="/cursos"
            className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <BookOpen className="w-5 h-5 mr-2" />
            Explorar Cursos
          </Link>
        </div>
      </div>
    );
  }

  // Render principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 break-words">
                Mis Cursos
              </h1>
              <p className="text-gray-600 text-base md:text-lg break-words">
                Gestiona todos tus cursos inscritos
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Activos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.active}
                </p>
              </div>
              <PlayCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completados</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Progreso</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.avgProgress}%
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Lista de cursos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {courses.map((course, index) => (
            <CourseCard
              key={`${course.id}-${index}`}
              course={course}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
