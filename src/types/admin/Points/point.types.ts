// src/types/admin/Points/point.types.ts

// Копируем определения ContentBlock из твоего примера News/общего (или импортируем, если они вынесены)
// Для ясности, пока скопируем и адаптируем.
export interface TestOption {
  id: string; // UUID для варианта ответа
  text: string;
  // is_correct?: boolean; // Если на бэке есть, нужно добавить
}

export type ContentBlockType =
  | "heading"
  | "text"
  | "image"
  | "video"
  | "audio"
  | "album"    // Для галереи изображений
  | "slider"   // Для слайдера изображений
  | "test";    // Для тестовых заданий

export interface BaseContentBlock {
  __id?: string; // Временный ID для управления на фронте (например, uuid)
  id?: string | null; // ID блока с бэкенда (если он есть и возвращается)
  type: ContentBlockType;
}

export interface HeadingBlock extends BaseContentBlock {
  type: "heading";
  level: number; // 1-6 для h1-h6
  content: string;
}

export interface TextBlock extends BaseContentBlock {
  type: "text";
  content: string;
}

export interface ImageBlock extends BaseContentBlock {
  type: "image";
  src: string; // URL изображения
  text?: string | null; // Подпись/alt текст
}

export interface VideoBlock extends BaseContentBlock {
  type: "video";
  src: string; // URL видео (например, YouTube, Vimeo, или прямой)
  text?: string | null; // Описание/название видео
}

export interface AudioBlock extends BaseContentBlock {
  type: "audio";
  src: string; // URL аудиофайла
  text?: string | null; // Описание/название аудио
}

export interface AlbumBlock extends BaseContentBlock { // Для галереи
  type: "album";
  src: string[]; // Массив URL изображений
  text?: string | null; // Общее описание альбома
}

export interface SliderBlock extends BaseContentBlock { // Для слайдера
  type: "slider";
  src: string[]; // Массив URL изображений
  text?: string | null; // Общее описание слайдера
}

export interface TestBlock extends BaseContentBlock {
  type: "test";
  question: string;
  options: TestOption[];
  message?: string | null; // Сообщение после ответа/правильный ответ/объяснение
  // correct_option_id?: string | null; // Если нужно хранить правильный ответ
}

// Объединенный тип для всех блоков контента
export type ContentBlock =
  | HeadingBlock
  | TextBlock
  | ImageBlock
  | VideoBlock
  | AudioBlock
  | AlbumBlock
  | SliderBlock
  | TestBlock;

// --- Основная сущность Point ---
export interface Point {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  is_partner: boolean;
  budget: number;
  image: string | null; // URL превью-изображения точки
  created_at?: string; // Предполагаем, что API их возвращает
  updated_at?: string; // Предполагаем, что API их возвращает
  // category_id?: number | null; // Пока нет в API, но если появится
  // location?: string; // Пока нет в этом объекте, а в PointContentResponse
}

// --- Данные для создания Point (внутри data_json) ---
export interface PointCreateDataPayload { // То, что пойдет в data_json (без content_data)
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  is_partner?: boolean; // Optional, т.к. есть default на бэке
  budget?: number;     // Optional, т.к. есть default на бэке
  // image URL будет добавлен на бэке после загрузки image_file
}

// --- Структура для content_data (внутри data_json) ---
export interface PointContentDataPayload {
  background?: string | null;
  content: ContentBlock[]; // Массив блоков контента
  // id, name, location, preview здесь не нужны при отправке, они для ответа от GET .../content
}

// --- Полный payload для создания Point (то, что формируем перед JSON.stringify) ---
export interface PointFullCreatePayload extends PointCreateDataPayload {
  content_data?: PointContentDataPayload | null; // Опционально
}


// --- Данные для обновления Point (внутри data_json) ---
export type PointUpdateDataPayload = Partial<PointCreateDataPayload>;

// --- Полный payload для обновления Point ---
export interface PointFullUpdatePayload extends PointUpdateDataPayload {
  content_data?: PointContentDataPayload | null; // Опционально, можно обновлять только контент или только данные
}


// --- Структура данных для формы Point (основные поля + файл + контент) ---
export interface PointFormData {
  name: string;
  description: string;
  latitude: string; // В форме используем string
  longitude: string; // В форме используем string
  is_partner: boolean;
  budget: string; // В форме используем string
  
  image_file: File | null;
  image_preview_url?: string | null;
  existing_image_url?: string | null;

  // Для управления контентом
  point_content_background: string; // Для поля background в content_data
  point_content_blocks: ContentBlock[]; // Массив блоков контента
}

export const initialPointFormData: PointFormData = {
  name: "",
  description: "",
  latitude: "",
  longitude: "",
  is_partner: false,
  budget: "0",
  image_file: null,
  image_preview_url: null,
  existing_image_url: null,
  point_content_background: "",
  point_content_blocks: [],
};

export interface PointFormOptions {
  onSuccess?: (point: Point) => void;
  pointToEdit?: Point & { contentData?: PointContentResponse | null }; // Добавляем contentData при редактировании
}

// --- Ответ от API для списка точек ---
export type PaginatedPointsResponse = Point[]; // API возвращает массив напрямую

export interface PointFilterParams {
  limit?: number;
  offset?: number;
  // search?: string;
  // category_id?: number;
  // is_partner?: boolean;
}

// --- Ответ от API GET /points/{point_id}/content ---
export interface PointContentResponse {
  id: number; // ID точки
  name: string; // Название точки
  location: string | null; // Адрес/Местоположение
  preview: string | null; // URL превью-изображения точки
  background: string | null; // URL фона для контента
  content: ContentBlock[]; // Массив блоков контента
}