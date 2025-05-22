// src/hooks/admin/RouteCategories/useRouteCategoryForm.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  RouteCategory,
  RouteCategoryCreatePayload,
  RouteCategoryUpdatePayload,
  RouteCategoryFormData,
  RouteCategoryFormOptions,
} from '../../../types/admin/RouteCategories/routeCategory.types';
import { initialRouteCategoryFormData } from '../../../types/admin/RouteCategories/routeCategory.types';
import { RouteCategoriesApi } from '../../../services/admin/RouteCategories/routeCategoriesApi';
// import { useNotification } from '../../../contexts/admin/NotificationContext'; // Если используешь

export const useRouteCategoryForm = (options: RouteCategoryFormOptions) => {
  const { onSuccess, categoryToEdit } = options;
  // const { showNotification } = useNotification();

  const [formData, setFormData] = useState<RouteCategoryFormData>(initialRouteCategoryFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setFormData(initialRouteCategoryFormData);
    setFormError(null);
  }, []);

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name,
        description: categoryToEdit.description,
        image_file: null,
        image_preview_url: categoryToEdit.image, // Показываем текущее изображение
        existing_image_url: categoryToEdit.image,
      });
      setFormError(null);
    } else {
      resetForm();
    }
  }, [categoryToEdit, resetForm]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Название категории обязательно.');
      setIsSubmitting(false);
      return;
    }

    const payload: RouteCategoryCreatePayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    try {
      let result: RouteCategory;
      const isEditing = !!categoryToEdit;

      if (isEditing && categoryToEdit) {
        // Формируем payload для обновления только измененных полей, если это необходимо
        // или передаем весь payload, а API разбирается.
        // В нашем RouteCategoriesApi.updateRouteCategory мы передаем весь payload из формы
        const updatePayload: RouteCategoryUpdatePayload = { ...payload };
        result = await RouteCategoriesApi.updateRouteCategory(
          categoryToEdit.id,
          updatePayload,
          formData.image_file
        );
        // showNotification?.('Категория успешно обновлена!', 'success');
        console.log('Категория успешно обновлена!');
      } else {
        result = await RouteCategoriesApi.createRouteCategory(
          payload,
          formData.image_file
        );
        // showNotification?.('Категория успешно создана!', 'success');
        console.log('Категория успешно создана!');
      }
      onSuccess?.(result);
    } catch (error: any) {
      console.error("Ошибка сохранения категории:", error);
      const message = error.response?.data?.detail || `Не удалось ${categoryToEdit ? 'обновить' : 'создать'} категорию.`;
      let errorMessage = "Произошла неизвестная ошибка.";

      if (typeof message === 'string') {
        errorMessage = message;
      } else if (Array.isArray(message) && message.length > 0 && message[0].msg) {
        errorMessage = message.map(err => `${err.loc?.join('.') || 'поле'} - ${err.msg}`).join('; ');
      } else if (typeof message === 'object' && message !== null) {
        // Попытка извлечь сообщение из более сложной структуры ошибки
        const errorDetails = Object.values(message).flat();
        if (Array.isArray(errorDetails) && errorDetails.length > 0 && typeof errorDetails[0] === 'string') {
            errorMessage = errorDetails.join('; ');
        }
      }
      // showNotification?.(errorMessage, 'error');
      console.error(errorMessage);
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    handleFileChange,
    handleSubmit,
    isSubmitting,
    formError,
    resetForm,
  };
};