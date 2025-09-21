import React, { useState, useEffect } from 'react';
import { getCourseById } from '@/services/courseService';
import { getCourseVideos } from '@/services/courseVideoService';

const JsonParsingTest = () => {
  const [courseId, setCourseId] = useState(16);
  const [courseData, setCourseData] = useState(null);
  const [videosData, setVideosData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const testCourseData = async () => {
    setLoading(true);
    setErrors([]);
    
    try {
      console.log("🧪 Probando carga de datos del curso:", courseId);
      
      // Probar carga de datos del curso
      const course = await getCourseById(courseId);
      console.log("✅ Curso cargado:", course);
      setCourseData(course);
      
      // Probar carga de videos
      const videos = await getCourseVideos(courseId);
      console.log("✅ Videos cargados:", videos);
      setVideosData(videos);
      
    } catch (error) {
      console.error("❌ Error en la prueba:", error);
      setErrors(prev => [...prev, {
        type: 'Error',
        message: error.message,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testCourseData();
  }, [courseId]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Prueba de Parsing de JSON</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Estado de la Prueba</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Course ID:
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={courseId}
                onChange={(e) => setCourseId(parseInt(e.target.value))}
                className="border rounded px-3 py-2 w-32"
              />
              <button
                onClick={testCourseData}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Probando...' : 'Probar'}
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${loading ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
            <span>{loading ? 'Cargando...' : 'Completado'}</span>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-red-600">Errores Encontrados</h2>
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                <div className="flex justify-between">
                  <span className="font-medium">{error.type}</span>
                  <span className="text-sm">{error.timestamp}</span>
                </div>
                <p className="text-sm mt-1">{error.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Datos del Curso */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Datos del Curso</h2>
          {courseData ? (
            <div className="space-y-2">
              <p><strong>ID:</strong> {courseData.id}</p>
              <p><strong>Título:</strong> {courseData.title}</p>
              <p><strong>Descripción:</strong> {courseData.description?.substring(0, 100)}...</p>
              <p><strong>Precio:</strong> ${courseData.price}</p>
              <p><strong>Premium:</strong> {courseData.isPremium ? 'Sí' : 'No'}</p>
              <p><strong>Publicado:</strong> {courseData.isPublished ? 'Sí' : 'No'}</p>
              <p><strong>Módulos:</strong> {courseData.modules?.length || 0}</p>
              <p><strong>Inscripciones:</strong> {courseData.enrollments?.length || 0}</p>
            </div>
          ) : (
            <p className="text-gray-500">No se han cargado datos del curso</p>
          )}
        </div>

        {/* Videos del Curso */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Videos del Curso</h2>
          {videosData.length > 0 ? (
            <div className="space-y-2">
              <p><strong>Total de videos:</strong> {videosData.length}</p>
              <div className="max-h-64 overflow-y-auto">
                {videosData.map((video, index) => (
                  <div key={video.id || index} className="p-2 bg-gray-50 rounded mb-2">
                    <p className="font-medium text-sm">{video.title}</p>
                    <p className="text-xs text-gray-600">
                      Módulo: {video.moduleTitle || 'Sin módulo'} | 
                      Duración: {video.durationSeconds || 0}s
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No se han cargado videos</p>
          )}
        </div>
      </div>

      {/* Datos Raw para Debugging */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Datos Raw (Debugging)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Curso Raw:</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-64">
              {JSON.stringify(courseData, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="font-medium mb-2">Videos Raw:</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-64">
              {JSON.stringify(videosData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonParsingTest;
