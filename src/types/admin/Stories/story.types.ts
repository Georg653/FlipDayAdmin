// src/types/admin/Stories/story.types.ts

export type StoryContentType = "image" | "video";

export interface StoryContentItem {
  content: string; // URL для image или video
  type: StoryContentType;
}

// Структура Story как она приходит с API и используется в приложении
export interface Story {
  id: number;
  name: string | null; // Может быть null
  is_active: boolean;
  preview: string; // URL превью
  content_items: StoryContentItem[];
  viewed?: boolean; // Опционально, т.к. для админки не очень важно
  expires_at?: string | null; // Дата/время в формате ISO, опционально
  created_at?: string; // Если API его возвращает (в модели SQLAlchemy есть)
  updated_at?: string; // Если API его возвращает
}

// Данные, передаваемые в data_json при создании
export interface StoryCreatePayload {
  name?: string | null; // Имя опционально
  is_active: boolean;
  content_items: StoryContentItem[];
  expires_at?: string | null; // Дата/время в формате ISO, опционально
}

// Данные, передаваемые в data_json при обновлении (все поля опциональны)
export type StoryUpdatePayload = Partial<StoryCreatePayload>;


// Структура данных для формы
export interface StoryFormData {
  name: string; // В форме сделаем строкой, даже если может быть null
  is_active: boolean;
  preview_file: File | null;
  preview_url?: string | null; // Для отображения текущего/нового превью
  existing_preview_url?: string | null;
  content_items: StoryContentItem[];
  expires_at: string; // В форме дата будет строкой
}

export const initialStoryFormData: StoryFormData = {
  name: "",
  is_active: true,
  preview_file: null,
  preview_url: null,
  existing_preview_url: null,
  content_items: [],
  expires_at: "",
};

export interface StoryFormOptions {
  onSuccess?: (story: Story) => void;
  storyToEdit?: Story | null;
}

// Для списка сторис (API возвращает массив, total мы не получаем)
export interface PaginatedStoriesResponse {
  items: Story[];
  // total: number; // API не возвращает total
  // limit: number;
  // offset: number;
}

export interface StoryFilterParams {
  is_active?: boolean | null; // null для "все"
  limit?: number;
  offset?: number;
}