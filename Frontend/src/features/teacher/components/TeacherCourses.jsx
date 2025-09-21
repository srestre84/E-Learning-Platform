// src/features/teacher/components/TeacherCourses.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { generateCoursePlaceholder } from "@/utils/imageUtils";
import { useTeacherCourses } from "@/shared/hooks/useTeacherCourses";
import { useAuth } from "@/shared/hooks/useAuth";
import { deleteCourse } from "@/services/courseService";
import { toast } from "sonner"; // ✅ Reemplazar alert con toast
import CourseBadges from "@/shared/components/CourseBadges";
import { 
  FILTER_OPTIONS, 
  FILTER_LABELS,
  isCourseFree,
  getCoursePriceRange
} from "@/shared/constants/courseConstants";

// Componentes de estado de carga
const LoadingState = () => (
  <div className="p-8 text-center">
    <h3 className="text-xl font-semibold text-gray-600">
      Cargando tus cursos...
    </h3>
  </div>
);

// Componentes de estado de error
const ErrorState = ({ message }) => (
  <div className="p-8 text-center">
    <h3 className="text-xl font-semibold text-red-600">Error: {message}</h3>
  </div>
);

// ✅ Componente de confirmación moderno
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6 whitespace-pre-line">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

const TeacherCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(FILTER_OPTIONS.STATUS.ALL);
  const [typeFilter, setTypeFilter] = useState(FILTER_OPTIONS.TYPE.ALL);
  const [levelFilter, setLevelFilter] = useState(FILTER_OPTIONS.LEVEL.ALL);
  const [priceFilter, setPriceFilter] = useState(FILTER_OPTIONS.PRICE.ALL);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    courseId: null,
    courseTitle: "",
  });

  // Obtener usuario autenticado
  const { user } = useAuth();

  // Debug: Verificar datos del usuario
  console.log("=== DEBUG TEACHER COURSES ===");
  console.log("Usuario completo:", user);
  console.log("ID del usuario:", user?.id);
  console.log("Rol del usuario:", user?.role);
  console.log("Email del usuario:", user?.email);

  // Usar solo una llamada al hook
  const { courses, loading, error, refreshCourses } = useTeacherCourses(
    user?.id
  );

  // ✅ Función mejorada para eliminar curso
  const handleDeleteCourse = async (courseId, courseTitle) => {
    setConfirmDialog({
      isOpen: true,
      courseId,
      courseTitle,
    });
  };

  // ✅ Confirmar eliminación
  const confirmDelete = async () => {
    const { courseId, courseTitle } = confirmDialog;

    try {
      await deleteCourse(courseId);
      await refreshCourses();
      toast.success("Curso eliminado exitosamente");
    } catch (error) {
      toast.error(`Error al eliminar el curso: ${error.message}`);
    } finally {
      setConfirmDialog({ isOpen: false, courseId: null, courseTitle: "" });
    }
  };

  // ✅ Cancelar eliminación
  const cancelDelete = () => {
    setConfirmDialog({ isOpen: false, courseId: null, courseTitle: "" });
  };

  // Muestra el estado de carga o error si es necesario
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const filteredCourses = courses.filter((course) => {
    // Filtro de búsqueda
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
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
    
    return matchesSearch && matchesStatus && matchesType && matchesLevel && matchesPrice;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ✅ Dialog de confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar el curso "${confirmDialog.courseTitle}"?\n\nEsta acción no se puede deshacer y el curso será eliminado permanentemente.\nSolo se pueden eliminar cursos sin estudiantes inscritos.`}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-950 mb-2">Mis Cursos</h1>
          <p className="text-lg text-gray-600">
            Gestiona y organiza todos tus cursos
          </p>
        </div>
        <Link
          to="/teacher/courses/create"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transform hover:-translate-y-0.5 transition-all duration-300">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Crear Nuevo Curso
        </Link>
      </div>

      {/* Search and filter section */}
      <div className="bg-white p-6 mb-8 rounded-2xl shadow-lg border border-gray-200">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Filtros avanzados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro de Estado */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900">
                {Object.entries(FILTER_LABELS.STATUS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Tipo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900">
                {Object.entries(FILTER_LABELS.TYPE).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Nivel */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nivel
              </label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900">
                {Object.entries(FILTER_LABELS.LEVEL).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Precio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Precio
              </label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900">
                {Object.entries(FILTER_LABELS.PRICE).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resumen de filtros activos */}
          {(statusFilter !== FILTER_OPTIONS.STATUS.ALL || 
            typeFilter !== FILTER_OPTIONS.TYPE.ALL || 
            levelFilter !== FILTER_OPTIONS.LEVEL.ALL ||
            priceFilter !== FILTER_OPTIONS.PRICE.ALL) && (
            <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-gray-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filtros activos:</span>
              {statusFilter !== FILTER_OPTIONS.STATUS.ALL && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {FILTER_LABELS.STATUS[statusFilter]}
                </span>
              )}
              {typeFilter !== FILTER_OPTIONS.TYPE.ALL && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  {FILTER_LABELS.TYPE[typeFilter]}
                </span>
              )}
              {levelFilter !== FILTER_OPTIONS.LEVEL.ALL && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {FILTER_LABELS.LEVEL[levelFilter]}
                </span>
              )}
              {priceFilter !== FILTER_OPTIONS.PRICE.ALL && (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                  {FILTER_LABELS.PRICE[priceFilter]}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mb-6">
            <svg
              className="w-20 h-20 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No tienes cursos creados
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza creando tu primer curso para compartir tu conocimiento
          </p>
          <Link
            to="/teacher/courses/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Crear mi primer curso
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200">
              {/* Contenedor de la imagen */}
              <div className="relative h-48 w-full group">
                <img
                  src={
                    course.thumbnailUrl ||
                    course.image ||
                    generateCoursePlaceholder(course.title || "Curso")
                  }
                  alt={`Imagen de ${course.title}`}
                  className="w-full h-full object-cover"
                />
                {/* Badges del curso */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <CourseBadges 
                    course={course}
                    showStatus={true}
                    showType={true}
                    showLevel={false}
                    showPrice={false}
                    className="flex-col"
                  />
                </div>
                {/* Botón de play overlay */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white/90 text-red-600 p-3 rounded-full hover:bg-white hover:scale-110 transition-all duration-200">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-2 leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="font-semibold text-sm text-gray-900">
                        {course.students || 0}
                      </span>
                      <span className="text-xs text-gray-500">estudiantes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="font-semibold text-sm text-gray-900">
                        {course.rating || "4.5"}
                      </span>
                      <span className="text-xs text-gray-500">rating</span>
                    </div>
                  </div>
                  
                  {/* Badge de precio */}
                  <div className="mb-4">
                    <CourseBadges 
                      course={course}
                      showStatus={false}
                      showType={false}
                      showLevel={false}
                      showPrice={true}
                    />
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  {/* Botones de acción */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/teacher/courses/${course.id}`}
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-200"
                        title="Ver curso">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>
                      <Link
                        to={`/teacher/courses/${course.id}/edit`}
                        className="text-gray-500 p-2 rounded-lg hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                        title="Editar curso">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() =>
                          handleDeleteCourse(course.id, course.title)
                        }
                        className="text-red-500 p-2 rounded-lg hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                        title="Eliminar curso">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Publicado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
