// src/hooks/admin/LearningPagesManagement/useLearningPageForm.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  LearningPage,
  LearningPageCreatePayload,
  LearningPageUpdatePayload,
  LearningPageFormData,
  LearningPageFormOptions,
  LearningPageContentBlockAPI,
  LearningPageContentBlockUIData,
} from '../../../types/admin/LearningPages/learningPage.types';
import { initialLearningPageFormData } from '../../../types/admin/LearningPages/learningPage.types';
import { LearningPagesApi } from '../../../services/admin/LearningPages/learningPagesApi';

const generateLocalId = () => `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

export const useLearningPageForm = (options: LearningPageFormOptions) => {
  const { onSuccess, learningPageToEdit, subtopicIdForCreate } = options;

  const [formData, setFormData] = useState<LearningPageFormData>(initialLearningPageFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setFormData(prev => ({
      ...initialLearningPageFormData,
      subtopic_id: subtopicIdForCreate?.toString() || prev.subtopic_id || "",
      current_content_blocks: [],
    }));
    setFormError(null);
  }, [subtopicIdForCreate]);

  useEffect(() => {
    if (learningPageToEdit) {
      let currentSubtopicId = "";
      if (options.subtopicIdForCreate && learningPageToEdit) {
        currentSubtopicId = options.subtopicIdForCreate.toString();
      } else if (formData.subtopic_id) {
        currentSubtopicId = formData.subtopic_id;
      }
      
      setFormData({
        subtopic_id: currentSubtopicId,
        page_number: learningPageToEdit.page_number.toString(),
        current_content_blocks: (learningPageToEdit.content || []).map(block => ({
          ...block,
          _localId: (block as any).id || generateLocalId(), // Используем API id (если есть в блоке) или генерируем локальный
        })),
      });
      setFormError(null);
    } else {
      resetForm();
    }
  }, [learningPageToEdit, options.subtopicIdForCreate, resetForm]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const addContentBlock = (newBlockData: Omit<LearningPageContentBlockUIData, '_localId'>) => {
    const newBlockWithId: LearningPageContentBlockUIData = {
      ...newBlockData,
      _localId: generateLocalId(),
    };
    setFormData(prev => ({
      ...prev,
      current_content_blocks: [...prev.current_content_blocks, newBlockWithId],
    }));
  };

  const updateContentBlock = (localId: string, updatedBlockData: LearningPageContentBlockUIData) => {
    setFormData(prev => ({
      ...prev,
      current_content_blocks: prev.current_content_blocks.map(block =>
        block._localId === localId ? { ...block, ...updatedBlockData, _localId: localId } : block // Сохраняем _localId
      ),
    }));
  };
  
  const deleteContentBlock = (localId: string) => {
    setFormData(prev => ({
      ...prev,
      current_content_blocks: prev.current_content_blocks.filter(block => block._localId !== localId),
    }));
  };

  const moveContentBlock = (fromIndex: number, toIndex: number) => {
    setFormData(prev => {
      if (fromIndex < 0 || fromIndex >= prev.current_content_blocks.length || 
          toIndex < 0 || toIndex >= prev.current_content_blocks.length) {
        return prev; // Индексы вне диапазона
      }
      const updatedBlocks = [...prev.current_content_blocks];
      const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
      updatedBlocks.splice(toIndex, 0, movedBlock);
      return { ...prev, current_content_blocks: updatedBlocks };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    if (!formData.subtopic_id.trim() || !formData.page_number.trim()) {
      setFormError('ID Подтемы и Номер страницы обязательны.');
      setIsSubmitting(false); return;
    }
    const subtopicIdNum = parseInt(formData.subtopic_id, 10);
    const pageNumberNum = parseInt(formData.page_number, 10);

    if (isNaN(subtopicIdNum) || subtopicIdNum <= 0) {
      setFormError('ID Подтемы должен быть положительным числом.'); setIsSubmitting(false); return;
    }
    if (isNaN(pageNumberNum) || pageNumberNum <= 0) {
      setFormError('Номер страницы должен быть положительным числом.'); setIsSubmitting(false); return;
    }

    const contentForAPI: LearningPageContentBlockAPI[] = formData.current_content_blocks.map(uiBlock => {
      const { _localId, ...apiBlock } = uiBlock;
      return apiBlock as LearningPageContentBlockAPI;
    });

    if (contentForAPI.length === 0 && !learningPageToEdit) {
      setFormError('Необходимо добавить хотя бы один блок контента.');
      setIsSubmitting(false); return;
    }

    try {
      let result: LearningPage;
      const isEditing = !!learningPageToEdit;

      if (isEditing && learningPageToEdit) {
        const payload: LearningPageUpdatePayload = {};
        let hasChanges = false;
        if (pageNumberNum !== learningPageToEdit.page_number) {
          payload.page_number = pageNumberNum; hasChanges = true;
        }
        const originalApiContent = (learningPageToEdit.content || []).map(b => {
            const tempBlock = {...b} as Partial<LearningPageContentBlockUIData>;
            delete tempBlock._localId;
            return tempBlock as LearningPageContentBlockAPI;
        });
        if (JSON.stringify(contentForAPI) !== JSON.stringify(originalApiContent)) {
          payload.content = contentForAPI; hasChanges = true;
        }
        if (!hasChanges) {
          setIsSubmitting(false); onSuccess?.(learningPageToEdit); return;
        }
        result = await LearningPagesApi.updateLearningPage(learningPageToEdit.id, payload);
      } else {
        const payload: LearningPageCreatePayload = {
          page_number: pageNumberNum,
          content: contentForAPI,
        };
        result = await LearningPagesApi.createLearningPage(subtopicIdNum, payload);
      }
      onSuccess?.(result);
    } catch (error: any) {
      const message = error.response?.data?.detail || `Не удалось ${learningPageToEdit ? 'обновить' : 'создать'} страницу обучения.`;
      let errorMessage = "Произошла ошибка.";
      if (typeof message === 'string') {errorMessage = message;}
      else if (Array.isArray(message)) {errorMessage = message.map(err => `${err.loc?.join(' -> ') || 'поле'} - ${err.msg}`).join('; ');}
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    addContentBlock,
    updateContentBlock,
    deleteContentBlock,
    moveContentBlock,
    handleSubmit,
    isSubmitting,
    formError,
    resetForm,
  };
};