import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Badge } from "@/ui/badge";
import { Skeleton } from "@/ui/skeleton";
import {
  Search,
  BookOpen,
  Star,
  Clock,
  Users,
  Play,
  ShoppingCart,
  Filter,
  Grid,
  List,
  ChevronDown,
  GraduationCap,
  DollarSign,
  Calendar,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getCourses, getCoursesWithEnrollmentInfo } from "@/services/courseService";
import { enrollInCourse } from "@/services/enrollmentService";
import { createStripeCheckoutSession } from "@/services/paymentService";
import { generateCoursePlaceholder } from "@/utils/imageUtils";
import { toast } from "react-toastify";
import CourseFilters from "@/shared/components/CourseFilters";
import CourseBadges from "@/shared/components/CourseBadges";
import { 
  FILTER_OPTIONS, 
  FILTER_LABELS,
  isCourseFree,
  getCoursePriceRange
} from "@/shared/constants/courseConstants";

export default function CourseCatalogPage() {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [enrollingCourse, setEnrollingCourse] = useState(null);
  const [purchasingCourse, setPurchasingCourse] = useState(null);
  
  // Nuevos filtros
  const [statusFilter, setStatusFilter] = useState(FILTER_OPTIONS.STATUS.ALL);
  const [typeFilter, setTypeFilter] = useState(FILTER_OPTIONS.TYPE.ALL);
  const [levelFilter, setLevelFilter] = useState(FILTER_OPTIONS.LEVEL.ALL);
  const [priceFilter, setPriceFilter] = useState(FILTER_OPTIONS.PRICE.ALL);

  // Cargar cursos al montar el componente y cuando cambie la autenticación
  useEffect(() => {
    loadCourses();
  }, [isAuthenticated, user?.id]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Cargando catálogo de cursos...");
      
      let coursesData;
      if (isAuthenticated && user?.id) {
        // Si el usuario está autenticado, obtener cursos con información de inscripción
        coursesData = await getCoursesWithEnrollmentInfo(user.id);
      } else {
        // Si no está autenticado, obtener solo los cursos
        coursesData = await getCourses();
      }
      
      console.log("📚 Cursos cargados:", coursesData);
      setCourses(coursesData || []);
    } catch (err) {
      console.error("❌ Error al cargar cursos:", err);
      setError("Error al cargar los cursos. Intenta más tarde.");
      toast.error("Error al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar cursos
  const filteredCourses = courses.filter((course) => {
    // Filtro de búsqueda
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor?.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de categoría
    const matchesCategory = selectedCategory === "all" || 
                           course.category?.name?.toLowerCase() === selectedCategory.toLowerCase();
    
    // Filtro de estado
    const matchesStatus = statusFilter === FILTER_OPTIONS.STATUS.ALL || 
                         course.status === statusFilter ||
                         (statusFilter === FILTER_OPTIONS.STATUS.PUBLISHED && course.isPublished) ||
                         (statusFilter === FILTER_OPTIONS.STATUS.DRAFT && !course.isPublished);
    
    // Filtro de tipo
    const matchesType = typeFilter === FILTER_OPTIONS.TYPE.ALL || 
                       course.courseType === typeFilter ||
                       (typeFilter === FILTER_OPTIONS.TYPE.FREE && isCourseFree(course)) ||
                       (typeFilter === FILTER_OPTIONS.TYPE.PREMIUM && !isCourseFree(course));
    
    // Filtro de nivel
    const matchesLevel = levelFilter === FILTER_OPTIONS.LEVEL.ALL || 
                        course.level?.toUpperCase() === levelFilter;
    
    // Filtro de precio
    const matchesPrice = priceFilter === FILTER_OPTIONS.PRICE.ALL ||
                        (priceFilter === FILTER_OPTIONS.PRICE.FREE && isCourseFree(course)) ||
                        (priceFilter === FILTER_OPTIONS.PRICE.PAID && !isCourseFree(course)) ||
                        (priceFilter === getCoursePriceRange(course.price));
    
    return matchesSearch && matchesCategory && matchesStatus && matchesType && matchesLevel && matchesPrice;
  });

  // Ordenar cursos
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "oldest":
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  // Obtener categorías únicas
  const categories = ["all", ...new Set(courses.map(course => course.category?.name).filter(Boolean))];

  // Manejar inscripción gratuita
  const handleEnroll = async (course) => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para inscribirte");
      return;
    }

    try {
      setEnrollingCourse(course.id);
      console.log("📝 Inscribiendo en curso:", course.title);
      
      await enrollInCourse(course.id);
      
      toast.success(`Te has inscrito en ${course.title}`);
      
      // Recargar cursos para actualizar el estado
      await loadCourses();
    } catch (err) {
      console.error("❌ Error al inscribirse:", err);
      toast.error("Error al inscribirse en el curso");
    } finally {
      setEnrollingCourse(null);
    }
  };

  // Manejar compra de curso
  const handlePurchase = async (course) => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para comprar");
      return;
    }

    try {
      setPurchasingCourse(course.id);
      console.log("💳 Iniciando compra de curso:", course.title);
      
      const checkoutUrl = await createStripeCheckoutSession(course.id);
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error("Error al procesar el pago");
      }
    } catch (err) {
      console.error("❌ Error al comprar curso:", err);
      toast.error("Error al procesar la compra");
    } finally {
      setPurchasingCourse(null);
    }
  };

  // Formatear precio
  const formatPrice = (price) => {
    if (!price || price === 0) return "Gratis";
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Formatear duración
  const formatDuration = (hours) => {
    if (!hours) return "Duración no especificada";
    if (hours < 1) return "Menos de 1 hora";
    if (hours === 1) return "1 hora";
    return `${hours} horas`;
  };

  // Componente de tarjeta de curso
  const CourseCard = ({ course }) => {
    const isFree = !course.price || course.price === 0;
    const isEnrolled = course.isEnrolled || course.enrollmentInfo?.isEnrolled || false;
    const enrollmentInfo = course.enrollmentInfo || {};
    const isProcessing = enrollingCourse === course.id || purchasingCourse === course.id;

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Imagen del curso */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
          {course.imageUrl ? (
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = generateCoursePlaceholder(course.title);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <CourseBadges 
              course={course}
              showStatus={true}
              showType={true}
              showLevel={false}
              showPrice={false}
              className="flex-col"
            />
            {isEnrolled && (
              <Badge className="bg-blue-500 text-white">Inscrito</Badge>
            )}
          </div>
          
          {/* Botón de vista previa */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => window.open(`/curso/${course.id}`, '_blank')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Vista previa
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Título y instructor */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600">
              Por {course.instructor?.userName || "Instructor"}
            </p>
          </div>

          {/* Descripción */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {course.description}
          </p>

          {/* Estadísticas */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(course.estimatedHours)}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.enrollmentCount || 0} estudiantes
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {course.rating || 0}
            </div>
          </div>

          {/* Precio y botón de acción */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(course.price)}
            </div>
            
            <div className="flex gap-2">
              {isEnrolled ? (
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    asChild
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Link to={`/curso/${course.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      {enrollmentInfo.progress > 0 ? 'Continuar' : 'Empezar'}
                    </Link>
                  </Button>
                  {enrollmentInfo.progress > 0 && (
                    <div className="text-xs text-gray-600 text-center">
                      Progreso: {enrollmentInfo.progress}%
                    </div>
                  )}
                </div>
              ) : isFree ? (
                <Button
                  onClick={() => handleEnroll(course)}
                  disabled={isProcessing}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {isProcessing ? "Inscribiendo..." : "Inscribirse gratis"}
                </Button>
              ) : (
                <Button
                  onClick={() => handlePurchase(course)}
                  disabled={isProcessing}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isProcessing ? "Procesando..." : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Comprar
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ {error}</div>
          <Button onClick={loadCourses} variant="outline">
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Catálogo de Cursos
        </h1>
        <p className="text-gray-600">
          Explora todos los cursos disponibles y encuentra el perfecto para ti
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="mb-8">
        <CourseFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          levelFilter={levelFilter}
          onLevelFilterChange={setLevelFilter}
          priceFilter={priceFilter}
          onPriceFilterChange={setPriceFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showAdvanced={true}
        />
        
        {/* Filtro de categoría adicional */}
        <div className="mt-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">Todas las categorías</option>
            {categories.slice(1).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Vista */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Resultados */}
      <div className="mb-4">
        <p className="text-gray-600">
          {sortedCourses.length} curso{sortedCourses.length !== 1 ? 's' : ''} encontrado{sortedCourses.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Lista de cursos */}
      {sortedCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No se encontraron cursos
          </h3>
          <p className="text-gray-600 mb-4">
            Intenta ajustar tus filtros de búsqueda
          </p>
          <Button onClick={() => {
            setSearchTerm("");
            setSelectedCategory("all");
          }}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        }`}>
          {sortedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
