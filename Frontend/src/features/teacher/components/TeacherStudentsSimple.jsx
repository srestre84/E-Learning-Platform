import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { getCoursesByInstructorId, getStudentsByCourseId } from '@/services/courseService';

const TeacherStudentsSimple = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Estudiantes</h1>
      
      <div className="mb-6 text-lg text-gray-600">
        Total de estudiantes: <span className="font-bold text-blue-600">{students.length}</span>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-xl text-gray-500">No hay estudiantes inscritos en tus cursos</div>
        </div>
      ) : (
        <div className="space-y-6">
        {students.map((student) => (
          <div key={student.email || student.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
                  <p className="text-gray-600">{student.email}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Cursos inscritos:</div>
                  <div className="text-2xl font-bold text-blue-600">{student.courses.length}</div>
                </div>
              </div>
              
              <div className="grid gap-3">
                <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Cursos Matriculados:
                </h3>
                {student.courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
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
                          {course.status === 'ACTIVE' ? 'Activo' : 
                           course.status === 'COMPLETED' ? 'Completado' : course.status}
                        </div>
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherStudentsSimple;
