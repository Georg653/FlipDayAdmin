// src/types/admin/LearningSubtopics/learningSubtopic.types.ts

export interface LearningSubtopic {
  id: number;
  topic_id: number;
  name: string;
  description: string | null;
  experience_points: number;
  image: string | null;
  order: number;
  is_completed: boolean;
  is_unlocked: boolean;
}

export interface LearningSubtopicCreatePayload {
  name: string;
  description?: string | null;
  experience_points: number;
  order: number;
}

export type LearningSubtopicUpdatePayload = Partial<LearningSubtopicCreatePayload>;

export interface LearningSubtopicFormData {
  topic_id: string;
  name: string;
  description: string;
  experience_points: string;
  order: string;
  image_file: File | null;
  image_preview_url?: string | null;
  existing_image_url?: string | null;
}

export const initialLearningSubtopicFormData: LearningSubtopicFormData = {
  topic_id: "",
  name: "",
  description: "",
  experience_points: "0",
  order: "0",
  image_file: null,
  image_preview_url: null,
  existing_image_url: null,
};

export interface LearningSubtopicFormOptions {
  topicIdForCreate?: number | null; // Именно number | null
  onSuccess?: (learningSubtopic: LearningSubtopic) => void;
  learningSubtopicToEdit?: LearningSubtopic | null;
}

export interface PaginatedLearningSubtopicsResponse {
  items: LearningSubtopic[];
  total: number;
  limit?: number;
  offset?: number;
}

export interface LearningSubtopicFilterParams {
  limit?: number;
  offset?: number;
}

export interface TopicOption {
  id: number;
  name: string;
}