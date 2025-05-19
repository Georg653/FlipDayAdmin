// src/services/admin/api/endpoints.ts

export const ENDPOINTS = {
  // Achievements
  ACHIEVEMENTS: `achievements/`,
  ACHIEVEMENT_DETAIL: (achievementId: number) => `achievements/${achievementId}/`,

  // Learning Pages
  LEARNING_PAGES_BY_SUBTOPIC: (subtopicId: number) => `learning-pages/subtopics/${subtopicId}/pages/`,
  LEARNING_PAGE_DETAIL: (pageId: number) => `learning-pages/pages/${pageId}/`,
  
  // Learning Subtopics
  LEARNING_SUBTOPICS_BY_TOPIC: (topicId: number) => `subtopics/topics/${topicId}/subtopics/`,
  LEARNING_SUBTOPIC_DETAIL: (subtopicId: number) => `subtopics/subtopics/${subtopicId}/`,

  // Learning Topics
  LEARNING_TOPICS_LIST: `topics/`, 
  LEARNING_TOPIC_DETAIL: (topicId: number) => `topics/${topicId}/`,
};