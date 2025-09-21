import React, { useState, useEffect } from 'react';
import { Play, Clock, Eye, ExternalLink, Tag } from 'lucide-react';
import PropTypes from 'prop-types';
import { getCourseVideos } from '@/services/courseVideoService';
import { getCategoryById, getSubcategoryById } from '@/services/categoryService';

const CourseCardHover = ({ 
  course, 
  onPreview, 
  onEnroll,
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(false);
  const [categoryInfo, setCategoryInfo] = useState(null);

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

  // Cargar thumbnail del primer video del curso y información de categoría
  useEffect(() => {
    const loadCourseInfo = async () => {
      if (!course?.id) return;
      
      try {
        setIsLoadingThumbnail(true);
        
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
        
        // Intentar obtener videos del curso usando el servicio
        const videos = await getCourseVideos(course.id);
        console.log('Videos obtenidos para el curso:', course.id, videos);
        
        if (videos && videos.length > 0) {
          const firstVideo = videos[0];
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
        }
      } catch (error) {
        console.error('Error al cargar información del curso:', error);
        // Si hay error, no establecer videoThumbnail para usar la imagen por defecto
      } finally {
        setIsLoadingThumbnail(false);
      }
    };

    loadCourseInfo();
  }, [course.id, course.categoryId, course.subcategoryId]);

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
    onPreview?.(course, videoThumbnail);
  };

  // Manejar inscripción
  const handleEnroll = (e) => {
    e.stopPropagation();
    onEnroll?.(course);
  };

  return (
    <div
      className={`relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group w-full text-left ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPreview?.(course, videoThumbnail)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPreview?.(course, videoThumbnail);
        }
      }}
    >
      {/* Imagen del curso con efectos */}
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

          {/* Overlay de hover con efecto de brillo */}
          <div className={`absolute inset-0 transition-all duration-300 ${
            isHovered ? 'opacity-40' : 'opacity-0'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Botón de play animado */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
          }`}>
            <div className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg transform transition-all duration-200 hover:scale-110 hover:bg-opacity-100">
              <Play className="w-8 h-8 text-blue-600 fill-current" />
            </div>
          </div>

          {/* Indicador de duración */}
          {videoThumbnail && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center backdrop-blur-sm">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(videoThumbnail.duration)}
            </div>
          )}

          {/* Badge de precio */}
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg">
            {formatPrice(course.price)}
          </div>

          {/* Efecto de carga */}
          {isLoadingThumbnail && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Efecto de brillo deslizante */}
          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </div>
        </div>
      </div>

      {/* Contenido del curso */}
      <div className="p-4">
        {/* Título con efecto de hover */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {course.title}
        </h3>

        {/* Descripción corta */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
          {course.shortDescription || course.description}
        </p>

        {/* Información del curso */}
        <div className="space-y-3 mb-4">
          {/* Categoría y Subcategoría */}
          {categoryInfo && (
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-blue-600 font-medium">
                {categoryInfo.category}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-600">
                {categoryInfo.subcategory}
              </span>
            </div>
          )}
          
          {/* Duración y Nivel */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center group-hover:text-blue-600 transition-colors duration-300">
                <Eye className="w-4 h-4 mr-1" />
                {course.estimatedHours || 0}h
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors duration-300">
                {course.level || 'Principiante'}
              </span>
            </div>
            <div className="flex items-center group-hover:text-blue-600 transition-colors duration-300">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-2">
          <button
            onClick={handlePreview}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium flex items-center justify-center transform hover:scale-105"
            type="button"
          >
            <Play className="w-4 h-4 mr-2" />
            Vista Previa
          </button>
          <button
            onClick={handleEnroll}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-medium transform hover:scale-105"
            type="button"
          >
            Inscribirse
          </button>
        </div>
      </div>

      {/* Efecto de borde en hover */}
      <div className={`absolute inset-0 rounded-lg border-2 border-transparent transition-all duration-300 ${
        isHovered ? 'border-blue-200' : ''
      }`} />
    </div>
  );
};

CourseCardHover.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    shortDescription: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    price: PropTypes.number.isRequired,
    level: PropTypes.string,
    estimatedHours: PropTypes.number,
    categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    subcategoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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

export default CourseCardHover;
