// src/components/admin/NewsManagement/ContentBlockForm.tsx
import React, { useState, useEffect } from 'react';
import type { ContentBlock, ContentBlockType, TestOption } from '../../../types/admin/News/news.types';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { Select } from '../../ui/Select/Select'; // Наш простой селект
import { Button } from '../../ui/Button/Button';
import { v4 as uuidv4 } from 'uuid';

interface ContentBlockFormProps {
  initialBlock?: ContentBlock | null; // Для редактирования
  onSave: (block: ContentBlock) => void;
  onCancel: () => void;
}

const blockTypeOptions = [
  { value: 'heading', label: 'Заголовок' },
  { value: 'text', label: 'Текст' },
  { value: 'image', label: 'Изображение' },
  { value: 'video', label: 'Видео' },
  { value: 'audio', label: 'Аудио' },
  { value: 'album', label: 'Альбом (несколько изображений)' },
  { value: 'slider', label: 'Слайдер (несколько изображений)' },
  { value: 'test', label: 'Тест (один правильный ответ)' },
];

export const ContentBlockForm: React.FC<ContentBlockFormProps> = ({
  initialBlock,
  onSave,
  onCancel,
}) => {
  const [block, setBlock] = useState<ContentBlock>(
    initialBlock || { __id: uuidv4(), type: 'text', content: '' }
  );

  useEffect(() => {
    if (initialBlock) {
      setBlock(initialBlock);
    } else {
        // При создании нового блока, сбрасываем поля специфичные для типа
        setBlock(prev => ({ __id: prev.__id || uuidv4(), type: prev.type, content: '', level: undefined, src: undefined, question: undefined, options: undefined, message: undefined, text: undefined }));
    }
  }, [initialBlock]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type: inputType } = e.target;
    let processedValue: any = value;
    if (name === 'level' && inputType === 'number') {
      processedValue = value === '' ? null : parseInt(value, 10);
    }
    if (name === 'type') { // При смене типа блока, сбрасываем специфичные поля
        setBlock({ __id: block.__id || uuidv4(), type: value as ContentBlockType });
        return;
    }
    setBlock(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSrcChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    const { value } = e.target;
    if (block.type === 'album' || block.type === 'slider') {
      const newSrc = Array.isArray(block.src) ? [...block.src] : [];
      if (index !== undefined) {
        newSrc[index] = value;
      }
      setBlock(prev => ({ ...prev, src: newSrc.filter(s => s.trim() !== '') })); // Убираем пустые строки
    } else {
      setBlock(prev => ({ ...prev, src: value }));
    }
  };
  
  const addSrcField = () => {
    if (block.type === 'album' || block.type === 'slider') {
      const newSrc = Array.isArray(block.src) ? [...block.src, ''] : [''];
      setBlock(prev => ({ ...prev, src: newSrc }));
    }
  };
  
  const removeSrcField = (index: number) => {
     if (block.type === 'album' || block.type === 'slider') {
      const newSrc = (Array.isArray(block.src) ? [...block.src] : []).filter((_, i) => i !== index);
      setBlock(prev => ({ ...prev, src: newSrc }));
    }
  };

  const handleTestOptionChange = (index: number, field: 'id' | 'text', value: string) => {
    const newOptions = [...(block.options || [])];
    if(newOptions[index]) {
        newOptions[index] = { ...newOptions[index], [field]: value };
        setBlock(prev => ({ ...prev, options: newOptions }));
    }
  };

  const addTestOption = () => {
    const newOption: TestOption = { id: uuidv4(), text: '' };
    setBlock(prev => ({ ...prev, options: [...(prev.options || []), newOption] }));
  };

  const removeTestOption = (index: number) => {
    setBlock(prev => ({ ...prev, options: (prev.options || []).filter((_, i) => i !== index) }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Добавить валидацию полей в зависимости от block.type
    onSave(block);
  };

  const renderSpecificFields = () => {
    switch (block.type) {
      case 'heading':
        return (
          <>
            <div className="form-group">
              <label htmlFor="block-level">Уровень (1-6)</label>
              <Input id="block-level" name="level" type="number" min="1" max="6" value={block.level || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="block-content-heading">Текст заголовка</label>
              <Input id="block-content-heading" name="content" value={block.content || ''} onChange={handleChange} required />
            </div>
          </>
        );
      case 'text':
        return (
          <div className="form-group">
            <label htmlFor="block-content-text">Текст</label>
            <Textarea id="block-content-text" name="content" value={block.content || ''} onChange={handleChange} rows={5} required />
          </div>
        );
      case 'image':
      case 'video':
      case 'audio':
        return (
          <>
            <div className="form-group">
              <label htmlFor="block-src-single">URL ресурса ({block.type})</label>
              <Input id="block-src-single" name="src" type="url" value={typeof block.src === 'string' ? block.src : ''} onChange={handleSrcChange} placeholder="https://example.com/resource.jpg" required />
            </div>
            <div className="form-group">
                <label htmlFor="block-text-caption">Подпись/Альтернативный текст (опционально)</label>
                <Input id="block-text-caption" name="text" value={block.text || ''} onChange={handleChange} />
            </div>
          </>
        );
      case 'album':
      case 'slider':
        return (
          <div className="form-group">
            <label>URL изображений для "{block.type}"</label>
            {(Array.isArray(block.src) ? block.src : []).map((s, index) => (
              <div key={index} className="form-group-array-item">
                <Input type="url" value={s} onChange={(e) => handleSrcChange(e, index)} placeholder={`URL изображения ${index + 1}`} />
                <Button type="button" onClick={() => removeSrcField(index)} variant="destructive" size="sm" style={{marginLeft: '0.5rem'}}>Удалить</Button>
              </div>
            ))}
            <Button type="button" onClick={addSrcField} variant="outline" size="sm" style={{marginTop: '0.5rem'}}>Добавить URL</Button>
          </div>
        );
      case 'test':
        return (
          <>
            <div className="form-group">
              <label htmlFor="block-question">Вопрос</label>
              <Textarea id="block-question" name="question" value={block.question || ''} onChange={handleChange} rows={2} required />
            </div>
            <div className="form-group">
              <label>Варианты ответов</label>
              {(block.options || []).map((opt, index) => (
                <div key={opt.id || index} className="form-group-array-item">
                  <Input name={`option-text-${index}`} placeholder={`Текст варианта ${index + 1}`} value={opt.text} onChange={(e) => handleTestOptionChange(index, 'text', e.target.value)} required />
                  {/* ID для опции обычно генерируется, но можно дать возможность его править */}
                  {/* <Input name={`option-id-${index}`} placeholder="ID варианта (уникальный)" value={opt.id} onChange={(e) => handleTestOptionChange(index, 'id', e.target.value)} style={{maxWidth: '150px', marginLeft: '0.5rem'}}/> */}
                  <Button type="button" onClick={() => removeTestOption(index)} variant="destructive" size="sm" style={{marginLeft: '0.5rem'}}>Удалить</Button>
                </div>
              ))}
              <Button type="button" onClick={addTestOption} variant="outline" size="sm" style={{marginTop: '0.5rem'}}>Добавить вариант</Button>
            </div>
            <div className="form-group">
              <label htmlFor="block-message-test">Сообщение к тесту (опционально)</label>
              <Textarea id="block-message-test" name="message" value={block.message || ''} onChange={handleChange} rows={2} />
            </div>
          </>
        );
      default:
        return <p>Неизвестный тип блока.</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="content-block-form">
      <div className="form-group">
        <label htmlFor="block-type">Тип блока*</label>
        <Select id="block-type" name="type" value={block.type} onChange={handleChange} options={blockTypeOptions} required />
      </div>
      
      {renderSpecificFields()}

      <div className="form-actions" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
        <Button type="submit" variant="success">Сохранить блок</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button>
      </div>
    </form>
  );
};