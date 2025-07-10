// --- Путь: src/types/admin/Points/point.types.ts ---

// --- Типы для API ---
// ИСПРАВЛЕНИЕ: Добавляем недостающее поле 'content' по спеке
export interface TextBlock { type: 'text'; text: string; content: string; }
export interface QuoteBlock { type: 'quote'; text: string; author: string | null; content: string; }
export interface HeadingBlock { type: 'heading'; text: string; level: 1 | 2 | 3 | 4; content: string; }
export interface ImageBlock { type: 'image'; src: string; caption: string | null; content: string; }
export interface VideoBlock { type: 'video'; src: string; caption: string | null; content: string; }
export interface AudioBlock { type: 'audio'; src: string; title: string | null; content: string; }
export interface AlbumBlock { type: 'album'; items: string[]; content: string; }
export interface SliderBlock { type: 'slider'; items: string[]; content: string; }

export type ContentBlock = TextBlock | QuoteBlock | ImageBlock | VideoBlock | AudioBlock | AlbumBlock | SliderBlock | HeadingBlock;

export interface Point {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  is_partner: boolean;
  budget: number;
  image: string | null;
  content_data?: { content: ContentBlock[] }
}

// --- ТИПЫ ДЛЯ ФОРМЫ ---
export type CollectionItemFormData = { id: string; url: string | null; file: File | null; preview: string | null; };
export type ContentBlockFormData = {
  id: string;
  type: ContentBlock['type'];
  text?: string;
  author?: string | null;
  src?: string;
  caption?: string | null;
  title?: string | null;
  items?: CollectionItemFormData[];
  file?: File | null;
  level?: 1 | 2 | 3 | 4;
  content?: string; // Поле для обратной совместимости, если понадобится
};
export interface PointFormData {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  is_partner: boolean;
  budget: string;
  image_url: string | null;
  image_file: File | null;
  remove_image: boolean;
  has_content: boolean;
  remove_content: boolean;
  content: ContentBlockFormData[];
}

// --- ТИПЫ ДЛЯ PAYLOAD ---
interface PointContentPayload { content: ContentBlock[]; }
export interface PointCreateUpdatePayload {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  is_partner: boolean;
  budget: number;
  image_url?: string | null;
  content_data?: PointContentPayload | null;
  remove_content?: boolean;
}

// --- ВСПОМОГАТЕЛЬНЫЕ ТИПЫ ---
export interface PointFilterParams { limit?: number; offset?: number; }