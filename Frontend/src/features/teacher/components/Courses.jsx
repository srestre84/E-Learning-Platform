import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  StarIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockCourses = [
          { 
            id: 1, 
            title: 'Introducción a la Programación con Python', 
            description: 'Aprende los fundamentos de la programación con Python desde cero',
            students: 124, 
            rating: 4.7, 
            status: 'publicado',
            lastUpdated: '2023-05-15',
            duration: '8 semanas',
            lessons: 24,
            category: 'Programación',
            image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80'
          },
          { 
            id: 2, 
            title: 'Desarrollo Web Moderno', 
            description: 'Domina React, Node.js y las tecnologías web más actuales',
            students: 89, 
            rating: 4.5, 
            status: 'publicado',
            lastUpdated: '2023-06-20',
            duration: '12 semanas',
            lessons: 36,
            category: 'Desarrollo Web',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80'
          },
          { 
            id: 3, 
            title: 'Machine Learning para Principiantes', 
            description: 'Introducción práctica al aprendizaje automático y ciencia de datos',
            students: 56, 
            rating: 4.8, 
            status: 'borrador',
            lastUpdated: '2023-07-10',
            duration: '10 semanas',
            lessons: 30,
            category: 'Inteligencia Artificial',
            image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80'
          },
          { 
            id: 4, 
            title: 'Diseño UX/UI Avanzado', 
            description: 'Crea experiencias de usuario excepcionales con herramientas modernas',
            students: 73, 
            rating: 4.6, 
            status: 'publicado',
            lastUpdated: '2023-08-05',
            duration: '6 semanas',
            lessons: 18,
            category: 'Diseño',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80'
          }
        ];

        setCourses(mockCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter and search functionality
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.status === 'publicado' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {course.status === 'publicado' ? 'Publicado' : 'Borrador'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            <Link to={`/teacher/courses/${course.id}`} className="hover:text-indigo-600">
              {course.title}
            </Link>
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <UsersIcon className="h-4 w-4 mr-1" />
              {course.students}
            </div>
            <div className="flex items-center">
              <BookOpenIcon className="h-4 w-4 mr-1" />
              {course.lessons} lecciones
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              {course.duration}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-900">{course.rating}</span>
            <span className="ml-1 text-sm text-gray-500">({course.students} estudiantes)</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link
              to={`/teacher/courses/${course.id}`}
              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Ver curso"
            >
              <EyeIcon className="h-4 w-4" />
            </Link>
            <Link
              to={`/teacher/courses/edit/${course.id}`}
              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Editar curso"
            >
              <PencilIcon className="h-4 w-4" />
            </Link>
            <button
              onClick={() => handleDelete(course.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Eliminar curso"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Cursos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona y organiza todos tus cursos desde aquí
          </p>
        </div>
        <Link
          to="/teacher/courses/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Nuevo Curso
        </Link>
      </div>

      {/* Search and Filters */}
     

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cursos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'No se encontraron cursos con los filtros aplicados.'
              : 'Comienza creando tu primer curso.'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <div className="mt-6">
              <Link
                to="/teacher/courses/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Nuevo Curso
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;