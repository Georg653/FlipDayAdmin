// src/types/admin/LearningTopics/learningTopic_props.types.ts
import type React from 'react';
import type { LearningTopic, LearningTopicFormData } from './learningTopic.types';

// Пропсы для компонента LearningTopicForm.tsx
export interface LearningTopicFormProps {
  formData: LearningTopicFormData;
  isSubmitting: boolean;
  formError: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setShowForm: (show: boolean) => void;
  handleCancel: () => void;
  learningTopicToEdit?: LearningTopic | null;
}

// Пропсы для компонента LearningTopicsHeader.tsx
export interface LearningTopicsHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  // filterNameInput?: string;
  // onFilterNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Пропсы для компонента LearningTopicsTable.tsx
export interface LearningTopicsTableProps {
  learningTopics: LearningTopic[];
  isLoading: boolean;
  error: string | null;
  onEdit: (learningTopic: LearningTopic) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}