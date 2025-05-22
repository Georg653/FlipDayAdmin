// src/hooks/admin/News/useNewsForm.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  NewsItem,
  NewsCreatePayload,
  NewsUpdatePayload,
  NewsFormData,
  NewsFormOptions,
  ContentBlock,
} from '../../../types/admin/News/news.types';
import { initialNewsFormData } from '../../../types/admin/News/news.types';
import { NewsApi } from '../../../services/admin/News/newsApi';
import { v4 as uuidv4 } from 'uuid';

export const useNewsForm = (options: NewsFormOptions) => {
  const { onSuccess, newsItemToEdit } = options;

  const [formData, setFormData] = useState<NewsFormData>(initialNewsFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(null); // Состояние для индекса

  const resetForm = useCallback(() => {
    setFormData(initialNewsFormData);
    setFormError(null);
    setIsBlockModalOpen(false);
    setEditingBlock(null);
    setEditingBlockIndex(null);
  }, []);

  useEffect(() => {
    if (newsItemToEdit) {
      setFormData({
        title: newsItemToEdit.title,
        description: newsItemToEdit.description,
        content: (newsItemToEdit.content || []).map(block => ({ ...block, __id: block.id || uuidv4() })),
        preview_file: null,
        preview_url_manual: newsItemToEdit.preview || "",
        existing_preview_url: newsItemToEdit.preview,
      });
      setFormError(null);
    } else {
      resetForm();
    }
  }, [newsItemToEdit, resetForm]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, }));
    if (formError) setFormError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      preview_file: file,
      preview_url_manual: file ? "" : prev.preview_url_manual,
    }));
    if (formError) setFormError(null);
  };

  const handleAddBlock = () => {
    setEditingBlock({ type: 'text', content: '', __id: uuidv4() });
    setEditingBlockIndex(null);
    setIsBlockModalOpen(true);
  };

  const handleEditBlock = (index: number) => {
    const blockToEdit = formData.content[index];
    setEditingBlock({ ...blockToEdit });
    setEditingBlockIndex(index);
    setIsBlockModalOpen(true);
  };

  const handleDeleteBlock = (index: number) => {
    if (window.confirm('Удалить этот блок контента?')) {
      setFormData(prev => ({
        ...prev,
        content: prev.content.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSaveBlock = (blockData: ContentBlock) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      if (editingBlockIndex !== null) {
        newContent[editingBlockIndex] = blockData;
      } else {
        newContent.push({ ...blockData, __id: blockData.__id || uuidv4() });
      }
      return { ...prev, content: newContent };
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
    const newBlocks = [...formData.content];
    const block = newBlocks[index];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newBlocks.length) return;

    newBlocks.splice(index, 1);
    newBlocks.splice(newIndex, 0, block);
    setFormData(prev => ({ ...prev, content: newBlocks }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError('Заголовок новости обязателен.');
      setIsSubmitting(false);
      return;
    }
    
    const contentForApi: ContentBlock[] = [];
    for (const block of formData.content) {
        const { __id, ...restOfBlock } = block;
        if (restOfBlock.type === 'heading' && (!restOfBlock.level || !restOfBlock.content)) {
            setFormError(`Блок "${restOfBlock.type}" (ID: ${__id || 'новый'}) не заполнен корректно (нужны level и content).`);
            setIsSubmitting(false);
            return;
        }
        if (restOfBlock.type === 'text' && !restOfBlock.content) {
            setFormError(`Блок "${restOfBlock.type}" (ID: ${__id || 'новый'}) не заполнен корректно (нужен content).`);
            setIsSubmitting(false);
            return;
        }
        contentForApi.push(restOfBlock as ContentBlock);
    }

    const newsDataPayload: NewsCreatePayload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      content: contentForApi,
    };

    if (!formData.preview_file && formData.preview_url_manual.trim()) {
      newsDataPayload.preview = formData.preview_url_manual.trim();
    }

    try {
      let result: NewsItem;
      const isEditing = !!newsItemToEdit;

      if (isEditing && newsItemToEdit) {
        const updatePayload: NewsUpdatePayload = {};
        if (formData.title.trim() !== newsItemToEdit.title) updatePayload.title = formData.title.trim();
        if (formData.description.trim() !== newsItemToEdit.description) updatePayload.description = formData.description.trim();
        
        const oldContentForApi = (newsItemToEdit.content || []).map(({ __id, ...rest }) => rest);
        const oldContentString = JSON.stringify(oldContentForApi);
        const newContentString = JSON.stringify(contentForApi);

        if (oldContentString !== newContentString) {
          updatePayload.content = contentForApi;
        }

        if (!formData.preview_file && formData.preview_url_manual.trim() && formData.preview_url_manual.trim() !== (newsItemToEdit.preview || "")) {
            (updatePayload as NewsCreatePayload).preview = formData.preview_url_manual.trim();
        }
        
        if (Object.keys(updatePayload).length > 0 || formData.preview_file) {
            result = await NewsApi.updateNewsItem(
              newsItemToEdit.id,
              updatePayload,
              formData.preview_file
            );
        } else {
            result = newsItemToEdit; 
        }
        console.log('Новость успешно обновлена!');
      } else {
        if (!formData.preview_file && formData.preview_url_manual.trim()) {
            newsDataPayload.preview = formData.preview_url_manual.trim();
        }
        result = await NewsApi.createNewsItem(
          newsDataPayload,
          formData.preview_file
        );
        console.log('Новость успешно создана!');
      }
      onSuccess?.(result);
    } catch (error: any) {
      console.error("Ошибка сохранения новости:", error);
      const message = error.response?.data?.detail || `Не удалось ${newsItemToEdit ? 'обновить' : 'создать'} новость.`;
      let errorMessage = "Произошла неизвестная ошибка.";

      if (typeof message === 'string') {
        errorMessage = message;
      } else if (Array.isArray(message)) {
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
    handleChange,
    handleFileChange,
    handleSubmit,
    isSubmitting,
    formError,
    resetForm,
    isBlockModalOpen,
    editingBlock,
    editingBlockIndex, // <--- УБЕДИСЬ, ЧТО ОН ЗДЕСЬ ЕСТЬ
    handleAddBlock,
    handleEditBlock,
    handleDeleteBlock,
    handleSaveBlock,
    handleCloseBlockModal,
    moveBlock,
  };
};