// Servicio para manejar categorías y subcategorías enfocadas en tecnología y desarrollo de software
export const CATEGORIES = [
  {
    id: 'programming',
    name: '💻 Programación',
    categoryId: 1,
    subcategories: [
      { id: 'web-development', name: 'Desarrollo Web', subcategoryId: 1 },
      { id: 'mobile-development', name: 'Desarrollo Móvil', subcategoryId: 2 },
      { id: 'desktop-development', name: 'Desarrollo de Escritorio', subcategoryId: 3 },
      { id: 'game-development', name: 'Desarrollo de Juegos', subcategoryId: 4 },
      { id: 'blockchain', name: 'Blockchain y Web3', subcategoryId: 5 }
    ]
  },
  {
    id: 'languages',
    name: '🔤 Lenguajes de Programación',
    categoryId: 2,
    subcategories: [
      { id: 'javascript', name: 'JavaScript', subcategoryId: 6 },
      { id: 'python', name: 'Python', subcategoryId: 7 },
      { id: 'java', name: 'Java', subcategoryId: 8 },
      { id: 'csharp', name: 'C#', subcategoryId: 9 },
      { id: 'cpp', name: 'C++', subcategoryId: 10 },
      { id: 'go', name: 'Go', subcategoryId: 11 },
      { id: 'rust', name: 'Rust', subcategoryId: 12 },
      { id: 'php', name: 'PHP', subcategoryId: 13 }
    ]
  },
  {
    id: 'frameworks',
    name: '⚡ Frameworks y Librerías',
    categoryId: 3,
    subcategories: [
      { id: 'react', name: 'React', subcategoryId: 14 },
      { id: 'vue', name: 'Vue.js', subcategoryId: 15 },
      { id: 'angular', name: 'Angular', subcategoryId: 16 },
      { id: 'nodejs', name: 'Node.js', subcategoryId: 17 },
      { id: 'express', name: 'Express.js', subcategoryId: 18 },
      { id: 'django', name: 'Django', subcategoryId: 19 },
      { id: 'flask', name: 'Flask', subcategoryId: 20 },
      { id: 'spring', name: 'Spring Boot', subcategoryId: 21 }
    ]
  },
  {
    id: 'databases',
    name: '🗄️ Bases de Datos',
    categoryId: 4,
    subcategories: [
      { id: 'sql', name: 'SQL', subcategoryId: 22 },
      { id: 'mysql', name: 'MySQL', subcategoryId: 23 },
      { id: 'postgresql', name: 'PostgreSQL', subcategoryId: 24 },
      { id: 'mongodb', name: 'MongoDB', subcategoryId: 25 },
      { id: 'redis', name: 'Redis', subcategoryId: 26 },
      { id: 'elasticsearch', name: 'Elasticsearch', subcategoryId: 27 }
    ]
  },
  {
    id: 'cloud',
    name: '☁️ Cloud y DevOps',
    categoryId: 5,
    subcategories: [
      { id: 'aws', name: 'Amazon Web Services', subcategoryId: 28 },
      { id: 'azure', name: 'Microsoft Azure', subcategoryId: 29 },
      { id: 'gcp', name: 'Google Cloud Platform', subcategoryId: 30 },
      { id: 'docker', name: 'Docker', subcategoryId: 31 },
      { id: 'kubernetes', name: 'Kubernetes', subcategoryId: 32 },
      { id: 'ci-cd', name: 'CI/CD', subcategoryId: 33 },
      { id: 'terraform', name: 'Terraform', subcategoryId: 34 }
    ]
  },
  {
    id: 'data-science',
    name: '📊 Ciencia de Datos e IA',
    categoryId: 6,
    subcategories: [
      { id: 'machine-learning', name: 'Machine Learning', subcategoryId: 35 },
      { id: 'deep-learning', name: 'Deep Learning', subcategoryId: 36 },
      { id: 'data-analysis', name: 'Análisis de Datos', subcategoryId: 37 },
      { id: 'data-visualization', name: 'Visualización de Datos', subcategoryId: 38 },
      { id: 'nlp', name: 'Procesamiento de Lenguaje Natural', subcategoryId: 39 },
      { id: 'computer-vision', name: 'Visión por Computadora', subcategoryId: 40 }
    ]
  },
  {
    id: 'cybersecurity',
    name: '🔒 Ciberseguridad',
    categoryId: 7,
    subcategories: [
      { id: 'ethical-hacking', name: 'Hacking Ético', subcategoryId: 41 },
      { id: 'penetration-testing', name: 'Pruebas de Penetración', subcategoryId: 42 },
      { id: 'network-security', name: 'Seguridad de Redes', subcategoryId: 43 },
      { id: 'cryptography', name: 'Criptografía', subcategoryId: 44 },
      { id: 'incident-response', name: 'Respuesta a Incidentes', subcategoryId: 45 }
    ]
  },
  {
    id: 'mobile',
    name: '📱 Desarrollo Móvil',
    categoryId: 8,
    subcategories: [
      { id: 'android', name: 'Android', subcategoryId: 46 },
      { id: 'ios', name: 'iOS', subcategoryId: 47 },
      { id: 'react-native', name: 'React Native', subcategoryId: 48 },
      { id: 'flutter', name: 'Flutter', subcategoryId: 49 },
      { id: 'xamarin', name: 'Xamarin', subcategoryId: 50 }
    ]
  }
];

export const COURSE_LEVELS = [
  { id: 'beginner', name: '🟢 Principiante', description: 'Para principiantes sin experiencia previa' },
  { id: 'intermediate', name: '🟡 Intermedio', description: 'Para personas con conocimientos básicos' },
  { id: 'advanced', name: '🔴 Avanzado', description: 'Para personas con experiencia sólida' }
];

// Función para obtener una categoría por ID
export const getCategoryById = (categoryId) => {
  return CATEGORIES.find(cat => cat.id === categoryId);
};

// Función para obtener una subcategoría por ID
export const getSubcategoryById = (categoryId, subcategoryId) => {
  const category = getCategoryById(categoryId);
  if (!category) return null;
  return category.subcategories.find(sub => sub.id === subcategoryId);
};

// Función para obtener el mapeo de categoría y subcategoría para el backend
export const getCategoryMapping = (categoryId, subcategoryId) => {
  const category = getCategoryById(categoryId);
  if (!category) return { categoryId: 1, subcategoryId: 1 };
  
  const subcategory = getSubcategoryById(categoryId, subcategoryId);
  if (!subcategory) return { categoryId: category.categoryId, subcategoryId: category.subcategories[0].subcategoryId };
  
  return {
    categoryId: category.categoryId,
    subcategoryId: subcategory.subcategoryId
  };
};

// Función para obtener el ID de categoría desde el mapeo del backend
export const getCategoryIdFromMapping = (backendCategoryId) => {
  const category = CATEGORIES.find(cat => cat.categoryId === backendCategoryId);
  return category ? category.id : 'programming';
};

// Función para obtener el ID de subcategoría desde el mapeo del backend
export const getSubcategoryIdFromMapping = (backendCategoryId, backendSubcategoryId) => {
  const category = CATEGORIES.find(cat => cat.categoryId === backendCategoryId);
  if (!category) return category.subcategories[0].id;
  
  const subcategory = category.subcategories.find(sub => sub.subcategoryId === backendSubcategoryId);
  return subcategory ? subcategory.id : category.subcategories[0].id;
};