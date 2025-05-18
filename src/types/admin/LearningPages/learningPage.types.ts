// src/types/admin/LearningPages/learningPage.types.ts

export interface LearningPageQuizOption {
  id: string;
  text: string;
}

export interface BaseContentBlock {
  id?: string | null; // Может быть локальный UI ID для управления ключами в списке
  type: string;
  level?: number | null;
  content?: string | null;
  src?: string | string[] | null;
  text?: string | null;
  question?: string | null;
  options?: LearningPageQuizOption[] | null;
  message?: string | null;
  correct_option_id?: string | null
  fileInput?: File | null; // Для хранения выбранного файла в UI
  previewUrl?: string | null; // Для локального превью загружаемого файла
}

// Этот тип остается для взаимодействия с API (то, что API ожидает/возвращает)
export type LearningPageContentBlockAPI = BaseContentBlock;


export type LearningPageContentBlockUIData = BaseContentBlock & {
    // Дополнительные поля, специфичные для UI, если понадобятся (например, _isEditing)
    _localId?: string; // Для ключей в React при рендеринге списка
};


export interface LearningPage {
  id: number;
  page_number: number;
  total_pages: number;
  content: LearningPageContentBlockAPI[];
}

export interface LearningPageCreatePayload {
  page_number: number;
  content: LearningPageContentBlockAPI[];
}

export interface LearningPageUpdatePayload {
  page_number?: number;
  content?: LearningPageContentBlockAPI[];
}

export interface LearningPageFormData {
  subtopic_id: string;
  page_number: string;
  // Теперь это массив объектов, которые мы будем собирать в UI
  current_content_blocks: LearningPageContentBlockUIData[];
}

export const initialLearningPageFormData: LearningPageFormData = {
  subtopic_id: "",
  page_number: "",
  current_content_blocks: [],
};

export interface LearningPageFormOptions {
  subtopicIdForCreate?: number | null;
  onSuccess?: (learningPage: LearningPage) => void;
  learningPageToEdit?: LearningPage | null;
}

export interface PaginatedLearningPagesResponse {
  items: LearningPage[];
  total: number;
  limit?: number;
  offset?: number;
}

export interface LearningPageFilterParams {
  limit?: number;
  offset?: number;
}

export interface SubtopicOption {
  id: number;
  name: string;
}