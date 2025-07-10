// --- Путь: src/components/admin/LearningPagesManagement/LearningPageForm.tsx ---
// ФИНАЛЬНАЯ ВЕРСИЯ. ТОЛЬКО UI.

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

import { useLearningPageForm } from '../../../hooks/admin/LearningPagesManagement/useLearningPageForm';
import type { LearningPageFormProps } from '../../../types/admin/LearningPages/learningPage_props.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Select } from '../../ui/Select/Select';

import { ContentBlockForm } from '../NewsManagement/ContentBlockForm';
import { AddBlockPanel } from '../NewsManagement/AddBlockPanel';

import '../../../styles/admin/ui/Form.css';
import '../NewsManagement/NewsForm.css';
import './LearningPageForm.css';

export const LearningPageForm: React.FC<LearningPageFormProps> = ({
  pageToEdit,
  onSuccess,
  onCancel,
  parentSubtopicId,
}) => {
  const {
    formData, isSubmitting, formError, handleSubmit, handleChange, addBlock, removeBlock, updateBlock, moveBlock,
    // Получаем всё для каскадных селектов из хука
    topics, subtopics, selectedTopicInForm, isCascadeLoading,
    handleTopicInFormChange, handleSubtopicInFormChange,
  } = useLearningPageForm({ pageToEdit, onSuccess, parentSubtopicId });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    moveBlock(result.source.index, result.destination.index);
  };
  
  const isLoading = isSubmitting || isCascadeLoading;

  return (
    <form onSubmit={handleSubmit} noValidate className="form-container news-form">
      {formError && <p className="form-error">Ошибка: {formError}</p>}
      
      <div className="learning-page-form-grid">
        <div className="form-column">
          <h4>Основные настройки</h4>
          
          <div className="form-group-cascade">
            <div className="form-group">
                <label htmlFor="topic-in-form">Тема*</label>
                <Select
                    id="topic-in-form"
                    name="topic-in-form"
                    options={topics}
                    value={selectedTopicInForm || ''}
                    onChange={handleTopicInFormChange}
                    disabled={isLoading}
                    placeholder="Выберите тему..."
                />
            </div>
            <div className="form-group">
                <label htmlFor="subtopic_id">Подтема*</label>
                <Select
                    id="subtopic_id"
                    name="subtopic_id"
                    options={subtopics}
                    value={formData.subtopic_id}
                    onChange={handleSubtopicInFormChange}
                    disabled={isLoading || !selectedTopicInForm}
                    required
                    placeholder={!selectedTopicInForm ? "Сначала выберите тему" : "Выберите подтему..."}
                />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="page_number">Номер страницы*</label>
            <Input id="page_number" name="page_number" type="number" value={formData.page_number} onChange={handleChange} required disabled={isLoading} />
          </div>
        </div>

        <div className="form-column form-column-content">
          <h4>Конструктор контента</h4>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="content-blocks-learning-page-form">
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
                            onAddBlock={(type) => addBlock(type)}
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
           <AddBlockPanel onAddBlock={addBlock} />
        </div>
      </div>
      
      <div className="form-actions">
        <Button type="submit" disabled={isLoading} variant="success">
          {isLoading ? 'Сохранение...' : 'Сохранить страницу'}
        </Button>
        <Button type="button" onClick={onCancel} disabled={isLoading} variant="outline">
          Отмена
        </Button>
      </div>
    </form>
  );
};