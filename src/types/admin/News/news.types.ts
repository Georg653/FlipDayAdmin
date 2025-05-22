// src/types/admin/News/news.types.ts

export interface TestOption {
  id: string;
  text: string;
}

export type ContentBlockType =
  | "heading"
  | "text"
  | "image"
  | "video"
  | "audio"
  | "album"
  | "slider"
  | "test";

export interface ContentBlock {
  __id?: string;
  type: ContentBlockType;
  id?: string | null;
  level?: number | null;
  content?: string | null;
  src?: string | string[] | null;
  text?: string | null;
  question?: string | null;
  options?: TestOption[] | null;
  message?: string | null;
}

export interface NewsItem {
  id: number;
  title: string;
  description: string;
  preview: string;
  content: ContentBlock[];
  created_at: string;
}

export interface NewsCreatePayload {
  title: string;
  description: string;
  content: ContentBlock[];
  preview?: string | null;
}

export type NewsUpdatePayload = Partial<Omit<NewsCreatePayload, 'content'>> & {
    content?: ContentBlock[];
};

export interface NewsFormData {
  title: string;
  description: string;
  content: ContentBlock[];
  preview_file: File | null;
  preview_url_manual: string;
  existing_preview_url?: string | null;
}

export const initialNewsFormData: NewsFormData = {
  title: "",
  description: "",
  content: [],
  preview_file: null,
  preview_url_manual: "",
  existing_preview_url: null,
};

export interface NewsFormOptions {
  onSuccess?: (newsItem: NewsItem) => void;
  newsItemToEdit?: NewsItem | null;
}

export type PaginatedNewsResponse = NewsItem[];

export interface NewsFilterParams {
  limit?: number;
  offset?: number;
}