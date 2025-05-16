// src/services/admin/Achievements/achievementsApi.ts

import axiosInstance from '../api/axios'; // Путь теперь правильный, если структура верна
import { ENDPOINTS } from '../api/endpoints'; // Исправлено на 'endpoints'
import { buildQueryString } from '../api/buildQuery'; // Путь теперь правильный

// Используем type-only import для типов
import type {
  Achievement,
  AchievementCreatePayload,
  AchievementUpdatePayload,
  PaginatedAchievementsResponse,
  AchievementFilterParams,
} from '../../../types/admin/Achievements/achievement.types';

export const AchievementsApi = {
  getAchievements: async (
    params: AchievementFilterParams = {}
  ): Promise<PaginatedAchievementsResponse> => {
    const query = buildQueryString({
      limit: params.limit,
      offset: params.offset,
    });
    // Предполагаем, что axiosInstance.baseURL = '/v1/admin'
    // ENDPOINTS.ACHIEVEMENTS = 'achievements/'
    // Итоговый URL будет: /v1/admin/achievements/?limit=X&offset=Y
    const response = await axiosInstance.get<Achievement[] | PaginatedAchievementsResponse>(`${ENDPOINTS.ACHIEVEMENTS}${query}`);

    // Проверяем, вернулся ли массив или объект с пагинацией
    if (Array.isArray(response.data)) {
      // Если API возвращает только массив items
      return {
        items: response.data,
        total: response.data.length, // Это НЕПРАВИЛЬНО для реальной пагинации, а просто заглушка.
                                      // API ДОЛЖЕН возвращать total, если нужна корректная пагинация.
        limit: params.limit || response.data.length,
        offset: params.offset || 0,
      };
    }
    // Если API возвращает структуру PaginatedAchievementsResponse напрямую:
    return response.data as PaginatedAchievementsResponse;
  },

  getAchievementById: async (achievementId: number): Promise<Achievement> => {
    // Итоговый URL: /v1/admin/achievements/{achievementId}/
    return (await axiosInstance.get<Achievement>(ENDPOINTS.ACHIEVEMENT_DETAIL(achievementId))).data;
  },

  createAchievement: async (
    payload: AchievementCreatePayload,
    imageFile?: File | null
  ): Promise<Achievement> => {
    const formData = new FormData();
    formData.append('achievement_data_json', JSON.stringify(payload));
    if (imageFile) {
      formData.append('image_file', imageFile);
    }
    // Итоговый URL: /v1/admin/achievements/
    return (await axiosInstance.post<Achievement>(ENDPOINTS.ACHIEVEMENTS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  },

  updateAchievement: async (
    achievementId: number,
    payload: AchievementUpdatePayload,
    imageFile?: File | null
  ): Promise<Achievement> => {
    const formData = new FormData();
    formData.append('achievement_data_json', JSON.stringify(payload));
    if (imageFile) {
      formData.append('image_file', imageFile);
    }
    // Итоговый URL: /v1/admin/achievements/{achievementId}/
    return (await axiosInstance.put<Achievement>(ENDPOINTS.ACHIEVEMENT_DETAIL(achievementId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  },

  deleteAchievement: async (achievementId: number): Promise<void> => {
    // Итоговый URL: /v1/admin/achievements/{achievementId}/
    await axiosInstance.delete(ENDPOINTS.ACHIEVEMENT_DETAIL(achievementId));
  },
};