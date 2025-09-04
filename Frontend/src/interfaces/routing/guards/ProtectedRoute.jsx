import { Navigate, useLocation } from 'react-router-dom';
import useAuth from "@/shared/hooks/useAuth";
<<<<<<< Updated upstream
||||||| Stash base
import NotFound from "@/shared/ui/layout/NotFound";
=======
import { useEffect, useState } from 'react';
>>>>>>> Stashed changes

<<<<<<< Updated upstream
const ProtectedRoute = ({ children, allowedRoles = ['student'] }) => {
  const { isAuthenticated, user, loading } = useAuth();
||||||| Stash base
const ProtectedRoute = ({ children, allowedRoles = ['student' , 'teacher'] }) => {
  const { isAuthenticated, user, loading } = useAuth();
=======
// Componente de carga personalizado
const LoadingSpinner = ({ message = 'Cargando...' }) => (
  <div className="fixed inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
    <p className="text-gray-600">{message}</p>
  </div>
);

// Componente de error
const ErrorMessage = ({ message = 'Ocurrió un error inesperado', onRetry }) => (
  <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 p-4">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-md">
      <p className="font-bold">Error</p>
      <p>{message}</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Reintentar
      </button>
    )}
  </div>
);

const ProtectedRoute = ({ children, allowedRoles = ['student', 'teacher'] }) => {
  const { isAuthenticated, user, loading, error: authError } = useAuth();
>>>>>>> Stashed changes
  const location = useLocation();
<<<<<<< Updated upstream
||||||| Stash base
 
=======
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
>>>>>>> Stashed changes

  useEffect(() => {
    // Sincronizar el estado de carga
    setIsLoading(loading);

    // Manejar errores de autenticación
    if (authError) {
      setError('Error al verificar la autenticación. ' + (authError.message || ''));
      setIsLoading(false);
    }
  }, [loading, authError]);

  // Manejar reintento
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Aquí podrías implementar una función de reintento si es necesario
    window.location.reload();
  };

  // Mostrar estado de error
  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  // Mostrar estado de carga
  if (isLoading) {
    return <LoadingSpinner message="Verificando autenticación..." />;
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
<<<<<<< Updated upstream
    // Redirect to login page, saving the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
||||||| Stash base
    // Redirect to login page, saving the current location they were trying to go to
    return <Navigate to="not-found" state={{ from: location }} replace />;
=======
    return <Navigate to="/login" state={{ from: location }} replace />;
>>>>>>> Stashed changes
  }

  // Verificar si el usuario tiene el rol necesario
  if (!allowedRoles.includes(user?.role)) {
    // Redirigir a la página de inicio correspondiente según el rol
    const redirectPath = user?.role === 'teacher' ? '/teacher/courses' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
