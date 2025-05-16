// src/hooks/admin/LearningPagesManagement/useLearningPageForm.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  LearningPage,
  LearningPageCreatePayload,
  LearningPageUpdatePayload,
  LearningPageFormData,
  LearningPageFormOptions,
  LearningPageContentBlock,
} from '../../../types/admin/LearningPages/learningPage.types';
import { initialLearningPageFormData } from '../../../types/admin/LearningPages/learningPage.types';
import { LearningPagesApi } from '../../../services/admin/LearningPages/learningPagesApi';

export const useLearningPageForm = (options: LearningPageFormOptions) => {
  const { onSuccess, learningPageToEdit, subtopicIdForCreate } = options;

  const [formData, setFormData] = useState<LearningPageFormData>(initialLearningPageFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setFormData(prev => ({
        ...initialLearningPageFormData,
        subtopic_id: subtopicIdForCreate?.toString() || prev.subtopic_id || "",
    }));
    setFormError(null);
  }, [subtopicIdForCreate]);

  useEffect(() => {
    if (learningPageToEdit) {
      let currentSubtopicId = "";
      // Если subtopicIdForForm (переданный извне при открытии формы на редактирование) есть, используем его
      if (options.subtopicIdForCreate && learningPageToEdit) { // subtopicIdForCreate используется и для редактирования в нашем случае
          currentSubtopicId = options.subtopicIdForCreate.toString();
      } else if (formData.subtopic_id) {
        currentSubtopicId = formData.subtopic_id;
      }

      setFormData({
        subtopic_id: currentSubtopicId,
        page_number: learningPageToEdit.page_number.toString(),
        content_json_string: JSON.stringify(learningPageToEdit.content || [], null, 2),
      });
      setFormError(null);
    } else {
      setFormData(prev => ({
          ...initialLearningPageFormData,
          subtopic_id: subtopicIdForCreate?.toString() || prev.subtopic_id || "",
      }));
    }
  }, [learningPageToEdit, resetForm, subtopicIdForCreate, options.subtopicIdForCreate, formData.subtopic_id]); // Добавил options.subtopicIdForCreate

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    if (!formData.subtopic_id.trim() || !formData.page_number.trim()) {
      setFormError('ID Подтемы и Номер страницы обязательны.');
      setIsSubmitting(false);
      return;
    }

    const subtopicIdNum = parseInt(formData.subtopic_id, 10);
    const pageNumberNum = parseInt(formData.page_number, 10);

    if (isNaN(subtopicIdNum) || subtopicIdNum <= 0) {
      setFormError('ID Подтемы должен быть положительным числом.');
      setIsSubmitting(false);
      return;
    }
    if (isNaN(pageNumberNum) || pageNumberNum <= 0) {
      setFormError('Номер страницы должен быть положительным числом.');
      setIsSubmitting(false);
      return;
    }

    let contentBlocks: LearningPageContentBlock[];
    try {
      contentBlocks = JSON.parse(formData.content_json_string);
      if (!Array.isArray(contentBlocks)) {
        throw new Error("Содержимое должно быть JSON массивом.");
      }
    } catch (jsonError: any) {
      setFormError(`Ошибка в JSON содержимого: ${jsonError.message || 'Некорректный JSON формат.'}`);
      setIsSubmitting(false);
      return;
    }

    try {
      let result: LearningPage;
      const isEditing = !!learningPageToEdit;

      if (isEditing && learningPageToEdit) {
        const payload: LearningPageUpdatePayload = {};
        let hasChanges = false;

        if (formData.page_number !== learningPageToEdit.page_number.toString()) {
          payload.page_number = pageNumberNum;
          hasChanges = true;
        }
        // Сравниваем JSON строки, чтобы понять, изменился ли контент
        const currentContentString = JSON.stringify(learningPageToEdit.content || []);
        const newContentString = JSON.stringify(contentBlocks); // Сравниваем нормализованный JSON
        if (newContentString !== currentContentString) { // Сравниваем строки после JSON.stringify
          payload.content = contentBlocks;
          hasChanges = true;
        }
        
        if (!hasChanges) {
            console.log('Нет изменений для сохранения.');
            setIsSubmitting(false);
            onSuccess?.(learningPageToEdit); // Вызываем onSuccess, чтобы родитель закрыл форму
            return;
        }
        
        result = await LearningPagesApi.updateLearningPage(
          learningPageToEdit.id,
          payload
        );
        console.log('Страница обучения успешно обновлена!');
      } else {
        const payload: LearningPageCreatePayload = {
          page_number: pageNumberNum,
          content: contentBlocks,
        };
        result = await LearningPagesApi.createLearningPage(
          subtopicIdNum,
          payload
        );
        console.log('Страница обучения успешно создана!');
      }
      onSuccess?.(result);
    } catch (error: any) {
      console.error("Ошибка сохранения страницы обучения:", error);
      const message = error.response?.data?.detail || `Не удалось ${learningPageToEdit ? 'обновить' : 'создать'} страницу обучения.`;
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

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    isSubmitting,
    formError,
    resetForm,
  };
};