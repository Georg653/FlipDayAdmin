// src/services/admin/LearningSubtopics/learningSubtopicsApi.ts

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { buildQueryString } from '../api/buildQuery';
import type {
  LearningSubtopic,
  LearningSubtopicCreatePayload,
  LearningSubtopicUpdatePayload,
  PaginatedLearningSubtopicsResponse,
  LearningSubtopicFilterParams,
  TopicOption, // Для будущего API тем
} from '../../../types/admin/LearningSubtopics/learningSubtopic.types';

export const LearningSubtopicsApi = {
  getLearningSubtopicsForTopic: async (
    topicId: number,
    params: LearningSubtopicFilterParams = {}
  ): Promise<PaginatedLearningSubtopicsResponse> => {
    const query = buildQueryString({
      limit: params.limit,
      offset: params.offset,
    });
    const response = await axiosInstance.get<LearningSubtopic[]>(
      `${ENDPOINTS.LEARNING_SUBTOPICS_BY_TOPIC(topicId)}${query}`
    );
    return {
      items: response.data,
      total: response.data.length, // API не возвращает total
      limit: params.limit,
      offset: params.offset,
    };
  },

  getLearningSubtopicById: async (subtopicId: number): Promise<LearningSubtopic> => {
    return (await axiosInstance.get<LearningSubtopic>(ENDPOINTS.LEARNING_SUBTOPIC_DETAIL(subtopicId))).data;
  },

  createLearningSubtopic: async (
    topicId: number,
    payload: LearningSubtopicCreatePayload,
    imageFile?: File | null
  ): Promise<LearningSubtopic> => {
    const formData = new FormData();
    formData.append('data_json', JSON.stringify(payload));
    if (imageFile) {
      formData.append('image_file', imageFile);
    }
    return (await axiosInstance.post<LearningSubtopic>(
      ENDPOINTS.LEARNING_SUBTOPICS_BY_TOPIC(topicId),
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } } // Явно указываем для FormData с файлом
    )).data;
  },

  updateLearningSubtopic: async (
    subtopicId: number,
    payload: LearningSubtopicUpdatePayload,
    imageFile?: File | null
  ): Promise<LearningSubtopic> => {
    const formData = new FormData();
    formData.append('data_json', JSON.stringify(payload));
    if (imageFile) {
      formData.append('image_file', imageFile);
    }
    return (await axiosInstance.put<LearningSubtopic>(
      ENDPOINTS.LEARNING_SUBTOPIC_DETAIL(subtopicId),
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )).data;
  },

  deleteLearningSubtopic: async (subtopicId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.LEARNING_SUBTOPIC_DETAIL(subtopicId));
  },

};