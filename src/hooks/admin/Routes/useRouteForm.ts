// src/hooks/admin/Routes/useRouteForm.ts
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  Route,
  RouteCreateDataPayload,
  RouteUpdateDataPayload,
  RouteFormData,
  RouteFormOptions,
  RoutePointInfo,    // Для хранения выбранных точек в форме
  SelectablePoint,   // Для списка всех доступных точек
  Point,             // Базовый тип Point
  RouteCategory,     // Для списка категорий
} from '../../../types/admin/Routes/route.types';
import { initialRouteFormData } from '../../../types/admin/Routes/route.types';
import { RoutesApi } from '../../../services/admin/Routes/routesApi';
import { PointsApi } from '../../../services/admin/Points/pointsApi'; // Для загрузки всех точек
import { RouteCategoriesApi } from '../../../services/admin/RouteCategories/routeCategoriesApi'; // Для загрузки категорий

// import { useNotification } from '../../../contexts/admin/NotificationContext';

export const useRouteForm = (options: RouteFormOptions) => {
  const { onSuccess, routeToEdit } = options;
  // const { showNotification } = useNotification();

  const [formData, setFormData] = useState<RouteFormData>(initialRouteFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Для выбора точек
  const [allAvailablePoints, setAllAvailablePoints] = useState<Point[]>([]);
  const [loadingAvailablePoints, setLoadingAvailablePoints] = useState(false);
  
  // Для выбора категории
  const [routeCategories, setRouteCategories] = useState<Pick<RouteCategory, 'id' | 'name'>[]>([]);
  const [loadingRouteCategories, setLoadingRouteCategories] = useState(false);

  // Загрузка категорий для селекта
  const fetchRouteCategoriesForForm = useCallback(async () => {
    setLoadingRouteCategories(true);
    try {
      const categoriesResponse = await RouteCategoriesApi.getRouteCategoriesList({ limit: 200 });
      // Фильтруем категорию с ID=1, так как ее нельзя выбирать (согласно коду бэка)
      setRouteCategories(
        categoriesResponse
            .filter(cat => cat.id !== 1) 
            .map(cat => ({ id: cat.id, name: cat.name }))
      );
    } catch (err) {
      console.error("Не удалось загрузить категории маршрутов для формы:", err);
      setRouteCategories([]);
    } finally {
      setLoadingRouteCategories(false);
    }
  }, []);

  // Загрузка всех доступных точек для выбора
  const fetchAllAvailablePoints = useCallback(async () => {
    setLoadingAvailablePoints(true);
    try {
      // Загружаем все точки (или с большим лимитом, если их очень много)
      // Предполагаем, что PointsApi.getPointsList вернет массив Point[]
      const pointsResponse = await PointsApi.getPointsList({ limit: 1000 }); // Отрегулируй лимит
      setAllAvailablePoints(pointsResponse);
    } catch (err) {
      console.error("Не удалось загрузить доступные точки:", err);
      setAllAvailablePoints([]);
    } finally {
      setLoadingAvailablePoints(false);
    }
  }, []);

  useEffect(() => {
    fetchRouteCategoriesForForm();
    fetchAllAvailablePoints();
  }, [fetchRouteCategoriesForForm, fetchAllAvailablePoints]);
  
  const resetForm = useCallback(() => {
    setFormData(initialRouteFormData);
    setFormError(null);
  }, []);

  useEffect(() => {
    if (routeToEdit) {
      // Преобразуем routeToEdit.points (который может быть number[] или Point[])
      // в RoutePointInfo[] для формы.
      // Если routeToEdit.points это number[], нам нужны детали этих точек.
      // Если это Point[], нам нужен order.
      // Бэкенд возвращает в RouteResponse.points массив PointResponse[], где order неявный.
      // Значит, при редактировании нам нужно восстановить order и основную инфу.
      
      let initialSelectedPoints: RoutePointInfo[] = [];
      if (routeToEdit.points && Array.isArray(routeToEdit.points)) {
        initialSelectedPoints = routeToEdit.points.map((pointOrId, index) => {
          if (typeof pointOrId === 'number') {
            // Если только ID, ищем в allAvailablePoints (этот сценарий менее вероятен с текущим бэком)
            const pointDetail = allAvailablePoints.find(p => p.id === pointOrId);
            return {
              id: pointOrId,
              name: pointDetail?.name || `Точка ID: ${pointOrId}`,
              latitude: pointDetail?.latitude || 0,
              longitude: pointDetail?.longitude || 0,
              image: pointDetail?.image || null,
              order: index,
              __id: uuidv4(),
            };
          } else { // Если это объект Point
            const point = pointOrId as Point; // Приводим тип
            return {
              id: point.id,
              name: point.name,
              latitude: point.latitude,
              longitude: point.longitude,
              image: point.image,
              order: index, // Порядок по индексу из API
              __id: uuidv4(),
            };
          }
        });
      }

      setFormData({
        name: routeToEdit.name,
        description: routeToEdit.description,
        route_category_id: routeToEdit.route_category_id.toString(),
        selected_points: initialSelectedPoints,
        distance: routeToEdit.distance.toString(),
        estimated_time: routeToEdit.estimated_time.toString(),
        budget: routeToEdit.budget.toString(),
        auto_generated: routeToEdit.auto_generated, // Не редактируется, но отображаем
        image_file: null,
        image_preview_url: routeToEdit.image,
        existing_image_url: routeToEdit.image,
      });
      setFormError(null);
    } else {
      resetForm();
    }
  }, [routeToEdit, resetForm, allAvailablePoints]); // Добавили allAvailablePoints в зависимости

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
    if (formError) setFormError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      image_file: file,
      image_preview_url: file ? URL.createObjectURL(file) : prev.existing_image_url,
    }));
    if (formError) setFormError(null);
  };

  // --- Логика управления выбранными точками маршрута ---
  const handleAddPointToRoute = useCallback((pointId: number) => {
    const pointToAdd = allAvailablePoints.find(p => p.id === pointId);
    if (pointToAdd && !formData.selected_points.find(p => p.id === pointId)) {
      const newRoutePoint: RoutePointInfo = {
        id: pointToAdd.id,
        name: pointToAdd.name,
        latitude: pointToAdd.latitude,
        longitude: pointToAdd.longitude,
        image: pointToAdd.image,
        order: formData.selected_points.length, // Новый порядок
        __id: uuidv4(),
      };
      setFormData(prev => ({
        ...prev,
        selected_points: [...prev.selected_points, newRoutePoint]
      }));
    }
  }, [allAvailablePoints, formData.selected_points]);

  const handleRemovePointFromRoute = useCallback((pointIdToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      selected_points: prev.selected_points
        .filter(p => p.id !== pointIdToRemove)
        .map((p, index) => ({ ...p, order: index })), // Пересчитываем order
    }));
  }, []);

  const handleMovePointInRoute = useCallback((pointIdToMove: number, direction: 'up' | 'down') => {
    setFormData(prev => {
      const currentIndex = prev.selected_points.findIndex(p => p.id === pointIdToMove);
      if (currentIndex === -1) return prev;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.selected_points.length) return prev;

      const newSelectedPoints = [...prev.selected_points];
      const [movedPoint] = newSelectedPoints.splice(currentIndex, 1);
      newSelectedPoints.splice(newIndex, 0, movedPoint);

      // Обновляем order для всех точек
      return {
        ...prev,
        selected_points: newSelectedPoints.map((p, index) => ({ ...p, order: index })),
      };
    });
  }, []);
  // --- Конец логики управления точками ---


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.route_category_id || formData.route_category_id === "1") {
        setFormError('Выберите категорию маршрута (нельзя выбрать "Autogenerated" ID=1).');
        setIsSubmitting(false);
        return;
    }
    if (formData.selected_points.length === 0) {
        setFormError('Маршрут должен содержать хотя бы одну точку.');
        setIsSubmitting(false);
        return;
    }
    // ... (другие валидации для name, distance и т.д.)

    setIsSubmitting(true);
    setFormError(null);

    const payload: RouteCreateDataPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      route_category_id: parseInt(formData.route_category_id, 10),
      points: formData.selected_points.map(p => p.id), // Отправляем массив ID точек
      distance: parseFloat(formData.distance) || 0,
      estimated_time: parseInt(formData.estimated_time, 10) || 0,
      budget: parseFloat(formData.budget) || 0,
      auto_generated: formData.auto_generated,
    };
    
    try {
      let result: Route;
      const isEditing = !!routeToEdit;

      if (isEditing && routeToEdit) {
        const updatePayload: RouteUpdateDataPayload = { ...payload };
        // auto_generated нельзя менять при обновлении через админский PUT, убираем его из payload
        delete (updatePayload as any).auto_generated; 
        
        result = await RoutesApi.updateRoute(
          routeToEdit.id,
          updatePayload,
          formData.image_file
        );
        console.log('Маршрут успешно обновлен!');
      } else {
        result = await RoutesApi.createRoute(
          payload, // auto_generated здесь уже установлен (false по умолчанию на бэке)
          formData.image_file
        );
        console.log('Маршрут успешно создан!');
      }
      onSuccess?.(result);
    } catch (error: any) {
      console.error("Ошибка сохранения маршрута:", error);
      const message = error.response?.data?.detail || `Не удалось ${routeToEdit ? 'обновить' : 'создать'} маршрут.`;
      let errorMessage = "Произошла неизвестная ошибка.";
       if (typeof message === 'string') {
        errorMessage = message;
      } else if (Array.isArray(message) && message.length > 0 && typeof message[0] === 'object' && message[0].msg) {
        errorMessage = message.map(err => `${err.loc?.join('.') || 'поле'} - ${err.msg}`).join('; ');
      }
      console.error(errorMessage);
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData, // Передаем для возможного внешнего управления (например, из компонента выбора точек)
    handleChange,
    handleCheckboxChange,
    handleFileChange,
    handleSubmit,
    isSubmitting,
    formError,
    resetForm,
    // Для селектов и выбора точек
    routeCategories,
    loadingRouteCategories,
    allAvailablePoints, // Список всех точек для выбора
    loadingAvailablePoints,
    // Функции для управления точками в маршруте
    handleAddPointToRoute,
    handleRemovePointFromRoute,
    handleMovePointInRoute,
  };
};