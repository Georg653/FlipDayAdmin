// --- Путь: src/hooks/admin/Routes/useRouteForm.ts ---

import { useState, useEffect } from 'react';
import type { 
  Route, 
  RouteFormData, 
  RouteCreateUpdatePayload 
} from '../../../types/admin/Routes/route.types';
import type { Point } from '../../../types/admin/Points/point.types';
import type { RouteCategory } from '../../../types/admin/RouteCategories/routeCategory.types';

import { RoutesApi } from '../../../services/admin/Routes/routesApi';
import { PointsApi } from '../../../services/admin/Points/pointsApi';
import { RouteCategoriesApi } from '../../../services/admin/RouteCategories/routeCategoriesApi';

const initialFormData: RouteFormData = {
  name: '',
  description: '',
  route_category_id: '',
  distance: '0',
  estimated_time: '0',
  budget: '0',
  image_file: null,
  image_preview_url: null,
  remove_image: false,
  points: [],
};

interface UseRouteFormOptions {
  routeToEdit: Route | null;
  onSuccess: () => void;
}

export const useRouteForm = ({ routeToEdit, onSuccess }: UseRouteFormOptions) => {
  const [formData, setFormData] = useState<RouteFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [allCategories, setAllCategories] = useState<RouteCategory[]>([]);
  const [allPoints, setAllPoints] = useState<Point[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDataForForm = async () => {
      setIsLoading(true);
      try {
        // --- ИСПРАВЛЕНИЕ: Уменьшаем limit до адекватного значения ---
        // Если у тебя больше 200 категорий или точек, это число нужно будет увеличить
        // или реализовать полную подгрузку всех страниц. Но для начала этого хватит.
        const [categoriesData, pointsData] = await Promise.all([
          RouteCategoriesApi.getRouteCategories({ limit: 200 }),
          PointsApi.getPointsList({ limit: 200 })
        ]);
        setAllCategories(categoriesData);
        setAllPoints(pointsData);
      } catch (err) {
        setFormError('Ошибка загрузки данных для формы (категорий или точек).');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataForForm();
  }, []);


  useEffect(() => {
    if (routeToEdit && allPoints.length > 0) {
      const selectedPoints = routeToEdit.points
        .map(pointId => allPoints.find(p => p.id === pointId))
        .filter((p): p is Point => p !== undefined);

      setFormData({
        name: routeToEdit.name,
        description: routeToEdit.description,
        route_category_id: String(routeToEdit.route_category_id),
        distance: String(routeToEdit.distance),
        estimated_time: String(routeToEdit.estimated_time),
        budget: String(routeToEdit.budget),
        image_file: null,
        image_preview_url: routeToEdit.image,
        remove_image: false,
        points: selectedPoints,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [routeToEdit, allPoints]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, image_file: e.target.files?.[0] || null }));
  };
  const handleRemoveImage = (checked: boolean) => {
    setFormData(prev => ({ ...prev, remove_image: checked }));
  };
  const handlePointsChange = (newPoints: Point[]) => {
    setFormData(prev => ({ ...prev, points: newPoints }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const categoryId = parseInt(formData.route_category_id, 10);
    if (isNaN(categoryId) || categoryId <= 0) {
      setFormError('Нужно выбрать категорию.'); setIsSubmitting(false); return;
    }
    if (formData.points.length === 0) {
      setFormError('Маршрут должен содержать хотя бы одну точку.'); setIsSubmitting(false); return;
    }

    const payload: RouteCreateUpdatePayload = {
      name: formData.name,
      description: formData.description,
      route_category_id: categoryId,
      distance: parseFloat(formData.distance) || 0,
      estimated_time: parseInt(formData.estimated_time, 10) || 0,
      budget: parseFloat(formData.budget) || 0,
      points: formData.points.map(p => p.id),
      image_url: formData.image_file ? null : formData.image_preview_url,
    };

    try {
      if (routeToEdit) {
        await RoutesApi.updateRoute(routeToEdit.id, payload, formData.image_file, formData.remove_image);
      } else {
        await RoutesApi.createRoute(payload, formData.image_file);
      }
      onSuccess();
    } catch (err: any) {
      setFormError(err.response?.data?.detail || 'Ошибка сохранения маршрута');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    formError,
    allCategories,
    allPoints,
    isLoading,
    handleChange,
    handleFileChange,
    handleRemoveImage,
    handlePointsChange,
    handleSubmit,
  };
};