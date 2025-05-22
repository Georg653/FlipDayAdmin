// src/types/admin/Routes/route.types.ts

// Ре-экспортируем Point, чтобы он был доступен для импорта из этого файла
export type { Point } from '../Points/point.types'; 
// Также импортируем его для использования внутри этого файла с алиасом
import type { Point as ImportedPointDetails } from '../Points/point.types'; 

// Ре-экспортируем тип RouteCategory
export type { RouteCategory } from '../RouteCategories/routeCategory.types'; 
// Также импортируем его для использования внутри этого файла с алиасом
import type { RouteCategory as ImportedRouteCategoryDetails } from '../RouteCategories/routeCategory.types';


// Структура точки внутри маршрута, как она может приходить от API (если приходит полный объект)
// или как мы будем ее хранить на фронте в форме
export interface RoutePointInfo extends Pick<ImportedPointDetails, 'id' | 'name' | 'latitude' | 'longitude' | 'image'> {
  order: number; // Порядковый номер точки в маршруте, управляемый на фронте
  __id?: string;  // Временный ID для React key и управления состоянием на фронте
}

// Основная сущность Маршрут, как она приходит от API
export interface Route {
  id: number;
  route_category_id: number;
  name: string;
  description: string;
  auto_generated: boolean;
  image: string | null;      // URL превью-изображения маршрута
  distance: number;          // Например, в метрах
  estimated_time: number;    // Например, в минутах
  budget: number;
  // API возвращает массив объектов Point (полные данные точек) после _convert_route_with_point_models.
  // Если бы приходили только ID, тип был бы number[].
  points: ImportedPointDetails[]; 
  route_category?: ImportedRouteCategoryDetails; // Вложенный объект категории (если API его возвращает)
  created_at?: string;
  updated_at?: string;
}

// --- Данные для создания Маршрута (то, что идет в data_json) ---
export interface RouteCreateDataPayload {
  name: string;
  description: string;
  route_category_id: number;
  points: number[]; // Массив ID точек в нужном порядке (согласно бэкенд схеме RouteCreateAdminSchema)
  distance: number;
  estimated_time: number;
  budget: number;
  auto_generated?: boolean; // По умолчанию false на бэке при создании из админки
}

// --- Данные для обновления Маршрута (то, что идет в data_json) ---
// auto_generated нельзя менять через админский PUT, поэтому убираем его
export type RouteUpdateDataPayload = Partial<Omit<RouteCreateDataPayload, 'auto_generated'>>;


// --- Структура данных для формы Маршрута на фронтенде ---
export interface RouteFormData {
  name: string;
  description: string;
  route_category_id: string; // В селекте будет string, конвертируем в number перед отправкой
  
  // Управление точками маршрута на фронте
  // Храним RoutePointInfo для отображения и управления порядком
  selected_points: RoutePointInfo[]; 

  distance: string; // В инпутах будут строки, конвертируем в number
  estimated_time: string; // В инпутах будут строки, конвертируем в number
  budget: string; // В инпутах будут строки, конвертируем в number
  auto_generated: boolean; // Чекбокс (отображаем, но не отправляем при обновлении)

  image_file: File | null;
  image_preview_url?: string | null;
  existing_image_url?: string | null;
}

export const initialRouteFormData: RouteFormData = {
  name: "",
  description: "",
  route_category_id: "",
  selected_points: [],
  distance: "0",
  estimated_time: "0",
  budget: "0",
  auto_generated: false,
  image_file: null,
  image_preview_url: null,
  existing_image_url: null,
};

export interface RouteFormOptions {
  onSuccess?: (route: Route) => void;
  routeToEdit?: Route | null; 
  // При редактировании, routeToEdit.points должен быть преобразован в RoutePointInfo[] в хуке useRouteForm
}

// --- Ответ от API для списка маршрутов ---
// API возвращает массив объектов Route напрямую
export type PaginatedRoutesResponse = Route[];

export interface RouteFilterParams {
  limit?: number;
  offset?: number;
  category_id?: number; // Фильтр по ID категории (number или undefined)
  search?: string;
}

// --- Вспомогательные типы для выбора точек в маршрут ---
// Точка, доступная для выбора (с флагом, выбрана ли она уже)
// Используем ImportedPointDetails для наследования
export interface SelectablePoint extends ImportedPointDetails {
  isSelected?: boolean;
}