// src/hooks/admin/AchievementsManagement/useAchievementsManagement.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  Achievement,
  AchievementFilterParams,
  PaginatedAchievementsResponse,
} from '../../../types/admin/Achievements/achievement.types';
import { AchievementsApi } from '../../../services/admin/Achievements/achievementsApi';
import { ITEMS_PER_PAGE_ACHIEVEMENTS } from '../../../constants/admin/Achievements/achievements.constants';

export const useAchievementsManagement = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]); // Инициализация пустым массивом
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_ACHIEVEMENTS);
  const [showForm, setShowForm] = useState(false);
  const [achievementToEdit, setAchievementToEdit] = useState<Achievement | null>(null);

  const fetchAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: AchievementFilterParams = {
        offset: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      };
      const response: PaginatedAchievementsResponse = await AchievementsApi.getAchievements(params);
      
      // Гарантируем, что response.items является массивом, иначе используем пустой массив
      setAchievements(response && Array.isArray(response.items) ? response.items : []);
      // Гарантируем, что response.total является числом, иначе 0
      setTotalItems(response && typeof response.total === 'number' ? response.total : 0);

    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load achievements.';
      setError(message);
      console.error('[useAchievementsManagement] Error fetching achievements:', message, err);
      setAchievements([]); // При ошибке устанавливаем пустой массив
      setTotalItems(0);     // При ошибке сбрасываем totalItems
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const handleEdit = useCallback((achievement: Achievement) => {
    setAchievementToEdit(achievement);
    setShowForm(true);
  }, []);

  const handleShowAddForm = useCallback(() => {
    setAchievementToEdit(null);
    setShowForm(true);
  }, []);

  const handleDelete = async (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Are you sure you want to delete this achievement?')) {
      return;
    }
    // setLoading(true); // Можно убрать глобальный лоадинг или сделать его более гранулярным
    setError(null);
    try {
      await AchievementsApi.deleteAchievement(id);
      console.log('Achievement deleted successfully!');
      if (achievements.length === 1 && currentPage > 1) {
        setCurrentPage(prevPage => prevPage - 1);
      } else {
        fetchAchievements();
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to delete achievement.';
      console.error('[useAchievementsManagement] Error deleting achievement:', message, err);
      setError(message);
    } finally {
      // setLoading(false);
    }
  };

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setAchievementToEdit(null);
    fetchAchievements();
  }, [fetchAchievements]);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setAchievementToEdit(null);
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPages && totalPages > 0) { // Добавил totalPages > 0
      setCurrentPage(prevPage => prevPage + 1);
    }
  }, [currentPage, totalItems, itemsPerPage]);

  return {
    achievements,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalItems,
    itemsPerPage,
    setItemsPerPage,
    handlePreviousPage,
    handleNextPage,
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    handleCancelForm,
    showForm,
    setShowForm,
    achievementToEdit,
    setAchievementToEdit,
  };
};