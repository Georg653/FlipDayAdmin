// src/router/AppRoutes.tsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';

const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage/RegisterPage'));
const AchievementsPage = lazy(() => import('../pages/admin/AchievementsPage/AchievementsPage'));
const NewsPage = lazy(() => import('../pages/admin/NewsPage/NewsPage'));
const StoriesPage = lazy(() => import('../pages/admin/StoriesPage/StoriesPage'));
const ProposalsPage = lazy(() => import('../pages/admin/ProposalsPage/ProposalsPage'));
const RouteCategoriesPage = lazy(() => import('../pages/admin/RouteCategoriesPage/RouteCategoriesPage'));
const PointsPage = lazy(() => import('../pages/admin/PointsPage/PointsPage'));
const RoutesPage = lazy(() => import('../pages/admin/RoutesPage/RoutesPage')); // Этот импорт уже должен работать
const LearningTopicsPage = lazy(() => import('../pages/admin/LearningTopicsPage/LearningTopicsPage'));
const LearningSubtopicsPage = lazy(() => import('../pages/admin/LearningSubtopicsPage/LearningSubtopicsPage'));
const LearningPagesPage = lazy(() => import('../pages/admin/LearningPagesPage/LearningPagesPage'));

const LoadingFallback = () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem' }}>Загрузка страницы...</div>;

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="stories" element={<StoriesPage />} />
          <Route path="proposals" element={<ProposalsPage />} />
          <Route path="route-categories" element={<RouteCategoriesPage />} />
          <Route path="points" element={<PointsPage />} />
          <Route path="routes" element={<RoutesPage />} /> {/* Этот роут уже должен работать */}
          <Route path="topics" element={<LearningTopicsPage />} />
          <Route path="learning-subtopics" element={<LearningSubtopicsPage />} />
          <Route path="learning-pages" element={<LearningPagesPage />} />
          <Route index element={<Navigate to="proposals" replace />} /> 
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} /> 
        
        <Route path="*" element={
            <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
                <h1>404 - Страница не найдена</h1>
                <p>Извините, запрашиваемая страница не существует.</p>
                <Link to="/admin" style={{color: 'var(--admin-primary-color, #007bff)', fontWeight: 'bold', textDecoration: 'underline'}}>
                    Перейти в Админ-панель
                </Link>
            </div>
        } />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;