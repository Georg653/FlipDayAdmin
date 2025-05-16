// src/router/AppRoutes.tsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';

const AchievementsPage = lazy(() => import('../pages/admin/AchievementsPage/AchievementsPage'));
const LearningPagesPage = lazy(() => import('../pages/admin/LearningPagesPage/LearningPagesPage')); // Раскомментировали и добавили

const LoadingFallback = () => <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка страницы...</div>;

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="learning-pages" element={<LearningPagesPage />} /> {/* <--- НОВЫЙ РОУТ */}
          <Route index element={<Navigate to="achievements" replace />} /> 
        </Route>

        <Route path="/" element={<Navigate to="/admin/achievements" replace />} />
        <Route path="*" element={<div style={{ padding: '20px', textAlign: 'center' }}>404 - Страница не найдена</div>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;