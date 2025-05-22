// src/components/admin/PointsManagement/ContentBlockFormModal.tsx
import React, { useState, useEffect, useId } from 'react';
import type {
  ContentBlock,
  ContentBlockType,
  TestOption,
  HeadingBlock,
  TextBlock,
  ImageBlock,
  VideoBlock,
  AudioBlock,
  AlbumBlock,
  SliderBlock,
  TestBlock,
  BaseContentBlock,
} from '../../../types/admin/Points/point.types';
import { POINT_CONTENT_BLOCK_TYPE_OPTIONS } from '../../../constants/admin/Points/points.constants';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { Select } from '../../ui/Select/Select';
import { Modal } from '../../ui/Modal/Modal'; // Твой компонент модального окна

interface ContentBlockFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blockData: ContentBlock) => void;
  initialBlockData?: ContentBlock | null;
}

const getDefaultBlock = (type: ContentBlockType = 'text', existingInternalId?: string): ContentBlock => {
  // __id (внутренний ID для React key и управления состоянием)
  // будет добавлен/сохранен в usePointForm или при инициализации здесь
  const base: Omit<BaseContentBlock, 'type'> = { __id: existingInternalId }; 
  switch (type) {
    case 'heading':
      return { ...base, type: 'heading', level: 1, content: '' } as HeadingBlock;
    case 'image':
      return { ...base, type: 'image', src: '', text: '' } as ImageBlock;
    case 'video':
      return { ...base, type: 'video', src: '', text: '' } as VideoBlock;
    case 'audio':
      return { ...base, type: 'audio', src: '', text: '' } as AudioBlock;
    case 'album':
      return { ...base, type: 'album', src: [], text: '' } as AlbumBlock;
    case 'slider':
      return { ...base, type: 'slider', src: [], text: '' } as SliderBlock;
    case 'test':
      return { ...base, type: 'test', question: '', options: [], message: '' } as TestBlock;
    case 'text':
    default:
      return { ...base, type: 'text', content: '' } as TextBlock;
  }
};

export const ContentBlockFormModal: React.FC<ContentBlockFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialBlockData,
}) => {
  // __id из initialBlockData используется для инициализации, если он есть
  const [block, setBlock] = useState<ContentBlock>(getDefaultBlock('text', initialBlockData?.__id));
  const [currentTestOptionText, setCurrentTestOptionText] = useState('');
  const formPrefix = useId();

  useEffect(() => {
    if (isOpen) {
      if (initialBlockData) {
        // Убеждаемся, что __id сохраняется, если он был в initialBlockData
        setBlock({ ...initialBlockData, __id: initialBlockData.__id || block.__id });
      } else {
        // Для нового блока __id будет добавлен позже в usePointForm при сохранении в массив
        // или можно генерировать его здесь, если getDefaultBlock не передает initialBlockData.__id
        setBlock(getDefaultBlock('text'));
      }
      setCurrentTestOptionText('');
    }
  }, [initialBlockData, isOpen, block.__id]); // Добавил block.__id в зависимости, хотя может быть излишне

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ContentBlockType;
    // Сохраняем __id, если он есть
    setBlock(getDefaultBlock(newType, block.__id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const parsedValue = e.target.type === 'number' ? parseInt(value, 10) || 0 : value;
    setBlock(prev => ({ ...prev, [name]: parsedValue, }));
  };
  
  const handleSrcListChange = (index: number, value: string) => {
    setBlock(prev => {
      if (prev.type === 'album' || prev.type === 'slider') {
        const newSrc = [...(prev.src || [])];
        newSrc[index] = value;
        return { ...prev, src: newSrc };
      }
      return prev;
    });
  };

  const addSrcListItem = () => {
    setBlock(prev => {
      if (prev.type === 'album' || prev.type === 'slider') {
        return { ...prev, src: [...(prev.src || []), ''] };
      }
      return prev;
    });
  };
  
  const removeSrcListItem = (index: number) => {
    setBlock(prev => {
      if (prev.type === 'album' || prev.type === 'slider') {
        return { ...prev, src: (prev.src || []).filter((_, i: number) => i !== index) };
      }
      return prev;
    });
  };

  const handleTestOptionChange = (index: number, textValue: string) => {
    setBlock(prev => {
      if (prev.type === 'test') {
        const currentBlock = prev as TestBlock; // Сужение типа
        const newOptions = [...(currentBlock.options || [])];
        newOptions[index] = { ...newOptions[index], text: textValue };
        return { ...prev, options: newOptions };
      }
      return prev;
    });
  };

  const addTestOption = () => {
    if (block.type === 'test' && currentTestOptionText.trim()) {
      const newOption: TestOption = { id: `opt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, text: currentTestOptionText.trim() };
      setBlock(prev => {
        if (prev.type === 'test') {
            const currentBlock = prev as TestBlock; // Сужение типа
            return { ...prev, options: [...(currentBlock.options || []), newOption] };
        }
        return prev;
      });
      setCurrentTestOptionText('');
    }
  };

  const removeTestOption = (index: number) => {
    setBlock(prev => {
      if (prev.type === 'test') {
        const currentBlock = prev as TestBlock; // Сужение типа
        return { ...prev, options: (currentBlock.options || []).filter((_, i: number) => i !== index) };
      }
      return prev;
    });
  };

  const handleSubmit = () => { // Убрал e: React.FormEvent, т.к. вызывается из onClick кнопки
    // Валидация (очень базовая, нужно расширить)
    if (block.type === 'heading' && (!block.level || !block.content)) {
        alert('Для заголовка нужны уровень и текст.'); return;
    }
    if (block.type === 'text' && !block.content) {
        alert('Для текстового блока нужен текст.'); return;
    }
    // ... другие валидации ...
    
    // Убедимся, что __id передается обратно, если он был
    const blockToSave = { ...block, __id: block.__id || initialBlockData?.__id };
    onSave(blockToSave);
  };

  const renderBlockFields = () => {
    switch (block.type) {
      case 'heading':
        const currentBlockHeading = block as HeadingBlock;
        return (
          <>
            <div className="form-group">
              <label htmlFor={`${formPrefix}-block-level`}>Уровень (1-6)</label>
              <Input id={`${formPrefix}-block-level`} type="number" name="level" value={currentBlockHeading.level || 1} onChange={handleChange} min="1" max="6" />
            </div>
            <div className="form-group">
              <label htmlFor={`${formPrefix}-block-h-content`}>Текст заголовка</label>
              <Input id={`${formPrefix}-block-h-content`} name="content" value={currentBlockHeading.content || ''} onChange={handleChange} />
            </div>
          </>
        );
      case 'text':
        const currentBlockText = block as TextBlock;
        return (
          <div className="form-group">
            <label htmlFor={`${formPrefix}-block-t-content`}>Текст</label>
            <Textarea id={`${formPrefix}-block-t-content`} name="content" value={currentBlockText.content || ''} onChange={handleChange} rows={5} />
          </div>
        );
      case 'image':
      case 'video':
      case 'audio':
        const currentBlockMedia = block as ImageBlock | VideoBlock | AudioBlock;
        return (
          <>
            <div className="form-group">
              <label htmlFor={`${formPrefix}-block-src`}>URL {currentBlockMedia.type === 'image' ? 'изображения' : currentBlockMedia.type === 'video' ? 'видео' : 'аудио'}</label>
              <Input id={`${formPrefix}-block-src`} name="src" value={currentBlockMedia.src || ''} onChange={handleChange} placeholder="https://example.com/file.ext" />
            </div>
            <div className="form-group">
              <label htmlFor={`${formPrefix}-block-media-text`}>Описание/Подпись (опционально)</label>
              <Input id={`${formPrefix}-block-media-text`} name="text" value={currentBlockMedia.text || ''} onChange={handleChange} />
            </div>
          </>
        );
      case 'album':
      case 'slider':
        const currentBlockGallery = block as AlbumBlock | SliderBlock;
        return (
          <>
            <div className="form-group">
                <label>URL изображений для {currentBlockGallery.type === 'album' ? 'альбома' : 'слайдера'}</label>
                {(currentBlockGallery.src || []).map((srcUrl, index) => (
                    <div key={index} className="form-group-array-item">
                        <Input value={srcUrl} onChange={(e) => handleSrcListChange(index, e.target.value)} placeholder={`URL изображения ${index + 1}`} />
                        <Button type="button" onClick={() => removeSrcListItem(index)} variant="destructive" size="sm">Удалить</Button>
                    </div>
                ))}
                <Button type="button" onClick={() => addSrcListItem()} variant="outline" size="sm" style={{marginTop: '0.5rem'}}>Добавить URL</Button>
            </div>
            <div className="form-group">
                <label htmlFor={`${formPrefix}-block-gallery-text`}>Общее описание (опционально)</label>
                <Input id={`${formPrefix}-block-gallery-text`} name="text" value={currentBlockGallery.text || ''} onChange={handleChange} />
            </div>
          </>
        );
      case 'test':
        const currentBlockTest = block as TestBlock;
        return (
          <>
            <div className="form-group">
              <label htmlFor={`${formPrefix}-block-question`}>Вопрос</label>
              <Textarea id={`${formPrefix}-block-question`} name="question" value={currentBlockTest.question || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Варианты ответа</label>
              {(currentBlockTest.options || []).map((opt, index) => (
                <div key={opt.id || index} className="form-group-array-item">
                  <Input value={opt.text} onChange={(e) => handleTestOptionChange(index, e.target.value)} placeholder={`Вариант ${index + 1}`} />
                  <Button type="button" onClick={() => removeTestOption(index)} variant="destructive" size="sm">Удалить</Button>
                </div>
              ))}
              <div className="form-group-array-item" style={{ marginTop: '0.5rem' }}>
                <Input value={currentTestOptionText} onChange={(e) => setCurrentTestOptionText(e.target.value)} placeholder="Новый вариант ответа" />
                <Button type="button" onClick={addTestOption} variant="outline" size="sm">Добавить вариант</Button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor={`${formPrefix}-block-message`}>Сообщение/Объяснение (опционально)</label>
              <Textarea id={`${formPrefix}-block-message`} name="message" value={currentBlockTest.message || ''} onChange={handleChange} />
            </div>
          </>
        );
      default:
        const exhaustiveCheck: never = block; // Для проверки полноты switch
        return <p>Неизвестный тип блока: {(exhaustiveCheck as any)?.type}</p>;
    }
  };

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={initialBlockData ? 'Редактировать блок контента' : 'Добавить блок контента'}
        size="lg" // Можно выбрать подходящий размер
        footer={
            <div className="form-actions">
                <Button type="button" variant="success" onClick={handleSubmit}>Сохранить блок</Button>
                <Button type="button" variant="outline" onClick={onClose}>Отмена</Button>
            </div>
        }
    >
        {/* Тело модального окна */}
        <div className="form-inputs" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}> {/* Обертка для стилей формы */}
            <div className="form-group">
                <Select
                id={`${formPrefix}-block-type-select`}
                name="blockType" // Имя для handleTypeChange
                label="Тип блока"
                value={block.type}
                onChange={handleTypeChange} // Используем специальный обработчик для смены типа
                options={POINT_CONTENT_BLOCK_TYPE_OPTIONS}
                required
                />
            </div>
            
            {renderBlockFields()}
        </div>
    </Modal>
  );
};