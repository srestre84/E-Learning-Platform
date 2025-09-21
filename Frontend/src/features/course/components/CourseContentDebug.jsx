import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

const CourseContentDebug = () => {
  const { id: courseId } = useParams();
  const [step, setStep] = useState("inicial");
  const [courseData, setCourseData] = useState(null);
  const [videosData, setVideosData] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [error, setError] = useState(null);

  console.log("🎯 CourseContentDebug - courseId:", courseId);
  console.log("🎭 Estado actual:", { step, courseData: !!courseData, videosData: !!videosData, enrollmentData: !!enrollmentData });

  useEffect(() => {
    const debugLoad = async () => {
      try {
        setStep("cargando_curso");
        console.log("📚 Paso 1: Cargando curso...");
        
        // Simular carga del curso
        const courseResponse = await fetch(`http://localhost:8081/api/courses/${courseId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!courseResponse.ok) {
          throw new Error(`Error HTTP: ${courseResponse.status}`);
        }
        
        const course = await courseResponse.json();
        console.log("✅ Curso cargado:", course);
        setCourseData(course);
        
        setStep("cargando_videos");
        console.log("🎬 Paso 2: Cargando videos...");
        
        // Simular carga de videos
        const videosResponse = await fetch(`http://localhost:8081/api/course-videos/course/${courseId}/lessons`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!videosResponse.ok) {
          throw new Error(`Error HTTP: ${videosResponse.status}`);
        }
        
        const videos = await videosResponse.json();
        console.log("✅ Videos cargados:", videos);
        setVideosData(videos);
        
        setStep("verificando_inscripcion");
        console.log("📋 Paso 3: Verificando inscripción...");
        
        // Simular verificación de inscripción
        const enrollmentResponse = await fetch(`http://localhost:8081/api/enrollments/check/${courseId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!enrollmentResponse.ok) {
          console.warn("⚠️ Error en verificación de inscripción:", enrollmentResponse.status);
          setEnrollmentData({ isEnrolled: false });
        } else {
          const enrollment = await enrollmentResponse.json();
          console.log("✅ Inscripción verificada:", enrollment);
          setEnrollmentData(enrollment);
        }
        
        setStep("completado");
        console.log("🎉 Todos los pasos completados!");
        
      } catch (err) {
        console.error("❌ Error en debug:", err);
        setError(err.message);
        setStep("error");
      }
    };

    if (courseId) {
      debugLoad();
    }
  }, [courseId]);

  const getStepIcon = (stepName) => {
    if (step === stepName) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }
    if (step === "completado" || step === "error") {
      if (stepName === "cargando_curso" && courseData) {
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      }
      if (stepName === "cargando_videos" && videosData) {
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      }
      if (stepName === "verificando_inscripcion" && enrollmentData) {
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      }
    }
    return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />;
  };

  if (step === "error") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error de Debug</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">CourseId: {courseId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Debug Course Content - ID: {courseId}
        </h1>
        
        {/* Pasos de carga */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Estado de Carga</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              {getStepIcon("cargando_curso")}
              <span>1. Cargando curso</span>
              {courseData && <span className="text-green-600">✓ {courseData.title}</span>}
            </div>
            <div className="flex items-center space-x-3">
              {getStepIcon("cargando_videos")}
              <span>2. Cargando videos</span>
              {videosData && <span className="text-green-600">✓ {videosData.length} videos</span>}
            </div>
            <div className="flex items-center space-x-3">
              {getStepIcon("verificando_inscripcion")}
              <span>3. Verificando inscripción</span>
              {enrollmentData && <span className="text-green-600">✓ {enrollmentData.isEnrolled ? 'Inscrito' : 'No inscrito'}</span>}
            </div>
          </div>
        </div>

        {/* Datos cargados */}
        {step === "completado" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información del curso */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Curso</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Título:</strong> {courseData?.title}</p>
                <p><strong>Descripción:</strong> {courseData?.description}</p>
                <p><strong>Instructor:</strong> {courseData?.instructor?.userName}</p>
                <p><strong>Nivel:</strong> {courseData?.level}</p>
                <p><strong>Horas:</strong> {courseData?.estimatedHours}</p>
              </div>
            </div>

            {/* Videos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Videos ({videosData?.length || 0})</h3>
              <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                {videosData?.map((video, index) => (
                  <div key={index} className="border-b pb-2">
                    <p><strong>{video.title}</strong></p>
                    <p className="text-gray-600">Módulo: {video.moduleTitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseContentDebug;
