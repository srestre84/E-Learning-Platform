import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import LandingLayout from "@/ui/layout/LandingLayout";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load components with Suspense wrapper
const withSuspense = (Component) => (props) => (
  <Suspense fallback={<LoadingSpinner className="min-h-[60vh]" />}>
    <Component {...props} />
  </Suspense>
);

// lazy cargar componente
const lazyLoad = (importFn) => withSuspense(lazy(importFn));

// importar paginas con lazy 
const LandingPage = lazy(() => import("@/features/marketing/pages/home"));
const LoginPage = lazy(() => import("@/features/auth/pages/AuthPage"))
const CatalogoCursos = lazy(() => import("@/features/marketing/pages/CatalogoCursos"));
const CourseDetail = lazy(() => import("@/features/course/components/CourseDetail"));
const NotFoundPage = lazy(() => import("@/shared/ui/layout/NotFound"));
const ComoFunciona = lazyLoad(() => import("@/features/marketing/pages/comoFunciona"));
const TestConnection = lazyLoad(() => import("@/features/test/TextConnection"));
const ErrorPage = lazyLoad(() => import("@/pages/ErrorPage"));

const publicRoutes = [
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        index: true,
        errorElement: <ErrorPage />,
        element: <LandingPage />,
      },
      {
        path: "comoFunciona",
        element: <ComoFunciona />,
      },
      {
        path: "test-connection",
        element: <TestConnection />,
      },
      {
        path: "cursos",
        element: <CatalogoCursos />,
      },
      {
        path: "curso/:courseId/detalle",
        element: <CourseDetail />,
      },
      {
        path: "not-found",
        element: <NotFoundPage />,
      },
      {
        path: "*",
        element: <Navigate to="/not-found" replace />,
      },
    ],
  },
  {
    path: "auth",
    element: <LoginPage />,
  },
 
  // This catch-all route is now handled by the root router
];

export default publicRoutes;
