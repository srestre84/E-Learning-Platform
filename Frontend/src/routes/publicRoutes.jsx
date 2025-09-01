import LandingLayout from "@/components/layout/LandingLayout";
import { lazy } from "react";

const Home = lazy(() => import("@/pages/Home"));
const LoginPage = lazy(() => import("@/pages/Auth/AuthPage"));
const CatalogoCursos = lazy(() => import("@/pages/CatalogoCursos"));

const publicRoutes = [
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: <Home />,
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
];

export default publicRoutes;
