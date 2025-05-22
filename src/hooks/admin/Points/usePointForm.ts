// src/hooks/admin/Points/usePointForm.ts
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  Point,
  PointFullCreatePayload,
  PointFullUpdatePayload,
  PointFormData,
  PointFormOptions,
  ContentBlock,
  PointContentResponse,
} from '../../../types/admin/Points/point.types';
import { initialPointFormData } from '../../../types/admin/Points/point.types';
import { PointsApi } from '../../../services/admin/Points/pointsApi';
// import { useNotification } from '../../../contexts/admin/NotificationContext';

export const usePointForm = (options: PointFormOptions) => {
  const { onSuccess, pointToEdit } = options;
  // const { showNotification } = useNotification();

  const [formData, setFormData] = useState<PointFormData>(initialPointFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(null);

  const resetForm = useCallback(() => {
    setFormData(initialPointFormData);
    setFormError(null);
    setIsBlockModalOpen(false);
    setEditingBlock(null);
    setEditingBlockIndex(null);
  }, []);

  useEffect(() => {
    if (pointToEdit) {
      const contentDataFromHook = pointToEdit.contentData;
      setFormData({
        name: pointToEdit.name,
        description: pointToEdit.description || "",
        latitude: pointToEdit.latitude.toString(),
        longitude: pointToEdit.longitude.toString(),
        is_partner: pointToEdit.is_partner,
        budget: pointToEdit.budget.toString(),
        image_file: null,
        image_preview_url: pointToEdit.image,
        existing_image_url: pointToEdit.image,
        point_content_background: contentDataFromHook?.background || "",
        point_content_blocks: (contentDataFromHook?.content || []).map(block => ({
          ...block,
          __id: block.id || uuidv4(),
        })),
      });
      setFormError(null);
    } else {
      resetForm();
    }
  }, [pointToEdit, resetForm]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  // ИЗМЕНЕННЫЙ handleCheckboxChange
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
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

  const handleAddBlock = () => {
    setEditingBlock({ type: 'text', content: '', __id: uuidv4() } as ContentBlock);
    setEditingBlockIndex(null);
    setIsBlockModalOpen(true);
  };

  const handleEditBlock = (index: number) => {
    const blockToEdit = formData.point_content_blocks[index];
    setEditingBlock({ ...blockToEdit });
    setEditingBlockIndex(index);
    setIsBlockModalOpen(true);
  };

  const handleDeleteBlock = (index: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Удалить этот блок контента?')) {
      setFormData(prev => ({
        ...prev,
        point_content_blocks: prev.point_content_blocks.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSaveBlock = (blockData: ContentBlock) => {
    setFormData(prev => {
      const newContentBlocks = [...prev.point_content_blocks];
      if (editingBlockIndex !== null) {
        newContentBlocks[editingBlockIndex] = { ...blockData, __id: newContentBlocks[editingBlockIndex].__id };
      } else {
        newContentBlocks.push({ ...blockData, __id: blockData.__id || uuidv4() });
      }
      return { ...prev, point_content_blocks: newContentBlocks };
    });
    setIsBlockModalOpen(false);
    setEditingBlock(null);
    setEditingBlockIndex(null);
  };

  const handleCloseBlockModal = () => {
    setIsBlockModalOpen(false);
    setEditingBlock(null);
    setEditingBlockIndex(null);
  };
  
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...formData.point_content_blocks];
    const blockToMove = newBlocks[index];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, blockToMove);
    setFormData(prev => ({ ...prev, point_content_blocks: newBlocks }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    if (!formData.name.trim() || !formData.latitude.trim() || !formData.longitude.trim()) {
      setFormError('Название и координаты точки обязательны.');
      setIsSubmitting(false);
      return;
    }
    const latitude = parseFloat(formData.latitude);
    const longitude = parseFloat(formData.longitude);
    const budget = parseFloat(formData.budget);

    if (isNaN(latitude) || isNaN(longitude)) {
      setFormError('Координаты должны быть числами.');
      setIsSubmitting(false);
      return;
    }
     if (isNaN(budget)) {
      setFormError('Бюджет должен быть числом.');
      setIsSubmitting(false);
      return;
    }

    const contentForApiCleaned: ContentBlock[] = formData.point_content_blocks.map(block => {
      const { __id, ...restOfBlock } = block;
      return restOfBlock as ContentBlock; 
    });

    const dataJsonPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      latitude,
      longitude,
      is_partner: formData.is_partner,
      budget,
      content_data: (formData.point_content_background || contentForApiCleaned.length > 0) 
        ? {
            background: formData.point_content_background || null,
            content: contentForApiCleaned,
          }
        : null, 
    };
    
    try {
      let result: Point;
      const isEditing = !!pointToEdit;

      if (isEditing && pointToEdit) {
        const updatePayload: PointFullUpdatePayload = { ...dataJsonPayload };
        if (updatePayload.content_data === null) {
            // delete updatePayload.content_data; // Раскомментируй, если API ожидает отсутствия поля, а не null
        }

        result = await PointsApi.updatePoint(
          pointToEdit.id,
          updatePayload,
          formData.image_file
        );
        console.log('Точка успешно обновлена!');
      } else {
        const createPayload: PointFullCreatePayload = dataJsonPayload as PointFullCreatePayload;
         if (createPayload.content_data === null) {
            // delete createPayload.content_data; // Раскомментируй, если API ожидает отсутствия поля, а не null
        }
        result = await PointsApi.createPoint(
          createPayload,
          formData.image_file
        );
        console.log('Точка успешно создана!');
      }
      onSuccess?.(result);
    } catch (error: any) {
      console.error("Ошибка сохранения точки:", error);
      const message = error.response?.data?.detail || `Не удалось ${pointToEdit ? 'обновить' : 'создать'} точку.`;
      let errorMessage = "Произошла неизвестная ошибка.";
      if (typeof message === 'string') {
        errorMessage = message;
      } else if (Array.isArray(message) && message.length > 0 && typeof message[0] === 'object' && message[0].msg) { // Проверка на структуру ошибки FastAPI
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
    setFormData,
    handleChange,
    handleCheckboxChange, // Измененная функция
    handleFileChange,
    handleSubmit,
    isSubmitting,
    formError,
    resetForm,
    isBlockModalOpen,
    editingBlock,
    editingBlockIndex,
    handleAddBlock,
    handleEditBlock,
    handleDeleteBlock,
    handleSaveBlock,
    handleCloseBlockModal,
    moveBlock,
  };
};