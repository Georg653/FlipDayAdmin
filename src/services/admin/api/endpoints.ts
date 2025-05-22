// src/services/admin/api/endpoints.ts

export const ENDPOINTS = {
  // AUTHENTICATION
  LOGIN: ``, 
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

  // LEARNING TOPICS
  LEARNING_TOPICS_LIST: `topics/`,
  LEARNING_TOPIC_DETAIL: (topicId: number) => `topics/${topicId}/`,

  // LEARNING SUBTOPICS
  LEARNING_SUBTOPICS_BY_TOPIC: (topicId: number) => `subtopics/topics/${topicId}/subtopics/`,
  LEARNING_SUBTOPIC_DETAIL: (subtopicId: number) => `subtopics/subtopics/${subtopicId}/`,

  // LEARNING PAGES
  LEARNING_PAGES_BY_SUBTOPIC: (subtopicId: number) => `learning-pages/subtopics/${subtopicId}/pages/`,
  LEARNING_PAGE_DETAIL: (pageId: number) => `learning-pages/pages/${pageId}/`,

  // --- PROPOSALS --- (НОВАЯ СЕКЦИЯ)
  PROPOSALS: `proposals/`, // Для GET списка предложений
  PROPOSAL_DETAIL: (proposalId: string) => `proposals/${proposalId}/`, // Для GET одного предложения
  PROPOSAL_UPDATE_STATUS: (proposalId: string) => `proposals/${proposalId}/status/`, // Для PATCH обновления статуса
  // --- КОНЕЦ PROPOSALS ---
};