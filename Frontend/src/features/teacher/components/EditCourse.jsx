

// === VERSIÓN MEJORADA CON DISEÑO EDUPLATFORM ===
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { getCourseById, updateCourse, getCategories, getSubcategoriesByCategory } from '@/services/courseService';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import CourseBadges from '@/shared/components/CourseBadges';
import { 
  COURSE_STATUS, 
  COURSE_TYPES, 
  COURSE_LEVELS_CONST,
  DEFAULT_COURSE_CONFIG,
  isCourseFree
} from '@/shared/constants/courseConstants';
import {
  Save,
  ArrowLeft,
  Trash2,
  Upload,
  Plus,
  Minus,
  DollarSign,
  Clock,
  Tag,
  Video,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit3,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Play,
  FileText
} from 'lucide-react';

const EditCourse = () => {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const { user } = useAuth();

  // Estados
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    subcategoryId: '',
    price: DEFAULT_COURSE_CONFIG.price,
    level: DEFAULT_COURSE_CONFIG.level.toLowerCase(),
    courseType: DEFAULT_COURSE_CONFIG.courseType,
    status: DEFAULT_COURSE_CONFIG.status,
    estimatedHours: 1,
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

  // Errores de validación
  const [formErrors, setFormErrors] = useState({});

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const courseData = await getCourseById(courseId);
        const categoriesData = await getCategories();

        setFormData({
          title: courseData.title || '',
          description: courseData.description || '',
          shortDescription: courseData.shortDescription || '',
          categoryId: courseData.category?.id ? String(courseData.category.id) : '',
          subcategoryId: courseData.subcategory?.id ? String(courseData.subcategory.id) : '',
          price: courseData.price || DEFAULT_COURSE_CONFIG.price,
          level: courseData.level?.toLowerCase() || DEFAULT_COURSE_CONFIG.level.toLowerCase(),
          courseType: courseData.courseType || DEFAULT_COURSE_CONFIG.courseType,
          status: courseData.status || DEFAULT_COURSE_CONFIG.status,
          estimatedHours: courseData.estimatedHours || 1,
          thumbnailUrl: courseData.thumbnailUrl || '',
          courseUrl: courseData.courseUrl || '',
          isPublished: courseData.isPublished !== undefined ? courseData.isPublished : DEFAULT_COURSE_CONFIG.isPublished,
          isActive: courseData.isActive !== false,
          modules: courseData.modules || [
            {
              id: 1,
              title: 'Módulo 1',
              description: '',
              lessons: []
            }
          ]
        });

        setCategories(categoriesData || []);

        if (courseData.category?.id) {
          const subcategoriesData = await getSubcategoriesByCategory(courseData.category.id);
          setSubcategories(subcategoriesData || []);
        }
      } catch (err) {
        setError(err.message || 'Error al cargar el curso');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadInitialData();
    } else {
      setError('ID de curso no válido');
      setLoading(false);
    }
  }, [courseId]);

  // Manejar cambios en formulario
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'categoryId' && value) {
      loadSubcategories(value);
      setFormData(prev => ({ ...prev, subcategoryId: '' }));
    }
  };

  // Manejar cambio de tipo de curso
  const handleCourseTypeChange = (newCourseType) => {
    const updatedFormData = { ...formData, courseType: newCourseType };
    
    if (newCourseType === COURSE_TYPES.FREE) {
      updatedFormData.price = 0;
    }
    
    if (newCourseType === COURSE_TYPES.PREMIUM && updatedFormData.price === 0) {
      updatedFormData.price = 29.99;
    }
    
    setFormData(updatedFormData);
  };

  // Manejar cambio de precio
  const handlePriceChange = (newPrice) => {
    const price = parseFloat(newPrice) || 0;
    const updatedFormData = { ...formData, price };
    
    if (price === 0) {
      updatedFormData.courseType = COURSE_TYPES.FREE;
    } else {
      updatedFormData.courseType = COURSE_TYPES.PREMIUM;
    }
    
    setFormData(updatedFormData);
  };

  // Cargar subcategorías
  const loadSubcategories = async (categoryId) => {
    try {
      setLoadingSubcategories(true);
      const subcategoriesData = await getSubcategoriesByCategory(categoryId);
      setSubcategories(subcategoriesData || []);
    } catch (err) {
      console.error('Error al cargar subcategorías:', err);
      toast.error('Error al cargar subcategorías');
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Funciones para manejar módulos y lecciones (simplificadas para edición)
  const addModule = () => {
    const newModule = {
      id: Date.now(),
      title: `Módulo ${formData.modules.length + 1}`,
      description: '',
      lessons: []
    };
    setFormData(prev => ({ ...prev, modules: [...prev.modules, newModule] }));
  };

  const removeModule = (moduleIndex) => {
    if (formData.modules.length > 1) {
      const updatedModules = formData.modules.filter((_, i) => i !== moduleIndex);
      setFormData(prev => ({ ...prev, modules: updatedModules }));
    }
  };

  const updateModule = (moduleIndex, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], [field]: value };
    setFormData(prev => ({ ...prev, modules: updatedModules }));
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'El título es obligatorio';
    if (!formData.description.trim()) errors.description = 'La descripción es obligatoria';
    if (!formData.categoryId) errors.categoryId = 'La categoría es obligatoria';
    if (!formData.subcategoryId) errors.subcategoryId = 'La subcategoría es obligatoria';
    if (formData.price < 0) errors.price = 'El precio no puede ser negativo';
    if (formData.estimatedHours < 1 || formData.estimatedHours > 1000) {
      errors.estimatedHours = 'Las horas estimadas deben estar entre 1 y 1000';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    try {
      setSaving(true);

      if (!formData.categoryId || !formData.subcategoryId) {
        toast.error('Categoría y subcategoría son requeridas');
        return;
      }

      if (!user?.id) {
        toast.error('Error: Usuario no autenticado');
        return;
      }

      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        instructorId: parseInt(user.id),
        categoryId: parseInt(formData.categoryId),
        subcategoryId: parseInt(formData.subcategoryId),
        price: parseFloat(formData.price) || 0,
        level: formData.level.toUpperCase(),
        courseType: formData.courseType,
        status: formData.status,
        estimatedHours: parseInt(formData.estimatedHours) || 1,
        isPublished: Boolean(formData.isPublished),
        isActive: Boolean(formData.isActive),
        modules: formData.modules
      };

      if (formData.shortDescription && formData.shortDescription.trim()) {
        courseData.shortDescription = formData.shortDescription.trim();
      }

      if (formData.thumbnailUrl && formData.thumbnailUrl.trim()) {
        courseData.thumbnailUrl = formData.thumbnailUrl.trim();
      }

      if (formData.courseUrl && formData.courseUrl.trim()) {
        courseData.courseUrl = formData.courseUrl.trim();
      }

      await updateCourse(courseId, courseData);
      window.dispatchEvent(new CustomEvent('courseUpdated', { detail: { courseId } }));
      toast.success('Curso actualizado exitosamente');
      // Navegar de vuelta al detalle del curso y abrir la pestaña de videos
      navigate(`/teacher/courses/${courseId}?tab=videos`);
    } catch (err) {
      if (err.message && err.message.includes('Errores de validación:')) {
        toast.error(err.message);
      } else {
        toast.error(err.message || 'Error al actualizar el curso');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando curso..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/teacher/courses')}
            className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a mis cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mejorado */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <button
                onClick={() => navigate('/teacher/courses')}
                className="mr-4 p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Editar Curso</h1>
                <p className="text-gray-600 mt-1">Actualiza la información de tu curso</p>
              </div>
            </div>

            <div className="flex space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate('/teacher/courses')}
                disabled={saving}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Cancelar
              </button>

              <button
                type="submit"
                form="course-form"
                disabled={saving}
                className="flex items-center px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs de navegación */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { key: 'basic', label: 'Información Básica', icon: Edit3 },
                { key: 'media', label: 'Multimedia', icon: Video },
                { key: 'config', label: 'Configuración', icon: Tag }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === key
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <form id="course-form" onSubmit={handleSubmit} className="p-8">
            {/* Tab: Información Básica */}
            {activeTab === 'basic' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Información Básica del Curso</h2>

                  <div className="space-y-6">
                    {/* Título */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Título del Curso *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                          formErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Ej: Introducción a React para Principiantes"
                      />
                      {formErrors.title && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.title}
                        </p>
                      )}
                    </div>

                    {/* Categorías */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Categoría *
                        </label>
                        <select
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                            formErrors.categoryId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Seleccionar categoría</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.categoryId && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formErrors.categoryId}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Subcategoría *
                        </label>
                        <select
                          name="subcategoryId"
                          value={formData.subcategoryId}
                          onChange={handleChange}
                          disabled={!formData.categoryId || loadingSubcategories}
                          className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                            formErrors.subcategoryId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        >
                          <option value="">
                            {loadingSubcategories ? 'Cargando...' : 'Seleccionar subcategoría'}
                          </option>
                          {subcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                              {subcategory.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.subcategoryId && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formErrors.subcategoryId}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Descripción completa */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción Completa *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="6"
                        className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                          formErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Describe detalladamente qué aprenderán los estudiantes en este curso..."
                      />
                      {formErrors.description ? (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.description}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-gray-500">
                          Descripción detallada que se mostrará en la página del curso
                        </p>
                      )}
                    </div>

                    {/* Descripción corta */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción Corta
                      </label>
                      <textarea
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                        placeholder="Resumen breve del curso (opcional)"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Descripción breve que se mostrará en las tarjetas de curso
                      </p>
                    </div>

                    {/* Tipo de Curso y Estado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tipo de Curso
                        </label>
                        <select
                          value={formData.courseType}
                          onChange={(e) => handleCourseTypeChange(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                        >
                          {Object.entries(COURSE_TYPES).map(([key, value]) => (
                            <option key={key} value={value}>
                              {value === COURSE_TYPES.FREE ? '🆓 Gratis' : 
                               value === COURSE_TYPES.PREMIUM ? '💎 Premium' :
                               value === COURSE_TYPES.SUBSCRIPTION ? '📅 Suscripción' :
                               '📦 Paquete'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Estado del Curso
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                        >
                          {Object.entries(COURSE_STATUS).map(([key, value]) => (
                            <option key={key} value={value}>
                              {value === COURSE_STATUS.DRAFT ? '📝 Borrador' :
                               value === COURSE_STATUS.PUBLISHED ? '✅ Publicado' :
                               value === COURSE_STATUS.ARCHIVED ? '📁 Archivado' :
                               '⏸️ Suspendido'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Precio y Nivel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Precio ($)
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={(e) => handlePriceChange(e.target.value)}
                            min="0"
                            step="0.01"
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                              formErrors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                        {formErrors.price ? (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formErrors.price}
                          </p>
                        ) : (
                          <p className="mt-1 text-sm text-gray-500">
                            {isCourseFree({ price: formData.price }) ? 'Curso gratuito' : 'Curso de pago'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nivel
                        </label>
                        <select
                          name="level"
                          value={formData.level}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                        >
                          {COURSE_LEVELS_CONST.map((level) => (
                            <option key={level.id} value={level.id.toLowerCase()}>
                              {level.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Horas Estimadas */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Horas Estimadas
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          name="estimatedHours"
                          value={formData.estimatedHours}
                          onChange={handleChange}
                          min="1"
                          max="1000"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                            formErrors.estimatedHours ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="1"
                        />
                      </div>
                      {formErrors.estimatedHours && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.estimatedHours}
                        </p>
                      )}
                    </div>

                    {/* Preview de Badges */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa de Badges</h4>
                      <div className="flex flex-wrap gap-2">
                        <CourseBadges 
                          course={formData}
                          showStatus={true}
                          showType={true}
                          showLevel={true}
                          showPrice={true}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        Así se verán los badges en el catálogo y en la página del curso
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Multimedia */}
            {activeTab === 'media' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contenido Multimedia</h2>

                  {/* Imagen de portada */}
                  <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300 text-center mb-8">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Imagen de Portada</h3>
                    <p className="text-gray-600 mb-4">Funcionalidad de upload próximamente</p>
                    <p className="text-sm text-gray-500 mb-4">Por ahora, usa una URL de imagen temporal</p>

                    <input
                      type="url"
                      name="thumbnailUrl"
                      value={formData.thumbnailUrl}
                      onChange={handleChange}
                      className="w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  {/* URL del curso */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      URL del Curso (Opcional)
                    </label>
                    <input
                      type="url"
                      name="courseUrl"
                      value={formData.courseUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                      placeholder="https://ejemplo.com/curso"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      URL externa del curso si está alojado en otra plataforma
                    </p>
                  </div>

                  {/* Módulos y Lecciones */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Módulos y Lecciones</h3>
                        <p className="text-gray-600">Organiza el contenido del curso en módulos con lecciones</p>
                      </div>
                      <button
                        type="button"
                        onClick={addModule}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Módulo
                      </button>
                    </div>

                    <div className="space-y-6">
                      {formData.modules.map((module, moduleIndex) => (
                        <div key={module.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={module.title}
                                onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                                className="flex-1 text-lg font-semibold bg-transparent border-b border-transparent focus:border-gray-400 focus:outline-none"
                                placeholder="Título del módulo"
                              />
                              <textarea
                                value={module.description}
                                onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                                className="w-full mt-2 text-sm text-gray-600 bg-transparent border-none focus:outline-none"
                                placeholder="Descripción del módulo"
                                rows="2"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeModule(moduleIndex)}
                              disabled={formData.modules.length === 1}
                              className="text-red-500 hover:text-red-700 p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Lecciones del módulo */}
                          <div className="space-y-3">
                            {module.lessons && module.lessons.length > 0 ? (
                              module.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="bg-white rounded p-3 border">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                        {lessonIndex + 1}
                                      </span>
                                      <span className="font-medium">{lesson.title}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {lesson.type === 'video' ? 'Video' : 'Texto'}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-4 text-gray-500">
                                <p className="text-sm">No hay lecciones en este módulo</p>
                                <p className="text-xs">Las lecciones se gestionan desde el detalle del curso</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Configuración */}
            {activeTab === 'config' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración del Curso</h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Configuraciones */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">Opciones del Curso</h3>

                      {/* Curso Publicado */}
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                          />
                          <div className="ml-3">
                            <label className="text-sm font-medium text-gray-900">Publicar Curso</label>
                            <p className="text-xs text-gray-600">Hacer visible para los estudiantes</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          formData.isPublished ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {formData.isPublished ? 'PÚBLICO' : 'BORRADOR'}
                        </span>
                      </div>

                      {/* Curso Activo */}
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <div className="ml-3">
                            <label className="text-sm font-medium text-gray-900">Curso Activo</label>
                            <p className="text-xs text-gray-600">Permite inscripciones y acceso</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          formData.isActive ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {formData.isActive ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </div>

                      {/* Resumen de configuración */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Configuración Actual</h4>
                        <div className="flex flex-wrap gap-2">
                          <CourseBadges 
                            course={formData}
                            showStatus={true}
                            showType={true}
                            showLevel={true}
                            showPrice={true}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Estado actual */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 text-red-500 mr-2" />
                        Estado Actual del Curso
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Completitud:</span>
                          <div className="flex items-center">
                            {formData.title && formData.description ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span className="text-sm font-medium">
                              {formData.title && formData.description ? 'Completo' : 'Incompleto'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Categorización:</span>
                          <div className="flex items-center">
                            {formData.categoryId && formData.subcategoryId ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span className="text-sm font-medium">
                              {formData.categoryId && formData.subcategoryId ? 'Configurado' : 'Pendiente'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Configuración:</span>
                          <div className="flex items-center">
                            {formData.courseType && formData.status && formData.level ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
                            )}
                            <span className="text-sm font-medium">
                              {formData.courseType && formData.status && formData.level ? 'Configurado' : 'Pendiente'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Multimedia:</span>
                          <div className="flex items-center">
                            {formData.thumbnailUrl || formData.modules.some(module => module.lessons?.length > 0) ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
                            )}
                            <span className="text-sm font-medium">
                              {formData.thumbnailUrl || formData.modules.some(module => module.lessons?.length > 0) ? 'Configurado' : 'Opcional'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Módulos:</span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium">
                              {formData.modules.length} módulo{formData.modules.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
