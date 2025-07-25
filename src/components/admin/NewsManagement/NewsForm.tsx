// --- Путь: src/components/admin/NewsManagement/NewsForm.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

import { useNewsForm } from '../../../hooks/admin/News/useNewsForm';
import { usePreviewData } from '../../../hooks/previews/usePreviewData';
import type { NewsFormProps } from '../../../types/admin/News/news_props.types';
import type { ContentBlockFormData } from '../../../types/common/content.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { ContentBlockForm } from './ContentBlockForm';
import { AddBlockPanel } from './AddBlockPanel';
import { ContentPreview } from '../../previews/ContentPreview/ContentPreview';

import '../../../styles/admin/ui/Form.css';
import '../../../styles/admin/ui/Layouts.css';
import './NewsForm.css';

export const NewsForm: React.FC<NewsFormProps> = ({ newsToEdit, onSuccess, onCancel }) => {
  const {
    formData, isSubmitting, formError, handleChange, handleFileChange, handleRemoveImage,
    addBlock, removeBlock, updateBlock, moveBlock, handleSubmit,
  } = useNewsForm({ newsToEdit, onSuccess });

  const previewData = usePreviewData(formData);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    moveBlock(result.source.index, result.destination.index);
  };

  return (
    <div className="form-with-preview-layout">
      {/* Левая колонка - форма */}
      <form onSubmit={handleSubmit} noValidate className="form-container form-with-preview-main">
        {formError && <p className="form-error">Ошибка: {formError}</p>}
        
        {/* --- УБРАНА ОБЕРТКА .news-form-grid --- */}
        <div className="form-column form-column-meta">
          <h4>Основные настройки</h4>
          <div className="form-group">
            <label htmlFor="title">Заголовок*</label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required disabled={isSubmitting} />
          </div>
          <div className="form-group">
            <label htmlFor="description">Краткое описание*</label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required disabled={isSubmitting} rows={4}/>
          </div>
          <div className="form-group">
            <ImageUpload
              id="news_preview" name="preview_file" label="Превью (карточка новости)"
              onChange={(e) => handleFileChange('preview_file', e.target.files?.[0] || null)}
              previewUrl={previewData.mainImage}
              disabled={isSubmitting || formData.remove_preview}
            />
            {newsToEdit?.preview && (
              <Checkbox id="remove_preview" label="Удалить превью" checked={formData.remove_preview} onChange={(c) => handleRemoveImage('remove_preview', c)} disabled={isSubmitting}/>
            )}
          </div>
          <div className="form-group">
            <ImageUpload
              id="news_background" name="background_file" label="Фон (внутри новости)"
              onChange={(e) => handleFileChange('background_file', e.target.files?.[0] || null)}
              previewUrl={previewData.backgroundImage}
              disabled={isSubmitting || formData.remove_background}
            />
            {newsToEdit?.background && (
              <Checkbox id="remove_background" label="Удалить фон" checked={formData.remove_background} onChange={(c) => handleRemoveImage('remove_background', c)} disabled={isSubmitting}/>
            )}
          </div>
        </div>

        <div className="form-column form-column-content">
          <h4>Конструктор контента</h4>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="content-blocks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="content-blocks-list">
                  {formData.content.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <ContentBlockForm
                            block={block} index={index} isSubmitting={isSubmitting}
                            onRemoveBlock={removeBlock} onUpdateBlock={updateBlock}
                            onMoveBlockUp={() => moveBlock(index, index - 1)}
                            onMoveBlockDown={() => moveBlock(index, index + 1)}
                            onAddBlock={(type) => addBlock(type, formData.content.length)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <AddBlockPanel onAddBlock={(type) => addBlock(type, formData.content.length)} />
        </div>
        
        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting} variant="success">
            {isSubmitting ? 'Сохранение...' : 'Сохранить новость'}
          </Button>
          <Button type="button" onClick={onCancel} disabled={isSubmitting} variant="outline">
            Отмена
          </Button>
        </div>
      </form>
      
      {/* Правая колонка - предпросмотр */}
      <aside className="form-with-preview-aside">
        <div className="preview-sticky-container">
          {/* Заголовок Live Preview убран из Layouts.css */}
          <ContentPreview data={previewData} />
        </div>
      </aside>
    </div>
  );
};