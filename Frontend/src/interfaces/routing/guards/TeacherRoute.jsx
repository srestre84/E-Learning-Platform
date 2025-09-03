import { Navigate, useLocation } from 'react-router-dom';
import useAuth from "@/shared/hooks/useAuth";

const TeacherRoute = ({ children }) => {
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
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is a teacher
  if (user?.role !== 'teacher') {
    // Redirect to home page if not a teacher
    return <Navigate to="/" replace />;
  }

  return children;
};

export default TeacherRoute;
