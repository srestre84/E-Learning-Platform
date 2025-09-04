import { Navigate, useLocation } from 'react-router-dom';
import useAuth from "@/shared/hooks/useAuth";
import NotFound from "@/shared/ui/layout/NotFound";

const ProtectedRoute = ({ children, allowedRoles = ['student' , 'teacher'] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
 

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
    // Redirect to login page, saving the current location they were trying to go to
    return <Navigate to="not-found" state={{ from: location }} replace />;
  }

  // Verificar si el usuario tiene el rol necesario
  if (!allowedRoles.includes(user?.role)) {
    // Redirigir a la página de inicio correspondiente según el rol
    const redirectPath = user?.role === 'teacher' ? '/teacher/courses' : '/';
    return <Navigate to={ notFound} replace />;
  }

  return children;
};

export default ProtectedRoute;
