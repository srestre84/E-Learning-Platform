import React, { useState, useEffect } from 'react';
import { Play, Clock, CheckCircle, Lock, Award, BookOpen, Tag, User, ChevronDown, ChevronRight } from 'lucide-react';
import VideoPlayer from '@/shared/components/VideoPlayer';
import { getCourseVideos } from '@/services/courseVideoService';
import { getCourseById } from '@/services/courseService';
import { updateCourseProgress, markCourseAsCompleted } from '@/services/enrollmentService';
import { getCategoryById, getSubcategoryById } from '@/services/categoryService';
import PropTypes from 'prop-types';

const StudentVideoViewer = ({ courseId, courseTitle, enrollmentData, onProgressUpdate }) => {
  const [videos, setVideos] = useState([]);
  const [modules, setModules] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [expandedModules, setExpandedModules] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseData, videosData] = await Promise.allSettled([
          getCourseById(courseId),
          getCourseVideos(courseId)
        ]);

        // Procesar datos del curso
        if (courseData.status === "fulfilled") {
          setCourse(courseData.value);
        }

        // Procesar videos y organizarlos por módulos
        if (videosData.status === "fulfilled") {
          const videosDataArray = videosData.value || [];
          setVideos(videosDataArray);
          
          // Organizar videos por módulos
          const organizedModules = organizeVideosIntoModules(videosDataArray);
          setModules(organizedModules);
          
          // Expandir el primer módulo por defecto
          if (organizedModules.length > 0) {
            setExpandedModules(new Set([organizedModules[0].id]));
          }
          
          // Seleccionar el primer video por defecto
          if (videosDataArray.length > 0) {
            setActiveVideo(videosDataArray[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError("Error al cargar los datos del curso.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  useEffect(() => {
    if (videos.length > 0) {
      const completedVideos = videos.filter(video => video.completed).length;
      const newProgress = (completedVideos / videos.length) * 100;
      setProgress(newProgress);
    }
  }, [videos]);

  // Organizar videos en módulos
  const organizeVideosIntoModules = (videos) => {
    if (!videos || videos.length === 0) return [];

    // Ordenar videos por orderIndex
    const sortedVideos = [...videos].sort((a, b) => a.orderIndex - b.orderIndex);
    
    // Agrupar videos por moduleId
    const modulesMap = new Map();
    
    sortedVideos.forEach(video => {
      const moduleId = video.moduleId || Math.floor((video.orderIndex - 1) / 5) + 1;
      
      if (!modulesMap.has(moduleId)) {
        modulesMap.set(moduleId, {
          id: moduleId,
          title: video.moduleTitle || `Módulo ${moduleId}`,
          description: `Contenido del módulo ${moduleId}`,
          videos: [],
          totalDuration: 0,
          orderIndex: video.moduleOrderIndex || moduleId
        });
      }
      
      const module = modulesMap.get(moduleId);
      module.videos.push(video);
      module.totalDuration += video.durationSeconds || 0;
    });

    // Convertir Map a array y ordenar por orderIndex del módulo
    return Array.from(modulesMap.values()).sort((a, b) => a.orderIndex - b.orderIndex);
  };

  // Obtener información de categoría y subcategoría
  const getCategoryInfo = () => {
    if (!course?.categoryId || !course?.subcategoryId) {
      return { categoryName: 'Sin categoría', subcategoryName: 'Sin subcategoría' };
    }

    const category = getCategoryById(course.categoryId);
    const subcategory = getSubcategoryById(course.categoryId, course.subcategoryId);
    
    return {
      categoryName: category?.name || 'Sin categoría',
      subcategoryName: subcategory?.name || 'Sin subcategoría'
    };
  };

  const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleVideoSelect = (video) => {
    setActiveVideo(video);
  };

  const handleVideoComplete = async (videoId) => {
    try {
      // Marcar video como completado
      await updateCourseProgress(courseId, videoId, 100);
      
      // Actualizar estado local
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video.id === videoId 
            ? { ...video, completed: true }
            : video
        )
      );

      // Verificar si el curso está completo
      const updatedVideos = videos.map(video => 
        video.id === videoId ? { ...video, completed: true } : video
      );
      const allCompleted = updatedVideos.every(video => video.completed);
      
      if (allCompleted) {
        await markCourseAsCompleted(courseId);
        if (onProgressUpdate) {
          onProgressUpdate(100);
        }
      } else {
        const completedCount = updatedVideos.filter(video => video.completed).length;
        const newProgress = (completedCount / videos.length) * 100;
        if (onProgressUpdate) {
          onProgressUpdate(newProgress);
        }
      }
    } catch (error) {
      console.error("Error updating video progress:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!enrollmentData?.isEnrolled) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <Lock className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Contenido Restringido
          </h3>
          <p className="text-gray-600 mb-4">
            Debes estar inscrito en este curso para ver los videos
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Inscribirse al Curso
          </button>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <Play className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No hay videos disponibles</p>
          <p className="text-sm">Este curso no tiene videos configurados</p>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header con información del curso */}
      <div className="p-6 border-b border-gray-200">
        {/* Información principal del curso */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {course?.title || courseTitle}
            </h2>
            
            {/* Información de categoría y subcategoría */}
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center text-sm text-gray-600">
                <Tag className="w-4 h-4 mr-1" />
                <span className="font-medium">{categoryInfo.categoryName}</span>
                <span className="mx-1">•</span>
                <span>{categoryInfo.subcategoryName}</span>
              </div>
              
              {course?.instructor && (
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-1" />
                  <span>Instructor: {course.instructor.userName} {course.instructor.lastName}</span>
                </div>
              )}
            </div>

            {/* Título del video actual */}
            {activeVideo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <Play className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Video Actual:</h3>
                    <p className="text-blue-800">{activeVideo.title}</p>
                    {activeVideo.description && (
                      <p className="text-sm text-blue-700 mt-1">{activeVideo.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Progreso del curso */}
          <div className="text-right ml-6">
            <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
            <div className="text-sm text-gray-500">Completado</div>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Estadísticas del curso */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              <span>{modules.length} módulo(s)</span>
            </div>
            <div className="flex items-center">
              <Play className="w-4 h-4 mr-1" />
              <span>{videos.length} videos</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>
                {formatDuration(videos.reduce((total, video) => total + (video.durationSeconds || 0), 0))}
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>{videos.filter(v => v.completed).length} completados</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Video Player */}
        <div className="flex-1">
          {activeVideo ? (
            <VideoPlayer
              videoUrl={activeVideo.youtubeUrl}
              title={activeVideo.title}
              description={activeVideo.description}
              duration={activeVideo.durationSeconds}
              isEnrolled={enrollmentData?.isEnrolled}
              isCompleted={activeVideo.completed}
              onVideoComplete={() => handleVideoComplete(activeVideo.id)}
              className="rounded-none"
            />
          ) : (
            <div className="aspect-video flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Selecciona un video para comenzar</p>
              </div>
            </div>
          )}
        </div>

        {/* Video List - Organizada por Módulos */}
        <div className="w-80 border-l border-gray-200 bg-gray-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Contenido del Curso</h3>
            <p className="text-sm text-gray-500">
              {modules.length} módulo(s) • {videos.length} lección(es)
            </p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {modules.map((module) => (
              <div key={module.id} className="border-b border-gray-200 last:border-b-0">
                {/* Header del módulo */}
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-4 text-left bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-center space-x-3">
                    {expandedModules.has(module.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                    <h4 className="font-medium text-gray-900">{module.title}</h4>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{module.videos.length} videos</span>
                    <Clock className="w-3 h-3" />
                    <span>{formatDuration(module.totalDuration)}</span>
                  </div>
                </button>

                {/* Videos del módulo */}
                {expandedModules.has(module.id) && (
                  <div className="border-t border-gray-200">
                    <div className="p-4 space-y-2">
                      {module.videos.map((video, index) => (
                        <button
                          key={video.id}
                          onClick={() => handleVideoSelect(video)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left ${
                            activeVideo?.id === video.id ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {(() => {
                              if (video.completed) {
                                return <CheckCircle className="w-4 h-4 text-green-500" />;
                              }
                              if (activeVideo?.id === video.id) {
                                return <Play className="w-4 h-4 text-blue-500" />;
                              }
                              return (
                                <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                                  <span className="text-xs text-gray-600">{index + 1}</span>
                                </div>
                              );
                            })()}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {video.title}
                            </h4>
                            {video.description && (
                              <p className="text-xs text-gray-500 truncate">
                                {video.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(video.durationSeconds || 0)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

StudentVideoViewer.propTypes = {
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  courseTitle: PropTypes.string.isRequired,
  enrollmentData: PropTypes.object,
  onProgressUpdate: PropTypes.func
};

export default StudentVideoViewer;
