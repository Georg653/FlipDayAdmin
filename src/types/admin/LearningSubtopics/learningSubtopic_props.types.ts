// src/types/admin/LearningSubtopics/learningSubtopic_props.types.ts
import type { LearningSubtopic, LearningSubtopicFormData, TopicOption, LearningSubtopicFormOptions } from './learningSubtopic.types';
import type React from 'react'; // Импортируем React для типов событий

// Расширяем LearningSubtopicFormOptions для пропсов компонента формы
export interface LearningSubtopicFormProps extends LearningSubtopicFormOptions {
  formData: LearningSubtopicFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setShowForm: (show: boolean) => void;
  isSubmitting: boolean;
  // learningSubtopicToEdit уже есть в LearningSubtopicFormOptions
  topicOptions?: TopicOption[]; // Для селекта тем, если будет
  formError: string | null;
}

export interface LearningSubtopicsHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  currentTopicIdInput: string;
  onTopicIdChange: (value: string) => void;
  topicOptions?: TopicOption[];
  loadingTopics?: boolean; // Если будет загрузка тем для селекта
}

export interface LearningSubtopicsTableProps {
  learningSubtopics: LearningSubtopic[];
  isLoading: boolean;
  error: string | null;
  onEdit: (learningSubtopic: LearningSubtopic) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}