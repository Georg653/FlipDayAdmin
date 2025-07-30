// --- Путь: src/hooks/admin/News/useNewsForm.ts ---
// ПОЛНАЯ ВЕРСИЯ

import { useState, useEffect } from 'react';
import type { News, NewsFormData, ContentBlockFormData, NewsCreateUpdatePayload } from '../../../types/admin/News/news.types';
import { NewsApi } from '../../../services/admin/News/newsApi';
import { createImageUrl } from '../../../utils/media';
import { createInitialBlock } from '../../../features/ContentEditor/contentEditor.helpers';
import type { ApiContentBlock, TestOption } from '../../../types/common/content.types';

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

  useEffect(() => {
    if (newsToEdit) {
        const contentForForm: ContentBlockFormData[] = newsToEdit.content.map((apiBlock: ApiContentBlock) => {
            const baseBlock: Partial<ContentBlockFormData> = { ...apiBlock, id: crypto.randomUUID(), file: null };
            if (apiBlock.type === 'album' || apiBlock.type === 'slider') {
                baseBlock.items = (apiBlock.src as string[] || []).map((url: string) => ({
                    id: crypto.randomUUID(), url: url, file: null, preview: createImageUrl(url),
                }));
                delete (baseBlock as any).src;
            }
            return baseBlock as ContentBlockFormData;
        });
      setFormData({
        title: newsToEdit.title,
        description: newsToEdit.description,
        preview_url: newsToEdit.preview, preview_file: null, remove_preview: false,
        background_url: newsToEdit.background, background_file: null, remove_background: false,
        content: contentForForm,
      });
    } else {
      setFormData(initialNewsFormData);
    }
  }, [newsToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (field: 'preview_file' | 'background_file', file: File | null) => {
    const urlField = field === 'preview_file' ? 'preview_url' : 'background_url';
    const removeField = field === 'preview_file' ? 'remove_preview' : 'remove_background';
    setFormData(prev => {
      if (prev[urlField] && (prev[urlField] as string).startsWith('blob:')) {
        URL.revokeObjectURL(prev[urlField] as string);
      }
      return {
        ...prev,
        [field]: file,
        [urlField]: file ? URL.createObjectURL(file) : (newsToEdit ? (field === 'preview_file' ? newsToEdit.preview : newsToEdit.background) : null),
        [removeField]: !!file ? false : prev[removeField],
      };
    });
  };

  const handleRemoveImage = (field: 'remove_preview' | 'remove_background', checked: boolean) => {
    const fileField = field === 'remove_preview' ? 'preview_file' : 'background_file';
    const urlField = field === 'remove_preview' ? 'preview_url' : 'background_url';
    setFormData(prev => {
        const currentUrl = prev[urlField];
        if (currentUrl && currentUrl.startsWith('blob:')) {
            URL.revokeObjectURL(currentUrl);
        }
        return {
            ...prev,
            [field]: checked, [fileField]: checked ? null : prev[fileField],
            [urlField]: checked ? null : (newsToEdit ? (field === 'remove_preview' ? newsToEdit.preview : newsToEdit.background) : null),
        };
    });
  };

  const addBlock = (type: ContentBlockFormData['type'], index: number) => {
    const newContent = [...formData.content];
    newContent.splice(index, 0, createInitialBlock(type));
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

  const handleSubmit = async (e: React.FormEvent) => { /* ... */ };

  return { formData, isSubmitting, formError, handleChange, handleFileChange, handleRemoveImage, addBlock, removeBlock, updateBlock, moveBlock, handleSubmit, };
};