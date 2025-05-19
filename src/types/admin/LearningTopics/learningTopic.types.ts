// src/types/admin/LearningTopics/learningTopic.types.ts

// Структура Темы Обучения, как она приходит с API и как мы ее знаем из структуры БД
export interface LearningTopic {
  id: number;
  name: string;
  description: string | null;
  experience_points: number;
  image: string | null; // URL изображения
  order: number;
  // Поле completion_percentage было в документации API ответа, добавим его
  completion_percentage?: number; // Опционально, т.к. не во всех контекстах оно может быть
  // created_at, updated_at - если API их возвращает, добавь
}

// Данные для JSON-строки в поле 'data_json' при создании Темы
export interface LearningTopicCreatePayload {
  name: string;
  description?: string | null;
  experience_points: number;
  order: number;
  // image не передается в data_json, а как image_file
}

// Данные для JSON-строки в поле 'data_json' при обновлении Темы
export type LearningTopicUpdatePayload = Partial<LearningTopicCreatePayload>;

// Структура данных для формы создания/редактирования Темы
export interface LearningTopicFormData {
  name: string;
  description: string;
  experience_points: string; // В форме строка
  order: string;             // В форме строка
  image_file: File | null;
  image_preview_url?: string | null;
  existing_image_url?: string | null;
}

// Начальное состояние для данных формы LearningTopic
export const initialLearningTopicFormData: LearningTopicFormData = {
  name: "",
  description: "",
  experience_points: "0",
  order: "0",
  image_file: null,
  image_preview_url: null,
  existing_image_url: null,
};

// Опции для хука useLearningTopicForm
export interface LearningTopicFormOptions {
  onSuccess?: (learningTopic: LearningTopic) => void;
  learningTopicToEdit?: LearningTopic | null;
}

// Ответ API на запрос списка Тем
// (Предполагаем, что API для списка тем тоже может не возвращать total)
export interface PaginatedLearningTopicsResponse {
  items: LearningTopic[];
  total: number; // Может не быть от API
  limit?: number;
  offset?: number;
}

// Параметры фильтрации для списка Тем
export interface LearningTopicFilterParams {
  limit?: number;
  offset?: number;
  name?: string; // Возможный фильтр
}

// Тип для опций селекта (используется в LearningSubtopics для выбора Topic)
export interface TopicOption {
  id: number;
  name: string;
}