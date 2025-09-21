import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { getCoursesByInstructorId, getStudentsByCourseId } from '@/services/courseService';

const TeacherStudentsDebug = () => {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const fetchDebugInfo = async () => {
      console.log('🚀 Iniciando debug...');
      console.log('👤 Usuario:', user);
      
      const info = {
        user: user,
        hasUserId: !!user?.id,
        userId: user?.id,
        userEmail: user?.email,
        userRole: user?.role
      };

      if (user?.id) {
        try {
          console.log('🔍 Obteniendo cursos...');
          const courses = await getCoursesByInstructorId(user.id);
          info.courses = courses;
          info.coursesCount = courses.length;
          
          if (courses.length > 0) {
            console.log('🔍 Obteniendo estudiantes para el primer curso...');
            const firstCourse = courses[0];
            try {
              const students = await getStudentsByCourseId(firstCourse.id);
              info.firstCourseStudents = students;
              info.firstCourseStudentsCount = students.length;
              info.firstCourseId = firstCourse.id;
              info.firstCourseTitle = firstCourse.title;
            } catch (err) {
              info.firstCourseError = err.message;
              console.error('❌ Error al obtener estudiantes:', err);
            }
          }
        } catch (err) {
          info.coursesError = err.message;
          console.error('❌ Error al obtener cursos:', err);
        }
      }

      console.log('📊 Info de debug:', info);
      setDebugInfo(info);
    };

    fetchDebugInfo();
  }, [user]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug - Teacher Students</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Información de Debug</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700">Usuario:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.user, null, 2)}
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Estado del Usuario:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Has User ID: {debugInfo.hasUserId ? '✅' : '❌'}</li>
              <li>User ID: {debugInfo.userId || 'N/A'}</li>
              <li>Email: {debugInfo.userEmail || 'N/A'}</li>
              <li>Rol: {debugInfo.userRole || 'N/A'}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Cursos:</h3>
            {debugInfo.coursesError ? (
              <div className="text-red-600">❌ Error: {debugInfo.coursesError}</div>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                <li>Cantidad: {debugInfo.coursesCount || 0}</li>
                {debugInfo.courses && (
                  <li>
                    <details>
                      <summary className="cursor-pointer">Ver cursos (click para expandir)</summary>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto mt-2">
                        {JSON.stringify(debugInfo.courses, null, 2)}
                      </pre>
                    </details>
                  </li>
                )}
              </ul>
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Estudiantes del Primer Curso:</h3>
            {debugInfo.firstCourseError ? (
              <div className="text-red-600">❌ Error: {debugInfo.firstCourseError}</div>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                <li>Curso: {debugInfo.firstCourseTitle || 'N/A'} (ID: {debugInfo.firstCourseId || 'N/A'})</li>
                <li>Cantidad de estudiantes: {debugInfo.firstCourseStudentsCount || 0}</li>
                {debugInfo.firstCourseStudents && (
                  <li>
                    <details>
                      <summary className="cursor-pointer">Ver estudiantes (click para expandir)</summary>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto mt-2">
                        {JSON.stringify(debugInfo.firstCourseStudents, null, 2)}
                      </pre>
                    </details>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherStudentsDebug;
