// Constantes para estados y tipos de curso

export const COURSE_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
  SUSPENDED: 'SUSPENDED'
};

export const COURSE_STATUS_LABELS = {
  [COURSE_STATUS.DRAFT]: 'Borrador',
  [COURSE_STATUS.PUBLISHED]: 'Publicado',
  [COURSE_STATUS.ARCHIVED]: 'Archivado',
  [COURSE_STATUS.SUSPENDED]: 'Suspendido'
};

export const COURSE_STATUS_COLORS = {
  [COURSE_STATUS.DRAFT]: 'bg-gray-100 text-gray-800',
  [COURSE_STATUS.PUBLISHED]: 'bg-green-100 text-green-800',
  [COURSE_STATUS.ARCHIVED]: 'bg-yellow-100 text-yellow-800',
  [COURSE_STATUS.SUSPENDED]: 'bg-red-100 text-red-800'
};

export const COURSE_STATUS_ICONS = {
  [COURSE_STATUS.DRAFT]: '📝',
  [COURSE_STATUS.PUBLISHED]: '✅',
  [COURSE_STATUS.ARCHIVED]: '📁',
  [COURSE_STATUS.SUSPENDED]: '⏸️'
};

export const COURSE_TYPES = {
  FREE: 'FREE',
  PREMIUM: 'PREMIUM',
  SUBSCRIPTION: 'SUBSCRIPTION',
  BUNDLE: 'BUNDLE'
};

export const COURSE_TYPE_LABELS = {
  [COURSE_TYPES.FREE]: 'Gratis',
  [COURSE_TYPES.PREMIUM]: 'Premium',
  [COURSE_TYPES.SUBSCRIPTION]: 'Suscripción',
  [COURSE_TYPES.BUNDLE]: 'Paquete'
};

export const COURSE_TYPE_COLORS = {
  [COURSE_TYPES.FREE]: 'bg-blue-100 text-blue-800',
  [COURSE_TYPES.PREMIUM]: 'bg-purple-100 text-purple-800',
  [COURSE_TYPES.SUBSCRIPTION]: 'bg-orange-100 text-orange-800',
  [COURSE_TYPES.BUNDLE]: 'bg-indigo-100 text-indigo-800'
};

export const COURSE_TYPE_ICONS = {
  [COURSE_TYPES.FREE]: '🆓',
  [COURSE_TYPES.PREMIUM]: '💎',
  [COURSE_TYPES.SUBSCRIPTION]: '🔄',
  [COURSE_TYPES.BUNDLE]: '📦'
};

export const COURSE_LEVELS = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
  EXPERT: 'EXPERT'
};

export const COURSE_LEVELS_CONST = [
  { id: 'BEGINNER', name: 'Principiante' },
  { id: 'INTERMEDIATE', name: 'Intermedio' },
  { id: 'ADVANCED', name: 'Avanzado' },
  { id: 'EXPERT', name: 'Experto' }
];

export const COURSE_LEVEL_LABELS = {
  [COURSE_LEVELS.BEGINNER]: 'Principiante',
  [COURSE_LEVELS.INTERMEDIATE]: 'Intermedio',
  [COURSE_LEVELS.ADVANCED]: 'Avanzado',
  [COURSE_LEVELS.EXPERT]: 'Experto'
};

export const COURSE_LEVEL_COLORS = {
  [COURSE_LEVELS.BEGINNER]: 'bg-green-100 text-green-800',
  [COURSE_LEVELS.INTERMEDIATE]: 'bg-yellow-100 text-yellow-800',
  [COURSE_LEVELS.ADVANCED]: 'bg-orange-100 text-orange-800',
  [COURSE_LEVELS.EXPERT]: 'bg-red-100 text-red-800'
};

// Opciones para filtros
export const FILTER_OPTIONS = {
  STATUS: {
    ALL: 'ALL',
    ...COURSE_STATUS
  },
  TYPE: {
    ALL: 'ALL',
    ...COURSE_TYPES
  },
  LEVEL: {
    ALL: 'ALL',
    ...COURSE_LEVELS
  },
  PRICE: {
    ALL: 'ALL',
    FREE: 'FREE',
    PAID: 'PAID',
    RANGE_0_50: 'RANGE_0_50',
    RANGE_50_100: 'RANGE_50_100',
    RANGE_100_PLUS: 'RANGE_100_PLUS'
  }
};

export const FILTER_LABELS = {
  STATUS: {
    ALL: 'Todos los estados',
    ...COURSE_STATUS_LABELS
  },
  TYPE: {
    ALL: 'Todos los tipos',
    ...COURSE_TYPE_LABELS
  },
  LEVEL: {
    ALL: 'Todos los niveles',
    ...COURSE_LEVEL_LABELS
  },
  PRICE: {
    ALL: 'Todos los precios',
    FREE: 'Gratis',
    PAID: 'De pago',
    RANGE_0_50: '$0 - $50',
    RANGE_50_100: '$50 - $100',
    RANGE_100_PLUS: '$100+'
  }
};

// Funciones de utilidad
export const getCourseStatusInfo = (status) => ({
  label: COURSE_STATUS_LABELS[status] || 'Desconocido',
  color: COURSE_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800',
  icon: COURSE_STATUS_ICONS[status] || '❓'
});

export const getCourseTypeInfo = (type) => ({
  label: COURSE_TYPE_LABELS[type] || 'Desconocido',
  color: COURSE_TYPE_COLORS[type] || 'bg-gray-100 text-gray-800',
  icon: COURSE_TYPE_ICONS[type] || '❓'
});

export const getCourseLevelInfo = (level) => ({
  label: COURSE_LEVEL_LABELS[level] || 'Desconocido',
  color: COURSE_LEVEL_COLORS[level] || 'bg-gray-100 text-gray-800'
});

export const isCourseFree = (course) => {
  return course.courseType === COURSE_TYPES.FREE || 
         (course.price === 0 || course.price === null || course.price === undefined);
};

export const getCoursePriceRange = (price) => {
  if (!price || price === 0) return FILTER_OPTIONS.PRICE.FREE;
  if (price <= 50) return FILTER_OPTIONS.PRICE.RANGE_0_50;
  if (price <= 100) return FILTER_OPTIONS.PRICE.RANGE_50_100;
  return FILTER_OPTIONS.PRICE.RANGE_100_PLUS;
};

// Configuración por defecto para nuevos cursos
export const DEFAULT_COURSE_CONFIG = {
  status: COURSE_STATUS.DRAFT,
  courseType: COURSE_TYPES.FREE,
  level: COURSE_LEVELS.BEGINNER,
  price: 0,
  isPublished: false,
  isActive: true
};
