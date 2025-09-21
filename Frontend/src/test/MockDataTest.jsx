import React, { useState, useEffect } from 'react';
import { getAllCourses, getCourseById, getCourseVideos } from '../services/mockDataService';

const MockDataTest = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMockData = async () => {
      try {
        console.log('🧪 Cargando datos mock...');
        
        // Cargar todos los cursos
        const allCourses = getAllCourses();
        console.log('📚 Cursos mock cargados:', allCourses);
        setCourses(allCourses);
        
        // Probar obtener un curso específico
        const course1 = getCourseById(1);
        console.log('📖 Curso 1 mock:', course1);
        
        // Probar obtener videos de un curso
        const videos1 = getCourseVideos(1);
        console.log('🎬 Videos del curso 1 mock:', videos1);
        
        setLoading(false);
      } catch (err) {
        console.error('❌ Error al cargar datos mock:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadMockData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">🧪 Test de Datos Mock</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4 text-red-600">❌ Error en Datos Mock</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">🧪 Test de Datos Mock</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">📊 Resumen</h3>
        <p>Total de cursos: <span className="font-bold text-blue-600">{courses.length}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-md p-4 border">
            <h4 className="font-semibold text-lg mb-2">{course.title}</h4>
            <p className="text-gray-600 text-sm mb-2">{course.shortDescription}</p>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Precio:</span> ${course.price}</p>
              <p><span className="font-medium">Nivel:</span> {course.level}</p>
              <p><span className="font-medium">Duración:</span> {course.estimatedHours}h</p>
              <p><span className="font-medium">Módulos:</span> {course.modules?.length || 0}</p>
              <p><span className="font-medium">Videos:</span> {course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0}</p>
            </div>
            {course.thumbnailUrl && (
              <img 
                src={course.thumbnailUrl} 
                alt={course.title}
                className="w-full h-32 object-cover rounded mt-2"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockDataTest;
