// --- Путь: src/hooks/admin/News/useNewsForm.ts ---

import { useState, useEffect } from 'react';
import type {
  News, NewsFormData, ContentBlock, ContentBlockFormData, NewsCreateUpdatePayload, TestOption
} from '../../../types/admin/News/news.types';
import { NewsApi } from '../../../services/admin/News/newsApi';
import { createImageUrl } from '../../../utils/media';

// Функция для создания пустого блока нужного типа
const createInitialBlock = (type: ContentBlockFormData['type']): ContentBlockFormData => {
  const id = crypto.randomUUID();
  switch (type) {
    case 'text': return { id, type, content: '' };
    case 'heading': return { id, type, content: '', level: 2 };
    case 'image': return { id, type, src: '', file: null };
    case 'video': return { id, type, src: '', file: null };
    case 'audio': return { id, type, src: '', file: null };
    case 'album': return { id, type, items: [] };
    case 'slider': return { id, type, items: [] };
    case 'test': return { id, type, question: '', options: [{id: crypto.randomUUID(), text: '', isCorrect: true}], message: '' };
    default: throw new Error(`Неизвестный тип блока: ${type}`);
  }
};

const initialNewsFormData: NewsFormData = {
  title: '', description: '', preview_url: null, preview_file: null, remove_preview: false,
  background_url: null, background_file: null, remove_background: false,
  content: [createInitialBlock('text')],
};

interface UseNewsFormOptions {
  newsToEdit: News | null;
  onSuccess: (newsItem: News) => void;
}

export const useNewsForm = ({ newsToEdit, onSuccess }: UseNewsFormOptions) => {
  const [formData, setFormData] = useState<NewsFormData>(initialNewsFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Эффект для заполнения формы при редактировании
  useEffect(() => {
    if (newsToEdit) {
      const contentForForm: ContentBlockFormData[] = newsToEdit.content.map((apiBlock: ContentBlock) => {
        const baseBlock: ContentBlockFormData = { ...apiBlock, id: crypto.randomUUID(), file: null };
        
        // --- ИСПРАВЛЕНИЕ: Правильно обрабатываем album и slider ---
        if (apiBlock.type === 'album' || apiBlock.type === 'slider') {
          // 'src' в API это массив строк, а в форме 'items' это массив объектов
          baseBlock.items = (apiBlock.src || []).map((url: string) => ({
            id: crypto.randomUUID(),
            url: url,
            file: null,
            preview: createImageUrl(url),
          }));
          delete (baseBlock as any).src; // Удаляем старое поле src, чтобы не было конфликта
        }
        
        return baseBlock;
      });

      setFormData({
        title: newsToEdit.title,
        description: newsToEdit.description,
        preview_url: newsToEdit.preview,
        preview_file: null,
        remove_preview: false,
        background_url: newsToEdit.background,
        background_file: null,
        remove_background: false,
        content: contentForForm,
      });
    } else {
      setFormData(initialNewsFormData);
    }
  }, [newsToEdit]);


  // --- Хендлеры формы ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (field: 'preview_file' | 'background_file', file: File | null) => setFormData(prev => ({ ...prev, [field]: file }));
  const handleRemoveImage = (field: 'remove_preview' | 'remove_background', checked: boolean) => setFormData(prev => ({ ...prev, [field]: checked }));
  const addBlock = (type: ContentBlockFormData['type'], index: number) => {
    const newContent = [...formData.content];
    newContent.splice(index + 1, 0, createInitialBlock(type));
    setFormData(prev => ({ ...prev, content: newContent }));
  };
  const removeBlock = (id: string) => setFormData(prev => ({ ...prev, content: prev.content.filter(block => block.id !== id) }));
  const updateBlock = (id: string, newBlockData: Partial<ContentBlockFormData>) => setFormData(prev => ({ ...prev, content: prev.content.map(block => (block.id === id ? { ...block, ...newBlockData } : block)) }));
  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newContent = [...formData.content];
    const [movedItem] = newContent.splice(fromIndex, 1);
    newContent.splice(toIndex, 0, movedItem);
    setFormData(prev => ({ ...prev, content: newContent }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError('Заголовок и Описание не могут быть пустыми.');
      setIsSubmitting(false); return;
    }

    const payloadContent: ContentBlock[] = formData.content.map(formBlock => {
      switch (formBlock.type) {
        case 'text': return { type: 'text', content: formBlock.content || '' };
        case 'heading': return { type: 'heading', content: formBlock.content || '', level: formBlock.level || 2 };
        case 'image': case 'video': case 'audio':
            return { type: formBlock.type, src: formBlock.file ? '' : formBlock.src || null };
        case 'album': case 'slider':
          const apiItems = (formBlock.items || []).map(item => (item.file ? '' : item.url || '')).filter(Boolean);
          return { type: formBlock.type, src: apiItems };
        case 'test':
            const options: TestOption[] = (formBlock.options || []).map(({id, text}) => ({id, text}));
            return { type: 'test', question: formBlock.question || '', options, message: formBlock.message || '' };
        default: return null;
      }
    }).filter((b): b is ContentBlock => b !== null);

    const payload: NewsCreateUpdatePayload = {
      title: formData.title, description: formData.description, content: payloadContent,
      preview_url: formData.preview_file ? null : formData.preview_url,
      background_url: formData.background_file ? null : formData.background_url,
    };
    
    const contentFiles: File[] = [];
    formData.content.forEach(block => {
      if (block.file) contentFiles.push(block.file);
      if (block.items) {
        block.items.forEach(item => { if (item.file) contentFiles.push(item.file); });
      }
    });

    try {
      let result: News;
      if (newsToEdit) {
        result = await NewsApi.updateNews(
          newsToEdit.id, payload, formData.preview_file, formData.background_file, contentFiles,
          formData.remove_preview, formData.remove_background
        );
      } else {
        result = await NewsApi.createNews(
          payload, formData.preview_file, formData.background_file, contentFiles
        );
      }
      onSuccess(result);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setFormError(typeof detail === 'object' ? JSON.stringify(detail, null, 2) : detail || 'Произошла ошибка.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData, setFormData, isSubmitting, formError, handleChange, handleFileChange,
    handleRemoveImage, addBlock, removeBlock, updateBlock, moveBlock, handleSubmit,
  };
};