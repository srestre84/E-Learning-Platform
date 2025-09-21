import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { getCoursesByInstructorId, getStudentsByCourseId } from '@/services/courseService';
import { ChevronDownIcon, ChevronUpIcon, UserIcon, MailIcon, BookOpenIcon } from 'lucide-react';

const TeacherStudentsReal = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStudents, setExpandedStudents] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Obtener cursos del instructor
        const courses = await getCoursesByInstructorId(user.id);
        
        // Obtener todos los estudiantes de todos los cursos
        const allStudents = [];
        
        for (const course of courses) {
          try {
            const enrollments = await getStudentsByCourseId(course.id);
            
            // Procesar cada inscripción
            enrollments.forEach(enrollment => {
              const student = enrollment.student || enrollment;
              
              // Filtrar solo estudiantes REALES (no datos de prueba)
              // Excluir emails que contengan 'student.com', 'test.com', 'example.com'
              if (student.email && 
                  !student.email.includes('student.com') && 
                  !student.email.includes('test.com') && 
                  !student.email.includes('example.com')) {
                
                const courseData = {
                  id: course.id,
                  title: course.title,
                  enrolledAt: enrollment.enrolledAt,
                  progress: enrollment.progressPercentage || 0,
                  status: enrollment.status
                };
                
                // Buscar si el estudiante ya existe en la lista
                let existingStudent = allStudents.find(s => s.email === student.email);
                
                if (existingStudent) {
                  // Si ya existe, agregar el curso a su lista
                  existingStudent.courses.push(courseData);
                } else {
                  // Si no existe, crear nuevo estudiante
                  const studentName = `${student.userName || ''} ${student.lastName || ''}`.trim() || 'Estudiante';
                  allStudents.push({
                    id: student.id,
                    name: studentName,
                    email: student.email,
                    courses: [courseData]
                  });
                }
              }
            });
          } catch (err) {
            console.error(`Error al obtener estudiantes del curso ${course.title}:`, err);
          }
        }
        
        setStudents(allStudents);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los estudiantes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const toggleStudent = (studentEmail) => {
    const newExpanded = new Set(expandedStudents);
    if (newExpanded.has(studentEmail)) {
      newExpanded.delete(studentEmail);
    } else {
      newExpanded.add(studentEmail);
    }
    setExpandedStudents(newExpanded);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="text-lg">Cargando estudiantes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <div className="text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Estudiantes</h1>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-lg text-blue-800">
          Total de estudiantes: <span className="font-bold">{students.length}</span>
        </div>
        <div className="text-sm text-blue-600 mt-1">
          Solo se muestran estudiantes reales (no datos de prueba)
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-xl text-gray-500 mb-4">
            No hay estudiantes reales inscritos en tus cursos
          </div>
          <div className="text-gray-400">
            Los estudiantes aparecerán aquí una vez que se registren e inscriban en tus cursos
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {students.map((student) => {
            const isExpanded = expandedStudents.has(student.email);
            const totalProgress = student.courses.reduce((sum, course) => sum + course.progress, 0);
            const averageProgress = student.courses.length > 0 ? Math.round(totalProgress / student.courses.length) : 0;
            
            return (
              <div key={student.email} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Header del estudiante */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleStudent(student.email)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleStudent(student.email);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MailIcon className="w-4 h-4 mr-1" />
                            {student.email}
                          </div>
                          <div className="flex items-center">
                            <BookOpenIcon className="w-4 h-4 mr-1" />
                            {student.courses.length} curso{student.courses.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Progreso Promedio</div>
                        <div className="text-lg font-bold text-green-600">{averageProgress}%</div>
                      </div>
                      
                      <div className="w-6 h-6 text-gray-400">
                        {isExpanded ? (
                          <ChevronUpIcon className="w-6 h-6" />
                        ) : (
                          <ChevronDownIcon className="w-6 h-6" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contenido expandible */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <h4 className="font-semibold text-gray-800 mb-3">Cursos Matriculados:</h4>
                    <div className="space-y-3">
                      {student.courses.map((course) => (
                        <div key={course.id} className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{course.title}</div>
                              <div className="text-sm text-gray-600">
                                Inscrito: {new Date(course.enrolledAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <div className="text-sm text-gray-500">Progreso</div>
                                <div className="font-bold text-green-600">{course.progress}%</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-500">Estado</div>
                                <div className={`font-bold ${
                                  course.status === 'ACTIVE' ? 'text-green-600' : 
                                  course.status === 'COMPLETED' ? 'text-blue-600' : 'text-gray-600'
                                }`}>
                                  {(() => {
                                    if (course.status === 'ACTIVE') return 'Activo';
                                    if (course.status === 'COMPLETED') return 'Completado';
                                    return course.status;
                                  })()}
                                </div>
                              </div>
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherStudentsReal;
