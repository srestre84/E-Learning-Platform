import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
  StarIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { getCourseById, deleteCourse } from "@/services/courseService";
import { getStudentsByCourseId } from "@/services/courseService";
import { getCourseVideos } from "@/services/courseVideoService";
import { getCourseLevelInfo } from "@/shared/constants/courseConstants";
import { generateCoursePlaceholder } from "@/utils/imageUtils";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import TeacherVideoViewer from "./TeacherVideoViewer";
import { toast } from "react-toastify";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [expandedLessons, setExpandedLessons] = useState(new Set());
  const [courseVideos, setCourseVideos] = useState([]);
  const [organizedModules, setOrganizedModules] = useState([]);

  // Manejar parámetro de URL para abrir pestaña específica
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'content', 'videos', 'students', 'analytics'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Escuchar eventos de actualización del curso
  useEffect(() => {
    const handleCourseUpdate = (event) => {
      if (event.detail.courseId === parseInt(id)) {
        console.log("🔄 Curso actualizado, recargando datos...");
        fetchCourseData();
        setRefreshTrigger(prev => prev + 1);
      }
    };

    window.addEventListener('courseUpdated', handleCourseUpdate);
    return () => {
      window.removeEventListener('courseUpdated', handleCourseUpdate);
    };
  }, [id]);

  // Función para cargar datos del curso
  const fetchCourseData = useCallback(async () => {
    // Validar que el ID sea un número válido
    if (!id || id === 'unknown' || isNaN(parseInt(id))) {
      console.error("❌ ID de curso inválido:", id);
      setError("ID de curso no válido");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 Cargando curso con ID: ${id} (tipo: ${typeof id})`);

      // Cargar datos del curso
      const courseData = await getCourseById(id);
      console.log("📋 Datos del curso recibidos:", courseData);

      // Adaptar los datos del backend al formato esperado por el componente
      const adaptedCourse = {
        id: courseData.id,
        title: courseData.title || "Sin título",
        description:
          courseData.description ||
          courseData.shortDescription ||
          "Sin descripción",
        instructor: courseData.instructor,
        students:
          courseData.enrollmentCount || courseData.studentsEnrolled || 0,
        rating: courseData.rating || 4.5,
        duration: courseData.estimatedHours
          ? `${courseData.estimatedHours} horas`
          : "No especificado",
        level: courseData.difficulty || courseData.level || "No especificado",
        category: courseData.category,
        price: courseData.price || 0,
        status:
          courseData.status ||
          (courseData.isPublished ? "published" : "draft"),
        imageUrl:
          courseData.thumbnailUrl ||
          courseData.imageUrl ||
          generateCoursePlaceholder(courseData.title),
        // Datos adicionales que podríamos necesitar
        isPublished: courseData.isPublished || false,
        isActive: courseData.isActive || false,
        createdAt: courseData.createdAt,
        updatedAt: courseData.updatedAt,
        // Datos mock para campos que no vienen del backend aún
        modules: courseData.modules || [
          {
            id: 1,
            title: "Contenido del curso",
            lessons: [
              {
                id: 1,
                title: "Introducción",
                type: "video",
                duration: "15 min",
                completed: false,
              },
            ],
          },
        ],
        statistics: {
            completionRate: courseData.completionRate || 0,
            avgScore: courseData.avgScore || 0,
            totalEnrollments: courseData.enrollmentCount || 0,
            activeStudents: courseData.activeStudents || 0,
          },
        };

        setCourse(adaptedCourse);

        // Cargar videos del curso y organizarlos por módulos
        try {
          const videos = await getCourseVideos(id);
          console.log("🎬 Videos cargados:", videos);
          setCourseVideos(videos);
          
          // Organizar videos por módulos
          const modules = organizeVideosIntoModules(videos);
          console.log("📚 Módulos organizados:", modules);
          setOrganizedModules(modules);
        } catch (videoError) {
          console.error("❌ Error al cargar videos:", videoError);
          setCourseVideos([]);
          setOrganizedModules([]);
        }

        // Cargar estudiantes del curso si es necesario
        try {
          const studentsData = await getStudentsByCourseId(id);
          console.log("👥 Estudiantes del curso:", studentsData);

          // Adaptar datos de estudiantes
          const adaptedStudents = studentsData.map((student, index) => ({
            name: student.userName || student.name || `Estudiante ${index + 1}`,
            progress: student.progress || Math.floor(Math.random() * 100), // Mock si no hay progreso real
            lastActive: student.lastActive || student.lastLogin || "1d ago",
          }));

          setStudents(adaptedStudents);
          setStudentCount(adaptedStudents.length);
        } catch (studentsError) {
          console.error("❌ Error al cargar estudiantes:", studentsError);
          // No es crítico, continuar sin estudiantes
          setStudents([]);
          setStudentCount(0);
        }
      } catch (error) {
        console.error("❌ Error al cargar el curso:", error);
        setError(error.message || "Error al cargar el curso");
      } finally {
        setLoading(false);
      }
    }, [id]);

  // Función para organizar videos en módulos
  const organizeVideosIntoModules = (videos) => {
    if (!videos || videos.length === 0) return [];

    // Crear un mapa de módulos basado en los videos
    const moduleMap = new Map();
    
    videos.forEach(video => {
      const moduleId = video.moduleId || 'default';
      const moduleTitle = video.moduleTitle || 'Contenido General';
      
      if (!moduleMap.has(moduleId)) {
        moduleMap.set(moduleId, {
          id: moduleId,
          title: moduleTitle,
          description: video.moduleDescription || '',
          orderIndex: video.moduleOrderIndex || 1,
          isActive: true,
          lessons: []
        });
      }
      
      // Agregar el video como lección
      moduleMap.get(moduleId).lessons.push({
        id: video.id,
        title: video.title,
        description: video.description || '',
        type: video.type || 'video',
        youtubeUrl: video.youtubeUrl,
        youtubeVideoId: video.youtubeVideoId,
        content: video.content,
        orderIndex: video.orderIndex || 1,
        durationSeconds: video.durationSeconds || 0,
        isActive: video.isActive !== false
      });
    });
    
    // Convertir mapa a array y ordenar
    const modules = Array.from(moduleMap.values()).sort((a, b) => a.orderIndex - b.orderIndex);
    
    // Ordenar lecciones dentro de cada módulo
    modules.forEach(module => {
      module.lessons.sort((a, b) => a.orderIndex - b.orderIndex);
    });
    
    return modules;
  };

  // Cargar datos del curso al montar el componente
  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  // Función para eliminar curso
  const handleDelete = async () => {
    if (!course?.title) return;

    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el curso "${course.title}"?\n\n` +
        "Esta acción no se puede deshacer y el curso será eliminado permanentemente."
    );

    if (!confirmDelete) {
      setShowDeleteModal(false);
      return;
    }

    try {
      setDeleting(true);
      console.log(`🗑️ Eliminando curso ${id}`);

      await deleteCourse(id);

      console.log("✅ Curso eliminado exitosamente");
      toast.success("Curso eliminado exitosamente");
      navigate("/teacher/courses");
    } catch (error) {
      console.error("❌ Error al eliminar curso:", error);
      toast.error(`Error al eliminar el curso: ${error.message}`);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Función para cargar estudiantes
  const loadStudents = useCallback(async () => {
    if (!course?.id) return;

    setLoadingStudents(true);
    try {
      console.log(`�� Cargando estudiantes para el curso ${course.id}...`);
      const studentsData = await getStudentsByCourseId(course.id);
      console.log(`✅ Estudiantes cargados:`, studentsData);

      setStudents(studentsData);
      setStudentCount(studentsData.length);
    } catch (error) {
      console.error("❌ Error al cargar estudiantes:", error);
      setStudents([]);
      setStudentCount(0);
    } finally {
      setLoadingStudents(false);
    }
  }, [course?.id]);

  // Cargar estudiantes cuando cambie el curso
  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Estados de carga y error
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Cargando curso..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error al cargar el curso
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="block w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              Reintentar
            </button>
            <Link
              to="/teacher/courses"
              className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-center">
              Volver a mis cursos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">
          Curso no encontrado
        </h3>
        <p className="mt-2 text-gray-500">
          El curso que estás buscando no existe o no tienes permiso para verlo.
        </p>
        <div className="mt-6">
          <Link
            to="/teacher/courses"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
            Volver a mis cursos
          </Link>
        </div>
      </div>
    );
  }

  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
      case "activo":
        return "bg-green-500 text-white";
      case "draft":
      case "borrador":
        return "bg-yellow-500 text-white";
      case "archived":
      case "archivado":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "Publicado";
      case "draft":
        return "Borrador";
      case "archived":
        return "Archivado";
      case "activo":
        return "Activo";
      case "borrador":
        return "Borrador";
      case "archivado":
        return "Archivado";
      default:
        return status || "Sin estado";
    }
  };

  // Función para obtener el nombre del instructor de manera segura
  const getInstructorName = (instructor) => {
    if (typeof instructor === 'string') {
      return instructor;
    }
    if (instructor && typeof instructor === 'object') {
      return instructor.userName || instructor.name || `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || "Sin instructor";
    }
    return "Sin instructor";
  };

  // Función para obtener el nombre de la categoría de manera segura
  const getCategoryName = (category) => {
    if (typeof category === 'string') {
      return category;
    }
    if (category && typeof category === 'object') {
      return category.name || "Sin categoría";
    }
    return "Sin categoría";
  };

  // Función para alternar la expansión de una lección
  const toggleLessonExpansion = (lessonId) => {
    setExpandedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  // Función para formatear la duración de la lección
  const formatLessonDuration = (durationSeconds) => {
    if (!durationSeconds) return "Duración no especificada";
    
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    
    if (minutes > 0) {
      return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center">
          <Link
            to="/teacher/courses"
            className="mr-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  course.isPublished ? 'published' : 'draft'
                )}`}>
                {getStatusText(course.isPublished ? 'published' : 'draft')}
              </span>
              {course.category && (
                <>
                  <span className="text-gray-500 text-sm">
                    {getCategoryName(course.category)}
                  </span>
                  <span className="text-gray-500 text-sm">•</span>
                </>
              )}
              <span className="text-gray-500 text-sm">{course.level}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            to={`/teacher/courses/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Editar
          </Link>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50">
            <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      {/* Course stats */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = generateCoursePlaceholder(course.title);
              }}
            />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {course.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Por {getInstructorName(course.instructor)}
            </p>
            {course.price > 0 && (
              <p className="mt-1 text-lg font-semibold text-green-600">
                ${course.price}
              </p>
            )}
          </div>
          <div className="ml-auto flex items-center space-x-6">
            <div className="flex items-center text-yellow-400">
              <StarIcon className="h-5 w-5" />
              <span className="ml-1 text-gray-600">{course.rating}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <UserGroupIcon className="h-5 w-5 text-gray-400 mr-1" />
              {loadingStudents ? (
                <span className="animate-pulse">Cargando...</span>
              ) : (
                `${studentCount} estudiantes`
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ClockIcon className="h-5 w-5 text-gray-400 mr-1" />
              {course.duration}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {["overview", "content", "videos", "students", "analytics"].map((tab) => {
            const tabTitles = {
              overview: "Resumen",
              content: "Contenido",
              videos: "Videos",
              students: "Estudiantes",
              analytics: "Análisis",
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                {tabTitles[tab]}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Descripción del curso
              </h3>
              <p className="mt-2 text-gray-600">{course.description}</p>
            </div>

            {/* Información adicional del curso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Detalles del curso
                </h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Nivel:</dt>
                    <dd className="text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCourseLevelInfo(course.level)?.color || 'bg-gray-100 text-gray-800'}`}>
                        {getCourseLevelInfo(course.level)?.label || course.level || 'No especificado'}
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Categoría:</dt>
                    <dd className="text-sm text-gray-900">{getCategoryName(course.category)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Subcategoría:</dt>
                    <dd className="text-sm text-gray-900">{getCategoryName(course.subcategory)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Horas estimadas:</dt>
                    <dd className="text-sm text-gray-900">{course.estimatedHours || 'No especificado'}h</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Precio:</dt>
                    <dd className="text-sm text-gray-900">
                      {course.price === 0 ? "Gratis" : `$${course.price}`}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Tipo:</dt>
                    <dd className="text-sm text-gray-900">
                      {course.isPremium ? 'Premium' : 'Gratuito'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Creado:</dt>
                    <dd className="text-sm text-gray-900">
                      {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'No disponible'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Actualizado:</dt>
                    <dd className="text-sm text-gray-900">
                      {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : 'No disponible'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Estadísticas
                </h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">
                      Estudiantes inscritos:
                    </dt>
                    <dd className="text-sm text-gray-900">{course.students}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Rating promedio:</dt>
                    <dd className="text-sm text-gray-900">{course.rating}/5</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Estado:</dt>
                    <dd className="text-sm text-gray-900">
                      {getStatusText(course.isPublished ? 'published' : 'draft')}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Contenido del curso
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {organizedModules?.length || 0} módulo(s) disponible(s)
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {organizedModules?.map((module) => (
                <li key={module.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">
                      {module.title || "Módulo sin título"}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {module.lessons?.length || 0} lección(es)
                    </span>
                  </div>
                  {module.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {module.description}
                    </p>
                  )}
                  <ul className="mt-3 divide-y divide-gray-100">
                    {module.lessons?.map((lesson) => {
                      const isExpanded = expandedLessons.has(lesson.id);
                      return (
                        <li key={lesson.id} className="py-3">
                          <div 
                            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                            onClick={() => toggleLessonExpansion(lesson.id)}
                          >
                            <div className="flex items-center">
                              {lesson.type === "video" && (
                                <VideoCameraIcon className="h-5 w-5 text-red-500 mr-3" />
                              )}
                              {lesson.type === "quiz" && (
                                <DocumentTextIcon className="h-5 w-5 text-yellow-500 mr-3" />
                              )}
                              {lesson.type === "exercise" && (
                                <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-3" />
                              )}
                              {lesson.type === "text" && (
                                <DocumentTextIcon className="h-5 w-5 text-green-500 mr-3" />
                              )}
                              <div>
                                <span className="text-sm font-medium text-gray-900">
                                  {lesson.title || "Lección sin título"}
                                </span>
                                {lesson.youtubeUrl && (
                                  <div className="flex items-center mt-1">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      📺 Video de YouTube
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 mr-4">
                                {lesson.durationSeconds ? 
                                  formatLessonDuration(lesson.durationSeconds) : 
                                  (lesson.duration || "Duración no especificada")
                                }
                              </span>
                              <div className="flex items-center">
                                {lesson.completed ? (
                                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                ) : (
                                  <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                                )}
                                <svg
                                  className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${
                                    isExpanded ? 'rotate-180' : ''
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          {/* Contenido expandible */}
                          {isExpanded && (
                            <div className="mt-3 ml-8 p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-400">
                              <div className="space-y-3">
                                {lesson.description && (
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-900 mb-2">
                                      Descripción:
                                    </h5>
                                    <p className="text-sm text-gray-600">
                                      {lesson.description}
                                    </p>
                                  </div>
                                )}
                                
                                {lesson.youtubeUrl && (
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-900 mb-2">
                                      Enlace del video:
                                    </h5>
                                    <a
                                      href={lesson.youtubeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-sm text-red-600 hover:text-red-800 underline"
                                    >
                                      <VideoCameraIcon className="h-4 w-4 mr-1" />
                                      Ver en YouTube
                                    </a>
                                  </div>
                                )}
                                
                                {lesson.content && (
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-900 mb-2">
                                      Contenido:
                                    </h5>
                                    <p className="text-sm text-gray-600">
                                      {lesson.content}
                                    </p>
                                  </div>
                                )}
                                
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                                  <div>
                                    <span className="text-xs font-medium text-gray-500">Tipo:</span>
                                    <span className="ml-1 text-xs text-gray-700 capitalize">
                                      {lesson.type || "No especificado"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-xs font-medium text-gray-500">Estado:</span>
                                    <span className={`ml-1 text-xs px-2 py-1 rounded-full ${
                                      lesson.isActive !== false 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {lesson.isActive !== false ? 'Activo' : 'Inactivo'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "videos" && (
          <div className="space-y-6">
            <TeacherVideoViewer
              courseId={parseInt(id)}
              courseTitle={course.title}
              isDraft={!course.isPublished}
              refreshTrigger={refreshTrigger}
            />
          </div>
        )}

        {activeTab === "students" && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Estudiantes inscritos
                </h3>
                <span className="text-sm text-gray-500">
                  {loadingStudents ? (
                    <span className="animate-pulse">Cargando...</span>
                  ) : (
                    `${studentCount} estudiante(s)`
                  )}
                </span>
              </div>
            </div>
            {students.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <li key={index} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Última conexión: {student.lastActive}
                        </p>
                      </div>
                      <div className="w-48">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span>{student.progress}%</span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-indigo-600 h-2.5 rounded-full"
                            style={{ width: `${student.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-8 text-center">
                <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No hay estudiantes inscritos aún.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Estadísticas del curso
              </h3>
              <dl className="space-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Tasa de finalización
                  </dt>
                  <dd className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {course.statistics.completionRate}%
                    </div>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Puntuación promedio
                  </dt>
                  <dd className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {course.statistics.avgScore}%
                    </div>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Estudiantes activos
                  </dt>
                  <dd className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {course.statistics.activeStudents}
                    </div>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Información adicional
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Fecha de creación
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {course.createdAt
                      ? new Date(course.createdAt).toLocaleDateString("es-ES")
                      : "No disponible"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Última actualización
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {course.updatedAt
                      ? new Date(course.updatedAt).toLocaleDateString("es-ES")
                      : "No disponible"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Estado de publicación
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {course.isPublished ? "Publicado" : "No publicado"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Eliminar curso
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      ¿Estás seguro de que deseas eliminar el curso "
                      {course.title}"? Esta acción no se puede deshacer y se
                      eliminarán todos los datos asociados.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                  onClick={handleDelete}
                  disabled={deleting}>
                  {deleting ? "Eliminando..." : "Eliminar"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
