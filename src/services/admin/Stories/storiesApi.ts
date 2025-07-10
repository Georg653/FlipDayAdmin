// --- Путь: src/services/admin/Stories/storiesApi.ts ---

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { buildQueryString } from '../api/buildQuery';
import type { Story, StoryFilterParams, StoryCreateUpdatePayload } from '../../../types/admin/Stories/story.types';

// Новая вспомогательная функция для форматирования даты, чтобы не дублировать код
const formatToUtcStringForBackend = (localDateTimeString: string): string | null => {
  if (!localDateTimeString) return null;
  const date = new Date(localDateTimeString);
  if (isNaN(date.getTime())) return null;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


export const StoriesApi = {
  // ... (getStories, getStoryById, deleteStory, createStory, updateStory остаются без изменений)
  getStories: async (params: StoryFilterParams = {}): Promise<Story[]> => {
    const query = buildQueryString(params);
    const response = await axiosInstance.get<Story[]>(`${ENDPOINTS.STORIES}${query}`);
    return Array.isArray(response.data) ? response.data : [];
  },
  getStoryById: async (storyId: number): Promise<Story> => {
    const response = await axiosInstance.get<Story>(ENDPOINTS.STORY_DETAIL(storyId));
    return response.data;
  },
  deleteStory: async (storyId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.STORY_DETAIL(storyId));
  },
  createStory: async (jsonData: StoryCreateUpdatePayload, previewFile: File | null, contentMediaFiles: File[]): Promise<Story> => {
    const formData = new FormData();
    formData.append('story_data_json', JSON.stringify(jsonData));
    if (previewFile) formData.append('preview_file', previewFile);
    contentMediaFiles.forEach(file => formData.append('story_content_media_files', file));
    const response = await axiosInstance.post<Story>(ENDPOINTS.STORIES, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
  },
  updateStory: async (storyId: number, jsonData: StoryCreateUpdatePayload, previewFile: File | null, contentMediaFiles: File[], removePreview: boolean): Promise<Story> => {
    const formData = new FormData();
    formData.append('story_data_json', JSON.stringify(jsonData));
    if (previewFile) formData.append('preview_file', previewFile);
    if (removePreview) formData.append('remove_preview', 'true');
    contentMediaFiles.forEach(file => formData.append('story_content_media_files', file));
    const response = await axiosInstance.put<Story>(ENDPOINTS.STORY_DETAIL(storyId), formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
  },

  // --- ВМЕСТО patchStory ИСПОЛЬЗУЕМ ЭТО ---
  updateStoryStatus: async (story: Story, newStatus: boolean): Promise<Story> => {
    // 1. Формируем полный payload, как в основной форме
    const payload: StoryCreateUpdatePayload = {
      name: story.name,
      is_active: newStatus, // Новое значение
      expires_at: story.expires_at ? formatToUtcStringForBackend(new Date(story.expires_at + 'Z').toISOString()) : null,
      content_items: story.content_items.map(item => ({
        content: item.content, // Отправляем существующие URL/ключи
        type: item.type,
        duration: item.duration,
      })),
    };

    // 2. Отправляем через FormData, но без файлов
    const formData = new FormData();
    formData.append('story_data_json', JSON.stringify(payload));
    
    // 3. Используем PUT запрос
    const response = await axiosInstance.put<Story>(ENDPOINTS.STORY_DETAIL(story.id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};