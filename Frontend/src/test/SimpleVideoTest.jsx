import React, { useState, useEffect } from 'react';
import { getCourseVideos } from '@/services/courseVideoService';

const SimpleVideoTest = () => {
  const [courseId, setCourseId] = useState(26);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Cargando videos para curso:", courseId);
      const videosData = await getCourseVideos(courseId);
      console.log("Videos cargados:", videosData);
      setVideos(videosData || []);
    } catch (err) {
      console.error("Error cargando videos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [courseId]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Prueba Simple de Videos</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
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
            onClick={loadVideos}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Cargar Videos'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Estado de Carga:</h2>
        <div className="p-4 bg-blue-50 rounded">
          <p><strong>Loading:</strong> {loading ? 'Sí' : 'No'}</p>
          <p><strong>Videos encontrados:</strong> {videos.length}</p>
          <p><strong>Course ID:</strong> {courseId}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Videos Raw Data:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
          {JSON.stringify(videos, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Lista de Videos:</h2>
        {videos.length === 0 ? (
          <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            No se encontraron videos para este curso.
          </div>
        ) : (
          <div className="space-y-2">
            {videos.map((video, index) => (
              <div key={video.id || index} className="p-4 border rounded bg-white">
                <h3 className="font-semibold">{video.title}</h3>
                <p className="text-sm text-gray-600">{video.description}</p>
                <div className="mt-2 text-xs text-gray-500">
                  <p>ID: {video.id}</p>
                  <p>Módulo: {video.moduleTitle || 'Sin módulo'}</p>
                  <p>Duración: {video.durationSeconds || 0} segundos</p>
                  <p>URL: {video.youtubeUrl}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleVideoTest;
