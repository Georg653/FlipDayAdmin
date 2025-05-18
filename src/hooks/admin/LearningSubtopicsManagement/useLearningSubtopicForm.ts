// src/hooks/admin/LearningSubtopicsManagement/useLearningSubtopicForm.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  LearningSubtopic,
  LearningSubtopicCreatePayload,
  LearningSubtopicUpdatePayload,
  LearningSubtopicFormData,
  LearningSubtopicFormOptions,
} from '../../../types/admin/LearningSubtopics/learningSubtopic.types';
import { initialLearningSubtopicFormData } from '../../../types/admin/LearningSubtopics/learningSubtopic.types';
import { LearningSubtopicsApi } from '../../../services/admin/LearningSubtopics/learningSubtopicsApi';

export const useLearningSubtopicForm = (options: LearningSubtopicFormOptions) => {
  const { onSuccess, learningSubtopicToEdit, topicIdForCreate } = options;

  const [formData, setFormData] = useState<LearningSubtopicFormData>(initialLearningSubtopicFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setFormData(prev => ({
      ...initialLearningSubtopicFormData,
      topic_id: topicIdForCreate?.toString() || prev.topic_id || "",
    }));
    setFormError(null);
  }, [topicIdForCreate]);

  useEffect(() => {
    if (learningSubtopicToEdit) {
      let currentTopicId = "";
      if (options.topicIdForCreate && learningSubtopicToEdit) {
          currentTopicId = options.topicIdForCreate.toString();
      } else if (formData.topic_id) {
        currentTopicId = formData.topic_id;
      } else {
        currentTopicId = learningSubtopicToEdit.topic_id.toString(); // Берем из редактируемого объекта
      }

      setFormData({
        topic_id: currentTopicId,
        name: learningSubtopicToEdit.name,
        description: learningSubtopicToEdit.description || "",
        experience_points: learningSubtopicToEdit.experience_points.toString(),
        order: learningSubtopicToEdit.order.toString(),
        image_file: null,
        image_preview_url: learningSubtopicToEdit.image,
        existing_image_url: learningSubtopicToEdit.image,
      });
      setFormError(null);
    } else {
      setFormData(prev => ({
        ...initialLearningSubtopicFormData,
        topic_id: topicIdForCreate?.toString() || prev.topic_id || "",
      }));
    }
  }, [learningSubtopicToEdit, resetForm, topicIdForCreate, options.topicIdForCreate, formData.topic_id]);

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

    if (!formData.topic_id.trim() || !formData.name.trim() || !formData.experience_points.trim() || !formData.order.trim()) {
      setFormError('ID Темы, Название, Очки опыта и Порядок обязательны.');
      setIsSubmitting(false);
      return;
    }

    const topicIdNum = parseInt(formData.topic_id, 10);
    const experiencePointsNum = parseInt(formData.experience_points, 10);
    const orderNum = parseInt(formData.order, 10);

    if (isNaN(topicIdNum) || topicIdNum <= 0) {
      setFormError('ID Темы должен быть положительным числом.'); setIsSubmitting(false); return;
    }
    if (isNaN(experiencePointsNum) || experiencePointsNum < 0) {
      setFormError('Очки опыта должны быть неотрицательным числом.'); setIsSubmitting(false); return;
    }
    if (isNaN(orderNum) || orderNum < 0) {
      setFormError('Порядок должен быть неотрицательным числом.'); setIsSubmitting(false); return;
    }

    const payloadData: LearningSubtopicCreatePayload = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      experience_points: experiencePointsNum,
      order: orderNum,
    };

    try {
      let result: LearningSubtopic;
      const isEditing = !!learningSubtopicToEdit;

      if (isEditing && learningSubtopicToEdit) {
        const updatePayload: LearningSubtopicUpdatePayload = {};
        let hasChanges = false;

        if (formData.name.trim() !== learningSubtopicToEdit.name) { updatePayload.name = formData.name.trim(); hasChanges = true; }
        if (formData.description.trim() !== (learningSubtopicToEdit.description || "")) { updatePayload.description = formData.description.trim() || null; hasChanges = true; }
        if (experiencePointsNum !== learningSubtopicToEdit.experience_points) { updatePayload.experience_points = experiencePointsNum; hasChanges = true; }
        if (orderNum !== learningSubtopicToEdit.order) { updatePayload.order = orderNum; hasChanges = true; }
        if (formData.image_file) { hasChanges = true; }


        if (!hasChanges) {
          console.log('Нет изменений для сохранения.');
          setIsSubmitting(false);
          onSuccess?.(learningSubtopicToEdit);
          return;
        }
        
        result = await LearningSubtopicsApi.updateLearningSubtopic(
          learningSubtopicToEdit.id,
          updatePayload,
          formData.image_file
        );
        console.log('Подтема успешно обновлена!');
      } else {
        result = await LearningSubtopicsApi.createLearningSubtopic(
          topicIdNum,
          payloadData,
          formData.image_file
        );
        console.log('Подтема успешно создана!');
      }
      onSuccess?.(result);
    } catch (error: any) {
      console.error("Ошибка сохранения подтемы:", error);
      const message = error.response?.data?.detail || `Не удалось ${learningSubtopicToEdit ? 'обновить' : 'создать'} подтему.`;
      let errorMessage = "Произошла неизвестная ошибка.";
      if (typeof message === 'string') {
        errorMessage = message;
      } else if (Array.isArray(message)) {
        errorMessage = message.map(err => `${err.loc?.join(' -> ') || 'поле'} - ${err.msg}`).join('; ');
      }
      console.error(errorMessage);
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, setFormData, handleChange, handleFileChange, handleSubmit, isSubmitting, formError, resetForm };
};