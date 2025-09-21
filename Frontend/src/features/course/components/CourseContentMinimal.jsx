import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const CourseContentMinimal = () => {
  const { id: courseId } = useParams();
  const [status, setStatus] = useState("loading");
  const [courseData, setCourseData] = useState(null);
  const [error, setError] = useState(null);

  console.log("🚀 CourseContentMinimal - INICIANDO");
  console.log("📋 CourseId:", courseId);

  useEffect(() => {
    console.log("🔄 useEffect ejecutado");
    
    // Función síncrona para evitar problemas de asincronía
    const loadCourse = () => {
      try {
        console.log("⏳ Paso 1: Verificando token...");
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError("No hay token de autenticación");
          setStatus("error");
          return;
        }
        
        console.log("✅ Token encontrado");
        setStatus("loading_data");
        
        // Usar fetch con .then() en lugar de async/await para evitar problemas
        fetch(`http://localhost:8081/api/courses/${courseId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log("📊 Respuesta recibida:", response.status);
          
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }
          
          return response.json();
        })
        .then(data => {
          console.log("✅ Datos recibidos:", data);
          setCourseData(data);
          setStatus("success");
        })
        .catch(err => {
          console.error("❌ Error:", err);
          setError(err.message);
          setStatus("error");
        });
        
      } catch (err) {
        console.error("❌ Error síncrono:", err);
        setError(err.message);
        setStatus("error");
      }
    };

    if (courseId) {
      loadCourse();
    } else {
      setError("No se proporcionó ID de curso");
      setStatus("error");
    }
  }, [courseId]);

  const getStatusColor = () => {
    switch (status) {
      case "loading": return "text-blue-600";
      case "loading_data": return "text-yellow-600";
      case "success": return "text-green-600";
      case "error": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "loading": return "⏳";
      case "loading_data": return "🔄";
      case "success": return "✅";
      case "error": return "❌";
      default: return "❓";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "loading": return "Verificando autenticación...";
      case "loading_data": return "Cargando datos del curso...";
      case "success": return "¡Curso cargado exitosamente!";
      case "error": return "Error al cargar el curso";
      default: return "Estado desconocido";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🎯 Curso ID: {courseId}
          </h1>
          
          {/* Estado actual */}
          <div className={`text-center py-8 ${getStatusColor()}`}>
            <div className="text-6xl mb-4">{getStatusIcon()}</div>
            <h2 className="text-2xl font-semibold mb-2">{getStatusText()}</h2>
            <p className="text-sm text-gray-500">Estado: {status}</p>
          </div>

          {/* Error */}
          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Datos del curso */}
          {status === "success" && courseData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Datos del Curso</h3>
              <div className="space-y-3">
                <div>
                  <strong className="text-gray-700">Título:</strong>
                  <span className="ml-2 text-gray-900">{courseData.title}</span>
                </div>
                <div>
                  <strong className="text-gray-700">Descripción:</strong>
                  <span className="ml-2 text-gray-900">{courseData.description}</span>
                </div>
                <div>
                  <strong className="text-gray-700">Instructor:</strong>
                  <span className="ml-2 text-gray-900">
                    {courseData.instructor?.userName} {courseData.instructor?.lastName}
                  </span>
                </div>
                <div>
                  <strong className="text-gray-700">Precio:</strong>
                  <span className="ml-2 text-gray-900">${courseData.price}</span>
                </div>
                <div>
                  <strong className="text-gray-700">Nivel:</strong>
                  <span className="ml-2 text-gray-900">{courseData.level}</span>
                </div>
                <div>
                  <strong className="text-gray-700">Horas estimadas:</strong>
                  <span className="ml-2 text-gray-900">{courseData.estimatedHours}</span>
                </div>
                <div>
                  <strong className="text-gray-700">Módulos:</strong>
                  <span className="ml-2 text-gray-900">{courseData.modules?.length || 0}</span>
                </div>
              </div>
            </div>
          )}

          {/* Información de debug */}
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Debug Info</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>CourseId:</strong> {courseId}</p>
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Error:</strong> {error || "Ninguno"}</p>
              <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
              <p><strong>URL:</strong> {window.location.href}</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔄 Recargar
            </button>
            
            <button
              onClick={() => {
                console.clear();
                console.log("🧹 Consola limpiada");
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              🧹 Limpiar Consola
            </button>
            
            <button
              onClick={() => {
                const token = localStorage.getItem('token');
                console.log("🔑 Token:", token ? "ENCONTRADO" : "NO ENCONTRADO");
                alert(`Token: ${token ? "ENCONTRADO" : "NO ENCONTRADO"}`);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              🔑 Verificar Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentMinimal;
