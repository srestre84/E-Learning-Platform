import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Button } from "@/ui/Button";
import { Progress } from "@/ui/progress";
import { Badge } from "@/ui/badge";
import { useAuth } from "@/contexts/useAuth";
import { useCourseProgress } from "@/shared/hooks/useCourseProgress";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  BookOpen,
  Clock,
  Award,
  Star,
  AlertCircle,
  PlayCircle,
  X,
  CheckCircle,
  User,
  Calendar,
  TrendingUp,
  Target,
} from "lucide-react";
import {
  getActiveEnrollments,
  getCompletedEnrollments,
  getEnrolledCourses,
  unenrollFromCourse,
 // updateCourseProgress,
 // markCourseAsCompleted,
} from "@/services/enrollmentService";
import { generateCoursePlaceholder } from "@/utils/imageUtils";
import { getCourseById } from "@/services/courseService";

export default function PurchasedCourses() {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { courseProgress } = useCourseProgress(user?.id);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loadingCourses, setLoadingCourses] = useState(new Set());

  const currentPath = location.pathname;

  // Función para obtener los datos completos del curso
  const fetchCourseData = async (courseId) => {
    try {
      console.log("🔍 Obteniendo datos del curso:", courseId);
      const courseData = await getCourseById(courseId);
      console.log("✅ Datos del curso obtenidos:", courseData);
      return courseData;
    } catch (error) {
      console.error("❌ Error al obtener datos del curso:", error);
      return null;
    }
  };

  // Función para enriquecer los datos de los cursos
  const enrichCourseData = async (enrollments) => {
    const enrichedCourses = [];

    for (const enrollment of enrollments) {
      let courseData = enrollment.course;

      // Si no hay datos del curso, obtenerlos
      if (!courseData || !courseData.title) {
        console.log(" Enriqueciendo datos del curso:", enrollment.id);
        setLoadingCourses((prev) => new Set([...prev, enrollment.id]));

        const fetchedCourseData = await fetchCourseData(enrollment.id);
        if (fetchedCourseData) {
          courseData = fetchedCourseData;
        }

        setLoadingCourses((prev) => {
          const newSet = new Set(prev);
          newSet.delete(enrollment.id);
          return newSet;
        });
      }

      enrichedCourses.push({
        ...enrollment,
        course: courseData,
      });
    }

    return enrichedCourses;
  };

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");
        let data = [];
        console.log("Cargando cursos para la ruta:", currentPath);

        // Llama a la API correcta según la URL
        if (currentPath.includes("en-progreso")) {
          console.log("LLamando a getActiveEnrollments");
          data = await getActiveEnrollments();
        } else if (currentPath.includes("completados")) {
          console.log("LLamando a getCompletedEnrollments");
          data = await getCompletedEnrollments();
        } else if (currentPath.includes("todos")) {
          console.log("Combinando todos los cursos para /mis-cursos/todos");
          try {
            const [activeCourses, completedCourses] = await Promise.all([
              getActiveEnrollments(),
              getCompletedEnrollments(),
            ]);
            data = [...activeCourses, ...completedCourses];
            console.log("Cursos activos:", activeCourses);
            console.log("Cursos completados:", completedCourses);
            console.log("Todos los cursos combinados:", data);
          } catch (error) {
            console.error("Error al combinar cursos:", error);
            data = await getEnrolledCourses(); // Fallback
          }
        } else {
          // Para la ruta /mis-cursos (sin especificar), también combinar todos
          console.log("Combinando todos los cursos para /mis-cursos");
          try {
            const [activeCourses, completedCourses] = await Promise.all([
              getActiveEnrollments(),
              getCompletedEnrollments(),
            ]);
            data = [...activeCourses, ...completedCourses];
            console.log("Cursos activos:", activeCourses);
            console.log("Cursos completados:", completedCourses);
            console.log("Todos los cursos combinados:", data);
          } catch (error) {
            console.error("Error al combinar cursos:", error);
            data = await getEnrolledCourses(); // Fallback
          }
        }

        console.log("Datos recibidos de la API:", data);
        console.log("Cantidad de cursos recibidos:", data.length || 0);
        console.log("Estructura del primer curso:", data[0]);

        // Enriquecer los datos de los cursos
        const enrichedData = await enrichCourseData(data);
        console.log("Datos enriquecidos:", enrichedData);

        setCourses(enrichedData);
      } catch (e) {
        setError("No se pudieron cargar tus cursos.");
        console.error("Error al cargar tus cursos:", e);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [currentPath]);

  // Función para desinscribirse de un curso
  const handleUnenrollCourse = async (enrollmentId, courseTitle) => {
    try {
      const confirmed = window.confirm(
        `¿Estás seguro de que quieres desinscribirte del curso "${courseTitle}"?`
      );

      if (!confirmed) return;

      await unenrollFromCourse(enrollmentId);

      // Actualizar la lista local
      setCourses((prev) => prev.filter((course) => course.id !== enrollmentId));

      toast.success("Te has desinscrito exitosamente del curso");
    } catch (err) {
      console.error("Error al desinscribirse del curso:", err);
      toast.error(err.message || "Error al desinscribirse del curso");
    }
  };

  // Función para continuar un curso
  const handleContinueCourse = async (courseId) => {
    try {
      console.log("Continuando curso:", courseId);
      toast.info("Redirigiendo al curso...");
      navigate(`/curso/${courseId}/content`);
    } catch (err) {
      console.error("Error al continuar curso:", err);
      toast.error("Error al continuar el curso");
    }
  };

  //Filtar cursos
  const filteredCourses = courses.filter((course) => {
    const courseData = course.course || course;

    // Si no hay término de búsqueda, mostrar todos los cursos
    const matchesSearch =
      searchTerm === "" ||
      courseData.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseData.instructor?.userName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Aplicar filtros de estado
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "active")
      return matchesSearch && course.status === "ACTIVE";
    if (filterStatus === "completed")
      return matchesSearch && course.status === "COMPLETED";
    if (filterStatus === "not-started")
      return matchesSearch && (course.progressPercentage || 0) === 0;

    return matchesSearch;
  });

  console.log("Cursos después del filtrado:", filteredCourses);
  console.log("Cantidad de cursos filtrados:", filteredCourses.length);
  console.log("Filtro actual:", filterStatus);
  console.log("Término de búsqueda:", searchTerm);

  // Estadísticas
  const stats = {
    total: courses.length,
    active: courses.filter((c) => c.status === "ACTIVE").length,
    completed: courses.filter((c) => c.status === "COMPLETED").length,
    notStarted: courses.filter((c) => (c.progressPercentage || 0) === 0).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-2 bg-gray-100 rounded w-full mb-2"></div>
                  <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar cursos
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg w-full text-center border border-gray-100">
          <BookOpen className="w-20 h-20 mx-auto mb-6 text-gray-300" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {currentPath.includes("en-progreso") &&
              "Lo sentimos, por el momento no tienes cursos en progreso"}
            {currentPath.includes("completados") &&
              "No tienes cursos completados aún"}
            {currentPath.includes("todos") && "No tienes cursos inscritos"}
            {!currentPath.includes("en-progreso") &&
              !currentPath.includes("completados") &&
              !currentPath.includes("todos") &&
              "Lo sentimos, por el momento no tienes cursos activos"}
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            {currentPath.includes("en-progreso") &&
              "Inscríbete en algunos cursos y comienza tu aprendizaje para verlos aquí."}
            {currentPath.includes("completados") &&
              "Completa algunos cursos para verlos aquí y revisar tus logros."}
            {currentPath.includes("todos") &&
              "Explora nuestros cursos disponibles y comienza tu viaje de aprendizaje."}
            {!currentPath.includes("en-progreso") &&
              !currentPath.includes("completados") &&
              !currentPath.includes("todos") &&
              "Puedes explorar nuestros cursos disponibles y comienza tu viaje de aprendizaje."}
          </p>
          <Link
            to="/cursos"
            className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <BookOpen className="w-5 h-5 mr-2" />
            {currentPath.includes("en-progreso") && "Explorar Cursos"}
            {currentPath.includes("completados") && "Explorar Cursos"}
            {currentPath.includes("todos") && "Explorar Cursos"}
            {!currentPath.includes("en-progreso") &&
              !currentPath.includes("completados") &&
              !currentPath.includes("todos") &&
              "Explorar Cursos disponibles"}
          </Link>
        </div>
      </div>
    );
  }

  // Al inicio del componente, después de cargar los datos
  console.log("🔍 Datos de cursos cargados:", courses);
  console.log("�� Cantidad de cursos:", courses.length);
  console.log("🔍 Primer curso:", courses[0]);
  console.log(
    "🔍 Estructura del primer curso:",
    courses[0] ? Object.keys(courses[0]) : "No hay cursos"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header mejorado */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {currentPath.includes("en-progreso") && "Cursos en Progreso"}
            {currentPath.includes("completados") && "Cursos Completados"}
            {currentPath.includes("todos") && "Todos los Cursos"}
            {!currentPath.includes("en-progreso") &&
              !currentPath.includes("completados") &&
              ""}
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            {currentPath.includes("en-progreso") &&
              "Continúa tu aprendizaje donde lo dejaste"}
            {currentPath.includes("completados") &&
              "Revisa tus logros y conocimientos adquiridos"}
            {!currentPath.includes("en-progreso") &&
              !currentPath.includes("completados") &&
              "Gestiona todos tus cursos inscritos"}
          </p>
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
                <p className="text-sm text-gray-600 mb-1">Sin empezar</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.notStarted}
                </p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-2xl p-4 md:p-6 mb-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300">
                <option value="all">Todos</option>
                <option value="active">En Progreso</option>
                <option value="completed">Completados</option>
                <option value="not-started">Sin Empezar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de cursos responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredCourses.map((course) => {
            console.log("Renderizando curso - datos completos:", course);

            // Los datos del curso pueden estar en course.course o directamente en course
            const courseData = course.course || course;
            const progressPercentage =
              course.progressPercentage || course.progress || 0;
            const status = course.status || "ACTIVE";
            const enrollmentId = course.id;
            const courseId = courseData?.id || course.id;
            const isLoading = loadingCourses.has(enrollmentId);

            console.log("Renderizando curso:", {
              enrollmentId,
              courseId,
              title: courseData?.title,
              status,
              progressPercentage,
              courseData,
              courseOriginal: course,
              isLoading,
            });

            if (isLoading) {
              return (
                <Card
                  key={enrollmentId}
                  className="group hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl border border-gray-100 overflow-hidden transform hover:-translate-y-1">
                  <div className="relative h-40 md:h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-500">Cargando curso...</div>
                  </div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
                  </div>
                </Card>
              );
            }

            // Si no hay datos del curso después de cargar, mostrar error
            if (!courseData || !courseData.title) {
              return (
                <Card
                  key={enrollmentId}
                  className="group hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl border border-gray-100 overflow-hidden transform hover:-translate-y-1">
                  <div className="relative h-40 md:h-48 overflow-hidden bg-red-100 flex items-center justify-center">
                    <div className="text-red-500 text-center">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Error al cargar curso</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Curso no disponible
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      No se pudieron cargar los datos del curso
                    </p>
                  </div>
                </Card>
              );
            }

            return (
              <Card
                key={enrollmentId}
                className="group hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl border border-gray-100 overflow-hidden transform hover:-translate-y-1">
                {/* Imagen del curso */}
                <div className="relative h-40 md:h-48 overflow-hidden">
                  <img
                    src={
                      courseData.thumbnailUrl ||
                      courseData.image ||
                      generateCoursePlaceholder(courseData.title || "Curso")
                    }
                    alt={courseData.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay con gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Badges mejorados */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Badge className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {progressPercentage}%
                    </Badge>
                    <Badge
                      className={`${
                        status === "COMPLETED"
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 text-white"
                      } px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}>
                      {status === "COMPLETED" ? "Completado" : "En Progreso"}
                    </Badge>
                  </div>
                </div>

                {/* Contenido del curso */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {courseData.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {courseData.shortDescription ||
                      courseData.description ||
                      "Sin descripción"}
                  </p>

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
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    {status === "COMPLETED" ? (
                      <Button
                        onClick={() => handleContinueCourse(courseId)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                        <Award className="w-4 h-4 mr-2" />
                        Ver de Nuevo
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleContinueCourse(courseId)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Continuar
                        </Button>
                        <Button
                          onClick={() =>
                            handleUnenrollCourse(enrollmentId, courseData.title)
                          }
                          variant="outline"
                          className="px-3 border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-all duration-300">
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Mensaje si no hay resultados de búsqueda */}
        {filteredCourses.length === 0 && courses.length > 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron cursos
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta con otros términos de búsqueda o cambia el filtro.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
              }}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
