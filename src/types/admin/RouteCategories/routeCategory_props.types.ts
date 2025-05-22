// src/types/admin/RouteCategories/routeCategory_props.types.ts
import type { RouteCategory, RouteCategoryFormData } from './routeCategory.types';

export interface RouteCategoryFormProps {
  formData: RouteCategoryFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setShowForm: (show: boolean) => void;
  isSubmitting: boolean;
  categoryToEdit?: RouteCategory | null;
  formError: string | null;
}

export interface RouteCategoriesHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  // filterSearch?: string;
  // onSearchFilterChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface RouteCategoriesTableProps {
  categories: RouteCategory[];
  isLoading: boolean;
  error: string | null;
  onEdit: (category: RouteCategory) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}