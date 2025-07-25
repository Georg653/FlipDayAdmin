// --- Путь: src/hooks/admin/Points/usePointForm.ts ---
// ПОЛНАЯ ВЕРСИЯ

import { useState, useEffect } from 'react';
import { PointsApi } from '../../../services/admin/Points/pointsApi';
import { usePreviewData } from '../../previews/usePreviewData';
import { createImageUrl } from '../../../utils/media';
import { createInitialBlock } from '../../../features/ContentEditor/contentEditor.helpers';
import type { ApiContentBlock, ContentBlockFormData, TestBlock } from '../../../types/common/content.types';
import type { Point, PointBase, PointFormData, PointCreateUpdatePayload } from '../../../types/admin/Points/point.types';

interface UsePointFormOptions {
  pointToEdit: Point | null;
  onSuccess: (point: PointBase) => void;
}

const initialPointFormData: PointFormData = {
  name: '', description: '', latitude: '', longitude: '',
  is_partner: false, budget: '0', image_url: null, image_file: null,
  remove_image: false, manageContent: false, content: [],
};

export const usePointForm = ({ pointToEdit, onSuccess }: UsePointFormOptions) => {
  const [formData, setFormData] = useState<PointFormData>(initialPointFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const previewData = usePreviewData({
    title: formData.name,
    description: formData.description,
    preview_file: formData.image_file,
    preview_url: formData.image_url,
    content: formData.content,
  });

  useEffect(() => {
    if (pointToEdit) {
      const hasContent = !!(pointToEdit.content && pointToEdit.content.length > 0);
      const contentForForm = (pointToEdit.content || []).map(apiBlock => {
        const baseBlock: Partial<ContentBlockFormData> = { ...apiBlock, id: crypto.randomUUID(), file: null };
        if (apiBlock.type === 'album' || apiBlock.type === 'slider') {
          baseBlock.items = (apiBlock.src as string[] || []).map((url: string) => ({
            id: crypto.randomUUID(), url: url, file: null, preview: createImageUrl(url),
          }));
          delete (baseBlock as any).src;
        } else if (apiBlock.type === 'test') {
            const testBlock = apiBlock as TestBlock;
            baseBlock.options = (testBlock.options || []).map(opt => ({
                ...opt,
                isCorrect: testBlock.correct_option_id === opt.id,
            }));
        }
        return baseBlock as ContentBlockFormData;
      });

      setFormData({
        name: pointToEdit.name,
        description: pointToEdit.description,
        latitude: String(pointToEdit.latitude),
        longitude: String(pointToEdit.longitude),
        is_partner: pointToEdit.is_partner,
        budget: String(pointToEdit.budget),
        image_url: pointToEdit.image,
        image_file: null,
        remove_image: false,
        manageContent: hasContent,
        content: hasContent ? contentForForm : [createInitialBlock('text')],
      });
    } else {
      setFormData(initialPointFormData);
    }
  }, [pointToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any; type?: string } }) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const finalValue = isCheckbox ? ((e as React.ChangeEvent<HTMLInputElement>).nativeEvent ? (e.target as HTMLInputElement).checked : value) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };
  
  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, image_file: file, remove_image: !!file ? false : prev.remove_image }));
  };
  const handleRemoveImage = (checked: boolean) => {
    setFormData(prev => ({ ...prev, remove_image: checked, image_file: checked ? null : prev.image_file }));
  };
  
  const addBlock = (type: ContentBlockFormData['type']) => setFormData(prev => ({ ...prev, content: [...prev.content, createInitialBlock(type)] }));
  const removeBlock = (id: string) => setFormData(prev => ({ ...prev, content: prev.content.filter(b => b.id !== id) }));
  const updateBlock = (id: string, data: Partial<ContentBlockFormData>) => setFormData(prev => ({ ...prev, content: prev.content.map(b => b.id === id ? { ...b, ...data } : b) }));
  const moveBlock = (from: number, to: number) => {
      const newContent = [...formData.content];
      const [moved] = newContent.splice(from, 1);
      newContent.splice(to, 0, moved);
      setFormData(prev => ({...prev, content: newContent}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const contentFiles: File[] = [];
    const payloadContent: ApiContentBlock[] = formData.content.map((formBlock: ContentBlockFormData) => {
        if (formBlock.file) contentFiles.push(formBlock.file);
        if (formBlock.items) formBlock.items.forEach(item => { if (item.file) contentFiles.push(item.file); });
        switch (formBlock.type) {
            case 'text': return { type: 'text', content: formBlock.content || '' };
            case 'heading': return { type: 'heading', content: formBlock.content || '', level: formBlock.level || 2 };
            case 'image': case 'video': case 'audio': return { type: formBlock.type, src: formBlock.file ? '' : formBlock.src || null, text: formBlock.text };
            case 'album': case 'slider':
                const apiItems = (formBlock.items || []).map(item => (item.file ? '' : item.url || null)).filter((url): url is string => url !== null);
                return { type: formBlock.type, src: apiItems };
            case 'test':
                const correctOption = (formBlock.options || []).find(opt => opt.isCorrect);
                return { type: 'test', question: formBlock.question || '', options: (formBlock.options || []).map(opt => ({ id: opt.id, text: opt.text })), message: formBlock.message || '', correct_option_id: correctOption?.id };
            default: const exhaustiveCheck: never = formBlock.type; console.warn(`Неизвестный тип блока: ${exhaustiveCheck}`); return null as any;
        }
    }).filter((b): b is ApiContentBlock => b !== null);

    try {
      if (pointToEdit) {
        // --- РЕЖИМ РЕДАКТИРОВАНИЯ: Один запрос ---
        const payload: PointCreateUpdatePayload = {
          name: formData.name, description: formData.description,
          latitude: parseFloat(formData.latitude) || 0, longitude: parseFloat(formData.longitude) || 0,
          is_partner: formData.is_partner, budget: parseInt(formData.budget, 10) || 0,
          content_data: { content: payloadContent },
        };
        const result = await PointsApi.updatePoint(pointToEdit.id, payload, formData.image_file, contentFiles, formData.remove_image);
        onSuccess(result);
      } else {
        // --- РЕЖИМ СОЗДАНИЯ: Два запроса, если есть контент ---
        const initialPayload: PointCreateUpdatePayload = {
          name: formData.name, description: formData.description,
          latitude: parseFloat(formData.latitude) || 0, longitude: parseFloat(formData.longitude) || 0,
          is_partner: formData.is_partner, budget: parseInt(formData.budget, 10) || 0,
          content_data: { content: [] }, // 1. Сначала создаем с пустым контентом
        };
        const createdPoint = await PointsApi.createPoint(initialPayload, formData.image_file, []);
        
        // 2. Если в форме был контент, сразу обновляем точку, добавляя его
        if (formData.content.length > 0) {
          const contentPayload: PointCreateUpdatePayload = {
            ...initialPayload,
            name: createdPoint.name, // Используем данные из созданной точки
            content_data: { content: payloadContent },
          };
          // Второй запрос - PUT на обновление с контентом
          const finalPoint = await PointsApi.updatePoint(createdPoint.id, contentPayload, null, contentFiles, false);
          onSuccess(finalPoint);
        } else {
          onSuccess(createdPoint); // Если контента не было, возвращаем результат первого запроса
        }
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setFormError(typeof detail === 'object' ? JSON.stringify(detail) : detail || 'Ошибка сохранения точки');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
      formData, isSubmitting, formError, handleChange, handleFileChange, handleRemoveImage, 
      addBlock, removeBlock, updateBlock, moveBlock, handleSubmit,
      previewData
  };
};