// --- Путь: src/types/admin/Points/point.types.ts ---
// ПОЛНАЯ ВЕРСИЯ

import type { ApiContentBlock, ContentBlockFormData } from '../../common/content.types';

// Тип для основной информации о точке (без контента)
export interface PointBase {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  is_partner: boolean;
  budget: number;
  image: string | null;
}

// Тип для контента точки
export interface PointContentData {
  content: ApiContentBlock[];
}

// Полный тип точки (база + контент)
export type Point = PointBase & PointContentData;


// =============================================================================
// ТИПЫ ДЛЯ ФОРМЫ
// =============================================================================

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

  // Флаг, который управляет отображением конструктора в UI
  manageContent: boolean;
  content: ContentBlockFormData[];
}


// =============================================================================
// ТИПЫ ДЛЯ PAYLOAD
// =============================================================================

// Объект, который мы упаковываем в point_data_json
export interface PointCreateUpdatePayload {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  is_partner: boolean;
  budget: number;
  image_url?: string | null;
  
  // Эти поля опциональны и зависят от галочки
  content_data?: {
    content: ApiContentBlock[];
  };
  remove_content?: boolean; // Флаг для удаления контента при обновлении
}


// =============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ТИПЫ
// =============================================================================

export interface PointFilterParams {
  limit?: number;
  offset?: number;
}