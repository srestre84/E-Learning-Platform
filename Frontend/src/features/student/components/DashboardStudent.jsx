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
} from "lucide-react";
import { useDashboard } from "@/shared/hooks/useDashboard";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="flex flex-col animate-pulse">
          <div className="w-full h-32 bg-gray-200 rounded-t-lg" />
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="h-2 bg-gray-200 rounded w-full mb-2" />
            <div className="h-2 bg-gray-200 rounded w-5/6" />
          </CardContent>
          <div className="p-4 border-t border-gray-200">
            <div className="h-8 bg-gray-200 rounded" />
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
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
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
          <div className="h-10 w-10 bg-gray-200 rounded-md" />
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
  } = useDashboard();

  // Debug: Ver qué datos están llegando
  console.log("DashboardStudent - showSuggested:", showSuggested);
  console.log("DashboardStudent - filteredCourses:", filteredCourses);
  console.log("DashboardStudent - enrollments:", enrollments);

  const handleUnenrollCourse = async (courseId) => {
    try {
      // Aquí implementarías la llamada a la API para desinscribirse
      console.log("Desinscribiéndose del curso:", courseId);

      // Por ahora, solo mostramos un mensaje
      alert(
        "Función de desinscripción en desarrollo. El curso será removido de la lista."
      );

      // TODO: Implementar llamada real a la API
      // await unenrollFromCourse(courseId);
    } catch (error) {
      console.error("Error al desinscribirse del curso:", error);
      alert("Error al desinscribirse del curso. Inténtalo de nuevo.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <AlertCircle className="w-10 h-10 mx-auto mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            ¡Hola, {user?.userName || "Usuario"}! 👋
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            {format(new Date(), "EEEE, d MMMM", { locale: es })}
          </p>
        </div>

        {/* Estadísticas */}
        <div className="mb-8">
          <Suspense fallback={<CourseListSkeleton />}>
            <DashboardStats stats={stats} />
          </Suspense>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Columna principal - Cursos y Progreso */}
          <div className="xl:col-span-2 space-y-8">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar en tus cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              />
            </div>

            {/* Cursos Recientes */}
            <Suspense fallback={<CourseListSkeleton />}>
              <RecentCourses
                enrollments={enrollments}
                onViewAll={() => {
                  /* Navegar a página de cursos */
                }}
              />
            </Suspense>

            {/* Progreso General */}
            <Suspense fallback={<CourseListSkeleton />}>
              <ProgressOverview enrollments={enrollments} />
            </Suspense>

            {/* Cursos Sugeridos o Mis Cursos */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  {showSuggested ? "Cursos Sugeridos para Ti" : "Mis Cursos"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Suspense fallback={<CourseListSkeleton />}>
                    <CourseListSkeleton />
                  </Suspense>
                ) : error ? (
                  <div className="p-8 text-center text-red-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg">{error}</p>
                    <Button
                      onClick={() => window.location.reload()}
                      className="mt-4">
                      Reintentar
                    </Button>
                  </div>
                ) : showSuggested ? (
                  <Suspense fallback={<CourseListSkeleton />}>
                    <CursosSugeridos courses={suggestedCourses} />
                  </Suspense>
                ) : filteredCourses && filteredCourses.length > 0 ? (
                  <Suspense fallback={<CourseListSkeleton />}>
                    <CourseList
                      courses={filteredCourses}
                      onUnenroll={handleUnenrollCourse}
                    />
                  </Suspense>
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold mb-2">
                      {searchTerm
                        ? "No se encontraron cursos que coincidan con tu búsqueda."
                        : "Aún no estás inscrito en ningún curso."}
                    </h3>
                    <p className="mb-6">
                      {searchTerm
                        ? "Intenta con otros términos de búsqueda."
                        : "Explora nuestros cursos disponibles y comienza tu viaje de aprendizaje."}
                    </p>
                    <Button
                      onClick={() => {
                        /* Navegar a catálogo */
                      }}
                      className="bg-blue-600 hover:bg-blue-700">
                      Explorar Cursos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Actividad y Eventos */}
          <div className="space-y-6">
            {/* Actividad Reciente */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bell className="h-5 w-5 text-green-600" />
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
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<EventsSkeleton />}>
                  <UpcomingEvents events={upcomingEvents} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
