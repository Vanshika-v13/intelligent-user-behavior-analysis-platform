import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

import LandingPage from '../pages/LandingPage';
import CoursesPage from '../pages/CoursesPage';
import CourseDetailPage from '../pages/CourseDetailPage';
import AboutPage from '../pages/AboutPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import MyLearningPage from '../pages/MyLearningPage';
import FeaturesPage from '../pages/FeaturesPage';
import QuizPage from '../pages/QuizPage';
import QuizResultsListPage from '../pages/QuizResultsListPage';
import QuizResultPage from '../pages/QuizResultPage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import CertificatesPage from '../pages/CertificatesPage';
import { ROUTES } from '../constants/routes';

// Analytics Route Code Splitting
const AnalyticsLayout = lazy(() => import('../layouts/AnalyticsLayout'));
const AnalyticsOverviewPage = lazy(() => import('../pages/analytics/AnalyticsOverviewPage'));
const AnalyticsUsersPage = lazy(() => import('../pages/analytics/AnalyticsUsersPage'));
const AnalyticsDevicesPage = lazy(() => import('../pages/analytics/AnalyticsDevicesPage'));
const AnalyticsSessionsPage = lazy(() => import('../pages/analytics/AnalyticsSessionsPage'));
const AnalyticsCoursesPage = lazy(() => import('../pages/analytics/AnalyticsCoursesPage'));
const AnalyticsVideosPage = lazy(() => import('../pages/analytics/AnalyticsVideosPage'));
const AnalyticsQuizzesPage = lazy(() => import('../pages/analytics/AnalyticsQuizzesPage'));
const AnalyticsFunnelsPage = lazy(() => import('../pages/analytics/AnalyticsFunnelsPage'));
const AnalyticsEngagementPage = lazy(() => import('../pages/analytics/AnalyticsEngagementPage'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public route */}
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        
        {/* Protected routes in MainLayout */}
        <Route path={ROUTES.COURSES} element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
        <Route path={ROUTES.COURSE_DETAIL} element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
        <Route path={ROUTES.COURSE_DETAIL + '/quiz'} element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path={ROUTES.COURSE_DETAIL + '/quiz-result'} element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>} />
        <Route path={ROUTES.ABOUT} element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
        <Route path={ROUTES.FEATURES} element={<ProtectedRoute><FeaturesPage /></ProtectedRoute>} />
      </Route>

      {/* Auth routes (Public) */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      {/* Dashboard routes (All Protected) */}
      <Route element={<DashboardLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path={ROUTES.PROFILE} element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path={ROUTES.SETTINGS} element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path={ROUTES.MY_LEARNING} element={<ProtectedRoute><MyLearningPage /></ProtectedRoute>} />
        <Route path="/dashboard/quizzes" element={<ProtectedRoute><QuizResultsListPage /></ProtectedRoute>} />
        <Route path="/dashboard/certificates" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
      </Route>

      {/* Analytics Foundation Routes (Isolated Module) */}
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Analytics...</div>}>
              <AnalyticsLayout />
            </Suspense>
          </ProtectedRoute>
        } 
      >
        <Route index element={<AnalyticsOverviewPage />} />
        <Route path="overview" element={<AnalyticsOverviewPage />} />
        <Route path="users" element={<AnalyticsUsersPage />} />
        <Route path="devices" element={<AnalyticsDevicesPage />} />
        <Route path="sessions" element={<AnalyticsSessionsPage />} />
        <Route path="courses" element={<AnalyticsCoursesPage />} />
        <Route path="videos" element={<AnalyticsVideosPage />} />
        <Route path="quizzes" element={<AnalyticsQuizzesPage />} />
        <Route path="funnels" element={<AnalyticsFunnelsPage />} />
        <Route path="engagement" element={<AnalyticsEngagementPage />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
