// src/types/admin/LearningPages/learningPage_props.types.ts
import type { LearningPage, LearningPageFormData, SubtopicOption } from './learningPage.types';

/**
 * Пропсы для компонента LearningPageForm.
 */
export interface LearningPageFormProps {
  formData: LearningPageFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  // handleSelectChange: (fieldName: string, value: string) => void; // Если будут селекты
  handleSubmit: (e: React.FormEvent) => void;
  setShowForm: (show: boolean) => void;
  isSubmitting: boolean;
  learningPageToEdit?: LearningPage | null;
  // subtopicIdFromContext?: number; // ID подтемы, если форма вызывается в контексте конкретной подтемы
  // subtopicOptions?: SubtopicOption[]; // Опции для селекта подтем, если он будет
  formError: string | null;
}

/**
 * Пропсы для компонента LearningPagesHeader.
 */
export interface LearningPagesHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  // subtopicIdFilter: string; // Для инпута/селекта subtopic_id
  // onSubtopicIdFilterChange: (value: string) => void; // Для инпута/селекта subtopic_id
  // subtopicOptions?: SubtopicOption[]; // Опции для селекта подтем
  // selectedSubtopicName?: string; // Для отображения названия выбранной подтемы
}

/**
 * Пропсы для компонента LearningPagesTable.
 */
export interface LearningPagesTableProps {
  learningPages: LearningPage[];
  isLoading: boolean;
  error: string | null;
  onEdit: (learningPage: LearningPage) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalItems: number; // Будет проблемой, т.к. API не возвращает
  itemsPerPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  // currentSubtopicId?: number | null; // Для информации, какие страницы отображаются
}