import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, CheckCircle, User, LogIn } from "lucide-react";

const CourseContentAuthTest = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState("checking");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  console.log("🔐 CourseContentAuthTest - Verificando autenticación");

  useEffect(() => {
    const checkAuth = () => {
      console.log("🔍 Verificando estado de autenticación...");
      
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log("🔑 Token encontrado:", storedToken ? "SÍ" : "NO");
      console.log("👤 Usuario encontrado:", storedUser ? "SÍ" : "NO");
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          setAuthStatus("authenticated");
          console.log("✅ Usuario autenticado:", userData);
        } catch (error) {
          console.error("❌ Error al parsear usuario:", error);
          setAuthStatus("error");
        }
      } else {
        setAuthStatus("not_authenticated");
        console.log("❌ Usuario NO autenticado");
      }
    };

    checkAuth();
  }, []);

  const getAuthStatusColor = () => {
    switch (authStatus) {
      case "checking": return "text-blue-600";
      case "authenticated": return "text-green-600";
      case "not_authenticated": return "text-red-600";
      case "error": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const getAuthStatusIcon = () => {
    switch (authStatus) {
      case "checking": return "⏳";
      case "authenticated": return "✅";
      case "not_authenticated": return "❌";
      case "error": return "⚠️";
      default: return "❓";
    }
  };

  const getAuthStatusText = () => {
    switch (authStatus) {
      case "checking": return "Verificando autenticación...";
      case "authenticated": return "¡Usuario autenticado!";
      case "not_authenticated": return "Usuario NO autenticado";
      case "error": return "Error en autenticación";
      default: return "Estado desconocido";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔐 Test de Autenticación - Curso ID: {courseId}
          </h1>
          
          {/* Estado de autenticación */}
          <div className={`text-center py-8 ${getAuthStatusColor()}`}>
            <div className="text-6xl mb-4">{getAuthStatusIcon()}</div>
            <h2 className="text-2xl font-semibold mb-2">{getAuthStatusText()}</h2>
            <p className="text-sm text-gray-500">Estado: {authStatus}</p>
          </div>

          {/* Información del usuario */}
          {authStatus === "authenticated" && user && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Usuario Autenticado
              </h3>
              <div className="space-y-2">
                <div>
                  <strong className="text-gray-700">Nombre:</strong>
                  <span className="ml-2 text-gray-900">{user.userName} {user.lastName}</span>
                </div>
                <div>
                  <strong className="text-gray-700">Email:</strong>
                  <span className="ml-2 text-gray-900">{user.email}</span>
                </div>
                <div>
                  <strong className="text-gray-700">Rol:</strong>
                  <span className="ml-2 text-gray-900">{user.role}</span>
                </div>
                <div>
                  <strong className="text-gray-700">Token:</strong>
                  <span className="ml-2 text-gray-900 text-sm">
                    {token ? `${token.substring(0, 20)}...` : "No disponible"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Usuario no autenticado */}
          {authStatus === "not_authenticated" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Usuario NO Autenticado
              </h3>
              <p className="text-red-700 mb-4">
                Para acceder al contenido del curso, necesitas iniciar sesión primero.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-red-600">
                  <strong>Credenciales de prueba:</strong>
                </p>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm">
                    <strong>Estudiante:</strong> student@test.com / Password123
                  </p>
                  <p className="text-sm">
                    <strong>Instructor:</strong> instructor@test.com / Password123
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error de autenticación */}
          {authStatus === "error" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Error en Autenticación
              </h3>
              <p className="text-yellow-700">
                Hubo un problema al verificar la autenticación. Intenta iniciar sesión nuevamente.
              </p>
            </div>
          )}

          {/* Información de debug */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Debug Info</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>CourseId:</strong> {courseId}</p>
              <p><strong>AuthStatus:</strong> {authStatus}</p>
              <p><strong>Token:</strong> {token ? "Presente" : "Ausente"}</p>
              <p><strong>User:</strong> {user ? "Presente" : "Ausente"}</p>
              <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
              <p><strong>URL:</strong> {window.location.href}</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-4">
            {authStatus === "not_authenticated" && (
              <button
                onClick={() => navigate("/authentication/login")}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </button>
            )}
            
            {authStatus === "authenticated" && (
              <button
                onClick={() => navigate(`/curso/${courseId}/content`)}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Ir al Contenido del Curso
              </button>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentAuthTest;
