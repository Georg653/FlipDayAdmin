// src/types/admin/LearningPages/learningPage.types.ts

// --- Типы для блоков контента ---

export interface LearningPageQuizOption {
  id: string; // ID варианта ответа
  text: string; // Текст варианта ответа
  // is_correct: boolean; // Возможно, понадобится, если API будет это поддерживать для отображения правильных ответов
}

// Базовый интерфейс для всех блоков контента
// Поля, которые могут быть у любого блока (согласно ContentBlock на бэке)
interface BaseContentBlock {
  id?: string | null; // ID блока, опционально
  type: string; // Тип блока (e.g., "heading", "text", "image", "test")
  level?: number | null; // Для заголовков
  content?: string | null; // Для текстового содержимого
  src?: string | string[] | null; // Для медиа (один URL или список для album/slider)
  text?: string | null; // Дополнительный текст (подпись?)
  question?: string | null; // Для тестов
  options?: LearningPageQuizOption[] | null; // Для тестов
  message?: string | null; // Для тестов или других сообщений
}

// Можно создать более конкретные типы для каждого блока, если это упростит работу в форме,
// но для API достаточно универсального ContentBlock. Для начала оставим универсальный.
export type LearningPageContentBlock = BaseContentBlock;

// --- Типы для самой страницы обучения ---

/**
 * Структура страницы обучения, как она приходит с API (в GET-запросах).
 */
export interface LearningPage {
  id: number;
  page_number: number;
  total_pages: number; // Общее количество страниц в родительской подтеме
  content: LearningPageContentBlock[];
  // subtopic_id не является частью этой модели, он передается в URL
  // title и is_published пока не предполагаем
}

/**
 * Данные, необходимые для JSON-строки в поле 'data_json' при создании страницы.
 * subtopic_id будет добавлен в URL на уровне API-сервиса.
 */
export interface LearningPageCreatePayload {
  page_number: number;
  content: LearningPageContentBlock[];
}

/**
 * Данные для JSON-строки в поле 'data_json' при обновлении страницы.
 * Все поля опциональны.
 */
export interface LearningPageUpdatePayload {
  page_number?: number;
  content?: LearningPageContentBlock[];
}

/**
 * Структура данных для формы создания/редактирования страницы обучения.
 * subtopic_id будет отдельным полем в форме.
 * content будет строкой (JSON) для ручного ввода на первом этапе.
 */
export interface LearningPageFormData {
  subtopic_id: string; // Будет числовым инпутом, конвертируем перед отправкой
  page_number: string; // Будет числовым инпутом, конвертируем
  content_json_string: string; // Текстовое поле для ручного ввода JSON массива ContentBlock
}

/**
 * Начальное состояние для данных формы LearningPage.
 */
export const initialLearningPageFormData: LearningPageFormData = {
  subtopic_id: "",
  page_number: "",
  content_json_string: "[]", // По умолчанию пустой массив JSON
};

/**
 * Опции для хука useLearningPageForm.
 */
// src/types/admin/LearningPages/learningPage.types.ts
// ... другие типы ...

export interface LearningPageFormOptions {
  subtopicIdForCreate?: number | null; // <--- ИЗМЕНЕНИЕ ЗДЕСЬ: добавили | null
  onSuccess?: (learningPage: LearningPage) => void;
  learningPageToEdit?: LearningPage | null;
}

// ... остальные типы ...
/**
 * Ответ API на запрос списка страниц обучения (для конкретной подтемы).
 * API возвращает просто массив, поэтому total, limit, offset мы не получаем.
 * Для консистентности создадим интерфейс, но total будет проблемой для пагинации.
 */
export interface PaginatedLearningPagesResponse {
  items: LearningPage[];
  total: number; // Этого поля НЕТ в ответе API, нужно будет как-то обрабатывать
  limit?: number; // Из запроса
  offset?: number; // Из запроса
}

/**
 * Параметры фильтрации и пагинации для запроса списка страниц обучения.
 * subtopic_id будет передаваться как path parameter.
 */
export interface LearningPageFilterParams {
  limit?: number;
  offset?: number;
  // Другие фильтры, если API будет их поддерживать (например, по page_number)
}

// Если понадобятся типы для Subtopic (для селекта)
export interface SubtopicOption {
  id: number;
  name: string; // Или title, или другое поле для отображения
}