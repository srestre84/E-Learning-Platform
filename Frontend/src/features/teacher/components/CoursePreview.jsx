import React, { useState } from 'react';
import { Play, Clock, Eye, ChevronDown, ChevronRight, Lock, CheckCircle } from 'lucide-react';
import VideoPreview from '@/shared/components/VideoPreview';

const CoursePreview = ({ course, isDraft = false }) => {
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [previewVideo, setPreviewVideo] = useState(null);

  // Organizar videos en módulos
  const organizeVideosIntoModules = (videos) => {
    if (!videos || videos.length === 0) return [];

    // Si el curso ya tiene módulos estructurados, usarlos
    if (course?.modules && course.modules.length > 0) {
      return course.modules.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description || '',
        videos: module.lessons?.filter(lesson => lesson.type === 'video' && lesson.youtubeUrl) || [],
        totalDuration: module.lessons?.reduce((total, lesson) => total + (lesson.durationSeconds || 0), 0) || 0
      }));
    }

    // Si no hay módulos estructurados, organizar manualmente
    const videosPerModule = 5;
    const modules = [];
    
    for (let i = 0; i < videos.length; i += videosPerModule) {
      const moduleVideos = videos.slice(i, i + videosPerModule);
      const moduleNumber = Math.floor(i / videosPerModule) + 1;
      
      modules.push({
        id: moduleNumber,
        title: `Módulo ${moduleNumber}`,
        description: `Contenido del módulo ${moduleNumber}`,
        videos: moduleVideos,
        totalDuration: moduleVideos.reduce((total, video) => total + (video.durationSeconds || 0), 0)
      });
    }
    
    return modules;
  };

  // Priorizar módulos estructurados del curso
  const modules = course?.modules && course.modules.length > 0 
    ? course.modules.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description || '',
        videos: module.lessons?.filter(lesson => lesson.type === 'video' && lesson.youtubeUrl) || [],
        totalDuration: module.lessons?.reduce((total, lesson) => total + (lesson.durationSeconds || 0), 0) || 0
      }))
    : organizeVideosIntoModules(course.youtubeUrls || []);

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

  const handleVideoPreview = (videoUrl, title) => {
    setPreviewVideo({
      videoUrl,
      thumbnailUrl: `https://img.youtube.com/vi/${extractVideoId(videoUrl)}/maxresdefault.jpg`,
      title,
      duration: 0
    });
  };

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const closeVideoPreview = () => {
    setPreviewVideo(null);
  };

  if (!course) return null;

  return (
    <div className="space-y-6">
      {/* Información del curso */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {course.title || 'Curso sin título'}
            </h3>
            <p className="text-gray-600 text-sm">
              {course.description || 'Sin descripción'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {isDraft && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                Borrador
              </span>
            )}
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {course.youtubeUrls?.length || 0} videos
            </span>
          </div>
        </div>

        {/* Estadísticas del curso */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Play className="w-4 h-4 mr-2 text-blue-500" />
            <span>{course.youtubeUrls?.length || 0} videos</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-green-500" />
            <span>{formatDuration(course.estimatedHours * 3600 || 0)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Eye className="w-4 h-4 mr-2 text-purple-500" />
            <span>{modules.length} módulos</span>
          </div>
          <div className="flex items-center text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-orange-500" />
            <span>{isDraft ? 'En desarrollo' : 'Completado'}</span>
          </div>
        </div>
      </div>

      {/* Módulos del curso */}
      {modules.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Contenido del Curso</h4>
          {modules.map((module) => (
            <div key={module.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header del módulo */}
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
                      <h5 className="font-semibold text-gray-900">{module.title}</h5>
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

              {/* Contenido del módulo */}
              {expandedModules.has(module.id) && (
                <div className="border-t border-gray-200">
                  <div className="p-4 space-y-2">
                    {module.videos.map((videoUrl, index) => {
                      const videoId = extractVideoId(videoUrl);
                      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                      
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleVideoPreview(videoUrl, `Video ${index + 1}`)}
                        >
                          <div className="flex-shrink-0">
                            <Play className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h6 className="text-sm font-medium text-gray-900 truncate">
                              Video {index + 1} - {module.title}
                            </h6>
                            <p className="text-xs text-gray-500 truncate">
                              {videoUrl}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>0:00</span>
                            {isDraft && (
                              <Lock className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No hay videos agregados</h4>
          <p className="text-gray-500">
            {isDraft 
              ? 'Agrega videos a tu curso para ver el contenido aquí'
              : 'Este curso no tiene contenido de video disponible'
            }
          </p>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <VideoPreview
          videoUrl={previewVideo.videoUrl}
          thumbnailUrl={previewVideo.thumbnailUrl}
          title={previewVideo.title}
          duration={previewVideo.duration}
          isVisible={!!previewVideo}
          onClose={closeVideoPreview}
        />
      )}
    </div>
  );
};

export default CoursePreview;
