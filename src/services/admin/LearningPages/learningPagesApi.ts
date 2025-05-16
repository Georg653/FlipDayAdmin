// src/services/admin/LearningPages/learningPagesApi.ts

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { buildQueryString } from '../api/buildQuery';
import type {
  LearningPage,
  LearningPageCreatePayload, // Для тела data_json
  LearningPageUpdatePayload, // Для тела data_json
  PaginatedLearningPagesResponse,
  LearningPageFilterParams,
  // SubtopicOption, // Если будет API для подтем
} from '../../../types/admin/LearningPages/learningPage.types';

export const LearningPagesApi = {
 
  getLearningPagesForSubtopic: async (
    subtopicId: number,
    params: LearningPageFilterParams = {}
  ): Promise<PaginatedLearningPagesResponse> => { // API возвращает LearningPage[]
    const query = buildQueryString({
      limit: params.limit,
      offset: params.offset,
    });
    // API возвращает просто массив LearningPage[], а не объект с total.
    // Поэтому мы "симулируем" PaginatedLearningPagesResponse.
    const response = await axiosInstance.get<LearningPage[]>(
      `${ENDPOINTS.LEARNING_PAGES_BY_SUBTOPIC(subtopicId)}${query}`
    );
    
    // Так как API не возвращает 'total', мы не можем его знать достоверно.
    // Для пагинации это проблема. Пока вернем длину текущего массива,
    // но это будет некорректно для отображения общего числа страниц.
    return {
      items: response.data,
      total: response.data.length, // НЕВЕРНО для реальной пагинации, если это не последняя страница.
                                   // Нужно, чтобы бэкенд возвращал total или мы делали count(*).
      limit: params.limit,
      offset: params.offset,
    };
  },

  /**
   * Получает одну страницу обучения по ее ID.
   */
  getLearningPageById: async (pageId: number): Promise<LearningPage> => {
    return (await axiosInstance.get<LearningPage>(ENDPOINTS.LEARNING_PAGE_DETAIL(pageId))).data;
  },

  /**
   * Создает новую страницу обучения для указанной подтемы.
   * Данные передаются как JSON строка в поле 'data_json' в application/x-www-form-urlencoded.
   */
  createLearningPage: async (
    subtopicId: number,
    payload: LearningPageCreatePayload // page_number и content
  ): Promise<LearningPage> => {
    const formData = new FormData();
    formData.append('data_json', JSON.stringify(payload));

    return (await axiosInstance.post<LearningPage>(
      ENDPOINTS.LEARNING_PAGES_BY_SUBTOPIC(subtopicId),
      formData,
      {
        headers: {
          // Axios обычно сам устанавливает Content-Type для FormData,
          // но если бэкенд ожидает application/x-www-form-urlencoded, это должно сработать.
          // Если бэкенд ожидает multipart/form-data из-за FormData, а принимает application/x-www-form-urlencoded,
          // может потребоваться настроить Axios или бэкенд.
          // Но т.к. нет файлов, FormData здесь используется просто для передачи x-www-form-urlencoded.
        },
      }
    )).data;
  },

  /**
   * Обновляет существующую страницу обучения по ее ID.
   * Данные передаются как JSON строка в поле 'data_json'.
   */
  updateLearningPage: async (
    pageId: number,
    payload: LearningPageUpdatePayload // page_number и/или content
  ): Promise<LearningPage> => {
    const formData = new FormData();
    formData.append('data_json', JSON.stringify(payload));

    return (await axiosInstance.put<LearningPage>(
      ENDPOINTS.LEARNING_PAGE_DETAIL(pageId),
      formData,
      {
        headers: {
          // См. комментарий в createLearningPage
        },
      }
    )).data;
  },

  /**
   * Удаляет страницу обучения по ID.
   */
  deleteLearningPage: async (pageId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.LEARNING_PAGE_DETAIL(pageId));
  },

  // Если/когда появится API для получения списка подтем:
  /*
  getSubtopics: async (params: { limit?: number; offset?: number } = {}): Promise<{items: SubtopicOption[], total: number}> => {
    const query = buildQueryString(params);
    // Предположим, эндпоинт SUBTOPICS_LIST возвращает { items: Subtopic[], total: number }
    const response = await axiosInstance.get<{items: SubtopicOption[], total: number}>(`${ENDPOINTS.SUBTOPICS_LIST}${query}`);
    return response.data;
  },
  */
};