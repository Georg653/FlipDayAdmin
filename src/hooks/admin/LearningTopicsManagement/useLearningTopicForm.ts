// src/hooks/admin/LearningTopicsManagement/useLearningTopicForm.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  LearningTopic,
  LearningTopicCreatePayload,
  LearningTopicUpdatePayload,
  LearningTopicFormData,
  LearningTopicFormOptions,
} from '../../../types/admin/LearningTopics/learningTopic.types';
import { initialLearningTopicFormData } from '../../../types/admin/LearningTopics/learningTopic.types';
import { LearningTopicsApi } from '../../../services/admin/LearningTopics/learningTopicsApi';

export const useLearningTopicForm = (options: LearningTopicFormOptions) => {
  const { onSuccess, learningTopicToEdit } = options;

  const [formData, setFormData] = useState<LearningTopicFormData>(initialLearningTopicFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setFormData(initialLearningTopicFormData);
    setFormError(null);
  }, []);

  useEffect(() => {
    if (learningTopicToEdit) {
      setFormData({
        name: learningTopicToEdit.name,
        description: learningTopicToEdit.description || "",
        experience_points: learningTopicToEdit.experience_points.toString(),
        order: learningTopicToEdit.order.toString(),
        image_file: null,
        image_preview_url: learningTopicToEdit.image,
        existing_image_url: learningTopicToEdit.image,
      });
      setFormError(null);
    } else {
      resetForm();
    }
  }, [learningTopicToEdit, resetForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    if (!formData.name.trim() || !formData.experience_points.trim() || !formData.order.trim()) {
      setFormError('Название, Очки опыта и Порядок обязательны.');
      setIsSubmitting(false); return;
    }
    const experiencePointsNum = parseInt(formData.experience_points, 10);
    const orderNum = parseInt(formData.order, 10);

    if (isNaN(experiencePointsNum) || experiencePointsNum < 0) {
      setFormError('Очки опыта должны быть неотрицательным числом.'); setIsSubmitting(false); return;
    }
    if (isNaN(orderNum) || orderNum < 0) {
      setFormError('Порядок должен быть неотрицательным числом.'); setIsSubmitting(false); return;
    }

    const payloadData: LearningTopicCreatePayload = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      experience_points: experiencePointsNum,
      order: orderNum,
    };

    try {
      let result: LearningTopic;
      const isEditing = !!learningTopicToEdit;

      if (isEditing && learningTopicToEdit) {
        const updatePayload: LearningTopicUpdatePayload = {};
        let hasChanges = false;
        if (formData.name.trim() !== learningTopicToEdit.name) { updatePayload.name = formData.name.trim(); hasChanges = true; }
        if (formData.description.trim() !== (learningTopicToEdit.description || "")) { updatePayload.description = formData.description.trim() || null; hasChanges = true; }
        if (experiencePointsNum !== learningTopicToEdit.experience_points) { updatePayload.experience_points = experiencePointsNum; hasChanges = true; }
        if (orderNum !== learningTopicToEdit.order) { updatePayload.order = orderNum; hasChanges = true; }
        if (formData.image_file) { hasChanges = true; }

        if (!hasChanges) {
          setIsSubmitting(false); onSuccess?.(learningTopicToEdit); return;
        }
        result = await LearningTopicsApi.updateLearningTopic(learningTopicToEdit.id, updatePayload, formData.image_file);
      } else {
        result = await LearningTopicsApi.createLearningTopic(payloadData, formData.image_file);
      }
      onSuccess?.(result);
    } catch (error: any) {
      const message = error.response?.data?.detail || `Не удалось ${learningTopicToEdit ? 'обновить' : 'создать'} тему.`;
      let errorMessage = "Произошла ошибка.";
      if (typeof message === 'string') {errorMessage = message;}
      else if (Array.isArray(message)) {errorMessage = message.map(err => `${err.loc?.join(' -> ') || 'поле'} - ${err.msg}`).join('; ');}
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return { formData, handleChange, handleFileChange, handleSubmit, isSubmitting, formError, resetForm };
};