// src/types/admin/LearningSubtopics/learningSubtopic_props.types.ts
import type React from 'react';
import type {
  LearningSubtopic,
  LearningSubtopicFormData,
  TopicOption,
} from './learningSubtopic.types';

export interface LearningSubtopicFormProps {
  formData: LearningSubtopicFormData;
  isSubmitting: boolean;
  formError: string | null;
   handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setShowForm: (show: boolean) => void;
  handleCancel: () => void;
  learningSubtopicToEdit?: LearningSubtopic | null;
  topicOptions?: TopicOption[];
}

export interface LearningSubtopicsHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  currentTopicIdInput: string;
  onTopicIdChange: (value: string) => void;
  topicOptions?: TopicOption[];
  loadingTopics?: boolean;
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