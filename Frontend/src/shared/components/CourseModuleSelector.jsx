import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Play, FileText, Plus } from 'lucide-react';
import PropTypes from 'prop-types';
import { getCourses } from '@/services/courseService';
import { getCourseModules } from '@/services/courseVideoService';

const CourseModuleSelector = ({ 
  onSelectModule, 
  onAddToModule,
  selectedCourseId,
  selectedModuleId,
  className = "" 
}) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);

  // Cargar cursos disponibles
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error al cargar cursos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Cargar módulos cuando se selecciona un curso
  useEffect(() => {
    const loadModules = async () => {
      if (!selectedCourse?.id) return;
      
      try {
        setLoading(true);
        const modulesData = await getCourseModules(selectedCourse.id);
        setModules(modulesData);
      } catch (error) {
        console.error('Error al cargar módulos:', error);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [selectedCourse]);

  // Manejar selección de curso
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedModule(null);
    setModules([]);
    setExpandedCourse(course.id);
    setExpandedModule(null);
    
    if (onSelectModule) {
      onSelectModule(course, null);
    }
  };

  // Manejar selección de módulo
  const handleModuleSelect = (module) => {
    setSelectedModule(module);
    setExpandedModule(module.id);
    
    if (onSelectModule) {
      onSelectModule(selectedCourse, module);
    }
  };

  // Manejar añadir contenido al módulo
  const handleAddToModule = (module) => {
    if (onAddToModule) {
      onAddToModule(selectedCourse, module);
    }
  };

  // Formatear duración
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };


  if (loading && courses.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Seleccionar Curso y Módulo
        </h3>
        <div className="text-sm text-gray-500">
          {courses.length} curso{courses.length !== 1 ? 's' : ''} disponible{courses.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Lista de cursos */}
      <div className="space-y-2">
        {courses.map((course) => (
          <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header del curso */}
            <div 
              className="bg-gray-50 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleCourseSelect(course)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCourseSelect(course);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {expandedCourse === course.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {course.shortDescription || course.description}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {course.estimatedHours || 0}h
                </div>
              </div>
            </div>

            {/* Módulos del curso */}
            {expandedCourse === course.id && (
              <div className="bg-white">
                {loading ? (
                  <div className="p-4">
                    <div className="animate-pulse space-y-2">
                      {[1, 2].map(i => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                ) : (() => {
                  if (modules.length > 0) {
                    return modules.map((module) => (
                    <div key={module.id} className="border-b border-gray-100 last:border-b-0">
                      <div 
                        className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleModuleSelect(module)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleModuleSelect(module);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {expandedModule === module.id ? (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronUp className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">
                                {module.title}
                              </h5>
                              {module.description && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {module.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-gray-500">
                              {module.lessons?.length || 0} lecciones
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToModule(module);
                              }}
                              className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Añadir
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Lecciones del módulo */}
                      {expandedModule === module.id && module.lessons && (
                        <div className="bg-gray-50 px-4 py-2">
                          <div className="space-y-1">
                            {module.lessons.map((lesson, index) => (
                              <div key={lesson.id} className="flex items-center space-x-2 text-xs text-gray-600">
                                <div className="flex-shrink-0">
                                  {lesson.type === 'VIDEO' ? (
                                    <Play className="w-3 h-3 text-blue-500" />
                                  ) : (
                                    <FileText className="w-3 h-3 text-green-500" />
                                  )}
                                </div>
                                <span className="truncate">
                                  {index + 1}. {lesson.title}
                                </span>
                                {lesson.durationSeconds && (
                                  <span className="text-gray-400">
                                    {formatDuration(lesson.durationSeconds)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ));
                  } else {
                    return (
                      <div className="p-4 text-center text-gray-500">
                        <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No hay módulos en este curso</p>
                      </div>
                    );
                  }
                })()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Información de selección */}
      {selectedCourse && selectedModule && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-blue-900">
                Módulo seleccionado:
              </h4>
              <p className="text-sm text-blue-700">
                <strong>{selectedCourse.title}</strong> → <strong>{selectedModule.title}</strong>
              </p>
            </div>
            <div className="text-xs text-blue-600">
              {selectedModule.lessons?.length || 0} lecciones existentes
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CourseModuleSelector.propTypes = {
  onSelectModule: PropTypes.func,
  onAddToModule: PropTypes.func,
  selectedCourseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedModuleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string
};

export default CourseModuleSelector;
