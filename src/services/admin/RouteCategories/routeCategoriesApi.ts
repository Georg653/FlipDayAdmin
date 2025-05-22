// src/services/admin/RouteCategories/routeCategoriesApi.ts

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { buildQueryString } from '../api/buildQuery';
import type {
  RouteCategory,
  RouteCategoryCreatePayload,
  RouteCategoryUpdatePayload,
  PaginatedRouteCategoriesResponse,
  RouteCategoryFilterParams,
} from '../../../types/admin/RouteCategories/routeCategory.types';

export const RouteCategoriesApi = {
  getRouteCategoriesList: async (
    params: RouteCategoryFilterParams = {}
  ): Promise<PaginatedRouteCategoriesResponse> => {
    const query = buildQueryString({
      limit: params.limit,
      offset: params.offset,
      // search: params.search, // Если будет фильтр по поиску
    });
    // API возвращает массив RouteCategory[] напрямую
    const response = await axiosInstance.get<RouteCategory[]>(`${ENDPOINTS.ROUTE_CATEGORIES}${query}`);
    return response.data;
  },

  getRouteCategoryById: async (categoryId: number): Promise<RouteCategory> => {
    return (await axiosInstance.get<RouteCategory>(ENDPOINTS.ROUTE_CATEGORY_DETAIL(categoryId))).data;
  },

  createRouteCategory: async (
    payload: RouteCategoryCreatePayload,
    imageFile?: File | null
  ): Promise<RouteCategory> => {
    const formData = new FormData();
    formData.append('data_json', JSON.stringify(payload));
    if (imageFile) {
      formData.append('image_file', imageFile);
    }

    return (await axiosInstance.post<RouteCategory>(ENDPOINTS.ROUTE_CATEGORIES, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  },

  updateRouteCategory: async (
    categoryId: number,
    payload: RouteCategoryUpdatePayload,
    imageFile?: File | null
  ): Promise<RouteCategory> => {
    const formData = new FormData();
    // data_json отправляем, даже если он пустой, если есть imageFile,
    // или если есть изменения в payload.
    // API ожидает data_json и image_file как опциональные, но если оба пустые, это может быть проблемой.
    // В твоем примере NewsApi был комментарий на эту тему.
    // Сейчас предполагаем, что если есть payload или imageFile, то data_json (даже {}) нужно отправить.
    
    let hasDataToUpdate = Object.keys(payload).length > 0;

    if (hasDataToUpdate || imageFile) {
        formData.append('data_json', JSON.stringify(payload)); // Отправляем payload как есть
    }
    
    if (imageFile) {
      formData.append('image_file', imageFile);
    }

    // Если нет ни данных для обновления в payload, ни нового файла,
    // возможно, не стоит делать запрос. Но API должен это обработать.
    // Пока отправляем запрос, если есть хотя бы одно изменение или файл.
    if (!hasDataToUpdate && !imageFile) {
      // Если нет изменений, можно попробовать вернуть существующий элемент или ошибку
      // throw new Error("No data provided for update and no new image file.");
      // Или получить текущую категорию и вернуть ее, имитируя "нет изменений".
      // Для простоты пока оставим так, API должен вернуть 200 OK с неизмененными данными или ошибку, если поля обязательны.
      // Или, если API может вернуть ошибку на пустой FormData, то лучше так:
      const currentCategory = await RouteCategoriesApi.getRouteCategoryById(categoryId);
      return currentCategory;
    }

    return (await axiosInstance.put<RouteCategory>(ENDPOINTS.ROUTE_CATEGORY_DETAIL(categoryId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  },

  deleteRouteCategory: async (categoryId: number): Promise<void> => {
    // API говорит "Удаляет категорию маршрутов (кроме ID=1)"
    // Эту логику (не удалять ID=1) лучше обрабатывать на клиенте перед вызовом,
    // или быть готовым к ошибке от API, если попытаться удалить ID=1.
    await axiosInstance.delete(ENDPOINTS.ROUTE_CATEGORY_DETAIL(categoryId));
  },
};