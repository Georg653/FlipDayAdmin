// src/services/admin/News/newsApi.ts

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { buildQueryString } from '../api/buildQuery';
import type {
  NewsItem,
  NewsCreatePayload,
  NewsUpdatePayload,
  PaginatedNewsResponse,
  NewsFilterParams,
} from '../../../types/admin/News/news.types';

export const NewsApi = {
  getNewsList: async (
    params: NewsFilterParams = {}
  ): Promise<PaginatedNewsResponse> => {
    const query = buildQueryString({
      limit: params.limit,
      offset: params.offset,
    });
    const response = await axiosInstance.get<NewsItem[]>(`${ENDPOINTS.NEWS_LIST}${query}`);
    return response.data;
  },

  getNewsItemById: async (newsId: number): Promise<NewsItem> => {
    return (await axiosInstance.get<NewsItem>(ENDPOINTS.NEWS_DETAIL(newsId))).data;
  },

  createNewsItem: async (
    payload: NewsCreatePayload,
    previewFile?: File | null
  ): Promise<NewsItem> => {
    const formData = new FormData();
    formData.append('data_json', JSON.stringify(payload));
    if (previewFile) {
      formData.append('preview_file', previewFile);
    }

    return (await axiosInstance.post<NewsItem>(ENDPOINTS.NEWS_LIST, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  },

  updateNewsItem: async (
    newsId: number,
    payload: NewsUpdatePayload,
    previewFile?: File | null
  ): Promise<NewsItem> => {
    const formData = new FormData();
    if (Object.keys(payload).length > 0 || !previewFile) {
      formData.append('data_json', JSON.stringify(payload));
    } else if (previewFile && Object.keys(payload).length === 0) {
       formData.append('data_json', JSON.stringify({}));
    }

    if (previewFile) {
      formData.append('preview_file', previewFile);
    }
    
    if (formData.entries().next().done && !previewFile) { // Проверка, что formData не пустой, если файла нет
        // Если и payload пуст, и файла нет, возможно, не стоит делать запрос или вернуть текущий элемент
        // Это поведение зависит от требований API. Сейчас он отправит data_json="{}" если только файл.
        // Если и файла нет, и payload пуст, formData будет пустым.
        // API для PUT /v1/admin/news/{news_id} говорит, что data_json и preview_file опциональны.
        // Если отправлять пустой FormData, это может вызвать ошибку на некоторых бэкендах.
        // Для безопасности, если нет ни payload, ни файла, можно вернуть ошибку на клиенте
        // или получить текущий элемент и вернуть его, имитируя "нет изменений".
        // Пока оставляем как есть, API должен обработать это.
    }


    return (await axiosInstance.put<NewsItem>(ENDPOINTS.NEWS_DETAIL(newsId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  },

  deleteNewsItem: async (newsId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.NEWS_DETAIL(newsId));
  },
};