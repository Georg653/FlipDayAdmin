// --- Путь: src/services/admin/Routes/routesApi.ts ---

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { buildQueryString } from '../api/buildQuery';

import type { 
  Route, 
  RouteFilterParams, 
  RouteCreateUpdatePayload 
} from '../../../types/admin/Routes/route.types';

export const RoutesApi = {
  // --- Запросы на чтение ---

  getRoutesList: async (params: RouteFilterParams = {}): Promise<Route[]> => {
    const query = buildQueryString(params);
    const response = await axiosInstance.get<Route[]>(`${ENDPOINTS.ROUTES}${query}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getRouteById: async (routeId: number): Promise<Route> => {
    const response = await axiosInstance.get<Route>(ENDPOINTS.ROUTE_DETAIL(routeId));
    return response.data;
  },

  // --- Запросы на изменение ---

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
    jsonData: Partial<RouteCreateUpdatePayload>,
    imageFile: File | null,
    removeImage: boolean
  ): Promise<Route> => {
    const formData = new FormData();
    formData.append('route_data_json', JSON.stringify(jsonData));

    if (imageFile) {
      formData.append('image_file', imageFile);
    }
    
    if (removeImage) {
      formData.append('remove_image', 'true');
    }

    const response = await axiosInstance.put<Route>(ENDPOINTS.ROUTE_DETAIL(routeId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};