// src/services/admin/LearningTopics/learningTopicsApi.ts
import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { buildQueryString } from '../api/buildQuery';
import type {
  LearningTopic,
  LearningTopicCreatePayload,
  LearningTopicUpdatePayload,
  PaginatedLearningTopicsResponse,
  LearningTopicFilterParams,
} from '../../../types/admin/LearningTopics/learningTopic.types';

export const LearningTopicsApi = {
  getLearningTopics: async (
    params: LearningTopicFilterParams = {}
  ): Promise<PaginatedLearningTopicsResponse> => {
    const query = buildQueryString({
      limit: params.limit,
      offset: params.offset,
      name: params.name, // Если будет фильтр по имени
    });
    // Из документации: GET /v1/admin/topics/ возвращает массив.
    // Schema: [ { "name": "string", ..., "id": 0, "completion_percentage": 0 } ]
    const response = await axiosInstance.get<LearningTopic[]>(
      `${ENDPOINTS.LEARNING_TOPICS_LIST}${query}`
    );
    return {
      items: response.data,
      total: response.data.length, // API не возвращает total
      limit: params.limit,
      offset: params.offset,
    };
  },

  getLearningTopicById: async (topicId: number): Promise<LearningTopic> => {
    // Из документации: GET /v1/admin/topics/{topic_id}
    return (await axiosInstance.get<LearningTopic>(ENDPOINTS.LEARNING_TOPIC_DETAIL(topicId))).data;
  },

  createLearningTopic: async (
    payload: LearningTopicCreatePayload,
    imageFile?: File | null
  ): Promise<LearningTopic> => {
    // Из документации: POST /v1/admin/topics/, multipart/form-data с data_json и image_file
    const formData = new FormData();
    formData.append('data_json', JSON.stringify(payload));
    if (imageFile) {
      formData.append('image_file', imageFile);
    }
    return (await axiosInstance.post<LearningTopic>(
      ENDPOINTS.LEARNING_TOPICS_LIST,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )).data;
  },

  updateLearningTopic: async (
    topicId: number,
    payload: LearningTopicUpdatePayload,
    imageFile?: File | null
  ): Promise<LearningTopic> => {
    // Из документации: PUT /v1/admin/topics/{topic_id}, multipart/form-data с data_json и image_file
    const formData = new FormData();
    // data_json опционален при обновлении в документации API, но если payload пустой, это может быть проблемой.
    // Однако, если payload будет {}, JSON.stringify({}) вернет "{}", что нормально.
    formData.append('data_json', JSON.stringify(payload));
    if (imageFile) {
      formData.append('image_file', imageFile);
    }
    return (await axiosInstance.put<LearningTopic>(
      ENDPOINTS.LEARNING_TOPIC_DETAIL(topicId),
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )).data;
  },

  deleteLearningTopic: async (topicId: number): Promise<void> => {
    // Из документации: DELETE /v1/admin/topics/{topic_id}
    await axiosInstance.delete(ENDPOINTS.LEARNING_TOPIC_DETAIL(topicId));
  },
};