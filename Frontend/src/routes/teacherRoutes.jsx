import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AppLayout from '@/ui/layout/AppLayout';
import ProtectedRoute from '@/interfaces/routing/guards/ProtectedRoute';
import LazyComponent from './components/LazyComponent';

// Lazy load all teacher components
const TeacherDashboard = lazy(() => import('@/features/teacher/components/TeacherDashboard'));
const TeacherDashboardHome = lazy(() => import('@/features/teacher/components/TeacherDashboardHome'));
const AnalyticsDashboard = lazy(() => import('@/features/teacher/components/AnalyticsDashboard'));
const TeacherMessages = lazy(() => import('@/features/teacher/components/TeacherMessages'));
const VideoProductionGuide = lazy(() => import('@/features/teacher/components/VideoProductionGuide'));
const TeacherCourses = lazy(() => import('@/features/teacher/components/TeacherCourses'));
const CreateCourse = lazy(() => import('@/features/teacher/components/CreateCourseSimple'));
const EditCourse = lazy(() => import('@/features/teacher/components/EditCourse'));
const TeacherStudents = lazy(() => import('@/features/teacher/components/TeacherStudentsComponent'));
const TeacherAllStudents = lazy(() => import('@/features/teacher/components/TeacherAllStudents'));
const TeacherStudentsDebug = lazy(() => import('@/features/teacher/components/TeacherStudentsDebug'));
const TeacherStudentsSimple = lazy(() => import('@/features/teacher/components/TeacherStudentsSimple'));
const TeacherStudentsReal = lazy(() => import('@/features/teacher/components/TeacherStudentsReal'));
const CourseDetail = lazy(() => import('@/features/teacher/components/CourseDetail'));
const TeacherProfile = lazy(() => import('@/features/teacher/components/TeacherProfileEditor'));
const TeacherSettings = lazy(() => import('@/features/teacher/components/TeacherSettings'));


const teacherRoutes = [
  {
    element: (
      <ProtectedRoute allowedRoles={['teacher', 'instructor']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/teacher',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />
          },
          {
            path: 'dashboard',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={TeacherDashboardHome} />
              }
            ]
          },
          {
            path: 'profile',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={TeacherProfile} />
              }
            ]
          },
          {
            path: 'courses',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={TeacherCourses} />
              },
              {
                path: 'create',
                element: <LazyComponent component={CreateCourse} />
              },
              {
                path: ':id/edit',
                element: <LazyComponent component={EditCourse} />
              },
              {
                path: ':id',
                element: <LazyComponent component={CourseDetail} />
              }
            ]
          },
          {
            path: 'students',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={TeacherStudentsReal} />
              },
              {
                path: ':courseId',
                element: <LazyComponent component={TeacherStudents} />
              }
            ]
          },
          {
            path: 'analytics',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={AnalyticsDashboard} />
              }
            ]
          },
          {
            path: 'messages',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={TeacherMessages} />
              }
            ]
          },
          {
            path: 'settings',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={TeacherSettings} />
              }
            ]
          },
          {
            path: 'video-guide',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={VideoProductionGuide} />
              }
            ]
          },
          {
            path: '*',
            element: <Navigate to="/teacher/dashboard" replace />
          }
        ]
      }
    ]
  }
];

export default teacherRoutes;
