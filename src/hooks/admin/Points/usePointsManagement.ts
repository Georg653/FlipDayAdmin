// --- Путь: src/hooks/admin/Points/usePointsManagement.ts ---
// ПОЛНАЯ ВЕРСИЯ

import { useState, useEffect, useCallback } from 'react';
import type { Point, PointBase } from '../../../types/admin/Points/point.types';
import { PointsApi } from '../../../services/admin/Points/pointsApi';

const ITEMS_PER_PAGE = 15;

export const usePointsManagement = () => {
  const [points, setPoints] = useState<PointBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [pointToEdit, setPointToEdit] = useState<Point | null>(null);
  const [isFetchingContent, setIsFetchingContent] = useState(false);

  const fetchPoints = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await PointsApi.getPoints({
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
      });
      setPoints(data);
      setHasNextPage(data.length === ITEMS_PER_PAGE);
    } catch (err: any) {
      setError('Ошибка загрузки точек.');
      setPoints([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoints(currentPage);
  }, [currentPage, fetchPoints]);

  const handleShowAddForm = () => {
    setPointToEdit(null);
    setShowForm(true);
  };

  const handleEdit = async (pointBase: PointBase) => {
    setPointToEdit(null);
    setIsFetchingContent(true);
    setShowForm(true);
    try {
      const contentData = await PointsApi.getPointContent(pointBase.id);
      setPointToEdit({ ...pointBase, ...contentData });
    } catch (err: any) {
      // --- ГЛАВНЫЙ ФИКС ЗДЕСЬ ---
      // Если ошибка 404, это значит, у точки просто еще нет контента.
      // Это не ошибка, а нормальная ситуация.
      if (err.response && err.response.status === 404) {
        // Мы открываем форму с пустым контентом.
        setPointToEdit({ ...pointBase, content: [] });
      } else {
        // А вот если другая ошибка - сообщаем о ней.
        setError('Ошибка загрузки контента точки.');
        setShowForm(false);
      }
    } finally {
      setIsFetchingContent(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту точку?')) return;
    
    const originalPoints = [...points];
    setPoints(currentPoints => currentPoints.filter(p => p.id !== id));

    try {
      await PointsApi.deletePoint(id);
      if (points.length === 1 && currentPage > 1) {
          setCurrentPage(p => p - 1);
      }
    } catch (err: any) {
      setError('Ошибка удаления.');
      setPoints(originalPoints);
    }
  };

  const handleFormSuccess = (updatedPoint: PointBase) => {
    setShowForm(false);
    setPointToEdit(null);
    setPoints(prevPoints => 
        prevPoints.map(p => p.id === updatedPoint.id ? { ...p, ...updatedPoint } : p)
    );
  };
  
  const handlePreviousPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const handleNextPage = () => { if (hasNextPage) setCurrentPage(p => p + 1); };

  return {
    points, loading, error, handleEdit, handleDelete, handleShowAddForm, handleFormSuccess,
    showForm, setShowForm, pointToEdit, isFetchingContent,
    currentPage, canGoNext: hasNextPage, canGoPrevious: currentPage > 1,
    handlePreviousPage, handleNextPage,
  };
};