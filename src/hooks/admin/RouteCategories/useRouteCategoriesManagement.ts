// src/hooks/admin/RouteCategories/useRouteCategoriesManagement.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  RouteCategory,
  RouteCategoryFilterParams,
} from '../../../types/admin/RouteCategories/routeCategory.types';
import { RouteCategoriesApi } from '../../../services/admin/RouteCategories/routeCategoriesApi';
import { ITEMS_PER_PAGE_ROUTE_CATEGORIES } from '../../../constants/admin/RouteCategories/routeCategories.constants';
// import { useNotification } from '../../../contexts/admin/NotificationContext'; // Если используешь
// import { useDebounce } from '../Other/useDebounce'; // Если будут фильтры

export const useRouteCategoriesManagement = () => {
  // const { showNotification } = useNotification();

  const [categories, setCategories] = useState<RouteCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_ROUTE_CATEGORIES);
  const [canGoNext, setCanGoNext] = useState(false); // Для пагинации без totalItems

  // Состояния для фильтров (если будут)
  // const [filterSearch, setFilterSearch] = useState('');
  // const debouncedSearch = useDebounce(filterSearch, 500);

  const [showForm, setShowForm] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<RouteCategory | null>(null);

  const fetchCategories = useCallback(async (pageToFetch: number) => {
    setLoading(true);
    setError(null);
    try {
      const params: RouteCategoryFilterParams = {
        offset: (pageToFetch - 1) * itemsPerPage,
        limit: itemsPerPage + 1, // Запрашиваем на один больше для определения canGoNext
        // search: debouncedSearch || undefined,
      };
      const responseItems = await RouteCategoriesApi.getRouteCategoriesList(params);
      
      if (responseItems.length > itemsPerPage) {
        setCanGoNext(true);
        setCategories(responseItems.slice(0, itemsPerPage));
      } else {
        setCanGoNext(false);
        setCategories(responseItems);
      }
      setCurrentPage(pageToFetch);

    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось загрузить категории маршрутов.';
      setError(message);
      // showNotification?.(message, 'error');
      console.error(message);
      setCategories([]);
      setCanGoNext(false);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage /*, debouncedSearch, showNotification */]);

  useEffect(() => {
    fetchCategories(1); // Загружаем первую страницу при монтировании
  }, [fetchCategories]);

  // Обработчики фильтров (если будут)
  // const handleSearchFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFilterSearch(e.target.value);
  //   // setCurrentPage(1); // Не обязательно здесь, т.к. fetchCategories вызовется с debouncedSearch
  // }, []);
  // useEffect(() => { // Перезагрузка при изменении debouncedSearch
  //   fetchCategories(1);
  // }, [debouncedSearch, fetchCategories]);


  const handleEdit = useCallback((category: RouteCategory) => {
    setCategoryToEdit(category);
    setShowForm(true);
  }, []);

  const handleShowAddForm = useCallback(() => {
    setCategoryToEdit(null);
    setShowForm(true);
  }, []);

  const handleDelete = async (id: number) => {
    if (id === 1) {
      // showNotification?.('Категорию с ID=1 нельзя удалить.', 'warning');
      alert('Категорию с ID=1 нельзя удалить.'); // Простое уведомление
      return;
    }
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }
    setError(null);
    try {
      await RouteCategoriesApi.deleteRouteCategory(id);
      // showNotification?.('Категория успешно удалена!', 'success');
      console.log('Категория успешно удалена!');
      if (categories.length === 1 && currentPage > 1) {
        fetchCategories(currentPage - 1);
      } else {
        fetchCategories(currentPage);
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось удалить категорию.';
      // showNotification?.(message, 'error');
      console.error(message);
      setError(message);
    }
  };

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setCategoryToEdit(null);
    // Если редактировали, пытаемся остаться на той же странице, если создавали - на первую
    // Или всегда на первую после создания/редактирования для простоты
    fetchCategories(categoryToEdit ? currentPage : 1);
  }, [fetchCategories, categoryToEdit, currentPage]);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setCategoryToEdit(null);
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      fetchCategories(currentPage - 1);
    }
  }, [currentPage, fetchCategories]);

  const handleNextPage = useCallback(() => {
    if (canGoNext) {
      fetchCategories(currentPage + 1);
    }
  }, [canGoNext, currentPage, fetchCategories]);

  return {
    categories,
    loading,
    error,
    currentPage,
    // setItemsPerPage, // Если нужна смена кол-ва элементов
    itemsPerPage, // Для передачи в Pagination
    handlePreviousPage,
    handleNextPage,
    canGoNext,
    canGoPrevious: currentPage > 1,
    // filterSearch,
    // handleSearchFilterChange,
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    handleCancelForm,
    showForm,
    setShowForm,
    categoryToEdit,
  };
};