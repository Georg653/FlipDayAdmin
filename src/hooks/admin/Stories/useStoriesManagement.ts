// src/hooks/admin/StoriesManagement/useStoriesManagement.ts
import { useState, useEffect, useCallback } from 'react';
import type { Story, StoryFilterParams } from '../../../types/admin/Stories/story.types'; // Убедись, что все типы импортированы с 'type' если нужно
import { StoriesApi } from '../../../services/admin/Stories/storiesApi';
import { ITEMS_PER_PAGE_STORIES } from '../../../constants/admin/Stories/stories.constants';
// import { useNotification } from '../../../contexts/admin/NotificationContext'; // Раскомментируй, если используешь

export const useStoriesManagement = () => {
  // const { showNotification } = useNotification();

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true); // Начальное состояние true для первой загрузки
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = ITEMS_PER_PAGE_STORIES;
  const [canLoadMore, setCanLoadMore] = useState(false);

  // null - все, true - активные, false - неактивные
  const [filterIsActive, setFilterIsActive] = useState<boolean | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [storyToEdit, setStoryToEdit] = useState<Story | null>(null);

  console.log('[useStoriesManagement] Hook state:', { loading, error, currentPage, filterIsActive, storiesCount: stories.length });

  const fetchStories = useCallback(async (pageToFetch: number, currentFilterValue: boolean | null) => {
    console.log(`[useStoriesManagement] fetchStories called. Page: ${pageToFetch}, Filter: ${currentFilterValue}`);
    setLoading(true); // Устанавливаем loading перед запросом
    setError(null);
    try {
      const params: StoryFilterParams = {
        offset: (pageToFetch - 1) * itemsPerPage,
        limit: itemsPerPage,
        is_active: currentFilterValue,
      };
      console.log('[useStoriesManagement] Fetching with params:', params);
      const responseStories = await StoriesApi.getStories(params);
      
      console.log('[useStoriesManagement] API response stories:', responseStories);
      setStories(responseStories || []); // Гарантируем, что это массив
      setCanLoadMore(responseStories && responseStories.length === itemsPerPage);

    } catch (err: any) {
      let message = 'Не удалось загрузить истории.';
      if (err.code === 'ERR_NETWORK') {
        message = 'Сетевая ошибка. Проверьте CORS на бэкенде или доступность сервера.';
      } else if (err.response && err.response.data && err.response.data.detail) {
        message = typeof err.response.data.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response.data.detail);
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
      // showNotification?.(message, 'error');
      console.error("[useStoriesManagement] Error fetching stories:", message, err);
      setStories([]); // Очищаем истории при ошибке
      setCanLoadMore(false);
    } finally {
      console.log('[useStoriesManagement] fetchStories finished. Setting loading to false.');
      setLoading(false);
    }
  }, [itemsPerPage]); // Убрал filterIsActive из зависимостей useCallback, т.к. он передается как параметр

  // Загрузка при монтировании и при смене страницы или фильтра
  useEffect(() => {
    console.log(`[useStoriesManagement] useEffect triggered. CurrentPage: ${currentPage}, FilterIsActive: ${filterIsActive}`);
    fetchStories(currentPage, filterIsActive);
  }, [currentPage, filterIsActive, fetchStories]);


  const handleIsActiveFilterChange = useCallback((value: string) => {
    console.log(`[useStoriesManagement] Filter changed to: ${value}`);
    let newFilterValue: boolean | null = null;
    if (value === "true") {
      newFilterValue = true;
    } else if (value === "false") {
      newFilterValue = false;
    }
    // Немедленно устанавливаем фильтр и сбрасываем на первую страницу
    // Эти изменения вызовут useEffect выше, который вызовет fetchStories
    setCurrentPage(1); 
    setFilterIsActive(newFilterValue);
  }, []);

  const handleEdit = useCallback((story: Story) => {
    setStoryToEdit(story);
    setShowForm(true);
  }, []);

  const handleShowAddForm = useCallback(() => {
    setStoryToEdit(null);
    setShowForm(true);
  }, []);

  const handleDelete = async (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Вы уверены, что хотите удалить эту историю?')) {
      return;
    }
    setError(null);
    // setLoading(true); // Можно сделать локальный лоадер для кнопки удаления
    try {
      await StoriesApi.deleteStory(id);
      // showNotification?.('История успешно удалена!', 'success');
      console.log('История успешно удалена!');
      // Перезагружаем текущую страницу с текущим фильтром
      fetchStories(currentPage, filterIsActive); 
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось удалить историю.';
      // showNotification?.(message, 'error');
      console.error("[useStoriesManagement] Error deleting story:", message, err);
      setError(message);
    } finally {
      // setLoading(false);
    }
  };

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setStoryToEdit(null);
    // После успеха, лучше перезапросить первую страницу с текущим фильтром
    // чтобы увидеть новую/обновленную историю в правильном порядке
    setCurrentPage(1); 
    fetchStories(1, filterIsActive);
  }, [fetchStories, filterIsActive]);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setStoryToEdit(null);
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (canLoadMore) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  }, [canLoadMore]);

  return {
    stories,
    loading,
    error,
    currentPage,
    handlePreviousPage,
    handleNextPage,
    canLoadMore,
    filterIsActive,
    handleIsActiveFilterChange,
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    handleCancelForm,
    showForm,
    setShowForm,
    storyToEdit,
  };
};