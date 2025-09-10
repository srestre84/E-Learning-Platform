import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, BarChart3, MessageSquare, Clock, Award, BookCheck, Video, Plus, TrendingUp } from 'lucide-react';
import {useAuth} from '@/shared/hooks/useAuth';

// Componente de tarjeta de estadísticas
const StatCard = ({ title, value, icon: Icon, change, trend, color = 'indigo' }) => (
  <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
    <div className="p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${color === 'blue' ? 'bg-red-500' : color === 'indigo' ? 'bg-red-500' : `bg-${color}-500`} rounded-lg p-3`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    {change && (
      <div className="bg-gray-50 px-6 py-3">
        <div className="text-sm flex items-center">
          {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
          <span className={`font-medium ${trend === 'up' ? 'text-green-700' : 'text-gray-600'}`}>
            {change}
          </span>
        </div>
      </div>
    )}
  </div>
);

// Componente de acceso rápido
const QuickActionCard = ({ title, description, icon: Icon, to, color = 'indigo' }) => (
  <Link
    to={to}
    className="block p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300"
  >
    <div className="flex items-center">
      <div className={`flex-shrink-0 ${color === 'blue' ? 'bg-red-100' : color === 'indigo' ? 'bg-red-100' : `bg-${color}-100`} rounded-lg p-3`}>
        <Icon className={`h-6 w-6 ${color === 'blue' ? 'text-red-600' : color === 'indigo' ? 'text-red-600' : `text-${color}-600`}`} />
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </Link>
);

const TeacherDashboardHome = () => {
  // Datos de ejemplo para las estadísticas
  const stats = [
    { 
      title: 'Total Estudiantes', 
      value: '156', 
      icon: Users, 
      change: '+12 este mes',
      trend: 'up',
      color: 'red'
    },
    { 
      title: 'Cursos Activos', 
      value: '8', 
      icon: BookOpen, 
      change: '+2 este mes',
      trend: 'up',
      color: 'green'
    },
    { 
      title: 'Promedio de Finalización', 
      value: '78%', 
      icon: BarChart3,
      change: '+5% vs mes anterior',
      trend: 'up',
      color: 'purple'
    },
    { 
      title: 'Tareas por Revisar', 
      value: '24', 
      icon: BookCheck, 
      change: '5 urgentes',
      color: 'orange'
    },
    { 
      title: 'Horas de Clase', 
      value: '42h', 
      icon: Clock, 
      change: 'Esta semana',
      color: 'teal'
    },
    { 
      title: 'Valoración Promedio', 
      value: '4.8/5', 
      icon: Award,
      change: 'Basado en 89 reseñas',
      color: 'yellow'
    }
  ];

  const quickActions = [
    {
      title: 'Crear Nuevo Curso',
      description: 'Comienza a crear un curso desde cero',
      icon: Plus,
      to: '/teacher/courses/new',
      color: 'red'
    },
    {
      title: 'Ver Mis Cursos',
      description: 'Gestiona y edita tus cursos existentes',
      icon: BookOpen,
      to: '/teacher/courses',
      color: 'red'
    },
    {
      title: 'Revisar Estudiantes',
      description: 'Ve el progreso de tus estudiantes',
      icon: Users,
      to: '/teacher/students',
      color: 'green'
    },
    {
      title: 'Ver Análisis',
      description: 'Revisa las métricas de rendimiento',
      icon: BarChart3,
      to: '/teacher/analytics',
      color: 'purple'
    }
  ];

  const {user} = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel del Profesor</h1>
        <p className="mt-2 text-lg text-gray-600">
          Bienvenido de nuevo, {user?.name}. Aquí tienes un resumen de tu actividad.
        </p>
      </div>

      {/* Estadísticas */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen General</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Actividad Reciente */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Actividad Reciente</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    3 nuevos estudiantes se inscribieron en "Desarrollo Web Moderno"
                  </p>
                  <p className="text-sm text-gray-500">Hace 2 horas</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <BookCheck className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    5 tareas nuevas por revisar en "Python para Principiantes"
                  </p>
                  <p className="text-sm text-gray-500">Hace 4 horas</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Nueva reseña de 5 estrellas en "Machine Learning Básico"
                  </p>
                  <p className="text-sm text-gray-500">Ayer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardHome;
