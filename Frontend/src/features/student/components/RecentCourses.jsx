import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Button } from "@/ui/Button";
import { Progress } from "@/ui/progress";
import { Badge } from "@/ui/badge";
import {
  BookOpen,
  Play,
  Clock,
  User,
  Calendar,
  ArrowRight,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RecentCourses({ enrollments = [], onViewAll }) {
  const navigate = useNavigate();

  // Obtener cursos recientes (últimos 4)
  const recentCourses = enrollments
    .sort((a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate))
    .slice(0, 4);

  const handleContinueCourse = (enrollment) => {
    const course = enrollment.course;
    if (!course) return;

    navigate(`/curso/${course.id}`, {
      state: {
        lastAccessed: enrollment.lastAccessed,
        progress: enrollment.progressPercentage,
        lastLessonId: enrollment.lastLessonId,
      },
    });
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getButtonText = (enrollment) => {
    if (enrollment.status === "COMPLETED") {
      return "Ver de nuevo";
    }
    if (enrollment.progressPercentage === 0) {
      return "Empezar curso";
    }
    return "Continuar";
  };

  const getButtonVariant = (enrollment) => {
    if (enrollment.status === "COMPLETED") {
      return "outline";
    }
    return "default";
  };

  if (recentCourses.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700">
            <BookOpen className="h-5 w-5" />
            Cursos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No tienes cursos recientes
          </h3>
          <p className="text-gray-500 mb-4">
            Inscríbete en algunos cursos para verlos aquí.
          </p>
          <Button onClick={onViewAll} className="bg-blue-600 hover:bg-blue-700">
            Explorar Cursos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Cursos Recientes
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="text-blue-600 hover:text-blue-700">
          Ver todos
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentCourses.map((enrollment) => {
          const course = enrollment.course;
          if (!course) return null;

          const enrollmentDate = new Date(enrollment.enrollmentDate);
          const daysAgo = Math.floor(
            (Date.now() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={enrollment.id}
              className="group p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-blue-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {course.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {course.shortDescription || course.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {course.instructor?.userName || "Instructor"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {daysAgo === 0
                        ? "Hoy"
                        : `Hace ${daysAgo} día${daysAgo > 1 ? "s" : ""}`}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.estimatedHours || 0}h estimadas
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex-shrink-0">
                  <Badge
                    variant={
                      enrollment.status === "COMPLETED"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      enrollment.status === "COMPLETED"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }>
                    {enrollment.status === "COMPLETED"
                      ? "Completado"
                      : "En Progreso"}
                  </Badge>
                </div>
              </div>

              {enrollment.status === "ACTIVE" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-medium text-gray-900">
                      {enrollment.progressPercentage || 0}%
                    </span>
                  </div>
                  <Progress
                    value={enrollment.progressPercentage || 0}
                    className="h-2"
                    indicatorColor={getProgressColor(
                      enrollment.progressPercentage || 0
                    )}
                  />
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  {course.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {course.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {course.category && (
                    <Badge variant="outline" className="text-xs">
                      {course.category.name}
                    </Badge>
                  )}
                </div>

                <Button
                  variant={getButtonVariant(enrollment)}
                  size="sm"
                  onClick={() => handleContinueCourse(enrollment)}
                  className="group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Play className="mr-1 h-3 w-3" />
                  {getButtonText(enrollment)}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
