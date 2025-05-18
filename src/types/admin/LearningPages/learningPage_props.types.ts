// src/types/admin/LearningPages/learningPage_props.types.ts
import type React from 'react';
import type {
  LearningPage,
  LearningPageFormData,
  SubtopicOption,
  LearningPageFormOptions, // Импортируем для использования в компоненте формы
} from './learningPage.types';

// Пропсы для компонента LearningPageForm.tsx
// Он будет принимать опции для своего внутреннего хука useLearningPageForm
// и функцию для управления своей видимостью.
export interface LearningPageFormProps extends LearningPageFormOptions {
  setShowForm: (show: boolean) => void;
  // subtopicOptions?: SubtopicOption[]; // Если селект подтем будет рендериться в форме
}

// Пропсы для компонента LearningPagesHeader.tsx
export interface LearningPagesHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  currentSubtopicIdInput: string;
  onSubtopicIdChange: (value: string) => void;
  subtopicOptions?: SubtopicOption[];
  loadingSubtopics?: boolean;
}

// Пропсы для компонента LearningPagesTable.tsx
export interface LearningPagesTableProps {
  learningPages: LearningPage[];
  isLoading: boolean;
  error: string | null;
  onEdit: (learningPage: LearningPage) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}