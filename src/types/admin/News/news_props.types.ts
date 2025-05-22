// src/types/admin/News/news_props.types.ts

import type { NewsItem, NewsFormData } from './news.types';

export interface NewsFormProps {
  formData: NewsFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setShowForm: (show: boolean) => void;
  isSubmitting: boolean;
  newsItemToEdit?: NewsItem | null;
  formError: string | null;
}

export interface NewsHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
}

export interface NewsTableProps {
  newsItems: NewsItem[];
  isLoading: boolean;
  error: string | null;
  onEdit: (newsItem: NewsItem) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}