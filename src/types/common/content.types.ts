// --- Путь: src/types/common/content.types.ts ---

// =============================================================================
// ТИПЫ ДЛЯ API (как на бэке)
// =============================================================================
export interface HeadingBlock { type: 'heading'; level: 1 | 2 | 3 | 4; content: string; }
export interface TextBlock { type: 'text'; content: string; }
export interface ImageBlock { type: 'image'; src: string | null; }
export interface VideoBlock { type: 'video'; src: string | null; }
export interface AudioBlock { type: 'audio'; src: string | null; }
export interface AlbumBlock { type: 'album'; src: string[]; } // src - это массив!
export interface SliderBlock { type: 'slider'; src: string[]; } // src - это массив!
export interface TestOption { id: string; text: string; }
export interface TestBlock {
    type: 'test';
    question: string;
    options: TestOption[];
    message: string;
    correct_option_id?: string; // На бэке это поле может быть, а может и не быть
}
// Общий тип для блока, как он приходит/уходит на/с API
export type ApiContentBlock = HeadingBlock | TextBlock | ImageBlock | VideoBlock | AudioBlock | AlbumBlock | SliderBlock | TestBlock;


// =============================================================================
// ТИПЫ ДЛЯ ФОРМЫ (как данные живут на фронте)
// =============================================================================

export type CollectionItemFormData = { id: string; url: string | null; file: File | null; preview: string | null; };
export type TestOptionFormData = { id: string; text: string; isCorrect: boolean; };

// Универсальный тип для блока в нашей форме на фронтенде
export type ContentBlockFormData = {
  id: string; // Уникальный ID на фронте
  type: ApiContentBlock['type'];
  // Поля для разных типов блоков
  level?: 1 | 2 | 3 | 4;
  content?: string;
  src?: string | null;              // Для одиночных медиа
  items?: CollectionItemFormData[]; // Для коллекций (альбом/слайдер)
  file?: File | null;               // Для нового загружаемого файла
  question?: string;
  options?: TestOptionFormData[];
  message?: string;
};