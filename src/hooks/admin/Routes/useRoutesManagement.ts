// src/hooks/admin/Routes/useRoutesManagement.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  Route,
  RouteFilterParams,
  RouteCategory, // Убедимся, что этот тип импортирован из route.types.ts, где он ре-экспортируется
} from '../../../types/admin/Routes/route.types';
import { RoutesApi } from '../../../services/admin/Routes/routesApi';
import { RouteCategoriesApi } from '../../../services/admin/RouteCategories/routeCategoriesApi';
import { ITEMS_PER_PAGE_ROUTES } from '../../../constants/admin/Routes/routes.constants';
// import { useNotification } from '../../../contexts/admin/NotificationContext';
// import { useDebounce } from '../Other/useDebounce'; // Если будешь использовать поиск

export const useRoutesManagement = () => {
  // const { showNotification } = useNotification();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_ROUTES);
  const [canGoNext, setCanGoNext] = useState(false);

  // filterCategoryId теперь всегда string, "" означает "все категории"
  const [filterCategoryId, setFilterCategoryId] = useState<string>(""); 
  // const [filterSearch, setFilterSearch] = useState('');
  // const debouncedSearch = useDebounce(filterSearch, 500);

  const [routeCategories, setRouteCategories] = useState<Pick<RouteCategory, 'id' | 'name'>[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [routeToEdit, setRouteToEdit] = useState<Route | null>(null);

  const fetchRouteCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const categoriesResponse = await RouteCategoriesApi.getRouteCategoriesList({ limit: 200 }); 
      setRouteCategories(categoriesResponse.map(cat => ({ id: cat.id, name: cat.name })));
    } catch (err) {
      console.error("Не удалось загрузить категории маршрутов для фильтра:", err);
      setRouteCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchRouteCategories();
  }, [fetchRouteCategories]);

  const fetchRoutes = useCallback(async (pageToFetch: number) => {
    setLoading(true);
    setError(null);
    try {
      let categoryIdForApi: number | undefined = undefined;
      if (filterCategoryId && filterCategoryId !== "") { // Если не пустая строка
        const parsedId = parseInt(filterCategoryId, 10);
        if (!isNaN(parsedId)) {
          categoryIdForApi = parsedId;
        }
      }

      const params: RouteFilterParams = {
        offset: (pageToFetch - 1) * itemsPerPage,
        limit: itemsPerPage + 1,
        category_id: categoryIdForApi, // Будет number или undefined
        // search: debouncedSearch || undefined,
      };
      const responseItems = await RoutesApi.getRoutesList(params);
      
      if (responseItems.length > itemsPerPage) {
        setCanGoNext(true);
        setRoutes(responseItems.slice(0, itemsPerPage));
      } else {
        setCanGoNext(false);
        setRoutes(responseItems);
      }
      setCurrentPage(pageToFetch);

    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось загрузить маршруты.';
      setError(message);
      console.error(message);
      setRoutes([]);
      setCanGoNext(false);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage, filterCategoryId /*, debouncedSearch */]); // Убрал showNotification для краткости

  useEffect(() => {
    fetchRoutes(1);
  }, [fetchRoutes]);

  const handleCategoryFilterChange = useCallback((value: string) => {
    setFilterCategoryId(value); // value из селекта всегда string
    // fetchRoutes(1) вызовется автоматически из-за изменения filterCategoryId в зависимостях useEffect выше
  }, []);

  // const handleSearchFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFilterSearch(e.target.value);
  // }, []);
  // useEffect(() => { // Если используешь debouncedSearch
  //   fetchRoutes(1);
  // }, [debouncedSearch, fetchRoutes]);


  const handleEdit = useCallback((route: Route) => {
    setRouteToEdit(route);
    setShowForm(true);
  }, []);

  const handleShowAddForm = useCallback(() => {
    setRouteToEdit(null);
    setShowForm(true);
  }, []);

  const handleDelete = async (id: number) => {
    const routeToDelete = routes.find(r => r.id === id);
    if (routeToDelete?.auto_generated) {
        alert('Автоматически сгенерированные маршруты нельзя удалить через админ-панель.');
        return;
    }
    if (!window.confirm('Вы уверены, что хотите удалить этот маршрут?')) {
      return;
    }
    setError(null);
    try {
      await RoutesApi.deleteRoute(id);
      console.log('Маршрут успешно удален!');
      if (routes.length === 1 && currentPage > 1) {
        fetchRoutes(currentPage - 1);
      } else {
        fetchRoutes(currentPage);
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось удалить маршрут.';
      console.error(message);
      setError(message);
    }
  };

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setRouteToEdit(null);
    fetchRoutes(routeToEdit ? currentPage : 1); 
  }, [fetchRoutes, routeToEdit, currentPage]);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setRouteToEdit(null);
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      fetchRoutes(currentPage - 1);
    }
  }, [currentPage, fetchRoutes]);

  const handleNextPage = useCallback(() => {
    if (canGoNext) {
      fetchRoutes(currentPage + 1);
    }
  }, [canGoNext, currentPage, fetchRoutes]);

  const getCategoryNameById = useCallback((categoryIdToFind: number): string => {
    const category = routeCategories.find(cat => cat.id === categoryIdToFind);
    return category ? category.name : `ID: ${categoryIdToFind}`; // Возвращаем ID, если имя не найдено
  }, [routeCategories]);


  return {
    routes,
    loading,
    error,
    currentPage,
    itemsPerPage,
    // setItemsPerPage, // Если нужна возможность менять itemsPerPage из UI
    handlePreviousPage,
    handleNextPage,
    canGoNext,
    canGoPrevious: currentPage > 1,
    
    filterCategoryId, // string, для передачи в селект фильтра
    handleCategoryFilterChange,
    routeCategories, // Pick<RouteCategory, 'id' | 'name'>[]
    loadingCategories,

    // filterSearch,
    // handleSearchFilterChange,
    
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    handleCancelForm,
    showForm,
    setShowForm,
    routeToEdit,
    getCategoryNameById,
  };
};