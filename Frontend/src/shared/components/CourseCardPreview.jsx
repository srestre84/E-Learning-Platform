import React, { useState, useRef, useEffect } from 'react';
import { Play, Clock, Eye, ExternalLink } from 'lucide-react';
import PropTypes from 'prop-types';

const CourseCardPreview = ({ 
  course, 
  onPreview, 
  onEnroll,
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(false);
  const cardRef = useRef(null);

  // Extraer video ID de YouTube URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Obtener thumbnail de YouTube
  const getYouTubeThumbnail = (videoId, quality = 'hqdefault') => {
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  };

  // Cargar thumbnail del primer video del curso
  useEffect(() => {
    const loadVideoThumbnail = async () => {
      if (!course?.modules || course.modules.length === 0) return;
      
      // Buscar el primer video en los módulos
      let firstVideo = null;
      for (const module of course.modules) {
        if (module.lessons && module.lessons.length > 0) {
          firstVideo = module.lessons.find(lesson => 
            lesson.type === 'VIDEO' && lesson.youtubeUrl
          );
          if (firstVideo) break;
        }
      }

      if (firstVideo?.youtubeUrl) {
        setIsLoadingThumbnail(true);
        const videoId = getYouTubeVideoId(firstVideo.youtubeUrl);
        if (videoId) {
          const thumbnailUrl = getYouTubeThumbnail(videoId, 'maxresdefault');
          setVideoThumbnail({
            url: thumbnailUrl,
            videoId: videoId,
            title: firstVideo.title,
            duration: firstVideo.durationSeconds || 0
          });
        }
        setIsLoadingThumbnail(false);
      }
    };

    loadVideoThumbnail();
  }, [course]);

  // Formatear duración
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  // Formatear precio
  const formatPrice = (price) => {
    if (price === 0) return 'Gratis';
    return `$${price.toFixed(2)}`;
  };

  // Manejar preview
  const handlePreview = (e) => {
    e.stopPropagation();
    if (videoThumbnail) {
      setShowPreview(true);
      onPreview?.(course, videoThumbnail);
    }
  };

  // Manejar inscripción
  const handleEnroll = (e) => {
    e.stopPropagation();
    onEnroll?.(course);
  };

  return (
    <>
      <button
        ref={cardRef}
        className={`relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group w-full text-left ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onPreview?.(course, videoThumbnail)}
        type="button"
      >
        {/* Imagen del curso con overlay */}
        <div className="relative aspect-video overflow-hidden">
          {/* Thumbnail principal */}
          <div className="relative w-full h-full">
            {(() => {
              if (course.thumbnailUrl) {
                return (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                );
              }
              
              if (videoThumbnail) {
                return (
                  <img
                    src={videoThumbnail.url}
                    alt={videoThumbnail.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                );
              }
              
              return (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white opacity-50" />
                </div>
              );
            })()}

            {/* Overlay de hover */}
            <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isHovered ? 'opacity-40' : 'opacity-0'
            }`} />

            {/* Botón de play animado */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
            }`}>
              <div className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg transform transition-transform duration-200 hover:scale-110">
                <Play className="w-8 h-8 text-blue-600 fill-current" />
              </div>
            </div>

            {/* Indicador de duración */}
            {videoThumbnail && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDuration(videoThumbnail.duration)}
              </div>
            )}

            {/* Badge de precio */}
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
              {formatPrice(course.price)}
            </div>

            {/* Efecto de carga */}
            {isLoadingThumbnail && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Contenido del curso */}
        <div className="p-4">
          {/* Título */}
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          {/* Descripción corta */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {course.shortDescription || course.description}
          </p>

          {/* Información del curso */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {course.estimatedHours || 0}h
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                {course.level || 'Principiante'}
              </span>
            </div>
            <div className="flex items-center">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-2">
            <button
              onClick={handlePreview}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
            >
              <Play className="w-4 h-4 mr-2" />
              Vista Previa
            </button>
            <button
              onClick={handleEnroll}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Inscribirse
            </button>
          </div>
        </div>

        {/* Efecto de brillo en hover */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </div>
      </button>

      {/* Modal de preview */}
      {showPreview && videoThumbnail && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoThumbnail.videoId}?autoplay=1&mute=1&controls=1&showinfo=0&rel=0`}
                title={videoThumbnail.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Info del video */}
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(videoThumbnail.duration)}
                  </span>
                  <span className="flex items-center">
                    <Play className="w-4 h-4 mr-1" />
                    Vista previa
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Presiona ESC para cerrar
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

CourseCardPreview.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    shortDescription: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    price: PropTypes.number.isRequired,
    level: PropTypes.string,
    estimatedHours: PropTypes.number,
    modules: PropTypes.arrayOf(PropTypes.shape({
      lessons: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string,
        youtubeUrl: PropTypes.string,
        title: PropTypes.string,
        durationSeconds: PropTypes.number
      }))
    }))
  }).isRequired,
  onPreview: PropTypes.func,
  onEnroll: PropTypes.func,
  className: PropTypes.string
};

export default CourseCardPreview;
