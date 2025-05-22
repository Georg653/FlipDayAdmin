// src/services/admin/Points/pointsApi.ts

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { buildQueryString } from '../api/buildQuery';
import type {
  Point,
  PointFullCreatePayload, // Используем этот тип для формирования data_json
  PointFullUpdatePayload, // Используем этот тип для формирования data_json
  PaginatedPointsResponse,
  PointFilterParams,
  PointContentResponse,   // Для ответа от GET .../content
} from '../../../types/admin/Points/point.types';

export const PointsApi = {
  getPointsList: async (
    params: PointFilterParams = {}
  ): Promise<PaginatedPointsResponse> => {
    const query = buildQueryString({
      limit: params.limit,
      offset: params.offset,
      // search: params.search,
      // category_id: params.category_id,
      // is_partner: params.is_partner,
    });
    // API возвращает массив Point[] напрямую
    const response = await axiosInstance.get<Point[]>(`${ENDPOINTS.POINTS}${query}`);
    return response.data;
  },

  getPointById: async (pointId: number): Promise<Point> => {
    return (await axiosInstance.get<Point>(ENDPOINTS.POINT_DETAIL(pointId))).data;
  },

  getPointContent: async (pointId: number): Promise<PointContentResponse> => {
    return (await axiosInstance.get<PointContentResponse>(ENDPOINTS.POINT_CONTENT(pointId))).data;
  },

  createPoint: async (
    payload: PointFullCreatePayload, // Ожидаем полный payload с content_data
    imageFile?: File | null
  ): Promise<Point> => {
    const formData = new FormData();
    formData.append('data_json', JSON.stringify(payload)); // payload уже содержит content_data
    if (imageFile) {
      formData.append('image_file', imageFile);
    }

    return (await axiosInstance.post<Point>(ENDPOINTS.POINTS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  },

  updatePoint: async (
    pointId: number,
    payload: PointFullUpdatePayload, // Ожидаем полный payload с content_data
    imageFile?: File | null
  ): Promise<Point> => {
    const formData = new FormData();
    
    // Проверяем, есть ли что отправлять в data_json
    // content_data может быть {}, если пользователь хочет очистить контент
    const hasDataInPayload = 
        Object.values(payload).some(value => value !== undefined && value !== null) ||
        (payload.content_data && Object.keys(payload.content_data).length > 0);

    if (hasDataInPayload || imageFile) { // Отправляем data_json, если есть данные или новый файл
        formData.append('data_json', JSON.stringify(payload));
    } else if (!imageFile) { // Если нет ни данных в payload, ни файла, запрос делать не стоит
        // Можно вернуть текущие данные точки, если нет изменений
        console.warn("UpdatePoint: No data or image file provided for update. Returning current point data.");
        const currentPoint = await PointsApi.getPointById(pointId);
        return currentPoint;
    }
    // Если только imageFile и нет данных в payload, data_json будет содержать {}

    if (imageFile) {
      formData.append('image_file', imageFile);
    }
    
    return (await axiosInstance.put<Point>(ENDPOINTS.POINT_DETAIL(pointId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  },

  deletePoint: async (pointId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.POINT_DETAIL(pointId));
  },
};