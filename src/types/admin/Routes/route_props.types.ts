// src/types/admin/Routes/route_props.types.ts
import type { 
    Route, 
    RouteFormData, 
    RoutePointInfo, 
    SelectablePoint,
    RouteCategory // Импортируем RouteCategory
} from './route.types';

export interface RouteFormProps {
  formData: RouteFormData;
  setFormData: React.Dispatch<React.SetStateAction<RouteFormData>>; // Для управления selected_points
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void; // для auto_generated
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  
  // Пропсы для управления списком точек в маршруте
  availablePoints: SelectablePoint[]; // Список всех доступных точек для выбора
  loadingAvailablePoints: boolean;
  onAddPointToRoute: (pointId: number) => void;
  onRemovePointFromRoute: (pointId: number) => void;
  onMovePointInRoute: (pointId: number, direction: 'up' | 'down') => void;
  // --- Конец пропсов для точек ---

  setShowForm: (show: boolean) => void;
  isSubmitting: boolean;
  routeToEdit?: Route | null;
  formError: string | null;
  routeCategories: Pick<RouteCategory, 'id' | 'name'>[]; // Для селекта категорий
  loadingRouteCategories: boolean;
}

export interface RoutesHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  filterCategoryId: string | number;
  onCategoryFilterChange: (value: string) => void; // value из селекта
  routeCategories: Pick<RouteCategory, 'id' | 'name'>[];
  loadingRouteCategories: boolean;
  // filterSearch?: string;
  // onSearchFilterChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface RoutesTableProps {
  routes: Route[];
  isLoading: boolean;
  error: string | null;
  onEdit: (route: Route) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  getCategoryName: (categoryId: number) => string; // Функция для получения имени категории
}

// Пропсы для компонента выбора/управления точками в маршруте
export interface RoutePointsManagerProps {
    selectedPoints: RoutePointInfo[]; // Точки, уже добавленные в маршрут
    availablePoints: SelectablePoint[]; // Все точки, доступные для добавления
    loadingAvailablePoints: boolean;
    onAddPoint: (pointId: number) => void;
    onRemovePoint: (pointId: number) => void;
    onMovePoint: (pointId: number, direction: 'up' | 'down') => void;
    // Возможно, строка поиска для фильтрации availablePoints
    // searchTerm: string;
    // onSearchTermChange: (term: string) => void;
}