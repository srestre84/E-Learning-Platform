import React, { useState, useEffect } from 'react';
import { Play, Clock, CheckCircle, Eye, Users, ChevronDown, ChevronRight } from 'lucide-react';
import VideoPlayer from '@/shared/components/VideoPlayer';
import VideoLinkButton from '@/shared/components/VideoLinkButton';
import { getCourseVideos } from '@/services/courseVideoService';
import PropTypes from 'prop-types';

const TeacherVideoViewer = ({ courseId, courseTitle, isDraft = false, refreshTrigger = 0 }) => {
  const [videos, setVideos] = useState([]);
  const [modules, setModules] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState(new Set());

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const videosData = await getCourseVideos(courseId);
        setVideos(videosData || []);
        
        // Organizar videos por módulos
        const organizedModules = organizeVideosIntoModules(videosData || []);
        setModules(organizedModules);
        
        // Expandir el primer módulo por defecto
        if (organizedModules.length > 0) {
          setExpandedModules(new Set([organizedModules[0].id]));
        }
        
        // Seleccionar el primer video por defecto
        if (videosData && videosData.length > 0) {
          setActiveVideo(videosData[0]);
        }
      } catch (err) {
        console.error("Error fetching course videos:", err);
        setError("Error al cargar los videos del curso.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchVideos();
    }
  }, [courseId, refreshTrigger]);

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

  if (videos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <Play className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No hay videos disponibles</p>
          <p className="text-sm">
            {isDraft 
              ? "Agrega videos a tu curso para que los estudiantes puedan verlos"
              : "Este curso no tiene videos configurados"
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {isDraft ? 'Vista Previa del Curso' : 'Videos del Curso'}
            </h2>
            <p className="text-sm text-gray-600">{courseTitle}</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
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
            {!isDraft && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>Estudiantes inscritos</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Video Player */}
        <div className="flex-1">
          {activeVideo ? (
            <div className="relative">
              <VideoPlayer
                videoUrl={activeVideo.youtubeUrl}
                title={activeVideo.title}
                description={activeVideo.description}
                duration={activeVideo.durationSeconds}
                isEnrolled={true} // Los profesores siempre pueden ver sus videos
                isCompleted={false}
                className="rounded-none"
              />
              {/* Botón de enlace flotante */}
              <div className="absolute top-4 right-4">
                <VideoLinkButton
                  videoUrl={activeVideo.youtubeUrl}
                  title={activeVideo.title}
                  variant="primary"
                  size="sm"
                />
              </div>
            </div>
          ) : (
            <div className="aspect-video flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Selecciona un video para reproducir</p>
              </div>
            </div>
          )}
        </div>

        {/* Video List */}
        <div className="w-80 border-l border-gray-200 bg-gray-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Lista de Videos</h3>
            <p className="text-sm text-gray-500">
              {isDraft ? 'Vista previa de contenido' : 'Contenido del curso'}
            </p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {videos.map((video, index) => (
              <button
                key={video.id}
                onClick={() => handleVideoSelect(video)}
                className={`w-full p-4 text-left hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 ${
                  activeVideo?.id === video.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {activeVideo?.id === video.id ? (
                      <Play className="w-4 h-4 text-blue-500" />
                    ) : (
                      <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-600">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {video.title}
                    </h4>
                    
                    {video.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {video.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{formatDuration(video.durationSeconds || 0)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {video.youtubeUrl && (
                          <VideoLinkButton
                            videoUrl={video.youtubeUrl}
                            title={video.title}
                            variant="preview"
                            size="xs"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                        {video.completed && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {isDraft && (
                          <Eye className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

TeacherVideoViewer.propTypes = {
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  courseTitle: PropTypes.string.isRequired,
  isDraft: PropTypes.bool,
  refreshTrigger: PropTypes.number
};

export default TeacherVideoViewer;
