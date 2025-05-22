// src/types/admin/Achievements/achievement.types.ts

export interface Achievement {
  id: number;
  name: string;
  description: string; // В БД 'text', не NULL, так что string оставляем
  achievement_type: string;
  criteria_value: number;
  criteria_unit: string | null; // В БД 'character varying NULL'
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface AchievementCreatePayload {
  name: string;
  description: string; // Оставляем string, API примет пустую строку если нужно
  achievement_type: string;
  criteria_value: number;
  criteria_unit: string | null; // Позволяем null, если API это поддерживает
}

export type AchievementUpdatePayload = Partial<Omit<AchievementCreatePayload, 'description'>> & {
  description?: string | null; // Позволяем null или пустую строку для обновления
};


export interface AchievementFormData {
  name: string;
  description: string;
  achievement_type: string;
  criteria_value: string;
  criteria_unit: string; // В форме оставляем string, пустая строка будет означать null при отправке (или API обработает)
  image_file: File | null;
  image_preview_url?: string | null;
  existing_image_url?: string | null;
}

export const initialAchievementFormData: AchievementFormData = {
  name: "",
  description: "",
  achievement_type: "",
  criteria_value: "0", // Можно установить 0 или 1 по умолчанию, если имеет смысл
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
  total: number;
  limit: number;
  offset: number;
}

export interface AchievementFilterParams {
  limit?: number;
  offset?: number;
  name?: string;
  achievement_type?: string;
}