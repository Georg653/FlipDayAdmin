// src/services/admin/api/endpoints.ts

// Т.к. baseURL уже есть в axiosInstance, здесь можно использовать относительные пути от /v1/admin
export const ENDPOINTS = {
  ACHIEVEMENTS: `achievements/`, // Уже будет /v1/admin/achievements/
  ACHIEVEMENT_DETAIL: (achievementId: number) => `achievements/${achievementId}/`, // Уже будет /v1/admin/achievements/{id}/
};