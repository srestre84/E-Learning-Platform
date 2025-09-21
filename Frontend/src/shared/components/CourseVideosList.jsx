import React, { useState, useEffect } from 'react';
import { Play, Clock, CheckCircle, Lock, Eye, ExternalLink } from 'lucide-react';
import PropTypes from 'prop-types';
import { getCourseVideos } from '@/services/courseVideoService';
import { getCategoryById, getSubcategoryById } from '@/services/categoryService';

const CourseVideosList = ({ 
  course, 
  isEnrolled = false, 
  onVideoClick,
  className = "" 
}) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('order'); // order, title, duration

  // Cargar videos del curso
  useEffect(() => {
    const loadCourseVideos = async () => {
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
        
        // Obtener todos los videos del curso
        const courseVideos = await getCourseVideos(course.id);
        console.log('Videos obtenidos para el curso:', course.id, courseVideos);
        setVideos(courseVideos);
        
      } catch (err) {
        console.error('Error al cargar videos del curso:', err);
        setError('Error al cargar los videos del curso');
      } finally {
        setLoading(false);
      }
    };

    loadCourseVideos();
  }, [course?.id, course?.categoryId, course?.subcategoryId]);

  // Filtrar y ordenar videos
  const filteredAndSortedVideos = videos
    .filter(video => 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.moduleTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'duration':
          return (b.durationSeconds || 0) - (a.durationSeconds || 0);
        case 'order':
        default:
          return (a.orderIndex || 0) - (b.orderIndex || 0);
      }
    });

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
            {[1, 2, 3, 4, 5].map(i => (
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
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-400 text-6xl mb-4">🎬</div>
        <p className="text-gray-600">No hay videos disponibles para este curso</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header con información */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Videos del Curso
          </h3>
          <p className="text-sm text-gray-600">
            {videos.length} video{videos.length !== 1 ? 's' : ''} disponible{videos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Eye className="w-4 h-4" />
          <span>Vista de lista</span>
        </div>
      </div>

      {/* Información de categoría */}
      {categoryInfo && (
        <div className="flex items-center space-x-2 text-sm mb-4">
          <span className="text-blue-600 font-medium">
            {categoryInfo.category}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">
            {categoryInfo.subcategory}
          </span>
        </div>
      )}

      {/* Controles de búsqueda y ordenamiento */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="order">Orden original</option>
            <option value="title">Título</option>
            <option value="duration">Duración</option>
          </select>
        </div>
      </div>

      {/* Lista de videos */}
      <div className="space-y-2">
        {filteredAndSortedVideos.map((video, index) => (
          <div 
            key={video.id}
            className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
              !isEnrolled ? 'opacity-60' : 'cursor-pointer'
            }`}
            onClick={() => isEnrolled && handleVideoClick(video)}
          >
            <div className="flex items-center space-x-4">
              {/* Número de orden */}
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                {index + 1}
              </div>

              {/* Thumbnail del video */}
              <div className="flex-shrink-0 w-20 h-12 bg-gray-200 rounded overflow-hidden">
                {video.youtubeVideoId ? (
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeVideoId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <Play className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Información del video */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {video.title}
                    </h4>
                    {video.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    {video.moduleTitle && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {video.moduleTitle}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Información adicional */}
                  <div className="flex items-center space-x-3 ml-4">
                    {/* Estado del video */}
                    <div className="flex-shrink-0">
                      {video.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : !isEnrolled ? (
                        <Lock className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Play className="w-5 h-5 text-blue-500" />
                      )}
                    </div>

                    {/* Duración */}
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{formatDuration(video.durationSeconds || 0)}</span>
                    </div>

                    {/* Botón de acción */}
                    {isEnrolled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVideoClick(video);
                        }}
                        className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Ver
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Información de resultados */}
      {searchTerm && (
        <div className="text-center text-sm text-gray-500 py-4">
          {filteredAndSortedVideos.length} de {videos.length} videos encontrados
        </div>
      )}
    </div>
  );
};

CourseVideosList.propTypes = {
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

export default CourseVideosList;
