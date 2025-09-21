import React, { useState, useEffect } from 'react';
import { getCourseVideos } from '@/services/courseVideoService';
import StudentVideoViewer from '@/features/student/components/StudentVideoViewer';

const VideoTest = () => {
  const [courseId, setCourseId] = useState(25);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const videosData = await getCourseVideos(courseId);
      console.log("Videos cargados:", videosData);
      setVideos(videosData);
    } catch (error) {
      console.error("Error cargando videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [courseId]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Prueba de Videos</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Course ID:
        </label>
        <input
          type="number"
          value={courseId}
          onChange={(e) => setCourseId(parseInt(e.target.value))}
          className="border rounded px-3 py-2 mr-2"
        />
        <button
          onClick={loadVideos}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Cargar Videos'}
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Videos Raw Data:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
          {JSON.stringify(videos, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Vista de Videos:</h2>
        <div className="border rounded">
          <StudentVideoViewer
            courseId={courseId}
            courseTitle="Curso de Prueba"
            enrollmentData={{ isEnrolled: true }}
            onProgressUpdate={(progress) => console.log("Progress:", progress)}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoTest;
