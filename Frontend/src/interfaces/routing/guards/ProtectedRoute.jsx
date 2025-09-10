import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth'; // <- named import

const ProtectedRoute = ({ children, allowedRoles = ['student', 'teacher', 'admin'] }) => {
  const { isAuthenticated, user, loading, error: authError } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(loading);
  const [error, setError] = useState(null);

  // Normalización de roles
  const userRole = (user?.role || 'guest').toLowerCase().trim();
  const allowedRolesNormalized = allowedRoles.map(r => r.toLowerCase().trim());
  const hasRequiredRole = allowedRolesNormalized.includes(userRole);

  // Debug
  //console.log('ProtectedRoute check:', {
  //  location: location.pathname,
  //  userRole,
  //  allowedRolesNormalized,
  //  hasRequiredRole,
  //  isAuthenticated
  //});

  useEffect(() => {
    setIsLoading(loading);
    if (authError) {
      setError('Error al verificar la autenticación. ' + (authError.message || ''));
      setIsLoading(false);
    }
  }, [loading, authError]);

  // Mostrar mensaje de error si existe
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Mostrar carga mientras se verifica la autenticación
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/authtentication" state={{ from: location }} replace />;
  }

  // Redirigir si no tiene el rol adecuado
  if (!hasRequiredRole) {
    //console.warn(
    //  `Acceso denegado: El usuario (${userRole}) no tiene permiso para acceder a ${location.pathname}. Roles permitidos: ${allowedRoles.join(
    //    ', '
    //  )}`
    //);
    return <Navigate to="/no-autorizado" replace />;
  }

  // Si todo está bien, mostrar el contenido
  return children;
};

export default ProtectedRoute;
