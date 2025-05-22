// src/router/AppRoutes.tsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';

const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage/RegisterPage'));
const AchievementsPage = lazy(() => import('../pages/admin/AchievementsPage/AchievementsPage'));
const StoriesPage = lazy(() => import('../pages/admin/StoriesPage/StoriesPage'));
const ProposalsPage = lazy(() => import('../pages/admin/ProposalsPage/ProposalsPage')); // <<<--- НОВЫЙ ИМПОРТ
const LearningTopicsPage = lazy(() => import('../pages/admin/LearningTopicsPage/LearningTopicsPage'));
const LearningSubtopicsPage = lazy(() => import('../pages/admin/LearningSubtopicsPage/LearningSubtopicsPage'));
const LearningPagesPage = lazy(() => import('../pages/admin/LearningPagesPage/LearningPagesPage'));
const NewsPage = lazy(() => import('../pages/admin/NewsPage/NewsPage'));

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
          <Route path="proposals" element={<ProposalsPage />} /> {/* <<<--- НОВЫЙ РОУТ */}
          <Route path="learning-topics" element={<LearningTopicsPage />} />
          <Route path="learning-subtopics" element={<LearningSubtopicsPage />} />
          <Route path="learning-pages" element={<LearningPagesPage />} />
          {/* Редирект для /admin, можно направить на proposals или оставить achievements */}
          <Route index element={<Navigate to="proposals" replace />} /> 
        </Route>

        {/* Редирект с главной, если пользователь не залогинен, на /login */}
        {/* Если залогинен, то можно на /admin/proposals или другую стартовую админскую страницу */}
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