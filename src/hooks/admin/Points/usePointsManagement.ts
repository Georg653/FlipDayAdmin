// src/hooks/admin/Points/usePointsManagement.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  Point,
  PointFilterParams,
  PointContentResponse, // Нам понадобится для предзагрузки контента при редактировании
} from '../../../types/admin/Points/point.types';
import { PointsApi } from '../../../services/admin/Points/pointsApi';
import { ITEMS_PER_PAGE_POINTS } from '../../../constants/admin/Points/points.constants';
// import { useNotification } from '../../../contexts/admin/NotificationContext';
// import { useDebounce } from '../Other/useDebounce';

export const usePointsManagement = () => {
  // const { showNotification } = useNotification();

  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_POINTS);
  const [canGoNext, setCanGoNext] = useState(false);

  // Фильтры (пока закомментированы)
  // const [filterSearch, setFilterSearch] = useState('');
  // const [filterCategory, setFilterCategory] = useState('');
  // const debouncedSearch = useDebounce(filterSearch, 500);

  const [showForm, setShowForm] = useState(false);
  // При редактировании, pointToEdit будет содержать основные данные точки.
  // Контент (PointContentResponse) будем загружать отдельно перед открытием формы.
  const [pointToEdit, setPointToEdit] = useState<Point | null>(null);
  const [pointContentToEdit, setPointContentToEdit] = useState<PointContentResponse | null>(null);
  const [loadingContent, setLoadingContent] = useState(false); // Для загрузки контента при редактировании


  const fetchPoints = useCallback(async (pageToFetch: number) => {
    setLoading(true);
    setError(null);
    try {
      const params: PointFilterParams = {
        offset: (pageToFetch - 1) * itemsPerPage,
        limit: itemsPerPage + 1, // Запрашиваем на один больше
        // search: debouncedSearch || undefined,
        // category_id: filterCategory ? parseInt(filterCategory) : undefined,
      };
      const responseItems = await PointsApi.getPointsList(params);
      
      if (responseItems.length > itemsPerPage) {
        setCanGoNext(true);
        setPoints(responseItems.slice(0, itemsPerPage));
      } else {
        setCanGoNext(false);
        setPoints(responseItems);
      }
      setCurrentPage(pageToFetch);

    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось загрузить точки.';
      setError(message);
      // showNotification?.(message, 'error');
      console.error(message);
      setPoints([]);
      setCanGoNext(false);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage /*, debouncedSearch, filterCategory, showNotification */]);

  useEffect(() => {
    fetchPoints(1);
  }, [fetchPoints]);

  // Обработчики фильтров (если будут)
  // ...

  const handleEdit = useCallback(async (point: Point) => {
    setPointToEdit(point);
    setLoadingContent(true); // Начинаем загрузку контента
    setShowForm(true); // Можно открыть форму сразу или после загрузки контента
    try {
      const contentData = await PointsApi.getPointContent(point.id);
      setPointContentToEdit(contentData);
    } catch (err: any) {
      console.error(`Не удалось загрузить контент для точки ID ${point.id}:`, err);
      // showNotification?.(`Ошибка загрузки контента для точки: ${err.message || 'Неизвестная ошибка'}`, 'error');
      setPointContentToEdit(null); // Сбрасываем, если ошибка
      // Можно решить, закрывать ли форму, если контент не загрузился, или позволить редактировать без него
    } finally {
      setLoadingContent(false);
    }
  }, [/* showNotification */]);

  const handleShowAddForm = useCallback(() => {
    setPointToEdit(null);
    setPointContentToEdit(null); // Сбрасываем контент для новой точки
    setShowForm(true);
  }, []);

  const handleDelete = async (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Вы уверены, что хотите удалить эту точку и весь связанный с ней контент?')) {
      return;
    }
    setError(null);
    // Можно добавить локальный индикатор загрузки для операции удаления
    try {
      await PointsApi.deletePoint(id);
      // showNotification?.('Точка успешно удалена!', 'success');
      console.log('Точка успешно удалена!');
      if (points.length === 1 && currentPage > 1) {
        fetchPoints(currentPage - 1);
      } else {
        fetchPoints(currentPage);
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось удалить точку.';
      // showNotification?.(message, 'error');
      console.error(message);
      setError(message);
    }
  };

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setPointToEdit(null);
    setPointContentToEdit(null);
    fetchPoints(pointToEdit ? currentPage : 1); // Если редактировали, остаемся, если создавали - на первую
  }, [fetchPoints, pointToEdit, currentPage]);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setPointToEdit(null);
    setPointContentToEdit(null);
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      fetchPoints(currentPage - 1);
    }
  }, [currentPage, fetchPoints]);

  const handleNextPage = useCallback(() => {
    if (canGoNext) {
      fetchPoints(currentPage + 1);
    }
  }, [canGoNext, currentPage, fetchPoints]);

  return {
    points,
    loading,
    error,
    currentPage,
    itemsPerPage,
    // setItemsPerPage, // Если нужна смена кол-ва элементов
    handlePreviousPage,
    handleNextPage,
    canGoNext,
    canGoPrevious: currentPage > 1,
    // filterSearch,
    // handleSearchFilterChange,
    // filterCategory,
    // handleCategoryFilterChange,
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    handleCancelForm,
    showForm,
    setShowForm,
    pointToEdit,
    pointContentToEdit, // Передаем загруженный контент в форму
    loadingContent, // Индикатор загрузки контента
  };
};