import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import TeacherRoute from '@/interfaces/routing/guards/TeacherRoute';
import TeacherDashboard from '@/features/teacher/components/TeacherDashboard';
import TeacherDashboardHome from '@/features/teacher/components/TeacherDashboardHome';
import TeacherAnalytics from '@/features/teacher/components/TeacherAnalytics';
import TeacherMessages from '@/features/teacher/components/TeacherMessages';
import TeacherSettings from '@/features/teacher/components/TeacherSettings';
import VideoProductionGuide from '@/features/teacher/components/VideoProductionGuide';
import ErrorBoundary from '@/ui/common/ErrorBoundary';
import AppLayout from '@/ui/layout/AppLayout';
import ProtectedRoute from '@/interfaces/routing/guards/ProtectedRoute';
import { Box, CircularProgress } from '@mui/material';

// Componentes lazy
const Courses = lazy(() => import('@/features/teacher/components/Courses'));

const Students = lazy(() => import('@/features/teacher/components/Students'));
const Analytics = lazy(() => import('@/features/teacher/components/Analytics'));
const CourseDetail = lazy(() => import('@/features/teacher/components/CourseDetail'));
const TeacherCourses = lazy(() => import('@/features/teacher/components/TeacherCourses'));
const CreateCourse = lazy(() => import('@/features/teacher/components/CreateCourse'));
const EditCourse = lazy(() => import('@/features/teacher/components/EditCourse'));
const TeacherStudents = lazy(() => import('@/features/teacher/components/TeacherStudents'));
const Profile = lazy(() => import('@/features/student/components/StudentProfileEditor'));

// Componente de carga
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

const teacherRoutes = [
  {
    element: (
      <ProtectedRoute allowedRoles={['teacher']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/teacher',
        element: (
          <TeacherRoute>
            <TeacherDashboard />
          </TeacherRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <TeacherDashboardHome />,
          },
          {
            path: 'courses',
            children: [
              {
                index: true,
                element: <TeacherCourses />,
              },
              {
                path: 'new',
                element: (
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      <CreateCourse />
                    </Suspense>
                  </ErrorBoundary>
                ),
              },
              {
                path: ':id',
                element: <CourseDetail />,
              },
              {
                path: ':id/edit',
                element: <EditCourse />,
              },
            ],
          },
          {
            path: 'students',
            children: [
              {
                index: true,
                element: <Students />,
              },
              {
                path: ':courseId',
                element: <TeacherStudents />,
              },
            ],
          },
          {
            path: 'analytics',
            element: <TeacherAnalytics />,
          },
          {
            path: 'messages',
            element: <TeacherMessages />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'settings',
            element: <TeacherSettings />,
          },
          {
            path: 'video-guide',
            element: <VideoProductionGuide />,
          },
        ],
      },
    ],
  },
];

export default teacherRoutes;
