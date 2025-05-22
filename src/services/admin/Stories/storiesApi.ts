// src/services/admin/Stories/storiesApi.ts

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { buildQueryString } from '../api/buildQuery';
import type {
  Story,
  StoryCreatePayload,
  StoryUpdatePayload,
  // PaginatedStoriesResponse, // API не возвращает структуру с total, а просто массив
  StoryFilterParams,
} from '../../../types/admin/Stories/story.types';

export const StoriesApi = {
  /**
   * Получает список историй с пагинацией и фильтрацией.
   * API не возвращает total, поэтому мы просто получаем массив.
   */
  getStories: async (params: StoryFilterParams = {}): Promise<Story[]> => {
    const queryParams: Record<string, any> = {
      limit: params.limit,
      offset: params.offset,
    };
    // Обрабатываем is_active: boolean | null
    // API ожидает is_active=true или is_active=false. Если null, параметр не передаем.
    if (typeof params.is_active === 'boolean') {
      queryParams.is_active = params.is_active;
    }

    const query = buildQueryString(queryParams);
    const response = await axiosInstance.get<Story[]>(`${ENDPOINTS.STORIES}${query}`);
    return response.data; // API возвращает просто массив Story[]
  },

  /**
   * Получает одну историю по ID.
   */
  getStoryById: async (storyId: number): Promise<Story> => {
    return (await axiosInstance.get<Story>(ENDPOINTS.STORY_DETAIL(storyId))).data;
  },

  /**
   * Создает новую историю.
   * Данные передаются как JSON строка в 'data_json' и файл в 'preview_file'.
   */
  createStory: async (
    payload: StoryCreatePayload,
    previewFile: File // превью обязательно при создании
  ): Promise<Story> => {
    const formData = new FormData();
    formData.append('data_json', JSON.stringify(payload));
    formData.append('preview_file', previewFile);

    return (await axiosInstance.post<Story>(ENDPOINTS.STORIES, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  },

  /**
   * Обновляет существующую историю по ID.
   * Данные в 'data_json' (опционально), новый файл превью в 'preview_file' (опционально).
   */
  updateStory: async (
    storyId: number,
    payload?: StoryUpdatePayload, // payload может быть undefined, если обновляется только файл
    previewFile?: File | null
  ): Promise<Story> => {
    const formData = new FormData();
    // data_json должен присутствовать, даже если пустой, если так ожидает API
    // или передаем только если payload не пустой
    if (payload && Object.keys(payload).length > 0) {
      formData.append('data_json', JSON.stringify(payload));
    } else {
      // Если API требует data_json всегда, даже для обновления только файла,
      // можно передать пустой объект {} или не передавать вовсе, если API это допускает
      // formData.append('data_json', JSON.stringify({}));
    }

    if (previewFile) {
      formData.append('preview_file', previewFile);
    }

    // Если ни payload, ни previewFile не предоставлены, возможно, стоит выдать ошибку или не делать запрос.
    // Но API может позволять "пустые" PUT-запросы, которые ничего не меняют.

    return (await axiosInstance.put<Story>(ENDPOINTS.STORY_DETAIL(storyId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  },

  /**
   * Удаляет историю по ID.
   */
  deleteStory: async (storyId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.STORY_DETAIL(storyId));
    // API возвращает 204 No Content
  },
};