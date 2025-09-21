import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Users, 
  BookOpen, 
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { getCourseById } from '@/services/courseService';
import { getCourseVideos, getCourseModules } from '@/services/courseVideoService';
import { getCategoryById, getSubcategoryById } from '@/services/categoryService';
import { enrollInCourse, checkEnrollment } from '@/services/enrollmentService';
import CourseContentModules from '@/shared/components/CourseContentModules';
import CourseVideosList from '@/shared/components/CourseVideosList';
import VideoPreview from '@/shared/components/VideoPreview';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/useAuth';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [modules, setModules] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('content'); // 'content' o 'videos'

  // Cargar datos del curso
  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const courseData = await getCourseById(id);
        console.log('Curso cargado:', courseData);
        setCourse(courseData);
        
        // Cargar información de categoría
        if (courseData.categoryId && courseData.subcategoryId) {
          const category = getCategoryById(courseData.categoryId);
          const subcategory = getSubcategoryById(courseData.categoryId, courseData.subcategoryId);
          
          if (category && subcategory) {
            setCategoryInfo({
              category: category.name,
              subcategory: subcategory.name
            });
          }
        }
        
        // Cargar videos del curso
        const courseVideos = await getCourseVideos(id);
        console.log('Videos del curso:', courseVideos);
        
        // Cargar módulos del curso
        const courseModules = await getCourseModules(id);
        console.log('Módulos del curso:', courseModules);
        setModules(courseModules);
        
        // Verificar si el usuario está inscrito (solo si está autenticado)
        if (isAuthenticated) {
          try {
            const enrollment = await checkEnrollment(id);
            console.log('Estado de inscripción:', enrollment);
            setIsEnrolled(enrollment.isEnrolled);
          } catch (enrollmentError) {
            console.warn('Error al verificar inscripción:', enrollmentError);
            setIsEnrolled(false);
          }
        } else {
          setIsEnrolled(false);
        }
        
      } catch (err) {
        console.error('Error al cargar el curso:', err);
        setError('Error al cargar el curso. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  // Manejar preview de video
  const handleVideoPreview = (video) => {
    setPreviewVideo({
      videoUrl: video.youtubeUrl,
      thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeVideoId}/maxresdefault.jpg`,
      title: video.title,
      duration: video.durationSeconds
    });
  };

  // Cerrar preview
  const closeVideoPreview = () => {
    setPreviewVideo(null);
  };

  // Manejar inscripción
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para inscribirte en el curso');
      navigate('/authentication/login');
      return;
    }

    if (isEnrolled) {
      toast.info('Ya estás inscrito en este curso');
      return;
    }
    
    try {
      setEnrolling(true);
      
      // Mostrar notificación de carga
      toast.loading('Inscribiéndote en el curso...', {
        id: 'enrollment-loading',
        duration: 0,
      });

      // Realizar la inscripción
      await enrollInCourse(id);
      
      // Cerrar notificación de carga
      toast.dismiss('enrollment-loading');
      
      // Mostrar éxito
      toast.success('¡Inscripción exitosa!', {
        description: 'Ya puedes acceder al contenido del curso',
        duration: 4000,
      });

      // Actualizar estado
      setIsEnrolled(true);

      // Redirigir al contenido del curso después de un breve delay
      setTimeout(() => {
        navigate(`/curso/${id}/content`);
      }, 1500);

    } catch (error) {
      console.error('Error al inscribirse:', error);
      
      // Cerrar notificación de carga
      toast.dismiss('enrollment-loading');
      
      // Mostrar error
      toast.error('Error al inscribirse', {
        description: error.message || 'No se pudo completar la inscripción. Intenta más tarde.',
        duration: 4000,
      });
    } finally {
      setEnrolling(false);
    }
  };

  // Formatear precio
  const formatPrice = (price) => {
    if (price === 0) return 'Gratis';
    return `$${price.toFixed(2)}`;
  };

  // Formatear duración total
  const formatTotalDuration = () => {
    const totalSeconds = modules.reduce((total, module) => {
      return total + (module.lessons || []).reduce((moduleTotal, lesson) => {
        return moduleTotal + (lesson.durationSeconds || 0);
      }, 0);
    }, 0);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar el curso</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/cursos')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Cursos
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Curso no encontrado</h2>
          <p className="text-gray-600 mb-6">El curso que buscas no existe o ha sido eliminado</p>
          <button
            onClick={() => navigate('/cursos')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cursos')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a Cursos
          </button>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            {categoryInfo ? (
              <>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {categoryInfo.category}
                </span>
                <span>•</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                  {categoryInfo.subcategory}
                </span>
                <span>•</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  {course.level || 'Principiante'}
                </span>
              </>
            ) : (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                {course.level || 'Principiante'}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video principal */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-video bg-gray-900 relative">
                {(() => {
                  if (course.thumbnailUrl) {
                    return (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    );
                  }
                  
                  // Buscar el primer video en los módulos
                  const firstVideo = modules.find(module => 
                    module.lessons && module.lessons.length > 0
                  )?.lessons?.find(lesson => 
                    lesson.type === 'VIDEO' && lesson.youtubeUrl
                  );
                  
                  if (firstVideo) {
                    const videoId = firstVideo.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1];
                    return (
                      <img
                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        alt={firstVideo.title}
                        className="w-full h-full object-cover"
                      />
                    );
                  }
                  
                  return (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Play className="w-16 h-16 text-white opacity-50" />
                    </div>
                  );
                })()}
                
                {/* Overlay con botón de play */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <button
                    onClick={() => {
                      const firstVideo = modules.find(module => 
                        module.lessons && module.lessons.length > 0
                      )?.lessons?.find(lesson => 
                        lesson.type === 'VIDEO' && lesson.youtubeUrl
                      );
                      
                      if (firstVideo) {
                        handleVideoPreview({
                          youtubeUrl: firstVideo.youtubeUrl,
                          title: firstVideo.title,
                          durationSeconds: firstVideo.durationSeconds
                        });
                      }
                    }}
                    className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all transform hover:scale-110"
                    disabled={!modules.some(module => 
                      module.lessons && module.lessons.some(lesson => 
                        lesson.type === 'VIDEO' && lesson.youtubeUrl
                      )
                    )}
                  >
                    <Play className="w-8 h-8 text-blue-600 fill-current" />
                  </button>
                </div>
              </div>
            </div>

            {/* Información del curso */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{formatTotalDuration()}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>{modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} lecciones</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{course.enrollments?.length ?? 0} estudiantes</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">
                  {course.description || course.shortDescription}
                </p>
              </div>
            </div>

            {/* Contenido del curso */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Pestañas */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'content'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Contenido por Módulos
                  </button>
                  <button
                    onClick={() => setActiveTab('videos')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'videos'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Todos los Videos
                  </button>
                </nav>
              </div>

              {/* Contenido de las pestañas */}
              <div className="p-6">
                {activeTab === 'content' ? (
                  <CourseContentModules
                    course={course}
                    isEnrolled={isEnrolled}
                    onVideoClick={handleVideoPreview}
                  />
                ) : (
                  <CourseVideosList
                    course={course}
                    isEnrolled={isEnrolled}
                    onVideoClick={handleVideoPreview}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de inscripción */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatPrice(course.price)}
                </div>
                {course.price > 0 && (
                  <div className="text-sm text-gray-500">
                    Pago único • Acceso de por vida
                  </div>
                )}
              </div>

              <button
                onClick={handleEnroll}
                className={(() => {
                  if (isEnrolled) return 'w-full py-3 px-4 rounded-lg font-medium transition-colors bg-green-100 text-green-800 cursor-not-allowed';
                  if (enrolling) return 'w-full py-3 px-4 rounded-lg font-medium transition-colors bg-blue-400 text-white cursor-not-allowed';
                  return 'w-full py-3 px-4 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700';
                })()}
                disabled={isEnrolled || enrolling}
              >
                {(() => {
                  if (isEnrolled) {
                    return (
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Inscrito
                      </div>
                    );
                  }
                  if (enrolling) {
                    return (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Inscribiendo...
                      </div>
                    );
                  }
                  return 'Inscribirse al Curso';
                })()}
              </button>

              {isEnrolled && (
                <div className="mt-4">
                  <button
                    onClick={() => navigate(`/curso/${id}/content`)}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <div className="flex items-center justify-center">
                      <Play className="w-4 h-4 mr-2" />
                      Acceder al Curso
                    </div>
                  </button>
                </div>
              )}

              {!isEnrolled && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Incluye acceso a todas las lecciones y materiales
                  </p>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">¿Qué incluye?</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  Acceso de por vida
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  Certificado de finalización
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  Materiales descargables
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  Soporte del instructor
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

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

export default CourseDetailPage;
