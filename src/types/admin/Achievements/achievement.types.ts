// src/types/admin/Achievements/achievement.types.ts

export interface Achievement {
  id: number;
  name: string;
  description: string;
  achievement_type: string;
  criteria_value: number;
  criteria_unit: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface AchievementCreatePayload {
  name: string;
  description: string;
  achievement_type: string;
  criteria_value: number;
  criteria_unit: string;
}

export type AchievementUpdatePayload = Partial<AchievementCreatePayload>;

export interface AchievementFormData {
  name: string;
  description: string;
  achievement_type: string;
  criteria_value: string;
  criteria_unit: string;
  image_file: File | null;
  image_preview_url?: string | null;
  existing_image_url?: string | null;
}

export const initialAchievementFormData: AchievementFormData = {
  name: "",
  description: "",
  achievement_type: "",
  criteria_value: "",
  criteria_unit: "",
  image_file: null,
  image_preview_url: null,
  existing_image_url: null,
};

export interface AchievementFormOptions {
  onSuccess?: (achievement: Achievement) => void;
  achievementToEdit?: Achievement | null;
}

export interface PaginatedAchievementsResponse {
  items: Achievement[];
  total: number; // Предполагаем, что API вернет общее количество для пагинации
  limit: number; // Предполагаем на основе query params
  offset: number; // Предполагаем на основе query params
}

export interface AchievementFilterParams {
  limit?: number;
  offset?: number;
  // Добавь сюда другие поля для фильтрации, если они будут поддержаны API
  // name?: string;
  // achievement_type?: string;
}