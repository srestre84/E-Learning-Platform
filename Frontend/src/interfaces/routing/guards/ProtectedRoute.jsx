import { Navigate, useLocation } from 'react-router-dom';
import useAuth from "@/shared/hooks/useAuth";
import NotFound from "@/shared/ui/layout/NotFound";

const ProtectedRoute = ({ children, allowedRoles = ['student' , 'teacher'] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
 

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
