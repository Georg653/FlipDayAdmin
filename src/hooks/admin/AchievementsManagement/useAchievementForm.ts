// src/hooks/admin/AchievementsManagement/useAchievementForm.ts
// src/hooks/admin/AchievementsManagement/useAchievementForm.ts
import { useState, useEffect, useCallback } from 'react';
import type { // <--- ДОБАВЬ type ЗДЕСЬ
  Achievement,
  AchievementCreatePayload,
  AchievementUpdatePayload,
  AchievementFormData,
  AchievementFormOptions,
} from '../../../types/admin/Achievements/achievement.types';
import { initialAchievementFormData } from '../../../types/admin/Achievements/achievement.types'; // initialAchievementFormData - это ЗНАЧЕНИЕ, а не тип, поэтому импортируем его отдельно без 'type'
import { AchievementsApi } from '../../../services/admin/Achievements/achievementsApi';
// ... остальной код ...

export const useAchievementForm = (options: AchievementFormOptions) => {
  const { onSuccess, achievementToEdit } = options;
  // const { showNotification } = useNotification(); // Раскомментируй, если есть контекст уведомлений

  const [formData, setFormData] = useState<AchievementFormData>(initialAchievementFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setFormData(initialAchievementFormData);
    setFormError(null);
  }, []);

  useEffect(() => {
    if (achievementToEdit) {
      setFormData({
        name: achievementToEdit.name,
        description: achievementToEdit.description,
        achievement_type: achievementToEdit.achievement_type,
        criteria_value: achievementToEdit.criteria_value.toString(),
        criteria_unit: achievementToEdit.criteria_unit,
        image_file: null, // При редактировании файл сбрасывается, пользователь загружает новый если нужно
        image_preview_url: achievementToEdit.image, // Показываем текущее изображение
        existing_image_url: achievementToEdit.image,
      });
      setFormError(null);
    } else {
      resetForm();
    }
  }, [achievementToEdit, resetForm]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      image_file: file,
      image_preview_url: file ? URL.createObjectURL(file) : prev.existing_image_url, // Показываем превью нового или старое
    }));
    if (formError) setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // Валидация
    if (!formData.name.trim() || !formData.achievement_type.trim() || !formData.criteria_value.trim() || !formData.criteria_unit.trim()) {
      setFormError('Name, Achievement Type, Criteria Value, and Criteria Unit are required.');
      setIsSubmitting(false);
      return;
    }

    const criteriaValueNumber = parseFloat(formData.criteria_value);
    if (isNaN(criteriaValueNumber)) {
      setFormError('Criteria Value must be a valid number.');
      setIsSubmitting(false);
      return;
    }

    const achievementDataPayload: AchievementCreatePayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      achievement_type: formData.achievement_type.trim(),
      criteria_value: criteriaValueNumber,
      criteria_unit: formData.criteria_unit.trim(),
    };

    try {
      let result: Achievement;
      const isEditing = !!achievementToEdit;

      if (isEditing && achievementToEdit) {
        // При обновлении передаем только измененные поля, если API это поддерживает
        // Для простоты, сейчас передаем все поля, кроме image, которые были в форме
        const updatePayload: AchievementUpdatePayload = { ...achievementDataPayload };
        result = await AchievementsApi.updateAchievement(
          achievementToEdit.id,
          updatePayload,
          formData.image_file
        );
        // showNotification?.('Achievement updated successfully!', 'success');
        console.log('Achievement updated successfully!');
      } else {
        result = await AchievementsApi.createAchievement(
          achievementDataPayload,
          formData.image_file
        );
        // showNotification?.('Achievement created successfully!', 'success');
        console.log('Achievement created successfully!');
      }
      onSuccess?.(result); // Вызываем колбэк с обновленными/созданными данными
      // resetForm(); // Можно сбрасывать форму здесь или в onSuccess в вызывающем компоненте
    } catch (error: any) {
      console.error("Error saving achievement:", error);
      const message = error.response?.data?.detail || `Failed to ${achievementToEdit ? 'update' : 'create'} achievement.`;
      let errorMessage = "An unknown error occurred.";

      if (typeof message === 'string') {
        errorMessage = message;
      } else if (Array.isArray(message)) {
        errorMessage = message.map(err => `${err.loc?.join('.') || 'field'} - ${err.msg}`).join('; ');
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
    setFormData, // Если нужно будет менять форму извне
    handleChange,
    handleFileChange,
    handleSubmit,
    isSubmitting,
    formError,
    resetForm,
  };
};