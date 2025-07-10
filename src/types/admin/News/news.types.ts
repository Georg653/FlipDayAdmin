// --- Путь: src/types/admin/News/news.types.ts ---

// --- Типы для API, 1-в-1 как на бэке ---
export interface HeadingBlock { type: 'heading'; level: 1 | 2 | 3 | 4; content: string; }
export interface TextBlock { type: 'text'; content: string; }
export interface ImageBlock { type: 'image'; src: string | null; }
export interface VideoBlock { type: 'video'; src: string | null; }
export interface AudioBlock { type: 'audio'; src: string | null; }
export interface AlbumBlock { type: 'album'; src: string[]; }
export interface SliderBlock { type: 'slider'; src: string[]; }
export interface TestOption { id: string; text: string; }
export interface TestBlock { type: 'test'; question: string; options: Array<TestOption>; message: string; }
export type ContentBlock = HeadingBlock | TextBlock | ImageBlock | VideoBlock | AudioBlock | AlbumBlock | SliderBlock | TestBlock;

export interface News {
  id: number;
  title: string;
  description: string;
  preview: string | null;
  background: string | null;
  content: ContentBlock[];
  created_at?: string;
}

// =============================================================================
// ТИПЫ ДЛЯ ФОРМЫ
// =============================================================================

export type CollectionItemFormData = { id: string; url: string | null; file: File | null; preview: string | null; };
export type TestOptionFormData = { id: string; text: string; isCorrect: boolean; };

// Универсальный тип для блока в нашей форме
export type ContentBlockFormData = {
  id: string;
  type: ContentBlock['type'];
  level?: 1 | 2 | 3 | 4;
  content?: string;
  src?: string | null;
  items?: CollectionItemFormData[];
  file?: File | null;
  question?: string;
  options?: TestOptionFormData[];
  message?: string;
};

// Основной тип для всей формы новости
export interface NewsFormData {
  title: string;
  description: string;
  preview_url: string | null;
  preview_file: File | null;
  remove_preview: boolean;
  background_url: string | null;
  background_file: File | null;
  remove_background: boolean;
  content: ContentBlockFormData[];
}

// --- Типы для PAYLOAD ---
export interface NewsCreateUpdatePayload {
  title: string;
  description: string;
  content: ContentBlock[];
  preview_url?: string | null;
  background_url?: string | null;
}

// --- Вспомогательные типы ---
export interface NewsFilterParams { limit?: number; offset?: number; title?: string; }