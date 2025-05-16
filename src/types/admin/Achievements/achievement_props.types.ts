// src/types/admin/Achievements/achievement_props.types.ts

// src/types/admin/Achievements/achievement_props.types.ts
import type { Achievement, AchievementFormData } from './achievement.types';

export interface AchievementFormProps {
  formData: AchievementFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setShowForm: (show: boolean) => void;
  isSubmitting: boolean;
  achievementToEdit?: Achievement | null;
  formError: string | null;
}

export interface AchievementsHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  // filterNameInput?: string;
  // onNameFilterChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface AchievementsTableProps {
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}