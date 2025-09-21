import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const CourseContentTest = () => {
  const { id: courseId } = useParams();
  const [step, setStep] = useState("inicial");

  console.log("🚀 CourseContentTest - INICIANDO");
  console.log("📋 CourseId:", courseId);
  console.log("📊 Step actual:", step);

  useEffect(() => {
    console.log("🔄 useEffect ejecutado");
    
    const testLoad = async () => {
      try {
        setStep("cargando");
        console.log("⏳ Paso 1: Cargando...");
        
        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStep("verificando_token");
        console.log("🔑 Paso 2: Verificando token...");
        
        const token = localStorage.getItem('token');
        console.log("🔑 Token encontrado:", token ? "SÍ" : "NO");
        
        if (!token) {
          setStep("error_sin_token");
          return;
        }
        
        setStep("haciendo_request");
        console.log("🌐 Paso 3: Haciendo request...");
        
        const response = await fetch(`http://localhost:8081/api/courses/${courseId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log("📊 Respuesta status:", response.status);
        
        if (!response.ok) {
          setStep("error_request");
          return;
        }
        
        const data = await response.json();
        console.log("✅ Datos recibidos:", data);
        
        setStep("exito");
        console.log("🎉 ¡ÉXITO! Datos cargados correctamente");
        
      } catch (error) {
        console.error("❌ Error:", error);
        setStep("error_general");
      }
    };

    if (courseId) {
      testLoad();
    } else {
      setStep("error_sin_id");
    }
  }, [courseId]);

  const getStepColor = (currentStep) => {
    if (currentStep === step) return "text-blue-600 font-bold";
    if (step === "exito") return "text-green-600";
    if (step.startsWith("error")) return "text-red-600";
    return "text-gray-400";
  };

  const getStepIcon = (currentStep) => {
    if (currentStep === step) return "⏳";
    if (step === "exito") return "✅";
    if (step.startsWith("error")) return "❌";
    return "⭕";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 Test de Carga - Curso ID: {courseId}
          </h1>
          
          <div className="space-y-4 mb-8">
            <div className={`flex items-center space-x-3 ${getStepColor("inicial")}`}>
              <span className="text-2xl">{getStepIcon("inicial")}</span>
              <span>1. Inicializando componente</span>
            </div>
            
            <div className={`flex items-center space-x-3 ${getStepColor("cargando")}`}>
              <span className="text-2xl">{getStepIcon("cargando")}</span>
              <span>2. Cargando datos...</span>
            </div>
            
            <div className={`flex items-center space-x-3 ${getStepColor("verificando_token")}`}>
              <span className="text-2xl">{getStepIcon("verificando_token")}</span>
              <span>3. Verificando token de autenticación</span>
            </div>
            
            <div className={`flex items-center space-x-3 ${getStepColor("haciendo_request")}`}>
              <span className="text-2xl">{getStepIcon("haciendo_request")}</span>
              <span>4. Haciendo request al backend</span>
            </div>
            
            <div className={`flex items-center space-x-3 ${getStepColor("exito")}`}>
              <span className="text-2xl">{getStepIcon("exito")}</span>
              <span>5. ¡Datos cargados exitosamente!</span>
            </div>
          </div>

          {/* Estados de error */}
          {step.startsWith("error") && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Detectado</h3>
              <div className="space-y-2 text-red-700">
                {step === "error_sin_token" && (
                  <p>❌ No se encontró token de autenticación en localStorage</p>
                )}
                {step === "error_sin_id" && (
                  <p>❌ No se proporcionó ID de curso</p>
                )}
                {step === "error_request" && (
                  <p>❌ Error en la petición al backend</p>
                )}
                {step === "error_general" && (
                  <p>❌ Error general en la carga</p>
                )}
              </div>
            </div>
          )}

          {/* Información de debug */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Información de Debug</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>CourseId:</strong> {courseId || "No disponible"}</p>
              <p><strong>Step actual:</strong> {step}</p>
              <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
              <p><strong>User Agent:</strong> {navigator.userAgent}</p>
              <p><strong>URL actual:</strong> {window.location.href}</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔄 Recargar Página
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
                console.log("🔑 Token actual:", token);
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

export default CourseContentTest;
