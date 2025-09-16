// src/DashboardStudent.jsx

'use client';

import React, { lazy, Suspense, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Button } from "@/ui/Button";
import { Progress } from "@/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Input } from "@/ui/Input";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { Skeleton } from "@/ui/skeleton";
import { Search, BookOpen, Star, Clock, Bell, ChevronRight, AlertCircle } from "lucide-react";
import { useDashboard } from "@/shared/hooks/useDashboard";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from 'react-router-dom';
import { getCourses } from '@/services/courseService'; 
import {getEnrolledCourses} from '@/services/enrollmentService'
import { useAuth } from "@/contexts/AuthContext";
import CourseList from "./CourseList";

// Componentes con lazy load
const DashboardStats = lazy(() => import('./DashboardStats'));
const ActivityFeed = lazy(() => import('./ActivityFeed'));
const UpcomingEvents = lazy(() => import('./UpcomingEvents'));
const CursosSugeridos = lazy(() => import('@/features/marketing/components/CursosSugeridos')); // Asegúrate de que la ruta sea correcta

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
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingSuggested, setLoadingSuggested] = useState(true);
  const [errorCourses, setErrorCourses] = useState(null);
  const [errorSuggested, setErrorSuggested] = useState(null);

  // Hook para cargar los cursos inscritos
  useEffect(() => {
    setLoadingCourses(true);
    getEnrolledCourses()
      .then(data => {
        setEnrolledCourses(data || []);
        setLoadingCourses(false);
      })
      .catch(error => {
        setErrorCourses("No se pudieron cargar tus cursos.");
        console.error(error);
        setLoadingCourses(false);
      });
  }, []);

  // Hook para cargar los cursos sugeridos
  useEffect(() => {
    setLoadingSuggested(true);
    getCourses()
      .then(data => {
        setSuggestedCourses(data || []);
        setLoadingSuggested(false);
      })
      .catch(error => {
        setErrorSuggested("No se pudieron cargar los cursos sugeridos.");
        console.error(error);
        setLoadingSuggested(false);
      });
  }, []);

  const { recentActivities, upcomingEvents } = useDashboard();

  // Filtrar cursos inscritos por búsqueda
  const filteredCourses = enrolledCourses.filter(course =>
    course.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-8">
      <div className="flex-1 space-y-6">
        <DashboardStats />
        
        {/* Sección de Mis Cursos */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Mis Cursos</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCourses ? (
              <CourseListSkeleton />
            ) : errorCourses ? (
              <div className="p-8 text-center text-red-500">
                <AlertCircle className="w-10 h-10 mx-auto mb-2" />
                <p>{errorCourses}</p>
              </div>
            ) : filteredCourses.length > 0 ? (
              <CourseList courses={filteredCourses} />
            ) : (
              <div className="p-8 text-center text-gray-500">
                <BookOpen className="w-10 h-10 mx-auto mb-2" />
                <p>Aún no estás inscrito en ningún curso.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Sección de Cursos Sugeridos */}
        <Suspense fallback={<CourseListSkeleton />}>
          {loadingSuggested ? (
            <CourseListSkeleton />
          ) : errorSuggested ? (
            <div className="p-8 text-center text-red-500">
              <AlertCircle className="w-10 h-10 mx-auto mb-2" />
              <p>{errorSuggested}</p>
            </div>
          ) : (
            <CursosSugeridos courses={suggestedCourses} />
          )}
        </Suspense>

      </div>

      <div className="lg:col-span-1 space-y-6 lg:min-w-[300px] lg:max-w-[400px]">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ActivitiesSkeleton />}>
              <ActivityFeed activities={recentActivities} />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<EventsSkeleton />}>
              <UpcomingEvents events={upcomingEvents} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}