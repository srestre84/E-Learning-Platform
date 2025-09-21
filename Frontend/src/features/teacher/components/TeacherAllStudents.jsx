import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { getCoursesByInstructorId, getStudentsByCourseId } from '@/services/courseService';
import { 
  Search as SearchIcon,
  Users as PeopleIcon,
  BookOpen as BookIcon,
  User as UserIcon,
  Mail as MailIcon,
  Calendar as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Eye as VisibilityIcon,
  MessageSquare as MessageIcon,
} from 'lucide-react';

const TeacherAllStudents = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [studentsByCourse, setStudentsByCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Función para obtener todos los cursos del instructor
  const fetchCourses = useCallback(async () => {
    console.log('🚀 Iniciando fetchCourses...');
    console.log('👤 Usuario:', user);
    
    if (!user?.id) {
      console.log('❌ No hay usuario o ID de usuario');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Obteniendo cursos del instructor:', user.id);
      const instructorCourses = await getCoursesByInstructorId(user.id);
      console.log('✅ Cursos obtenidos:', instructorCourses);
      console.log('📊 Cantidad de cursos:', instructorCourses.length);
      
      setCourses(instructorCourses);
      
      // Obtener estudiantes para cada curso
      if (instructorCourses.length > 0) {
        console.log('🔄 Obteniendo estudiantes para cada curso...');
        const studentsData = {};
        
        for (const course of instructorCourses) {
          try {
            console.log(`🔍 Obteniendo estudiantes para curso ${course.id} - ${course.title}`);
            const enrollments = await getStudentsByCourseId(course.id);
            studentsData[course.id] = enrollments;
            console.log(`✅ Inscripciones para curso ${course.title}:`, enrollments.length);
            console.log(`📊 Datos de inscripciones:`, enrollments);
          } catch (err) {
            console.error(`❌ Error al obtener estudiantes para curso ${course.id}:`, err);
            console.error('❌ Detalles del error:', err.message);
            studentsData[course.id] = [];
          }
        }
        
        console.log('📚 Datos de estudiantes por curso:', studentsData);
        setStudentsByCourse(studentsData);
      } else {
        console.log('⚠️ No se encontraron cursos para el instructor');
      }
    } catch (err) {
      console.error('❌ Error al cargar cursos:', err);
      console.error('❌ Detalles del error:', err.message);
      setError('No se pudieron cargar los cursos. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Función para obtener todos los estudiantes únicos
  const getAllUniqueStudents = () => {
    console.log('🔍 Procesando estudiantes únicos...');
    console.log('📚 studentsByCourse:', studentsByCourse);
    console.log('📖 courses:', courses);
    
    const allStudents = new Map();
    
    Object.entries(studentsByCourse).forEach(([courseId, enrollments]) => {
      console.log(`📝 Procesando curso ${courseId} con ${enrollments.length} inscripciones`);
      
      enrollments.forEach(enrollment => {
        console.log('📋 Inscripción:', enrollment);
        const student = enrollment.student || enrollment;
        const key = student.email;
        
        console.log('👤 Estudiante:', student);
        console.log('🔑 Key:', key);
        
        if (key && !allStudents.has(key)) {
          const course = courses.find(c => c.id === parseInt(courseId));
          console.log('🎯 Curso encontrado:', course);
          
          allStudents.set(key, {
            student: student,
            courses: course ? [course] : [],
            enrollments: [enrollment]
          });
          console.log('✅ Estudiante agregado:', key);
        } else if (key && allStudents.has(key)) {
          // Agregar curso adicional al estudiante existente
          const existingStudent = allStudents.get(key);
          const course = courses.find(c => c.id === parseInt(courseId));
          if (course && !existingStudent.courses.find(c => c.id === course.id)) {
            existingStudent.courses.push(course);
            existingStudent.enrollments.push(enrollment);
            console.log('➕ Curso agregado al estudiante existente:', key, course.title);
          }
        }
      });
    });
    
    const result = Array.from(allStudents.values());
    console.log('🎯 Resultado final:', result);
    return result;
  };

  // Función para filtrar estudiantes
  const getFilteredStudents = () => {
    let students = getAllUniqueStudents();
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      students = students.filter(studentData => {
        const student = studentData.student;
        return (
          student.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    // Filtrar por curso seleccionado
    if (selectedCourse !== 'all') {
      const courseId = parseInt(selectedCourse);
      students = students.filter(studentData => 
        studentData.courses.some(course => course.id === courseId)
      );
    }
    
    return students;
  };

  const filteredStudents = getFilteredStudents();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar estudiantes</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchCourses}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          Reintentar
        </button>
      </div>
    );
  }

  const totalStudents = getAllUniqueStudents().length;
  const totalCourses = courses.length;
  
  console.log('📊 Estadísticas:');
  console.log('👥 Total estudiantes:', totalStudents);
  console.log('📚 Total cursos:', totalCourses);
  console.log('📋 Total inscripciones:', Object.values(studentsByCourse).flat().length);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Estudiantes</h1>
        <p className="text-gray-600">Gestiona y supervisa el progreso de tus estudiantes</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <PeopleIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <BookIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cursos Activos</p>
              <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio por Curso</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCourses > 0 ? Math.round(totalStudents / totalCourses) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          {/* Filtro por curso */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
            <option value="all">Todos los cursos</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de estudiantes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Estudiantes ({filteredStudents.length})
          </h2>
        </div>
        
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <PeopleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || selectedCourse !== 'all' ? 'No se encontraron estudiantes' : 'No tienes estudiantes inscritos'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCourse !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'Los estudiantes aparecerán aquí una vez que se inscriban en tus cursos'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredStudents.map((studentData, index) => {
              const student = studentData.student;
              const studentName = `${student.userName || ''} ${student.lastName || ''}`.trim() || 'Estudiante';
              
              // Calcular progreso promedio
              const totalProgress = studentData.enrollments.reduce((sum, enrollment) => 
                sum + (enrollment.progressPercentage || 0), 0);
              const averageProgress = studentData.enrollments.length > 0 
                ? Math.round(totalProgress / studentData.enrollments.length) 
                : 0;
              
              // Obtener fecha de inscripción más reciente
              const latestEnrollment = studentData.enrollments.reduce((latest, enrollment) => {
                if (!latest || !enrollment.enrolledAt) return enrollment;
                return new Date(enrollment.enrolledAt) > new Date(latest.enrolledAt) ? enrollment : latest;
              }, null);
              
              return (
                <div key={`${student.id || index}`} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-red-600" />
                      </div>
                      
                      {/* Información del estudiante */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{studentName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center">
                            <MailIcon className="w-4 h-4 mr-1" />
                            {student.email}
                          </div>
                          {latestEnrollment?.enrolledAt && (
                            <div className="flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              {new Date(latestEnrollment.enrolledAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        
                        {/* Cursos inscritos */}
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-2">
                            {studentData.courses.map(course => (
                              <span
                                key={course.id}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <BookIcon className="w-3 h-3 mr-1" />
                                {course.title}
                              </span>
                            ))}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {studentData.courses.length} curso{studentData.courses.length !== 1 ? 's' : ''} inscrito{studentData.courses.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Acciones */}
                    <div className="flex items-center space-x-2">
                      {averageProgress > 0 && (
                        <div className="text-right mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {averageProgress}%
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-red-600 h-2 rounded-full" 
                              style={{ width: `${averageProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Ver perfil">
                        <VisibilityIcon className="w-5 h-5" />
                      </button>
                      
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Enviar mensaje">
                        <MessageIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAllStudents;
