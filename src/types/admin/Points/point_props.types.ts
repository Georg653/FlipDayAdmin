// src/types/admin/Points/point_props.types.ts
import type { Point, PointFormData, ContentBlock, PointContentResponse } from './point.types';

export interface PointFormProps {
  formData: PointFormData;
  setFormData: React.Dispatch<React.SetStateAction<PointFormData>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void; // <<<--- ИЗМЕНЕНА СИГНАТУРА
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  
  isBlockModalOpen: boolean;
  editingBlock: ContentBlock | null;
  editingBlockIndex: number | null;
  handleAddBlock: () => void;
  handleEditBlock: (index: number) => void;
  handleDeleteBlock: (index: number) => void;
  handleSaveBlock: (blockData: ContentBlock) => void;
  handleCloseBlockModal: () => void;
  moveBlock: (index: number, direction: 'up' | 'down') => void;

  setShowForm: (show: boolean) => void;
  isSubmitting: boolean;
  pointToEdit?: Point & { contentData?: PointContentResponse | null };
  formError: string | null;
}

export interface PointsHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
}

export interface PointsTableProps {
  points: Point[];
  isLoading: boolean;
  error: string | null;
  onEdit: (point: Point) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export interface ContentBlockFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (blockData: ContentBlock) => void;
    initialBlockData?: ContentBlock | null;
}