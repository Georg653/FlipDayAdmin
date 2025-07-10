// --- Путь: src/services/admin/Points/pointsApi.ts ---

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { buildQueryString } from '../api/buildQuery';

import type { 
  Point, 
  PointFilterParams, 
  PointCreateUpdatePayload 
} from '../../../types/admin/Points/point.types';

export const PointsApi = {
  // --- Запросы на чтение ---

  getPointsList: async (params: PointFilterParams = {}): Promise<Point[]> => {
    const query = buildQueryString(params);
    const response = await axiosInstance.get<Point[]>(`${ENDPOINTS.POINTS}${query}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getPointById: async (pointId: number): Promise<Point> => {
    // Получаем основную инфу о точке
    const pointPromise = axiosInstance.get<Point>(ENDPOINTS.POINT_DETAIL(pointId));
    // Пытаемся получить ее контент
    const contentPromise = axiosInstance.get(ENDPOINTS.POINT_CONTENT(pointId)).catch(() => null);

    const [pointResponse, contentResponse] = await Promise.all([pointPromise, contentPromise]);

    // Собираем все в один объект
    const pointData = pointResponse.data;
    if (contentResponse && contentResponse.data) {
      pointData.content_data = contentResponse.data;
    }

    return pointData;
  },

  // --- Запросы на изменение ---

  deletePoint: async (pointId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.POINT_DETAIL(pointId));
  },
  
  createPoint: async (
    jsonData: PointCreateUpdatePayload,
    pointImageFile: File | null,
    contentMediaFiles: File[]
  ): Promise<Point> => {
    const formData = new FormData();
    formData.append('point_data_json', JSON.stringify(jsonData));

    if (pointImageFile) {
      formData.append('point_image_file', pointImageFile);
    }
    
    contentMediaFiles.forEach(file => {
      formData.append('content_media_files', file);
    });

    const response = await axiosInstance.post<Point>(ENDPOINTS.POINTS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updatePoint: async (
    pointId: number,
    jsonData: PointCreateUpdatePayload,
    pointImageFile: File | null,
    contentMediaFiles: File[],
    removePointImage: boolean,
  ): Promise<Point> => {
    const formData = new FormData();
    formData.append('point_data_json', JSON.stringify(jsonData));

    if (pointImageFile) {
      formData.append('point_image_file', pointImageFile);
    }
    if (removePointImage) {
      formData.append('remove_point_image', 'true');
    }
    
    contentMediaFiles.forEach(file => {
      formData.append('content_media_files', file);
    });

    const response = await axiosInstance.put<Point>(ENDPOINTS.POINT_DETAIL(pointId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};