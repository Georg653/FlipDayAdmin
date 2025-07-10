// --- Путь: src/hooks/admin/Routes/useRoutesManagement.ts ---

import { useState, useEffect, useCallback } from 'react';
import type { Route } from '../../../types/admin/Routes/route.types';
import type { RouteCategory } from '../../../types/admin/RouteCategories/routeCategory.types';
import { RoutesApi } from '../../../services/admin/Routes/routesApi';
import { RouteCategoriesApi } from '../../../services/admin/RouteCategories/routeCategoriesApi';
import { useDebounce } from './useDebounce'; // Предполагаем, что этот хук у нас есть и экспортирован

const ITEMS_PER_PAGE = 10;

export const useRoutesManagement = () => {
  // --- Состояние для данных ---
  const [routes, setRoutes] = useState<Route[]>([]);
  const [categories, setCategories] = useState<RouteCategory[]>([]);
  
  // --- Состояние загрузки/ошибок ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Состояние пагинации и фильтров ---
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all'); // 'all' или ID категории
  const debouncedSearch = useDebounce(searchFilter, 500);

  // --- Состояние для модалки ---
  const [showForm, setShowForm] = useState(false);
  const [routeToEdit, setRouteToEdit] = useState<Route | null>(null);

  // --- Функция загрузки маршрутов ---
  const fetchRoutes = useCallback(async (page: number, categoryId?: number | null, search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await RoutesApi.getRoutesList({
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        category_id: categoryId,
        search: search,
      });
      setRoutes(data);
      setHasNextPage(data.length === ITEMS_PER_PAGE);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка загрузки маршрутов');
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Функция загрузки категорий для фильтра ---
  const fetchCategories = useCallback(async () => {
    try {
      const cats = await RouteCategoriesApi.getRouteCategories({ limit: 200 }); // Загружаем много категорий
      setCategories(cats);
    } catch (err) {
      console.error("Не удалось загрузить категории для фильтра", err);
    }
  }, []);


  // --- Эффекты ---
  
  // Загружаем категории один раз при монтировании
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Реагируем на изменение фильтров или пагинации
  useEffect(() => {
    const catId = categoryFilter === 'all' ? null : Number(categoryFilter);
    fetchRoutes(currentPage, catId, debouncedSearch);
  }, [currentPage, categoryFilter, debouncedSearch, fetchRoutes]);


  // --- Обработчики действий ---

  const handleEdit = (route: Route) => {
    setRouteToEdit(route);
    setShowForm(true);
  };
  const handleShowAddForm = () => {
    setRouteToEdit(null);
    setShowForm(true);
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот маршрут?')) return;
    setRoutes(prev => prev.filter(r => r.id !== id));
    try {
      await RoutesApi.deleteRoute(id);
    } catch (err) {
      setError('Ошибка удаления маршрута');
      // Можно было бы восстановить список, но для простоты просто покажем ошибку
      // и пользователь обновит страницу.
    }
  };
  const handleFormSuccess = () => {
    setShowForm(false);
    setRouteToEdit(null);
    // Перезагружаем текущую страницу, чтобы увидеть изменения
    const catId = categoryFilter === 'all' ? null : Number(categoryFilter);
    fetchRoutes(currentPage, catId, debouncedSearch);
  };
  const handlePreviousPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const handleNextPage = () => { if (hasNextPage) setCurrentPage(p => p + 1); };
  
  // Обработчики для фильтров
  const handleCategoryFilterChange = (value: string) => {
    setCurrentPage(1);
    setCategoryFilter(value);
  };
  const handleSearchFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearchFilter(e.target.value);
  };
  
  return {
    routes, categories, loading, error, currentPage,
    hasNextPage, showForm, routeToEdit,
    searchFilter, categoryFilter,
    handleEdit, handleShowAddForm, handleDelete, handleFormSuccess,
    setShowForm, setRouteToEdit, handlePreviousPage, handleNextPage,
    handleCategoryFilterChange, handleSearchFilterChange,
  };
};