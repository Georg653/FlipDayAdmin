// --- Путь: src/components/admin/NewsManagement/ContentBlockForm.tsx ---
// ИСПРАВЛЕННАЯ ВЕРСИЯ

import React from 'react';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { Select } from '../../ui/Select/Select';
import { Checkbox } from '../../ui/Checkbox/Checkbox'; // <--- ДОБАВЛЕН НОВЫЙ ИМПОРТ
import { createImageUrl } from '../../../utils/media';

// ВАЖНО: Используем общие типы
import type { ContentBlockFormData, CollectionItemFormData, TestOptionFormData } from '../../../types/common/content.types';

import './ContentBlockForm.css';

// Компонент для коллекций остается без изменений
const CollectionEditor: React.FC<{
  block: ContentBlockFormData;
  onUpdateBlock: (id: string, data: Partial<ContentBlockFormData>) => void;
}> = ({ block, onUpdateBlock }) => {
    const handleItemFileChange = (itemId: string, file: File | null) => {
        const newItems = (block.items || []).map(item => 
            item.id === itemId 
                ? { ...item, file, preview: file ? URL.createObjectURL(file) : item.url } 
                : item
        );
        onUpdateBlock(block.id, { items: newItems });
    };
    const handleAddItem = () => {
        const newItem: CollectionItemFormData = { id: crypto.randomUUID(), url: null, file: null, preview: null };
        const newItems = [...(block.items || []), newItem];
        onUpdateBlock(block.id, { items: newItems });
    };
    const handleRemoveItem = (itemId: string) => {
        const newItems = (block.items || []).filter(item => item.id !== itemId);
        onUpdateBlock(block.id, { items: newItems });
    };
    return (
        <div className="collection-editor">
            <div className="collection-items-grid">
                {(block.items || []).map(item => (
                    <div key={item.id} className="collection-item">
                        <ImageUpload
                            id={`file-collection-${item.id}`} name="collection_item_file"
                            previewUrl={item.preview || createImageUrl(item.url)}
                            onChange={(e) => handleItemFileChange(item.id, e.target.files?.[0] || null)}
                        />
                        <Button size="icon" variant="destructive" onClick={() => handleRemoveItem(item.id)} className="collection-item-delete" aria-label="Удалить изображение">×</Button>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>+ Добавить изображение</Button>
        </div>
    );
};

// --- НОВЫЙ КОМПОНЕНТ ДЛЯ РЕДАКТИРОВАНИЯ ТЕСТОВ ---
const TestEditor: React.FC<{
  block: ContentBlockFormData;
  onUpdateBlock: (id: string, data: Partial<ContentBlockFormData>) => void;
}> = ({ block, onUpdateBlock }) => {
    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateBlock(block.id, { question: e.target.value });
    };
    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdateBlock(block.id, { message: e.target.value });
    };
    const handleOptionTextChange = (optionId: string, text: string) => {
        const newOptions = (block.options || []).map(opt => 
            opt.id === optionId ? { ...opt, text } : opt
        );
        onUpdateBlock(block.id, { options: newOptions });
    };
    const handleCorrectOptionChange = (optionId: string) => {
        const newOptions = (block.options || []).map(opt => ({
            ...opt,
            isCorrect: opt.id === optionId
        }));
        onUpdateBlock(block.id, { options: newOptions });
    };
    const handleAddOption = () => {
        const newOption: TestOptionFormData = { id: crypto.randomUUID(), text: '', isCorrect: false };
        const newOptions = [...(block.options || []), newOption];
        onUpdateBlock(block.id, { options: newOptions });
    };
    const handleRemoveOption = (optionId: string) => {
        // Не даем удалить последний вариант
        if ((block.options?.length ?? 0) <= 1) return;
        const newOptions = (block.options || []).filter(opt => opt.id !== optionId);
        onUpdateBlock(block.id, { options: newOptions });
    };

    return (
        <div className="test-editor">
            <div className="form-group">
                <label>Вопрос теста*</label>
                <Input value={block.question || ''} onChange={handleQuestionChange} placeholder="Введите вопрос..." />
            </div>
            <label>Варианты ответов (отметьте правильный)</label>
            <div className="test-options-list">
                {(block.options || []).map((option, index) => (
                    <div key={option.id} className="test-option-item">
                        <Checkbox 
                            id={`correct-${option.id}`} label="" checked={option.isCorrect}
                            onChange={() => handleCorrectOptionChange(option.id)}
                            title="Отметить как правильный ответ"
                        />
                        <Input 
                            value={option.text}
                            onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                            placeholder={`Вариант ${index + 1}`}
                            className="test-option-input"
                        />
                        <Button 
                            type="button" variant="destructive" size="sm"
                            onClick={() => handleRemoveOption(option.id)}
                            disabled={(block.options?.length ?? 0) <= 1}
                        >
                            -
                        </Button>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>+ Добавить вариант</Button>
            <div className="form-group" style={{marginTop: '1rem'}}>
                <label>Сообщение после ответа (опционально)</label>
                <Textarea value={block.message || ''} onChange={handleMessageChange} rows={2} placeholder="Например, объяснение правильного ответа..." />
            </div>
        </div>
    );
};

// Пропсы для главной формы
interface ContentBlockFormProps {
  block: ContentBlockFormData;
  index: number;
  isSubmitting: boolean;
  onRemoveBlock: (id: string) => void;
  onUpdateBlock: (id: string, newBlockData: Partial<ContentBlockFormData>) => void;
  onMoveBlockUp: () => void;
  onMoveBlockDown: () => void;
  onAddBlock: (type: ContentBlockFormData['type'], index: number) => void;
}

export const ContentBlockForm: React.FC<ContentBlockFormProps> = ({
  block, index, isSubmitting, onRemoveBlock, onUpdateBlock, onMoveBlockUp, onMoveBlockDown,
}) => {

  const renderBlockFields = () => {
    switch (block.type) {
      case 'heading':
        return (
          <div className="heading-editor">
            <Input name="content" value={block.content || ''} onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })} disabled={isSubmitting} placeholder="Текст заголовка..."/>
            <Select
              label="Уровень"
              value={block.level}
              onChange={(e) => onUpdateBlock(block.id, { level: Number(e.target.value) as 1 | 2 | 3 | 4 })}
              options={[{ value: 1, label: 'H1' }, { value: 2, label: 'H2' }, { value: 3, label: 'H3' }, { value: 4, label: 'H4' }]}
              disabled={isSubmitting}
            />
          </div>
        );
      case 'text':
        return <Textarea name="content" value={block.content || ''} onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })} disabled={isSubmitting} rows={5} placeholder="Введите текст..."/>;
      case 'image':
      case 'video':
        return <ImageUpload id={`file-${block.id}`} name="file" onChange={(e) => onUpdateBlock(block.id, { file: e.target.files?.[0] || null })} previewUrl={block.file ? URL.createObjectURL(block.file) : createImageUrl(block.src)} label={block.type === 'image' ? "Изображение" : "Видео"} />;
      case 'audio':
        return (
          <>
            <p>Текущий файл: {block.src || 'не выбран'}</p>
            <Input type="file" id={`file-${block.id}`} name="file" onChange={(e) => onUpdateBlock(block.id, { file: e.target.files?.[0] || null })} accept="audio/*"/>
          </>
        );
      case 'album':
      case 'slider':
        return <CollectionEditor block={block} onUpdateBlock={onUpdateBlock} />;
      
      // ИЗМЕНЕНО: Заменяем заглушку на полноценный редактор
      case 'test':
        return <TestEditor block={block} onUpdateBlock={onUpdateBlock} />;

      default: return null;
    }
  };

  return (
    <div className="content-block-form">
      <div className="block-header">
        <span className="block-title">Блок: {block.type}</span>
        <div className="block-controls">
          <Button type="button" size="sm" variant="outline" onClick={onMoveBlockUp} disabled={index === 0}>↑</Button>
          <Button type="button" size="sm" variant="outline" onClick={onMoveBlockDown}>↓</Button>
          <Button type="button" size="sm" variant="destructive" onClick={() => onRemoveBlock(block.id)}>Удалить</Button>
        </div>
      </div>
      <div className="block-fields">
        {renderBlockFields()}
      </div>
    </div>
  );
};