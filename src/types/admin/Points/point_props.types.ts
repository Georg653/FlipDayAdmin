// --- Путь: src/types/admin/Points/point_props.types.ts ---

import type { Point } from './point.types';

// Пропсы для основных компонентов страницы
export interface PointsTableProps {
  points: Point[];
  isLoading: boolean;
  error: string | null;
  onEdit: (point: Point) => void;
  onDelete: (id: number) => void;
  // Сюда можно будет добавить пагинацию, если она появится на бэке
}

export interface PointsHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  // Сюда можно будет добавить фильтры
}

export interface PointFormProps {
  pointToEdit: Point | null;
  onSuccess: () => void;
  onCancel: () => void;
}