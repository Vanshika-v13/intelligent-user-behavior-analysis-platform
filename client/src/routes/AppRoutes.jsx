import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import PageLoader from '../components/ui/PageLoader';

// Lazy loading pages
const Home = React.lazy(() => import('../pages/Home'));
const About = React.lazy(() => import('../pages/About'));
const Courses = React.lazy(() => import('../pages/Courses'));
const CourseDetails = React.lazy(() => import('../pages/CourseDetails'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Sessions = React.lazy(() => import('../pages/Sessions'));
const Events = React.lazy(() => import('../pages/Events'));
const Journeys = React.lazy(() => import('../pages/Journeys'));
const Engagement = React.lazy(() => import('../pages/Engagement'));
const Users = React.lazy(() => import('../pages/Users'));
const Reports = React.lazy(() => import('../pages/Reports'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Layouts
const MainLayout = React.lazy(() => import('../layouts/MainLayout'));
const DashboardLayout = React.lazy(() => import('../layouts/DashboardLayout'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Main Routes */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.COURSES} element={<Courses />} />
          <Route path={ROUTES.COURSE_DETAILS} element={<CourseDetails />} />
        </Route>

        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.SESSIONS} element={<Sessions />} />
          <Route path={ROUTES.EVENTS} element={<Events />} />
          <Route path={ROUTES.JOURNEYS} element={<Journeys />} />
          <Route path={ROUTES.ENGAGEMENT} element={<Engagement />} />
          <Route path={ROUTES.USERS} element={<Users />} />
          <Route path={ROUTES.REPORTS} element={<Reports />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
