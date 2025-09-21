// Script de prueba para el nuevo sistema de gestión de cursos
import { 
  COURSE_STATUS, 
  COURSE_TYPES, 
  COURSE_LEVELS,
  FILTER_OPTIONS,
  getCourseStatusInfo,
  getCourseTypeInfo,
  getCourseLevelInfo,
  isCourseFree,
  getCoursePriceRange,
  DEFAULT_COURSE_CONFIG
} from '@/shared/constants/courseConstants';

// Función para probar las constantes
export const testCourseConstants = () => {
  console.log('🧪 Probando constantes de curso...');
  
  // Probar estados
  console.log('Estados disponibles:', Object.values(COURSE_STATUS));
  
  // Probar tipos
  console.log('Tipos disponibles:', Object.values(COURSE_TYPES));
  
  // Probar niveles
  console.log('Niveles disponibles:', Object.values(COURSE_LEVELS));
  
  // Probar configuración por defecto
  console.log('Configuración por defecto:', DEFAULT_COURSE_CONFIG);
  
  return true;
};

// Función para probar las funciones de utilidad
export const testUtilityFunctions = () => {
  console.log('🧪 Probando funciones de utilidad...');
  
  // Probar información de estado
  const draftInfo = getCourseStatusInfo(COURSE_STATUS.DRAFT);
  console.log('Info de borrador:', draftInfo);
  
  // Probar información de tipo
  const freeInfo = getCourseTypeInfo(COURSE_TYPES.FREE);
  console.log('Info de curso gratis:', freeInfo);
  
  // Probar información de nivel
  const beginnerInfo = getCourseLevelInfo(COURSE_LEVELS.BEGINNER);
  console.log('Info de principiante:', beginnerInfo);
  
  // Probar si es gratis
  const freeCourse = { price: 0, courseType: COURSE_TYPES.FREE };
  const paidCourse = { price: 29.99, courseType: COURSE_TYPES.PREMIUM };
  
  console.log('¿Es gratis el curso gratuito?', isCourseFree(freeCourse));
  console.log('¿Es gratis el curso de pago?', isCourseFree(paidCourse));
  
  // Probar rango de precios
  console.log('Rango de precio $0:', getCoursePriceRange(0));
  console.log('Rango de precio $25:', getCoursePriceRange(25));
  console.log('Rango de precio $75:', getCoursePriceRange(75));
  console.log('Rango de precio $150:', getCoursePriceRange(150));
  
  return true;
};

// Función para probar filtros
export const testFilters = () => {
  console.log('🧪 Probando sistema de filtros...');
  
  const courses = [
    {
      id: 1,
      title: 'Curso Gratuito de React',
      price: 0,
      courseType: COURSE_TYPES.FREE,
      status: COURSE_STATUS.PUBLISHED,
      level: COURSE_LEVELS.BEGINNER,
      isPublished: true
    },
    {
      id: 2,
      title: 'Curso Premium de Node.js',
      price: 99.99,
      courseType: COURSE_TYPES.PREMIUM,
      status: COURSE_STATUS.DRAFT,
      level: COURSE_LEVELS.INTERMEDIATE,
      isPublished: false
    },
    {
      id: 3,
      title: 'Curso de Suscripción - Full Stack',
      price: 49.99,
      courseType: COURSE_TYPES.SUBSCRIPTION,
      status: COURSE_STATUS.PUBLISHED,
      level: COURSE_LEVELS.ADVANCED,
      isPublished: true
    }
  ];
  
  // Probar filtros
  console.log('Todos los cursos:', courses.length);
  
  // Filtrar por estado
  const publishedCourses = courses.filter(course => 
    course.status === COURSE_STATUS.PUBLISHED || course.isPublished
  );
  console.log('Cursos publicados:', publishedCourses.length);
  
  // Filtrar por tipo
  const freeCourses = courses.filter(course => isCourseFree(course));
  console.log('Cursos gratis:', freeCourses.length);
  
  // Filtrar por precio
  const expensiveCourses = courses.filter(course => course.price > 50);
  console.log('Cursos caros (>$50):', expensiveCourses.length);
  
  return true;
};

// Función principal de prueba
export const runAllTests = () => {
  console.log('🚀 Iniciando pruebas del sistema de gestión de cursos...');
  
  try {
    testCourseConstants();
    testUtilityFunctions();
    testFilters();
    
    console.log('✅ Todas las pruebas pasaron exitosamente!');
    return true;
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
    return false;
  }
};

// Exportar funciones individuales para uso en componentes
export default {
  testCourseConstants,
  testUtilityFunctions,
  testFilters,
  runAllTests
};
