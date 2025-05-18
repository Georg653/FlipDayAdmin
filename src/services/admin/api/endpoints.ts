// src/services/admin/api/endpoints.ts

export const ENDPOINTS = {
  // Achievements
  ACHIEVEMENTS: `achievements/`,
  ACHIEVEMENT_DETAIL: (achievementId: number) => `achievements/${achievementId}/`,

  // Learning Pages
  LEARNING_PAGES_BY_SUBTOPIC: (subtopicId: number) => `learning-pages/subtopics/${subtopicId}/pages/`,
  LEARNING_PAGE_DETAIL: (pageId: number) => `learning-pages/pages/${pageId}/`,
 
  LEARNING_SUBTOPICS_BY_TOPIC: (topicId: number) => `subtopics/topics/${topicId}/subtopics/`,
  
  LEARNING_SUBTOPIC_DETAIL: (subtopicId: number) => `subtopics/subtopics/${subtopicId}/`,

    LEARNING_TOPICS_LIST: `topics/`, // Пример, если будет такой эндпоинт для списка тем
  
};