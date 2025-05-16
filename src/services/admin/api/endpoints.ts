// src/services/admin/api/endpoints.ts

// Т.к. baseURL уже есть в axiosInstance (предположительно '/v1/admin'),
// здесь можно использовать относительные пути от /v1/admin

export const ENDPOINTS = {
  // Achievements
  ACHIEVEMENTS: `achievements/`,
  ACHIEVEMENT_DETAIL: (achievementId: number) => `achievements/${achievementId}/`,

  // --- НОВЫЕ ЭНДПОИНТЫ ДЛЯ LEARNING PAGES ---
  // Для создания и получения списка страниц в контексте подтемы
  LEARNING_PAGES_BY_SUBTOPIC: (subtopicId: number) => `learning-pages/subtopics/${subtopicId}/pages/`,
  // Для получения, обновления, удаления конкретной страницы по ее ID
  LEARNING_PAGE_DETAIL: (pageId: number) => `learning-pages/pages/${pageId}/`,
  
  // Если/когда появится API для списка подтем, добавим сюда:
  // SUBTOPICS_LIST: `subtopics/`, // Пример
  // --- КОНЕЦ НОВЫХ ЭНДПОИНТОВ ---

  // ... другие эндпоинты из твоего проекта ...
};