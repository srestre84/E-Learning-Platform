import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import LandingLayout from "@/ui/layout/LandingLayout";

const Home = lazy(() => import("@/features/marketing/pages/Home"));
const LoginPage = lazy(() => import("@/features/auth/pages/AuthPage"));
const CatalogoCursos = lazy(() => import("@/features/marketing/pages/CatalogoCursos"));
const ComoFunciona = lazy(() => import("@/features/marketing/pages/comoFunciona"));

const publicRoutes = [
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "comoFunciona",
        element: <ComoFunciona />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/cursos",
    element: <CatalogoCursos />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export default publicRoutes;
