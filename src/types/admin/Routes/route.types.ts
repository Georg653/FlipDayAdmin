// --- Путь: src/types/admin/Routes/route.types.ts ---

// Нам понадобится базовый тип Точки, чтобы отображать их в конструкторе
// Убедись, что этот путь правильный
import type { Point } from '../Points/point.types';

// --- Тип, как данные приходят с бэка ---
export interface Route {
  id: number;
  route_category_id: number;
  name: string;
  description: string;
  auto_generated: boolean;
  image: string | null;
  distance: number;
  estimated_time: number;
  budget: number;
  points: number[]; // Бэкенд возвращает массив ID точек
}

// =============================================================================
// ТИПЫ ДЛЯ ФОРМЫ (то, с чем мы работаем на фронте)
// =============================================================================

export interface RouteFormData {
  name: string;
  description: string;
  route_category_id: string; // В select'е это будет строка
  distance: string;
  estimated_time: string;
  budget: string;
  
  image_file: File | null;
  image_preview_url: string | null;
  remove_image: boolean;
  
  // В форме мы будем хранить не просто ID, а полные объекты точек
  // для удобного отображения и управления
  points: Point[]; 
}

// =============================================================================
// ТИПЫ ДЛЯ PAYLOAD (то, что мы отправляем на бэк)
// =============================================================================

export interface RouteCreateUpdatePayload {
  name: string;
  description: string;
  route_category_id: number;
  distance: number;
  estimated_time: number;
  budget: number;
  image_url?: string | null;
  // На бэк мы отправляем только массив ID
  points: number[];
}


// =============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ТИПЫ
// =============================================================================

export interface RouteFilterParams {
  limit?: number;
  offset?: number;
  category_id?: number | null;
  search?: string;
}