import React, { useState, useEffect } from 'react';
import { Play, Clock, BookOpen, ChevronDown, ChevronUp, CheckCircle, Lock, Tag } from 'lucide-react';
import PropTypes from 'prop-types';
import { getCourseModules } from '@/services/courseVideoService';
import { getCategoryById, getSubcategoryById } from '@/services/categoryService';

const CourseContentModules = ({ 
  course, 
  isEnrolled = false, 
  onVideoClick,
  className = "" 
}) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [error, setError] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);

  // Cargar módulos y videos del curso
  useEffect(() => {
    const loadCourseContent = async () => {
      if (!course?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Cargar información de categoría
        if (course.categoryId && course.subcategoryId) {
          const category = getCategoryById(course.categoryId);
          const subcategory = getSubcategoryById(course.categoryId, course.subcategoryId);
          
          if (category && subcategory) {
            setCategoryInfo({
              category: category.name,
              subcategory: subcategory.name
            });
          }
        }
        
        // Obtener módulos del curso
        const courseModules = await getCourseModules(course.id);
        console.log('Módulos obtenidos para el curso:', course.id, courseModules);
        
        if (courseModules && courseModules.length > 0) {
          // Procesar módulos y convertir lecciones a formato de videos
          const processedModules = courseModules.map(module => ({
            id: module.id,
            title: module.title,
            description: module.description || '',
            orderIndex: module.orderIndex || 0,
            videos: module.lessons
              ? module.lessons
                  .filter(lesson => lesson.type === 'VIDEO' && lesson.youtubeUrl)
                  .map(lesson => ({
                    id: lesson.id,
                    title: lesson.title,
                    description: lesson.description || '',
                    youtubeUrl: lesson.youtubeUrl,
                    youtubeVideoId: lesson.youtubeUrl ? lesson.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1] : null,
                    durationSeconds: lesson.durationSeconds || 0,
                    orderIndex: lesson.orderIndex || 0,
                    completed: false
                  }))
              : []
          }));
          
          setModules(processedModules);
          
          // Expandir el primer módulo por defecto
          if (processedModules.length > 0) {
            setExpandedModules({ [processedModules[0].id]: true });
          }
        } else {
          // Si no hay módulos, crear módulos de ejemplo
          const mockModules = [
            {
              id: 'module-1',
              title: 'Introducción',
              description: 'Módulo de introducción al curso',
              videos: [
                {
                  id: 1,
                  title: 'Bienvenida al curso',
                  youtubeUrl: 'https://www.youtube.com/watch?v=zOjov-2OZ0E',
                  durationSeconds: 300,
                  completed: false
                }
              ],
              orderIndex: 1
            }
          ];
          setModules(mockModules);
          setExpandedModules({ 'module-1': true });
        }
      } catch (err) {
        console.error('Error al cargar contenido del curso:', err);
        setError('Error al cargar el contenido del curso');
      } finally {
        setLoading(false);
      }
    };

    loadCourseContent();
  }, [course?.id]);

  // Alternar expansión de módulo
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Formatear duración
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  // Manejar clic en video
  const handleVideoClick = (video) => {
    if (onVideoClick) {
      onVideoClick(video);
    } else {
      // Abrir video en nueva pestaña por defecto
      window.open(video.youtubeUrl, '_blank');
    }
  };

  if (loading) {
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

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-500 mb-2">⚠️</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay contenido disponible para este curso</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Contenido del Curso
          </h3>
          <div className="text-sm text-gray-500">
            {modules.length} módulo{modules.length !== 1 ? 's' : ''} • {modules.reduce((total, module) => total + module.videos.length, 0)} lección{modules.reduce((total, module) => total + module.videos.length, 0) !== 1 ? 'es' : ''}
          </div>
        </div>
        
        {/* Información de categoría */}
        {categoryInfo && (
          <div className="flex items-center space-x-2 text-sm">
            <Tag className="w-4 h-4 text-blue-500" />
            <span className="text-blue-600 font-medium">
              {categoryInfo.category}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">
              {categoryInfo.subcategory}
            </span>
          </div>
        )}

        {/* Información de videos por módulo */}
        <div className="text-sm text-gray-600">
          <strong>Videos organizados por módulos:</strong> {modules.reduce((total, module) => total + (module.videos?.length || 0), 0)} videos en {modules.length} módulos
        </div>
      </div>

      {modules.map((module, moduleIndex) => (
        <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Header del módulo */}
          <div 
            className="bg-gray-50 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleModule(module.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleModule(module.id);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {expandedModules[module.id] ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {moduleIndex + 1}. {module.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {module.videos.length} lección{module.videos.length !== 1 ? 'es' : ''}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {formatDuration(module.videos.reduce((total, video) => total + (video.durationSeconds || 0), 0))}
              </div>
            </div>
          </div>

          {/* Contenido del módulo */}
          {expandedModules[module.id] && (
            <div className="bg-white">
              {module.videos.map((video, videoIndex) => (
                <div 
                  key={video.id}
                  className={`px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                    !isEnrolled ? 'opacity-60' : 'cursor-pointer'
                  }`}
                  onClick={() => isEnrolled && handleVideoClick(video)}
                  onKeyDown={(e) => {
                    if (isEnrolled && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleVideoClick(video);
                    }
                  }}
                  role={isEnrolled ? "button" : undefined}
                  tabIndex={isEnrolled ? 0 : undefined}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {(() => {
                        if (video.completed) {
                          return <CheckCircle className="w-5 h-5 text-green-500" />;
                        }
                        if (!isEnrolled) {
                          return <Lock className="w-5 h-5 text-gray-400" />;
                        }
                        return <Play className="w-5 h-5 text-blue-500" />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-gray-900 truncate">
                        {videoIndex + 1}. {video.title}
                      </h5>
                      {video.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(video.durationSeconds || 0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

CourseContentModules.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    subcategoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  isEnrolled: PropTypes.bool,
  onVideoClick: PropTypes.func,
  className: PropTypes.string
};

export default CourseContentModules;
