// src/DashboardStudent.jsx

"use client";

import React, { lazy, Suspense, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Button } from "@/ui/Button";
import { Progress } from "@/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Input } from "@/ui/Input";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { Skeleton } from "@/ui/skeleton";
import {
  Search,
  BookOpen,
  Star,
  Clock,
  Bell,
  ChevronRight,
  AlertCircle,
  ShoppingCart,
  PlayCircle,
  Award,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Users,
  Target,
} from "lucide-react";
import { useDashboard } from "@/shared/hooks/useDashboard";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "react-toastify";
import PurchasedCourses from "./PurchasedCourses";

// Componentes con lazy load
const DashboardStats = lazy(() => import("./DashboardStats"));
const ActivityFeed = lazy(() => import("./ActivityFeed"));
const CourseList = lazy(() => import("./CourseList"));
const UpcomingEvents = lazy(() => import("./UpcomingEvents"));
const ProgressOverview = lazy(() => import("./ProgressOverview"));
const RecentCourses = lazy(() => import("./RecentCourses"));
const CursosSugeridos = lazy(() =>
  import("@/features/marketing/components/CursosSugeridos")
);

// Componentes de esqueleto (Skeletons)
function CourseListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <Card
          key={index}
          className="flex flex-col animate-pulse bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl" />
          <CardHeader className="pb-3">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="h-3 bg-gray-200 rounded w-full mb-2" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
          </CardContent>
          <div className="p-4 border-t border-gray-100">
            <div className="h-10 bg-gray-200 rounded-lg" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function ActivitiesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-start space-x-3 animate-pulse">
          <div className="h-10 w-10 bg-gradient-to-br from-red-100 to-red-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EventsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4 animate-pulse">
          <div className="h-12 w-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-2 bg-gray-100 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardStudent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    isLoading,
    error,
    suggestedCourses,
    showSuggested,
    filteredCourses,
    stats,
    recentActivities,
    upcomingEvents,
    enrollments,
    refreshData,
  } = useDashboard();

  console.log("�� DashboardStudent - filteredCourses:", filteredCourses);
  console.log(
    "�� DashboardStudent - filteredCourses length:",
    filteredCourses?.length
  );
  console.log("�� DashboardStudent - isLoading:", isLoading);
  console.log(" DashboardStudent - error:", error);

  const handleUnenrollCourse = async (courseId) => {
    try {
      console.log("Desinscribiéndose del curso:", courseId);

      // Recargar los datos después de desinscribirse
      await refreshData();

      toast.success("Te has desinscrito del curso exitosamente");
    } catch (error) {
      console.error("Error al desinscribirse del curso:", error);
      toast.error("Error al desinscribirse del curso. Inténtalo de nuevo.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <CircularProgress size={60} />
          <p className="mt-4 text-gray-600">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-semibold mb-2">
            Error al cargar el dashboard
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 relative">
        {/* Header mejorado */}
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            ¡Hola,{" "}
            <span className="text-red-500 relative">
              {user?.userName || "Usuario"}!
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-red-200 rounded-full"></div>
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {format(new Date(), "EEEE, d MMMM", { locale: es })}
          </p>
          <p className="text-lg text-gray-500">
            Continúa tu viaje de aprendizaje
          </p>
        </div>

        {/* Estadísticas mejoradas */}
        <div className="mb-10">
          <Suspense fallback={<CourseListSkeleton />}>
            <DashboardStats stats={stats} />
          </Suspense>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Columna principal - Cursos */}
          <div className="xl:col-span-2 space-y-8">
            {/* Búsqueda mejorada */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar en tus cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg border-2   focus:ring-0 rounded-2xl   transition-all duration-300"
              />
            </div>
            {/* Progreso General */}
            <Suspense fallback={<CourseListSkeleton />}>
              <ProgressOverview enrollments={enrollments} />
            </Suspense>

            {/* Mis Cursos Inscritos */}
            <RecentCourses />

            {/* Cursos Sugeridos */}
            <Card className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl flex items-center gap-3 text-gray-900">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <ShoppingCart className="h-8 w-8 text-green-600" />
                  </div>
                  Cursos Sugeridos para Ti
                </CardTitle>
                <p className="text-gray-600 text-lg">
                  Descubre nuevos cursos basados en tus intereses
                </p>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Suspense fallback={<CourseListSkeleton />}>
                    <CourseListSkeleton />
                  </Suspense>
                ) : error ? (
                  <div className="p-12 text-center">
                    <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
                      <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Error al cargar sugerencias
                      </h3>
                      <p className="text-gray-600 mb-6">{error}</p>
                      <Button
                        onClick={() => window.location.reload()}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold">
                        Reintentar
                      </Button>
                    </div>
                  </div>
                ) : suggestedCourses && suggestedCourses.length > 0 ? (
                  <Suspense fallback={<CourseListSkeleton />}>
                    <CursosSugeridos courses={suggestedCourses} />
                  </Suspense>
                ) : (
                  <div className="p-16 text-center">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 border border-gray-200">
                      <TrendingUp className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        No hay cursos sugeridos disponibles
                      </h3>
                      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                        Estamos trabajando en recomendaciones personalizadas
                        para ti.
                      </p>
                      <Button
                        onClick={() => {
                          /* Navegar a catálogo completo */
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        <ArrowRight className="w-5 h-5 mr-2" />
                        Ver Todos los Cursos
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar mejorado */}
          <div className="space-y-6">
            {/* Actividad Reciente */}
            <Card className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3 text-gray-900">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Bell className="h-5 w-5 text-green-600" />
                  </div>
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<ActivitiesSkeleton />}>
                  <ActivityFeed activities={recentActivities} />
                </Suspense>
              </CardContent>
            </Card>

            {/* Próximos Eventos */}
            <Card className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3 text-gray-900">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<EventsSkeleton />}>
                  <UpcomingEvents events={upcomingEvents} />
                </Suspense>
              </CardContent>
            </Card>

            {/* Logros Recientes */}
            <Card className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3 text-gray-900">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  Logros Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                    <Award className="h-10 w-10 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Primer Curso Completado
                      </p>
                      <p className="text-sm text-gray-600">¡Felicitaciones!</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <Star className="h-10 w-10 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Estudiante Activo
                      </p>
                      <p className="text-sm text-gray-600">
                        7 días consecutivos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
                    <Target className="h-10 w-10 text-red-600" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Objetivo Semanal
                      </p>
                      <p className="text-sm text-gray-600">¡Completado!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
