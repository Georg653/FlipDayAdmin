// --- Путь: src/hooks/admin/LearningPagesManagement/useLearningPageForm.ts ---
// ПОЛНАЯ ВЕРСИЯ

import { useState, useEffect } from 'react';
import { LearningPagesApi } from '../../../services/admin/LearningPages/learningPagesApi';
import { LearningTopicsApi } from '../../../services/admin/LearningTopics/learningTopicsApi';
import { LearningSubtopicsApi } from '../../../services/admin/LearningSubtopics/learningSubtopicsApi';
import { createImageUrl } from '../../../utils/media';
import { usePreviewData } from '../../previews/usePreviewData';
import { createInitialBlock } from '../../../features/ContentEditor/contentEditor.helpers';
import type { ApiContentBlock, ContentBlockFormData, TestBlock } from '../../../types/common/content.types';
import type { 
    LearningPage, LearningPageFormData, LearningPageCreateUpdatePayload,
    TopicOption, SubtopicOption 
} from '../../../types/admin/LearningPages/learningPage.types';

interface UseLearningPageFormOptions {
  pageToEdit: LearningPage | null;
  onSuccess: (page: LearningPage) => void;
  parentSubtopicId: number | null;
}

export const useLearningPageForm = ({ pageToEdit, onSuccess, parentSubtopicId }: UseLearningPageFormOptions) => {
  const [formData, setFormData] = useState<LearningPageFormData>({ page_number: '1', subtopic_id: '', content: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [subtopics, setSubtopics] = useState<SubtopicOption[]>([]);
  const [selectedTopicInForm, setSelectedTopicInForm] = useState<string | null>(null);
  const [isCascadeLoading, setIsCascadeLoading] = useState(false);

  const previewData = usePreviewData({
    title: `Страница №${formData.page_number || ''}`,
    content: formData.content,
  });

  useEffect(() => {
    setIsCascadeLoading(true);
    LearningTopicsApi.getTopics({ limit: 1000 })
      .then(data => setTopics(data.map(t => ({ value: String(t.id), label: t.name }))))
      .finally(() => setIsCascadeLoading(false));
  }, []);

  useEffect(() => {
    if (selectedTopicInForm) {
      setIsCascadeLoading(true);
      setSubtopics([]);
      LearningSubtopicsApi.getSubtopicsByTopicId(Number(selectedTopicInForm), { limit: 1000 })
        .then(data => setSubtopics(data.map(st => ({ value: String(st.id), label: st.name }))))
        .finally(() => setIsCascadeLoading(false));
    } else {
      setSubtopics([]);
    }
  }, [selectedTopicInForm]);

  useEffect(() => {
    const setInitialState = async () => {
      if (pageToEdit && topics.length > 0) {
        setIsCascadeLoading(true);
        try {
          const parentSubtopic = await LearningSubtopicsApi.getSubtopicById(pageToEdit.subtopic_id);
          const parentTopicId = String(parentSubtopic.topic_id);
          setSelectedTopicInForm(parentTopicId);
        } catch (error) {
          console.error("Ошибка при поиске родительской темы:", error);
        } finally {
          setIsCascadeLoading(false);
        }
      }
    };
    setInitialState();
  }, [pageToEdit, topics]);

  useEffect(() => {
    if (pageToEdit) {
      const contentForForm: ContentBlockFormData[] = (pageToEdit.content || []).map(apiBlock => {
        const { type, ...restOfApiBlock } = apiBlock;
        let baseBlock: Partial<ContentBlockFormData> = { ...restOfApiBlock, type, id: crypto.randomUUID(), file: null };
        if (type === 'album' || type === 'slider') {
          const { src, ...restWithoutSrc } = restOfApiBlock as any;
          baseBlock = { ...restWithoutSrc, ...baseBlock };
          baseBlock.items = (src as string[] || []).map((url: string) => ({
            id: crypto.randomUUID(), url: url, file: null, preview: createImageUrl(url),
          }));
        } else if (type === 'test') {
            const testBlock = apiBlock as TestBlock;
            baseBlock.options = (testBlock.options || []).map(opt => ({
                ...opt,
                isCorrect: testBlock.correct_option_id === opt.id,
            }));
        }
        return baseBlock as ContentBlockFormData;
      });
      setFormData({
        page_number: String(pageToEdit.page_number),
        subtopic_id: String(pageToEdit.subtopic_id),
        content: contentForForm,
      });
    } else if (parentSubtopicId) {
      setFormData({ page_number: '1', subtopic_id: String(parentSubtopicId), content: [createInitialBlock('text')] });
    }
  }, [pageToEdit, parentSubtopicId]);
  
  const handleTopicInFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const topicId = e.target.value;
    setSelectedTopicInForm(topicId);
    setFormData(prev => ({ ...prev, subtopic_id: '' })); 
  };
  const handleSubtopicInFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, subtopic_id: e.target.value }));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  }
  const addBlock = (type: ContentBlockFormData['type']) => setFormData(prev => ({ ...prev, content: [...prev.content, createInitialBlock(type)] }));
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

    const pageNumber = parseInt(formData.page_number, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
      setFormError('Номер страницы должен быть положительным числом.');
      setIsSubmitting(false); return;
    }
    const subtopicId = parseInt(formData.subtopic_id, 10);
    if (isNaN(subtopicId)) {
        setFormError('Необходимо выбрать подтему.');
        setIsSubmitting(false); return;
    }

    const contentFiles: File[] = [];
    const payloadContent: ApiContentBlock[] = formData.content.map(formBlock => {
        if (formBlock.file) contentFiles.push(formBlock.file);
        if (formBlock.items) formBlock.items.forEach(item => { if (item.file) contentFiles.push(item.file); });
        
        switch (formBlock.type) {
            case 'text': return { type: 'text', content: formBlock.content || '' };
            case 'heading': return { type: 'heading', content: formBlock.content || '', level: formBlock.level || 2 };
            case 'image': case 'video': case 'audio':
                return { type: formBlock.type, src: formBlock.file ? '' : formBlock.src || null, text: formBlock.text };
            case 'album': case 'slider':
                const apiItems = (formBlock.items || []).map(item => (item.file ? '' : item.url || null)).filter((url): url is string => url !== null);
                return { type: formBlock.type, src: apiItems };
            case 'test':
                const correctOption = (formBlock.options || []).find(opt => opt.isCorrect);
                return {
                    type: 'test', question: formBlock.question || '', options: (formBlock.options || []).map(opt => ({ id: opt.id, text: opt.text })),
                    message: formBlock.message || '', correct_option_id: correctOption?.id,
                };
            default: const exhaustiveCheck: never = formBlock.type; console.warn(`Неизвестный тип: ${exhaustiveCheck}`); return null as any;
        }
    }).filter((b): b is ApiContentBlock => b !== null);

    const payload: LearningPageCreateUpdatePayload = { page_number: pageNumber, content: payloadContent };

    try {
      let result: LearningPage;
      if (pageToEdit) {
        result = await LearningPagesApi.updatePage(pageToEdit.id, payload, contentFiles);
      } else {
        result = await LearningPagesApi.createPage(subtopicId, payload, contentFiles);
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
    formData, isSubmitting, formError, handleSubmit, handleChange, addBlock, removeBlock, updateBlock, moveBlock,
    topics, subtopics, selectedTopicInForm, isCascadeLoading,
    handleTopicInFormChange, handleSubtopicInFormChange,
    previewData,
  };
};