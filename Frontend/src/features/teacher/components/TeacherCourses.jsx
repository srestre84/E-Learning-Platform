// src/features/teacher/components/TeacherCourses.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { generateCoursePlaceholder } from "@/utils/imageUtils";
import { useTeacherCourses } from "@/shared/hooks/useTeacherCourses";
import { useAuth } from "@/shared/hooks/useAuth";
import { deleteCourse } from "@/services/courseService";

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

const TeacherCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Obtener usuario autenticado
  const { user } = useAuth();

  // Usar solo una llamada al hook
  const { courses, loading, error, refreshCourses } = useTeacherCourses(
    user?.id
  );

  // Eliminar curso
  const handleDeleteCourse = async (courseId, courseTitle) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el curso "${courseTitle}"?\n\n` +
        "Esta acción no se puede deshacer y el curso será eliminado permanentemente.\n" +
        "Solo se pueden eliminar cursos sin estudiantes inscritos."
    );
    if (!confirmDelete) return;
    try {
      await deleteCourse(courseId);
      await refreshCourses();
      alert("Curso eliminado exitosamente");
    } catch (error) {
      alert(`Error al eliminar el curso: ${error.message}`);
    }
  };

  // Muestra el estado de carga o error si es necesario
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "todos" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
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
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900">
              <option value="todos">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Borrador">Borrador</option>
              <option value="Archivado">Archivado</option>
            </select>
          </div>
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
                <div
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    course.status === "Activo"
                      ? "bg-green-500"
                      : course.status === "Borrador"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}>
                  {course.status}
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
                </div>
                <div className="border-t border-gray-200 pt-4">
                  {/* Botones de acción */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
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
                      </button>
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
