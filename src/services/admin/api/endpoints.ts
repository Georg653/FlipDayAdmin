// src/services/admin/api/endpoints.ts

export const ENDPOINTS = {
  // AUTHENTICATION
  LOGIN: ``, // Путь для логина относительно baseURL (если он есть в axiosInstance для auth)
             // или это может быть полный URL, если auth на другом сервисе/префиксе
  REGISTER: `register/`, 
  TOKEN_REFRESH: `token/refresh/`,
  PASSWORD_RESET_CONFIRM: `password-reset/confirm/`,
  
  // ACHIEVEMENTS
  ACHIEVEMENTS: `achievements/`,
  ACHIEVEMENT_DETAIL: (achievementId: number) => `achievements/${achievementId}/`,

  // NEWS
  NEWS_LIST: `news/`,
  NEWS_DETAIL: (newsId: number) => `news/${newsId}/`,

  // STORIES
  STORIES: `stories/`,
  STORY_DETAIL: (storyId: number) => `stories/${storyId}/`,

  // ROUTE CATEGORIES
  ROUTE_CATEGORIES: `route-categories/`,
  ROUTE_CATEGORY_DETAIL: (categoryId: number) => `route-categories/${categoryId}/`,

  // POINTS
  POINTS: `points/`,
  POINT_DETAIL: (pointId: number) => `points/${pointId}/`,
  POINT_CONTENT: (pointId: number) => `points/${pointId}/content/`,

  // ROUTES (НОВАЯ СЕКЦИЯ - ДОБАВЛЕНА)
  ROUTES: `routes/`,
  ROUTE_DETAIL: (routeId: number) => `routes/${routeId}/`,

  // LEARNING TOPICS
  LEARNING_TOPICS_LIST: `topics/`, // Убедись, что префикс /learning- или подобный не нужен, если они вложены
  LEARNING_TOPIC_DETAIL: (topicId: number) => `topics/${topicId}/`,

  // LEARNING SUBTOPICS
  LEARNING_SUBTOPICS_BY_TOPIC: (topicId: number) => `subtopics/topics/${topicId}/subtopics/`,
  LEARNING_SUBTOPIC_DETAIL: (subtopicId: number) => `subtopics/subtopics/${subtopicId}/`,

  // LEARNING PAGES
  LEARNING_PAGES_BY_SUBTOPIC: (subtopicId: number) => `learning-pages/subtopics/${subtopicId}/pages/`,
  LEARNING_PAGE_DETAIL: (pageId: number) => `learning-pages/pages/${pageId}/`,

  // PROPOSALS
  PROPOSALS: `proposals/`,
  PROPOSAL_DETAIL: (proposalId: string) => `proposals/${proposalId}/`,
  PROPOSAL_UPDATE_STATUS: (proposalId: string) => `proposals/${proposalId}/status/`,
};