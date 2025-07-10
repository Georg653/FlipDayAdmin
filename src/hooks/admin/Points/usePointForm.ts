// --- Путь: src/hooks/admin/Points/usePointForm.ts ---

import { useState, useEffect } from 'react';
import type {
  Point, PointFormData, PointCreateUpdatePayload, ContentBlockFormData, ContentBlock
} from '../../../types/admin/Points/point.types';
import { PointsApi } from '../../../services/admin/Points/pointsApi';
import { createImageUrl } from '../../../utils/media';

// Эта функция нужна для создания новых пустых блоков в конструкторе
const createInitialBlock = (type: ContentBlockFormData['type']): ContentBlockFormData => {
  const id = crypto.randomUUID();
  switch (type) {
    case 'text': return { id, type, text: '' };
    case 'heading': return { id, type, text: '', level: 2 };
    case 'quote': return { id, type, text: '', author: '' };
    case 'image': return { id, type, src: '', caption: '', file: null };
    case 'video': return { id, type, src: '', caption: '', file: null };
    case 'audio': return { id, type, src: '', title: '', file: null };
    case 'album': return { id, type, items: [] };
    case 'slider': return { id, type, items: [] };
  }
};

const initialPointFormData: PointFormData = {
  name: '', description: '', latitude: '', longitude: '', is_partner: false, budget: '0',
  image_url: null, image_file: null, remove_image: false,
  has_content: false, remove_content: false, content: [],
};

interface UsePointFormOptions {
  pointToEdit: Point | null;
  onSuccess: () => void;
}

export const usePointForm = ({ pointToEdit, onSuccess }: UsePointFormOptions) => {
  const [formData, setFormData] = useState<PointFormData>(initialPointFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (pointToEdit) {
      const contentForForm: ContentBlockFormData[] = (pointToEdit.content_data?.content || []).map((apiBlock: ContentBlock) => {
        const baseBlock: Partial<ContentBlockFormData> = { ...apiBlock, id: crypto.randomUUID(), file: null };
        if (apiBlock.type === 'album' || apiBlock.type === 'slider') {
          baseBlock.items = (apiBlock.items || []).map((itemUrl: string) => ({
            id: crypto.randomUUID(), url: itemUrl, file: null, preview: createImageUrl(itemUrl),
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
        has_content: !!pointToEdit.content_data,
        remove_content: false,
        content: contentForForm,
      });
    } else {
      setFormData(initialPointFormData);
    }
  }, [pointToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;
    setFormData(prev => ({ ...prev, [name]: isCheckbox ? checked : value }));
  };
  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, image_file: file }));
  };
  const handleRemoveImage = (checked: boolean) => {
    setFormData(prev => ({ ...prev, remove_image: checked }));
  };
  const addBlock = (type: ContentBlockFormData['type'], index: number) => {
    const newContent = [...formData.content];
    newContent.splice(index + 1, 0, createInitialBlock(type));
    setFormData(prev => ({ ...prev, content: newContent }));
  };
  const removeBlock = (id: string) => {
    setFormData(prev => ({ ...prev, content: prev.content.filter(block => block.id !== id) }));
  };
  const updateBlock = (id: string, newBlockData: Partial<ContentBlockFormData>) => {
    setFormData(prev => ({ ...prev, content: prev.content.map(block => (block.id === id ? { ...block, ...newBlockData } : block)), }));
  };
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

    const latitude = parseFloat(formData.latitude);
    const longitude = parseFloat(formData.longitude);
    const budget = parseFloat(formData.budget);
    if (!formData.name.trim() || !formData.description.trim()) {
      setFormError('Название и описание не могут быть пустыми.'); setIsSubmitting(false); return;
    }
    if (isNaN(latitude) || isNaN(longitude) || isNaN(budget)) {
      setFormError('Координаты и бюджет должны быть числами.'); setIsSubmitting(false); return;
    }

    const payloadContent: ContentBlock[] | undefined = formData.has_content
      ? formData.content.map(formBlock => {
          switch (formBlock.type) {
            case 'text': return { type: 'text', text: formBlock.text || '', content: formBlock.text || '' };
            case 'heading': return { type: 'heading', text: formBlock.text || '', level: formBlock.level || 2, content: formBlock.text || '' };
            case 'quote': return { type: 'quote', text: formBlock.text || '', author: formBlock.author || null, content: formBlock.text || '' };
            case 'image': case 'video': return { type: formBlock.type, src: formBlock.file ? '' : formBlock.src || '', caption: formBlock.caption || null, content: formBlock.file ? '' : formBlock.src || '' };
            case 'audio': return { type: 'audio', src: formBlock.file ? '' : formBlock.src || '', title: formBlock.title || null, content: formBlock.file ? '' : formBlock.src || '' };
            case 'album': case 'slider':
              const apiItems = (formBlock.items || []).map(item => (item.file ? '' : item.url || '')).filter(Boolean);
              return { type: formBlock.type, items: apiItems, content: apiItems.join(',') };
            default: throw new Error('Unknown block type');
          }
        }).filter((b): b is ContentBlock => b !== null)
      : undefined;

    const payload: PointCreateUpdatePayload = {
      name: formData.name, description: formData.description,
      latitude, longitude, budget,
      is_partner: formData.is_partner,
      image_url: formData.image_file ? null : formData.image_url,
      content_data: (payloadContent && payloadContent.length > 0) ? { content: payloadContent } : null,
      remove_content: formData.remove_content,
    };
    
    const contentFiles: File[] = [];
    if (formData.has_content) {
      formData.content.forEach(block => {
        if (block.file) contentFiles.push(block.file);
        if (block.items) {
          block.items.forEach(item => { if (item.file) contentFiles.push(item.file); });
        }
      });
    }

    try {
      if (pointToEdit) {
        await PointsApi.updatePoint(pointToEdit.id, payload, formData.image_file, contentFiles, formData.remove_image);
      } else {
        await PointsApi.createPoint(payload, formData.image_file, contentFiles);
      }
      onSuccess();
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setFormError(typeof detail === 'object' ? JSON.stringify(detail) : detail || 'Произошла ошибка.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData, setFormData, isSubmitting, formError,
    handleChange, handleFileChange, handleRemoveImage, handleSubmit,
    addBlock, removeBlock, updateBlock, moveBlock,
  };
};