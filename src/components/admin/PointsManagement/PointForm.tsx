// --- Путь: src/components/admin/PointsManagement/PointForm.tsx ---

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

import { usePointForm } from '../../../hooks/admin/Points/usePointForm';
import type { PointFormProps } from '../../../types/admin/Points/point_props.types';
import type { ContentBlockFormData } from '../../../types/admin/Points/point.types';

// Переиспользуем UI-компоненты
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
// Переиспользуем компоненты конструктора из Новостей
import { ContentBlockForm } from '../NewsManagement/ContentBlockForm';
import { AddBlockPanel } from '../NewsManagement/AddBlockPanel';

import '../../../styles/admin/ui/Form.css';
import '../../admin/NewsManagement/NewsForm.css'; // Переиспользуем стили сетки из формы новостей

export const PointForm: React.FC<PointFormProps> = ({ pointToEdit, onSuccess, onCancel }) => {
  const {
    formData,
    setFormData,
    isSubmitting,
    formError,
    handleChange,
    handleFileChange,
    handleRemoveImage,
    handleSubmit,
    addBlock,
    removeBlock,
    updateBlock,
    moveBlock,
  } = usePointForm({ pointToEdit, onSuccess });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    moveBlock(result.source.index, result.destination.index);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="form-container news-form">
      {formError && <p className="form-error">Ошибка: {formError}</p>}
      
      <div className="news-form-grid">
        {/* --- ЛЕВАЯ КОЛОНКА: Основные настройки точки --- */}
        <div className="form-column form-column-meta">
          <h4>Основные данные точки</h4>
          <div className="form-group">
            <label htmlFor="name">Название*</label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isSubmitting} />
          </div>
          <div className="form-group">
            <label htmlFor="description">Описание*</label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required disabled={isSubmitting} rows={4}/>
          </div>
           <div className="form-group">
            <label htmlFor="latitude">Широта (Latitude)*</label>
            <Input id="latitude" name="latitude" type="number" value={formData.latitude} onChange={handleChange} required disabled={isSubmitting} step="any" />
          </div>
           <div className="form-group">
            <label htmlFor="longitude">Долгота (Longitude)*</label>
            <Input id="longitude" name="longitude" type="number" value={formData.longitude} onChange={handleChange} required disabled={isSubmitting} step="any" />
          </div>
          <div className="form-group">
            <label htmlFor="budget">Бюджет*</label>
            <Input id="budget" name="budget" type="number" value={formData.budget} onChange={handleChange} required disabled={isSubmitting} />
          </div>
          <div className="form-group">
            <Checkbox id="is_partner" name="is_partner" label="Партнерская точка" checked={formData.is_partner} onChange={(checked) => setFormData(prev => ({...prev, is_partner: checked}))} disabled={isSubmitting} />
          </div>
          <div className="form-group">
            <ImageUpload
              id="point_image" name="image_file" label="Основное изображение"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              previewUrl={formData.image_file ? URL.createObjectURL(formData.image_file) : formData.image_url}
              disabled={isSubmitting || formData.remove_image}
            />
            {pointToEdit?.image && (
              <Checkbox id="remove_image" label="Удалить изображение" checked={formData.remove_image} onChange={handleRemoveImage} disabled={isSubmitting}/>
            )}
          </div>
        </div>

        {/* --- ПРАВАЯ КОЛОНКА: Конструктор контента --- */}
        <div className="form-column form-column-content">
          <h4>Дополнительный контент</h4>
          <Checkbox id="has_content" name="has_content" label="Добавить/редактировать контент" checked={formData.has_content} onChange={(checked) => setFormData(prev => ({...prev, has_content: checked}))} disabled={isSubmitting} />
          
          {formData.has_content && (
            <>
              {pointToEdit?.content_data && (
                <Checkbox id="remove_content" name="remove_content" label="Полностью удалить контент при сохранении" checked={formData.remove_content} onChange={(checked) => setFormData(prev => ({...prev, remove_content: checked}))} disabled={isSubmitting}/>
              )}
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="content-blocks">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="content-blocks-list">
                      {formData.content.map((block, index) => (
                        <Draggable key={block.id} draggableId={block.id} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <ContentBlockForm block={block} index={index} isSubmitting={isSubmitting} onRemoveBlock={removeBlock} onUpdateBlock={updateBlock} onAddBlock={addBlock} onMoveBlockUp={() => moveBlock(index, index - 1)} onMoveBlockDown={() => moveBlock(index, index + 1)}/>
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
            </>
          )}
        </div>
      </div>
      
      <div className="form-actions">
        <Button type="submit" disabled={isSubmitting} variant="success">{isSubmitting ? 'Сохранение...' : 'Сохранить'}</Button>
        <Button type="button" onClick={onCancel} disabled={isSubmitting} variant="outline">Отмена</Button>
      </div>
    </form>
  );
};