// src/router/AppRoutes.tsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'; // Добавил BrowserRouter

// Импортируем нашу страницу достижений
const AchievementsPage = lazy(() => import('../pages/admin/AchievementsPage/AchievementsPage'));

// Компонент для отображения загрузки
const LoadingFallback = () => <div>Loading...</div>;

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Наша страница достижений */}
        <Route path="/admin/achievements" element={<AchievementsPage />} />

        {/* Редирект с главной страницы на страницу достижений (или куда тебе нужно) */}
        <Route path="/" element={<Navigate to="/admin/achievements" replace />} />
        
        {/* Страница не найдена */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
};

// Важно: AppRoutes должен быть обернут в BrowserRouter где-то выше по дереву компонентов,
// обычно в main.tsx или App.tsx.
// Если он еще не обернут, можно обернуть его здесь для простоты,
// или лучше сделать это в main.tsx.

// Вариант A: Обертка здесь (менее предпочтительно для больших приложений)
// const AppRouterWithProvider: React.FC = () => (
//   <BrowserRouter>
//     <AppRoutes />
//   </BrowserRouter>
// );
// export default AppRouterWithProvider;

// Вариант B: Просто экспортируем AppRoutes, а BrowserRouter будет в main.tsx (предпочтительно)
export default AppRoutes;