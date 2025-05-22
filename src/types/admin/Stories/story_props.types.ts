// src/types/admin/Stories/story_props.types.ts

import type { Story, StoryFormData, StoryContentItem } from './story.types';

export interface StoryFormProps {
  formData: StoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<StoryFormData>>; // Для управления content_items
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void; // Для is_active
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Для preview_file
  handleSubmit: (e: React.FormEvent) => void;
  setShowForm: (show: boolean) => void;
  isSubmitting: boolean;
  storyToEdit?: Story | null;
  formError: string | null;

  // Функции для управления content_items
  addContentItem: () => void;
  updateContentItem: (index: number, field: keyof StoryContentItem, value: string) => void;
  removeContentItem: (index: number) => void;
}

export interface StoriesHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  filterIsActive: boolean | null; // null для "все", true для "активные", false для "неактивные"
  onIsActiveFilterChange: (value: string) => void; // value будет "all", "true", "false"
}

export interface StoriesTableProps {
  stories: Story[];
  isLoading: boolean;
  error: string | null;
  onEdit: (story: Story) => void;
  onDelete: (id: number) => void;
  // Пагинация будет упрощенной, т.к. нет totalItems
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  canLoadMore?: boolean; // Флаг, есть ли еще данные для загрузки (для кнопки "Next")
}