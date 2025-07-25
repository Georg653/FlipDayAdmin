// --- Путь: src/services/admin/Routes/routesApi.ts ---
// ПОЛНАЯ ВЕРСИЯ

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { buildQueryString } from '../api/buildQuery';

import type { 
  Route, 
  RouteFilterParams, 
  RouteCreateUpdatePayload 
} from '../../../types/admin/Routes/route.types';

export const RoutesApi = {
  getRoutes: async (params: RouteFilterParams = {}): Promise<Route[]> => {
    const query = buildQueryString(params);
    const response = await axiosInstance.get<Route[]>(`${ENDPOINTS.ROUTES}${query}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getRouteById: async (routeId: number): Promise<Route> => {
    const response = await axiosInstance.get<Route>(ENDPOINTS.ROUTE_DETAIL(routeId));
    return response.data;
  },

  deleteRoute: async (routeId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.ROUTE_DETAIL(routeId));
  },
  
  createRoute: async (
    jsonData: RouteCreateUpdatePayload,
    imageFile: File | null
  ): Promise<Route> => {
    const formData = new FormData();
    formData.append('route_data_json', JSON.stringify(jsonData));

    if (imageFile) {
      formData.append('image_file', imageFile);
    }

    const response = await axiosInstance.post<Route>(ENDPOINTS.ROUTES, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateRoute: async (
    routeId: number,
    jsonData: RouteCreateUpdatePayload, // Бэкенд ожидает полный объект
    imageFile: File | null,
    removeImage: boolean
  ): Promise<Route> => {
    const formData = new FormData();
    
    // Добавляем флаг `remove_image` в JSON, как того ожидает бэкенд
    const payloadWithFlags = { ...jsonData, remove_image: removeImage };
    formData.append('route_data_json', JSON.stringify(payloadWithFlags));

    if (imageFile) {
      formData.append('image_file', imageFile);
    }
    
    const response = await axiosInstance.put<Route>(ENDPOINTS.ROUTE_DETAIL(routeId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};