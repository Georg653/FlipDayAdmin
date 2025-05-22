// src/types/admin/RouteCategories/routeCategory.types.ts

export interface RouteCategory {
  id: number;
  name: string;
  description: string;
  image: string | null; // URL изображения, может быть null, если не загружено
}

export interface RouteCategoryCreatePayload {
  name: string;
  description: string;
  // image_file будет обрабатываться отдельно как FormData
}

export type RouteCategoryUpdatePayload = Partial<RouteCategoryCreatePayload>;

export interface RouteCategoryFormData {
  name: string;
  description: string;
  image_file: File | null;
  image_preview_url?: string | null; // Для отображения нового/текущего изображения
  existing_image_url?: string | null; // URL текущего изображения при редактировании
}

export const initialRouteCategoryFormData: RouteCategoryFormData = {
  name: "",
  description: "",
  image_file: null,
  image_preview_url: null,
  existing_image_url: null,
};

export interface RouteCategoryFormOptions {
  onSuccess?: (category: RouteCategory) => void;
  categoryToEdit?: RouteCategory | null;
}

// API для списка возвращает просто массив RouteCategory[]
export type PaginatedRouteCategoriesResponse = RouteCategory[];

export interface RouteCategoryFilterParams {
  limit?: number;
  offset?: number;
  // Добавь сюда другие поля для фильтрации, если они появятся в API
  // search?: string;
}