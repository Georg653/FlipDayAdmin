// --- Путь: src/hooks/admin/Points/usePointsManagement.ts ---

import { useState, useEffect, useCallback } from 'react';
import type { Point } from '../../../types/admin/Points/point.types';
import { PointsApi } from '../../../services/admin/Points/pointsApi';

export const usePointsManagement = () => {
  // --- Состояние для данных ---
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Состояние для модального окна формы ---
  const [showForm, setShowForm] = useState(false);
  const [pointToEdit, setPointToEdit] = useState<Point | null>(null);

  // --- Функция загрузки данных с бэка ---
  const fetchPoints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Бэк пока не поддерживает пагинацию, загружаем все
      const data = await PointsApi.getPointsList();
      setPoints(data);
    } catch (err: any) {
      let errorMessage = 'Ошибка загрузки точек.';
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        errorMessage = typeof detail === 'object' ? JSON.stringify(detail, null, 2) : String(detail);
      }
      setError(errorMessage);
      setPoints([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Эффект, который вызывает загрузку при первом рендере
  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);
  
  // --- Обработчики действий пользователя ---

  const handleEdit = async (point: Point) => {
    // Перед открытием формы нужно подгрузить детальную инфу (включая контент)
    setLoading(true);
    try {
        const detailedPoint = await PointsApi.getPointById(point.id);
        setPointToEdit(detailedPoint);
        setShowForm(true);
    } catch (err) {
        setError('Не удалось загрузить детальную информацию о точке.');
    } finally {
        setLoading(false);
    }
  };

  const handleShowAddForm = () => {
    setPointToEdit(null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту точку?')) return;
    
    const originalPoints = [...points];
    setPoints(items => items.filter(item => item.id !== id));

    try {
      await PointsApi.deletePoint(id);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(detail || 'Ошибка удаления точки.');
      setPoints(originalPoints);
    }
  };

  // Вызывается после успешного сохранения формы
  const handleFormSuccess = () => {
    setShowForm(false);
    setPointToEdit(null);
    // Просто перезагружаем весь список, т.к. пагинации нет
    fetchPoints();
  };
  
  // --- Возвращаем всё, что нужно для UI-компонентов ---
  return {
    points,
    loading,
    error,
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    showForm,
    setShowForm,
    pointToEdit,
  };
};