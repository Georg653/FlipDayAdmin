// src/hooks/admin/LearningPagesManagement/useContentBlockForm.ts
import { useState, useEffect, useCallback } from 'react';
import type { LearningPageContentBlockUIData, LearningPageQuizOption } from '../../../types/admin/LearningPages/learningPage.types';
import { LearningPageBlockType } from '../../../constants/admin/LearningPages/learningPages.constants';
import type { LearningPageBlockTypeEnum } from '../../../constants/admin/LearningPages/learningPages.constants';

const generateUniqueLocalIdInternal = (prefix: string, existingIds: string[]): string => {
  let newId = '';
  do {
    newId = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  } while (existingIds.includes(newId));
  return newId;
};

export interface UseContentBlockFormOptions {
  initialBlockData?: Partial<LearningPageContentBlockUIData>;
  existingBlockIdsInPage: string[];
}

export const useContentBlockForm = ({ initialBlockData, existingBlockIdsInPage }: UseContentBlockFormOptions) => {
  const [type, setType] = useState<LearningPageBlockTypeEnum>(LearningPageBlockType.TEXT);
  const [level, setLevel] = useState<number>(1);
  const [content, setContent] = useState<string>('');
  const [src, setSrc] = useState<string | string[]>('');
  const [text, setText] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [options, setOptions] = useState<LearningPageQuizOption[]>([{ id: generateUniqueLocalIdInternal('opt_init', []), text: '' }]);
  const [message, setMessage] = useState<string>('');
  const [correctOptionId, setCorrectOptionId] = useState<string | null>(null);
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialBlockData) {
      setType(initialBlockData.type as LearningPageBlockTypeEnum || LearningPageBlockType.TEXT);
      setLevel(initialBlockData.level ?? 1);
      setContent(initialBlockData.content ?? '');
      setSrc(initialBlockData.src ?? '');
      setText(initialBlockData.text ?? '');
      setQuestion(initialBlockData.question ?? '');
      const initialOptIds = (initialBlockData.options || []).map(o => o.id).filter(Boolean) as string[];
      setOptions(
        initialBlockData.options && initialBlockData.options.length > 0
          ? initialBlockData.options.map(o => ({ ...o, id: o.id || generateUniqueLocalIdInternal('opt_edit', initialOptIds) }))
          : [{ id: generateUniqueLocalIdInternal('opt_edit_new', initialOptIds), text: '' }]
      );
      setMessage(initialBlockData.message ?? '');
      setCorrectOptionId(initialBlockData.correct_option_id ?? null);
      setFileInput(initialBlockData.fileInput || null);
      setPreviewUrl(initialBlockData.previewUrl || (typeof initialBlockData.src === 'string' ? initialBlockData.src : null));
    } else {
      setType(LearningPageBlockType.TEXT); setLevel(1); setContent(''); setSrc('');
      setText(''); setQuestion(''); 
      setOptions([{ id: generateUniqueLocalIdInternal('opt_new', []), text: '' }]); 
      setMessage(''); setCorrectOptionId(null); setFileInput(null); setPreviewUrl(null);
    }
  }, [initialBlockData]);

  const handleFileChangeInternal = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFileInput(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setPreviewUrl(reader.result as string); };
      reader.readAsDataURL(file);
      setSrc('');
    } else {
      setPreviewUrl(typeof initialBlockData?.src === 'string' ? initialBlockData.src : null);
    }
  };

  const getBlockData = useCallback((): LearningPageContentBlockUIData => {
    const allCurrentIdsOnPage = [...existingBlockIdsInPage];
    const currentOptionIdsInBlock = options.map(o => o.id);
    let blockLocalId = initialBlockData?._localId;
    if (!blockLocalId || (existingBlockIdsInPage.includes(blockLocalId) && blockLocalId !== initialBlockData?._localId)) {
        blockLocalId = generateUniqueLocalIdInternal('block', allCurrentIdsOnPage.concat(currentOptionIdsInBlock));
    }
    let apiSrc: string | string[] | undefined;
    if (type === LearningPageBlockType.ALBUM || type === LearningPageBlockType.SLIDER) {
        apiSrc = Array.isArray(src) ? src : (src ? [src as string] : []);
    } else {
        apiSrc = fileInput ? undefined : (typeof src === 'string' ? src : undefined);
    }
    return {
      _localId: blockLocalId,
      type: type,
      id: initialBlockData?.id || undefined,
      level: type === LearningPageBlockType.HEADING ? (level || 1) : undefined,
      content: (type === LearningPageBlockType.HEADING || type === LearningPageBlockType.TEXT) ? content : undefined,
      src: apiSrc,
      text: (type === LearningPageBlockType.IMAGE || type === LearningPageBlockType.VIDEO || type === LearningPageBlockType.AUDIO) ? text : undefined,
      question: type === LearningPageBlockType.TEST ? question : undefined,
      options: type === LearningPageBlockType.TEST ? options.filter(opt => opt.text.trim() !== '') : undefined,
      message: type === LearningPageBlockType.TEST ? message : undefined,
      correct_option_id: type === LearningPageBlockType.TEST ? (correctOptionId || undefined) : undefined,
      fileInput: fileInput,
      previewUrl: previewUrl,
    } as LearningPageContentBlockUIData;
  }, [type, level, content, src, text, question, options, message, correctOptionId, initialBlockData, fileInput, previewUrl, existingBlockIdsInPage]);

  const addOptionInternal = () => {
    const currentOptionIds = options.map(o => o.id);
    setOptions([...options, { id: generateUniqueLocalIdInternal('opt_add', currentOptionIds), text: '' }]);
  };
  const updateOptionTextInternal = (index: number, newText: string) => {
    const newOptions = [...options]; newOptions[index].text = newText; setOptions(newOptions);
  };
  const removeOptionInternal = (index: number) => setOptions(options.filter((_, i) => i !== index));

  return {
    type, setType, level, setLevel, content, setContent, src, setSrc,
    text, setText, question, setQuestion, options, message, setMessage,
    correctOptionId, setCorrectOptionId,
    fileInput, previewUrl, handleFileChange: handleFileChangeInternal,
    getBlockData, 
    addOption: addOptionInternal, 
    updateOptionText: updateOptionTextInternal, 
    removeOption: removeOptionInternal,
  };
};