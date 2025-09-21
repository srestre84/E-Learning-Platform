import React, { useState } from 'react';
import { PlusIcon, TrashIcon, PlayIcon, DocumentTextIcon, BookOpenIcon, ArrowUpIcon, ArrowDownIcon, BarsArrowUpIcon } from '@heroicons/react/24/solid';
import { CATEGORIES, COURSE_LEVELS, getCategoryMapping } from '@/services/categoryService';
import { createCourse, updateCourse } from '@/services/courseService';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import CourseModuleSelector from '@/shared/components/CourseModuleSelector';
import { 
  COURSE_STATUS, 
  COURSE_TYPES, 
  COURSE_LEVELS as COURSE_LEVELS_CONST,
  DEFAULT_COURSE_CONFIG,
  isCourseFree
} from '@/shared/constants/courseConstants';
import CourseBadges from '@/shared/components/CourseBadges';

const CreateCourseSimple = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: DEFAULT_COURSE_CONFIG.price,
    level: DEFAULT_COURSE_CONFIG.level.toLowerCase(),
    courseType: DEFAULT_COURSE_CONFIG.courseType,
    status: DEFAULT_COURSE_CONFIG.status,
    categoryId: '',
    subcategoryId: '',
    estimatedHours: 0,
    thumbnailUrl: '',
    courseUrl: '',
    isPublished: DEFAULT_COURSE_CONFIG.isPublished,
    isActive: DEFAULT_COURSE_CONFIG.isActive,
    modules: [
      {
        id: 1,
        title: 'Módulo 1',
        description: '',
        lessons: []
      }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedExistingCourse, setSelectedExistingCourse] = useState(null);
  const [selectedExistingModule, setSelectedExistingModule] = useState(null);
  const [showModuleSelector, setShowModuleSelector] = useState(false);

  // Función para generar URL del curso basada en el título
  const generateCourseUrl = (title) => {
    if (!title) return '';
    
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
      .trim()
      .substring(0, 50); // Limitar a 50 caracteres
  };

  // Generar URL automáticamente cuando cambie el título
  React.useEffect(() => {
    if (formData.title && !formData.courseUrl) {
      const generatedUrl = generateCourseUrl(formData.title);
      setFormData(prev => ({ ...prev, courseUrl: generatedUrl }));
    }
  }, [formData.title, formData.courseUrl]);

  // Cargar datos del curso en modo edición
  React.useEffect(() => {
    if (isEditMode && id) {
      const loadCourseData = async () => {
        try {
          setLoading(true);
          const courseData = await updateCourse(id, {});
          // Aquí cargarías los datos del curso para edición
          console.log('Cargando datos del curso para edición:', courseData);
        } catch (err) {
          console.error('Error al cargar curso para edición:', err);
          setError('Error al cargar el curso para edición');
        } finally {
          setLoading(false);
        }
      };
      loadCourseData();
    }
  }, [isEditMode, id]);

  const addModule = () => {
    const newModule = {
      id: formData.modules.length + 1,
      title: `Módulo ${formData.modules.length + 1}`,
      description: '',
      lessons: []
    };
    setFormData({
      ...formData,
      modules: [...formData.modules, newModule]
    });
  };

  const addLesson = (moduleIndex, type) => {
    const newLesson = {
      id: Date.now(),
      title: '',
      type: type,
      video: type === 'video' ? { url: '', duration: 0 } : null,
      content: type === 'text' ? '' : null
    };

    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].lessons.push(newLesson);
    
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };

  const updateModule = (index, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[index][field] = value;
    setFormData({ ...formData, modules: updatedModules });
  };

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...formData.modules];
    if (field === 'video') {
      updatedModules[moduleIndex].lessons[lessonIndex].video = {
        ...updatedModules[moduleIndex].lessons[lessonIndex].video,
        ...value
      };
    } else {
      updatedModules[moduleIndex].lessons[lessonIndex][field] = value;
    }
    setFormData({ ...formData, modules: updatedModules });
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].lessons.splice(lessonIndex, 1);
    setFormData({ ...formData, modules: updatedModules });
  };

  // Función para ordenar lecciones por número de videos
  const sortLessonsByVideoCount = (moduleIndex) => {
    const updatedModules = [...formData.modules];
    const module = updatedModules[moduleIndex];
    
    // Contar videos por lección y ordenar
    const sortedLessons = [...module.lessons].sort((a, b) => {
      const aVideoCount = a.type === 'video' && a.video?.url ? 1 : 0;
      const bVideoCount = b.type === 'video' && b.video?.url ? 1 : 0;
      
      // Ordenar por número de videos (descendente) y luego por título
      if (aVideoCount !== bVideoCount) {
        return bVideoCount - aVideoCount;
      }
      return a.title.localeCompare(b.title);
    });
    
    updatedModules[moduleIndex] = { ...module, lessons: sortedLessons };
    setFormData({ ...formData, modules: updatedModules });
    toast.success('Lecciones ordenadas por número de videos');
  };

  // Función para mover lección hacia arriba
  const moveLessonUp = (moduleIndex, lessonIndex) => {
    if (lessonIndex === 0) return;
    
    const updatedModules = [...formData.modules];
    const module = updatedModules[moduleIndex];
    const lessons = [...module.lessons];
    
    // Intercambiar con la lección anterior
    [lessons[lessonIndex - 1], lessons[lessonIndex]] = [lessons[lessonIndex], lessons[lessonIndex - 1]];
    
    updatedModules[moduleIndex] = { ...module, lessons };
    setFormData({ ...formData, modules: updatedModules });
  };

  // Función para mover lección hacia abajo
  const moveLessonDown = (moduleIndex, lessonIndex) => {
    const updatedModules = [...formData.modules];
    const module = updatedModules[moduleIndex];
    
    if (lessonIndex === module.lessons.length - 1) return;
    
    const lessons = [...module.lessons];
    
    // Intercambiar con la lección siguiente
    [lessons[lessonIndex], lessons[lessonIndex + 1]] = [lessons[lessonIndex + 1], lessons[lessonIndex]];
    
    updatedModules[moduleIndex] = { ...module, lessons };
    setFormData({ ...formData, modules: updatedModules });
  };

  // Función para obtener el número de videos en una lección
  const getVideoCount = (lesson) => {
    return lesson.type === 'video' && lesson.video?.url ? 1 : 0;
  };

  // Función para manejar el cambio de tipo de curso
  const handleCourseTypeChange = (newCourseType) => {
    const updatedFormData = { ...formData, courseType: newCourseType };
    
    // Si cambia a FREE, establecer precio en 0
    if (newCourseType === COURSE_TYPES.FREE) {
      updatedFormData.price = 0;
    }
    
    // Si cambia a PREMIUM y el precio es 0, establecer un precio por defecto
    if (newCourseType === COURSE_TYPES.PREMIUM && updatedFormData.price === 0) {
      updatedFormData.price = 29.99;
    }
    
    setFormData(updatedFormData);
  };

  // Función para manejar el cambio de precio
  const handlePriceChange = (newPrice) => {
    const price = parseFloat(newPrice) || 0;
    const updatedFormData = { ...formData, price };
    
    // Actualizar el tipo de curso basado en el precio
    if (price === 0) {
      updatedFormData.courseType = COURSE_TYPES.FREE;
    } else {
      updatedFormData.courseType = COURSE_TYPES.PREMIUM;
    }
    
    setFormData(updatedFormData);
  };

  // Manejar selección de módulo existente
  const handleModuleSelect = (course, module) => {
    setSelectedExistingCourse(course);
    setSelectedExistingModule(module);
  };

  // Manejar añadir contenido al módulo existente
  const handleAddToExistingModule = (course, module) => {
    if (!course || !module) return;

    // Crear un nuevo módulo en el formulario que represente el módulo existente
    const existingModule = {
      id: `existing-${module.id}`,
      title: `${module.title} (${course.title})`,
      description: `Contenido adicional para: ${module.description || module.title}`,
      isExisting: true,
      existingCourseId: course.id,
      existingModuleId: module.id,
      lessons: []
    };

    // Agregar el módulo existente al formulario
    setFormData({
      ...formData,
      modules: [...formData.modules, existingModule]
    });

    setShowModuleSelector(false);
    toast.success(`Módulo "${module.title}" añadido al formulario`);
  };

  // Remover módulo existente
  const removeExistingModule = (moduleIndex) => {
    const updatedModules = formData.modules.filter((_, index) => index !== moduleIndex);
    setFormData({ ...formData, modules: updatedModules });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validar campos requeridos
      if (!formData.title || !formData.description || !formData.shortDescription) {
        throw new Error('Por favor completa todos los campos requeridos');
      }

      if (!formData.categoryId || !formData.subcategoryId) {
        throw new Error('Por favor selecciona una categoría y subcategoría');
      }

      // Validar URL de thumbnail si se proporciona
      if (formData.thumbnailUrl) {
        const imageUrlPattern = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
        if (!imageUrlPattern.test(formData.thumbnailUrl)) {
          throw new Error('La URL de miniatura debe ser una imagen válida (jpg, jpeg, png, gif, webp, svg)');
        }
      }

      // Validación de URL del curso temporalmente deshabilitada
      // if (!formData.courseUrl) {
      //   throw new Error('Por favor ingresa una URL para el curso');
      // }

      // Validar formato de URL del curso
      // const urlPattern = /^[a-z0-9-]+$/;
      // if (!urlPattern.test(formData.courseUrl)) {
      //   throw new Error('La URL del curso solo puede contener letras minúsculas, números y guiones');
      // }

      // Preparar datos para el backend
      const { categoryId, subcategoryId } = getCategoryMapping(formData.categoryId, formData.subcategoryId);
      
      // Obtener el instructorId del usuario autenticado
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const instructorId = user.id;

      console.log('🔍 Debug - Usuario del localStorage:', user);
      console.log('🔍 Debug - instructorId:', instructorId);

      if (!instructorId) {
        console.error('❌ No se encontró instructorId en el usuario:', user);
        throw new Error('No se pudo obtener el ID del instructor. Por favor, inicia sesión nuevamente.');
      }

      const courseData = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: formData.price,
        level: formData.level.toUpperCase(),
        courseType: formData.courseType,
        status: formData.status,
        categoryId: categoryId,
        subcategoryId: subcategoryId,
        estimatedHours: formData.estimatedHours,
        thumbnailUrl: formData.thumbnailUrl || null, // Permitir null si no se proporciona
        instructorId: instructorId, // Agregar el ID del instructor
        isPublished: formData.isPublished,
        isActive: formData.isActive,
        modules: formData.modules.map(module => ({
          title: module.title,
          description: module.description,
          isExisting: module.isExisting || false,
          existingCourseId: module.existingCourseId || null,
          existingModuleId: module.existingModuleId || null,
          lessons: module.lessons.map(lesson => ({
            title: lesson.title,
            type: lesson.type.toUpperCase(),
            youtubeUrl: lesson.type === 'video' ? lesson.video?.url : null,
            durationSeconds: lesson.type === 'video' ? (lesson.video?.duration || 0) * 60 : 0,
            content: lesson.type === 'text' ? lesson.content : null
          }))
        }))
      };

      console.log('📤 Datos del curso preparados:', courseData);
      console.log('📤 instructorId en courseData:', courseData.instructorId);

      let result;
      if (isEditMode) {
        result = await updateCourse(id, courseData);
        toast.success('Curso actualizado exitosamente!');
      } else {
        result = await createCourse(courseData);
        toast.success('Curso creado exitosamente!');
      }

      // Redirigir al detalle del curso
      navigate(`/teacher/dashboard/courses/${result.id}`);
    } catch (err) {
      console.error('Error al guardar el curso:', err);
      setError(err.message || 'Error al guardar el curso');
      toast.error(err.message || 'Error al guardar el curso');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando curso para edición...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? 'Editar Curso' : 'Crear Nuevo Curso'}
      </h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información Básica */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Información Básica</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Título del Curso *
              </label>
              <input
                id="courseTitle"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Introducción a React"
                required
              />
            </div>
            
            <div>
              <label htmlFor="courseType" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Curso *
              </label>
              <select
                id="courseType"
                value={formData.courseType}
                onChange={(e) => handleCourseTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={COURSE_TYPES.FREE}>🆓 Gratis</option>
                <option value={COURSE_TYPES.PREMIUM}>💎 Premium</option>
                <option value={COURSE_TYPES.SUBSCRIPTION}>🔄 Suscripción</option>
                <option value={COURSE_TYPES.BUNDLE}>📦 Paquete</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="coursePrice" className="block text-sm font-medium text-gray-700 mb-2">
                Precio (USD) *
              </label>
              <input
                id="coursePrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handlePriceChange(e.target.value)}
                disabled={formData.courseType === COURSE_TYPES.FREE}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.courseType === COURSE_TYPES.FREE ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="0.00"
                required
              />
              {formData.courseType === COURSE_TYPES.FREE && (
                <p className="mt-1 text-sm text-gray-500">Los cursos gratis no tienen costo</p>
              )}
            </div>
            
            <div>
              <label htmlFor="courseStatus" className="block text-sm font-medium text-gray-700 mb-2">
                Estado del Curso *
              </label>
              <select
                id="courseStatus"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={COURSE_STATUS.DRAFT}>📝 Borrador</option>
                <option value={COURSE_STATUS.PUBLISHED}>✅ Publicado</option>
                <option value={COURSE_STATUS.ARCHIVED}>📁 Archivado</option>
                <option value={COURSE_STATUS.SUSPENDED}>⏸️ Suspendido</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="courseLevel" className="block text-sm font-medium text-gray-700 mb-2">
                Nivel *
              </label>
              <select
                id="courseLevel"
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {COURSE_LEVELS.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="courseHours" className="block text-sm font-medium text-gray-700 mb-2">
                Duración Estimada (horas) *
              </label>
              <input
                id="courseHours"
                type="number"
                min="1"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({...formData, estimatedHours: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="courseCategory" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                id="courseCategory"
                value={formData.categoryId}
                onChange={(e) => setFormData({
                  ...formData, 
                  categoryId: e.target.value,
                  subcategoryId: '' // Reset subcategory when category changes
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="courseSubcategory" className="block text-sm font-medium text-gray-700 mb-2">
                Subcategoría *
              </label>
              <select
                id="courseSubcategory"
                value={formData.subcategoryId}
                onChange={(e) => setFormData({...formData, subcategoryId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.categoryId}
                required
              >
                <option value="">Selecciona una subcategoría</option>
                {formData.categoryId && CATEGORIES
                  .find(cat => cat.id === formData.categoryId)
                  ?.subcategories.map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <label htmlFor="courseShortDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción Corta *
            </label>
            <input
              id="courseShortDescription"
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Una descripción breve del curso"
              required
            />
          </div>
          
          <div className="mt-6">
            <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción Completa *
            </label>
            <textarea
              id="courseDescription"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Describe detalladamente el contenido del curso"
              required
            />
          </div>
          
          <div className="mt-6">
            <label htmlFor="courseUrl" className="block text-sm font-medium text-gray-700 mb-2">
              URL del Curso en la Plataforma *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                {window.location.origin}/curso/
              </span>
              <input
                id="courseUrl"
                type="text"
                value={formData.courseUrl}
                onChange={(e) => setFormData({...formData, courseUrl: e.target.value})}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="introduccion-a-react"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              URL única para que los estudiantes accedan a tu curso en la plataforma. Se genera automáticamente basada en el título.
            </p>
          </div>
          
          <div className="mt-6">
            <label htmlFor="courseThumbnail" className="block text-sm font-medium text-gray-700 mb-2">
              URL de Miniatura (Opcional)
            </label>
            <input
              id="courseThumbnail"
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({...formData, thumbnailUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <p className="mt-1 text-sm text-gray-500">
              Debe ser una imagen válida (jpg, jpeg, png, gif, webp, svg). Si no se proporciona, se usará una imagen por defecto.
            </p>
          </div>
          
          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
              Publicar curso inmediatamente
            </label>
          </div>
          
          {/* Vista previa de badges */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Vista previa del curso:</h3>
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm text-gray-600">Badges que verán los estudiantes:</p>
                <CourseBadges 
                  course={formData} 
                  showStatus={true}
                  showType={true}
                  showLevel={true}
                  showPrice={true}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>

              {/* Módulos y Lecciones */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Contenido del Curso</h2>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowModuleSelector(!showModuleSelector)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <BookOpenIcon className="h-4 w-4 mr-2" />
                      Añadir a Módulo Existente
                    </button>
                    <button
                      type="button"
                      onClick={addModule}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Crear Nuevo Módulo
                    </button>
                  </div>
                </div>

                {/* Selector de módulos existentes */}
                {showModuleSelector && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                    <CourseModuleSelector
                      onSelectModule={handleModuleSelect}
                      onAddToModule={handleAddToExistingModule}
                      className="mb-4"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowModuleSelector(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

          <div className="space-y-6">
            {formData.modules.map((module, moduleIndex) => (
              <div key={module.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                        className="flex-1 text-lg font-semibold bg-transparent border-b border-transparent focus:border-gray-400 focus:outline-none"
                        placeholder="Título del módulo"
                      />
                      {module.isExisting && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Módulo Existente
                        </span>
                      )}
                    </div>
                    
                    {/* Botón de ordenamiento por videos */}
                    {module.lessons.length > 1 && (
                      <div className="flex items-center space-x-2 mb-2">
                        <button
                          type="button"
                          onClick={() => sortLessonsByVideoCount(moduleIndex)}
                          className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                          title="Ordenar lecciones por número de videos"
                        >
                          <BarsArrowUpIcon className="h-3 w-3 mr-1" />
                          Ordenar por Videos
                        </button>
                        <span className="text-xs text-gray-500">
                          {module.lessons.filter(lesson => lesson.type === 'video' && lesson.video?.url).length} videos
                        </span>
                      </div>
                    )}
                    <textarea
                      value={module.description}
                      onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                      className="w-full mt-2 text-sm text-gray-600 bg-transparent border-none focus:outline-none"
                      placeholder="Descripción del módulo"
                      rows="2"
                    />
                    {module.isExisting && (
                      <div className="mt-2 text-xs text-blue-600">
                        <strong>Curso:</strong> {module.existingCourseId} | <strong>Módulo:</strong> {module.existingModuleId}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (module.isExisting) {
                        removeExistingModule(moduleIndex);
                      } else {
                        const updatedModules = formData.modules.filter((_, i) => i !== moduleIndex);
                        setFormData({...formData, modules: updatedModules});
                      }
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Lecciones del módulo */}
                <div className="space-y-3">
                  {/* Encabezado de ordenamiento */}
                  {module.lessons.length > 0 && (
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2 px-2">
                      <span>Orden de las lecciones:</span>
                      <span className="flex items-center space-x-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {module.lessons.filter(lesson => lesson.type === 'video' && lesson.video?.url).length} videos
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {module.lessons.filter(lesson => lesson.type === 'text').length} textos
                        </span>
                      </span>
                    </div>
                  )}
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson.id} className="bg-white rounded p-3 border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center flex-1">
                          {/* Número de orden */}
                          <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                            {lessonIndex + 1}
                          </span>
                          
                          {lesson.type === 'video' ? (
                            <PlayIcon className="h-4 w-4 text-blue-500 mr-2" />
                          ) : (
                            <DocumentTextIcon className="h-4 w-4 text-green-500 mr-2" />
                          )}
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                            className="flex-1 font-medium bg-transparent border-b border-transparent focus:border-gray-400 focus:outline-none"
                            placeholder="Título de la lección"
                          />
                          {/* Indicador de número de videos */}
                          {lesson.type === 'video' && lesson.video?.url && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              1 video
                            </span>
                          )}
                        </div>
                        
                        {/* Controles de movimiento y eliminación */}
                        <div className="flex items-center space-x-1">
                          {/* Botón subir */}
                          <button
                            type="button"
                            onClick={() => moveLessonUp(moduleIndex, lessonIndex)}
                            disabled={lessonIndex === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Mover hacia arriba"
                          >
                            <ArrowUpIcon className="h-4 w-4" />
                          </button>
                          
                          {/* Botón bajar */}
                          <button
                            type="button"
                            onClick={() => moveLessonDown(moduleIndex, lessonIndex)}
                            disabled={lessonIndex === module.lessons.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Mover hacia abajo"
                          >
                            <ArrowDownIcon className="h-4 w-4" />
                          </button>
                          
                          {/* Botón eliminar */}
                          <button
                            type="button"
                            onClick={() => removeLesson(moduleIndex, lessonIndex)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Eliminar lección"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {lesson.type === 'video' && (
                        <div className="space-y-2">
                          <input
                            type="url"
                            value={lesson.video?.url || ''}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'video', {url: e.target.value})}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="URL del video (YouTube, Vimeo, etc.)"
                          />
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              min="0"
                              value={lesson.video?.duration || ''}
                              onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'video', {duration: parseInt(e.target.value) || 0})}
                              className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Min"
                            />
                            <span className="text-sm text-gray-500 self-center">minutos</span>
                          </div>
                        </div>
                      )}

                      {lesson.type === 'text' && (
                        <textarea
                          value={lesson.content || ''}
                          onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'content', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Contenido de la lección"
                          rows="3"
                        />
                      )}
                    </div>
                  ))}

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => addLesson(moduleIndex, 'video')}
                      className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      <PlayIcon className="h-4 w-4 mr-1" />
                      Video
                    </button>
                    <button
                      type="button"
                      onClick={() => addLesson(moduleIndex, 'text')}
                      className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-1" />
                      Texto
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/teacher/dashboard/courses')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {(() => {
              if (loading) {
                return (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditMode ? 'Actualizando...' : 'Creando...'}
                  </div>
                );
              }
              return isEditMode ? 'Actualizar Curso' : 'Crear Curso';
            })()}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourseSimple;
