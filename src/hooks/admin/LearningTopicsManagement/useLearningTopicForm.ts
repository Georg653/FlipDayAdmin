// src/hooks/admin/LearningTopics/useLearningTopicForm.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  LearningTopic,
  LearningTopicCreatePayload,
  LearningTopicUpdatePayload,
  LearningTopicFormData,
  LearningTopicFormOptions,
} from '../../../types/admin/LearningTopics/learningTopic.types'; // Убедись, что типы обновлены
import { initialLearningTopicFormData } from '../../../types/admin/LearningTopics/learningTopic.types'; // Убедись, что обновлен
import { LearningTopicsApi } from '../../../services/admin/LearningTopics/learningTopicsApi';
// import { useNotification } from '../../../contexts/admin/NotificationContext'; // Если используешь

export const useLearningTopicForm = (options: LearningTopicFormOptions) => {
  const { onSuccess, learningTopicToEdit } = options;
  // const { showNotification } = useNotification();

  const [formData, setFormData] = useState<LearningTopicFormData>(initialLearningTopicFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const revokePreviewUrl = useCallback((url: string | null | undefined) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }, []);

  const resetForm = useCallback(() => {
    revokePreviewUrl(formData.image_preview_url);
    setFormData(initialLearningTopicFormData);
    setFormError(null);
  }, [formData.image_preview_url, revokePreviewUrl]);

  useEffect(() => {
    // Освобождаем URL от предыдущего состояния перед установкой нового
    // Это нужно, если learningTopicToEdit меняется несколько раз без размонтирования компонента
    if (formData.image_preview_url && formData.image_preview_url.startsWith('blob:')) {
        revokePreviewUrl(formData.image_preview_url);
    }

    if (learningTopicToEdit) {
      setFormData({
        name: learningTopicToEdit.name,
        description: learningTopicToEdit.description || "",
        experience_points: learningTopicToEdit.experience_points.toString(),
        order: learningTopicToEdit.order.toString(),
        image_file: null,
        image_url_manual: learningTopicToEdit.image || "", 
        image_preview_url: learningTopicToEdit.image, 
        existing_image_url: learningTopicToEdit.image,
      });
      setFormError(null);
    } else {
      setFormData(initialLearningTopicFormData); // При создании просто сбрасываем на initial
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [learningTopicToEdit]); // Убрал resetForm, чтобы избежать лишних вызовов и зависимостей

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newValues = { ...prev, [name]: value };

      if (name === 'image_url_manual') {
        if (prev.image_preview_url && prev.image_preview_url.startsWith('blob:')) {
          revokePreviewUrl(prev.image_preview_url);
        }
        newValues.image_file = null;
        if (value.trim().toLowerCase().startsWith('http')) {
            newValues.image_preview_url = value.trim();
        } else {
            newValues.image_preview_url = prev.existing_image_url || null;
        }
      }
      return newValues;
    });

    if (formError) setFormError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    setFormData(prev => {
      if (prev.image_preview_url && prev.image_preview_url.startsWith('blob:')) {
        revokePreviewUrl(prev.image_preview_url);
      }
      
      let newPreviewUrl: string | null = null;
      if (file) {
        newPreviewUrl = URL.createObjectURL(file);
      } else {
        newPreviewUrl = prev.existing_image_url || null; // Если отменили выбор файла, вернем existing
      }

      return {
        ...prev,
        image_file: file,
        image_preview_url: newPreviewUrl,
        image_url_manual: "", 
      };
    });
    if (formError) setFormError(null);
  };

  // Гарантируем освобождение URL при размонтировании компонента, использующего хук
  useEffect(() => {
    const currentPreview = formData.image_preview_url;
    return () => {
      revokePreviewUrl(currentPreview);
    };
  }, [formData.image_preview_url, revokePreviewUrl]);

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

    const basePayloadData = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      experience_points: experiencePointsNum,
      order: orderNum,
    };

    let imageFileToSend: File | null = formData.image_file;
    let imageUrlForApi: string | null | undefined = undefined;

    if (formData.image_file) {
      // Файл имеет приоритет, URL для API будет null (или его не будет, бэк сам разберется)
      imageUrlForApi = null; 
    } else if (formData.image_url_manual.trim()) {
      imageUrlForApi = formData.image_url_manual.trim();
    } else {
      // Ни файла, ни нового URL. Если редактируем и было изображение, его нужно сохранить.
      // Если создаем, то изображения не будет (null).
      imageUrlForApi = learningTopicToEdit ? learningTopicToEdit.image : null;
    }
    
    try {
      let result: LearningTopic;
      const isEditing = !!learningTopicToEdit;

      if (isEditing && learningTopicToEdit) {
        const updatePayload: LearningTopicUpdatePayload = {};
        let hasChanges = false;

        if (basePayloadData.name !== learningTopicToEdit.name) { updatePayload.name = basePayloadData.name; hasChanges = true; }
        if (basePayloadData.description !== (learningTopicToEdit.description || null)) { updatePayload.description = basePayloadData.description; hasChanges = true; }
        if (basePayloadData.experience_points !== learningTopicToEdit.experience_points) { updatePayload.experience_points = basePayloadData.experience_points; hasChanges = true; }
        if (basePayloadData.order !== learningTopicToEdit.order) { updatePayload.order = basePayloadData.order; hasChanges = true; }
        
        // Логика для изображения при редактировании
        if (imageFileToSend) { // Новый файл выбран
          updatePayload.image_url = null; // Бэк будет использовать файл
          hasChanges = true;
        } else {
          // Файл не выбран. Проверяем, изменился ли URL или был ли он удален
          const currentApiImage = learningTopicToEdit.image || null;
          const newManualUrl = formData.image_url_manual.trim() || null;
          if (newManualUrl !== currentApiImage) {
            updatePayload.image_url = newManualUrl;
            hasChanges = true;
          }
          // Если newManualUrl === currentApiImage, значит URL не менялся, и поле image_url не добавляем в payload
        }

        console.log("Отправляемый updatePayload (редактирование):", updatePayload);
        console.log("Отправляемый файл (редактирование):", imageFileToSend);

        if (!hasChanges && !imageFileToSend) {
          console.log('Нет изменений для сохранения.');
          setIsSubmitting(false);
          onSuccess?.(learningTopicToEdit); 
          return;
        }
        result = await LearningTopicsApi.updateLearningTopic(learningTopicToEdit.id, updatePayload, imageFileToSend);
      } else { // Создание
        const createPayload: LearningTopicCreatePayload = {
            ...basePayloadData,
            image_url: imageUrlForApi, 
        };
        console.log("Отправляемый createPayload (создание):", createPayload);
        console.log("Отправляемый файл (создание):", imageFileToSend);
        result = await LearningTopicsApi.createLearningTopic(createPayload, imageFileToSend);
      }
      onSuccess?.(result);
    } catch (error: any) {
      const message = error.response?.data?.detail || `Не удалось ${learningTopicToEdit ? 'обновить' : 'создать'} тему.`;
      let errorMessage = "Произошла ошибка.";
      if (typeof message === 'string') {errorMessage = message;}
      else if (Array.isArray(message) && message.length > 0 && typeof message[0] === 'object' && message[0].msg) {errorMessage = message.map(err => `${err.loc?.join(' -> ') || 'поле'} - ${err.msg}`).join('; ');}
      setFormError(errorMessage);
      console.error("API Error:", error.response?.data || error.message); // Добавил более детальный лог ошибки
    } finally {
      setIsSubmitting(false);
    }
  };
  return { formData, handleChange, handleFileChange, handleSubmit, isSubmitting, formError, resetForm };
};