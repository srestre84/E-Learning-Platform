import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Play, Clock, Lock, CheckCircle } from 'lucide-react';
import { getCourseVideos } from '@/services/courseVideoService';
import PropTypes from 'prop-types';

const CourseModules = ({ courseId, isEnrolled = false, onVideoClick }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const videosData = await getCourseVideos(courseId);
        
        // Organizar videos en módulos basándose en el orderIndex
        const organizedModules = organizeVideosIntoModules(videosData || []);
        setModules(organizedModules);
        
        // Expandir el primer módulo por defecto
        if (organizedModules.length > 0) {
          setExpandedModules(new Set([0]));
        }
      } catch (err) {
        console.error('Error al cargar videos del curso:', err);
        setError('Error al cargar el contenido del curso');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchVideos();
    }
  }, [courseId]);

  // Organizar videos en módulos basándose en el orderIndex y moduleId
  const organizeVideosIntoModules = (videos) => {
    if (!videos || videos.length === 0) return [];

    // Ordenar videos por orderIndex
    const sortedVideos = [...videos].sort((a, b) => a.orderIndex - b.orderIndex);
    
    // Agrupar videos por moduleId si existe, sino agrupar manualmente
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
    
    return Array.from(modulesMap.values()).sort((a, b) => a.orderIndex - b.orderIndex);
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

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVideoClick = (video) => {
    if (onVideoClick) {
      onVideoClick(video);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-3 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-500">No hay contenido disponible para este curso.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <div key={module.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Module Header */}
          <button
            className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
            onClick={() => toggleModule(module.id)}
            type="button"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {expandedModules.has(module.id) ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-500">{module.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Play className="w-4 h-4 mr-1" />
                  <span>{module.videos.length} videos</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{formatDuration(module.totalDuration)}</span>
                </div>
              </div>
            </div>
          </button>

          {/* Module Content */}
          {expandedModules.has(module.id) && (
            <div className="border-t border-gray-200">
              <div className="p-4 space-y-2">
                {module.videos.map((video, index) => (
                  <button
                    key={video.id}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left ${
                      !isEnrolled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    onClick={() => isEnrolled && handleVideoClick(video)}
                    disabled={!isEnrolled}
                    type="button"
                  >
                    <div className="flex-shrink-0">
                      {isEnrolled ? (
                        <Play className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
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
                      {video.completed && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

CourseModules.propTypes = {
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isEnrolled: PropTypes.bool,
  onVideoClick: PropTypes.func.isRequired
};

export default CourseModules;
