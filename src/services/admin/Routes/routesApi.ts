// src/services/admin/Routes/routesApi.ts

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { buildQueryString } from '../api/buildQuery';
import type {
  Route,
  RouteCreateDataPayload, // Основные данные для data_json
  RouteUpdateDataPayload, // Основные данные для data_json
  PaginatedRoutesResponse,
  RouteFilterParams,
} from '../../../types/admin/Routes/route.types';

export const RoutesApi = {
  getRoutesList: async (
    params: RouteFilterParams = {}
  ): Promise<PaginatedRoutesResponse> => {
    const query = buildQueryString({
      limit: params.limit,
      offset: params.offset,
      category_id: params.category_id, // Фильтр по category_id
      search: params.search,
    });
    // API возвращает массив Route[] напрямую
    const response = await axiosInstance.get<Route[]>(`${ENDPOINTS.ROUTES}${query}`);
    return response.data;
  },

  getRouteById: async (routeId: number): Promise<Route> => {
    return (await axiosInstance.get<Route>(ENDPOINTS.ROUTE_DETAIL(routeId))).data;
  },

  createRoute: async (
    payload: RouteCreateDataPayload, // Ожидаем только данные для data_json
    imageFile?: File | null
  ): Promise<Route> => {
    const formData = new FormData();
    formData.append('data_json', JSON.stringify(payload));
    if (imageFile) {
      formData.append('image_file', imageFile);
    }

    return (await axiosInstance.post<Route>(ENDPOINTS.ROUTES, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  },

  updateRoute: async (
    routeId: number,
    payload: RouteUpdateDataPayload, // Ожидаем только данные для data_json
    imageFile?: File | null
  ): Promise<Route> => {
    const formData = new FormData();
    
    // Проверяем, есть ли что отправлять в data_json
    const hasDataInPayload = Object.values(payload).some(value => value !== undefined);

    if (hasDataInPayload || imageFile) {
        formData.append('data_json', JSON.stringify(payload));
    } else if (!imageFile) { 
        // Если нет ни данных в payload, ни файла, чтобы избежать отправки пустого FormData,
        // можно вернуть текущие данные маршрута.
        console.warn("UpdateRoute: No data or image file provided for update. Returning current route data.");
        const currentRoute = await RoutesApi.getRouteById(routeId);
        return currentRoute;
    }
    // Если только imageFile и нет данных в payload, data_json будет содержать {} (если payload пустой объект)
    // или не будет добавлен, если payload был undefined.
    // Если бэкенд требует data_json даже для обновления только файла, нужно确保 formData.append('data_json', JSON.stringify(payload || {}));

    if (imageFile) {
      formData.append('image_file', imageFile);
    }
    
    return (await axiosInstance.put<Route>(ENDPOINTS.ROUTE_DETAIL(routeId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  },

  deleteRoute: async (routeId: number): Promise<void> => {
    // API документация (и код бэка) упоминала, что auto_generated маршруты нельзя удалять через этот эндпоинт.
    // Эту проверку лучше делать на клиенте перед вызовом,
    // или быть готовым к ошибке 403 от API.
    await axiosInstance.delete(ENDPOINTS.ROUTE_DETAIL(routeId));
  },
};