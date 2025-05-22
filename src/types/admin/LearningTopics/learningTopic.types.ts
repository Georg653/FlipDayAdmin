// src/types/admin/LearningTopics/learningTopic.types.ts

// Структура Темы Обучения, как она приходит с API и как мы ее знаем из структуры БД
export interface LearningTopic {
  id: number;
  name: string;
  description: string | null;
  experience_points: number;
  image: string | null; // URL изображения (может быть как внутренним, так и внешним, если API поддерживает)
  order: number;
  completion_percentage?: number;
  created_at?: string; // Добавим, если API возвращает
  updated_at?: string; // Добавим, если API возвращает
}

// Данные для JSON-строки в поле 'data_json' при создании Темы
export interface LearningTopicCreatePayload {
  name: string;
  description?: string | null;
  experience_points: number;
  order: number;
  image_url?: string | null; // <<<--- НОВОЕ ПОЛЕ: для передачи URL изображения, если не загружается файл
                             // Название 'image_url' выбрано для ясности, что это URL.
                             // Бэкенд должен его обработать (скачать или сохранить как есть).
}

// Данные для JSON-строки в поле 'data_json' при обновлении Темы
export type LearningTopicUpdatePayload = Partial<LearningTopicCreatePayload>;
// image_url также будет опциональным и может использоваться для обновления/удаления ссылки на изображение.


// Структура данных для формы создания/редактирования Темы
export interface LearningTopicFormData {
  name: string;
  description: string;
  experience_points: string;
  order: string;
  
  image_file: File | null;            // Для загрузки файла
  image_url_manual: string;         // <<<--- НОВОЕ ПОЛЕ: для ввода URL вручную

  image_preview_url?: string | null; // Для отображения превью в ImageUpload (из файла или URL)
  existing_image_url?: string | null;// Для отображения существующей картинки при редактировании
}

// Начальное состояние для данных формы LearningTopic
export const initialLearningTopicFormData: LearningTopicFormData = {
  name: "",
  description: "",
  experience_points: "0",
  order: "0",
  image_file: null,
  image_url_manual: "", // <<<--- НОВОЕ ПОЛЕ: инициализируем пустой строкой
  image_preview_url: null,
  existing_image_url: null,
};

// Опции для хука useLearningTopicForm
export interface LearningTopicFormOptions {
  onSuccess?: (learningTopic: LearningTopic) => void;
  learningTopicToEdit?: LearningTopic | null;
}

// Ответ API на запрос списка Тем
export interface PaginatedLearningTopicsResponse {
  items: LearningTopic[];
  total: number; 
  limit?: number;
  offset?: number;
}

// Параметры фильтрации для списка Тем
export interface LearningTopicFilterParams {
  limit?: number;
  offset?: number;
  name?: string;
}

// Тип для опций селекта
export interface TopicOption {
  id: number;
  name: string;
}