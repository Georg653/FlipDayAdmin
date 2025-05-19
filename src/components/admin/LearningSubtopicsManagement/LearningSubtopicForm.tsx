// src/components/admin/LearningSubtopicsManagement/LearningSubtopicForm.tsx
import React from 'react';
import type { LearningSubtopicFormProps } from '../../../types/admin/LearningSubtopics/learningSubtopic_props.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { Select } from '../../ui/Select/Select';
import type { SelectOption as UiSelectOption } from '../../ui/Select/Select';
import '../../../styles/admin/ui/Form.css';

export const LearningSubtopicForm: React.FC<LearningSubtopicFormProps> = ({
  formData,
  isSubmitting,
  formError,
  handleChange,
  handleFileChange,
  handleSubmit,
  handleCancel,
  learningSubtopicToEdit,
  topicOptions,
}) => {

  const uiTopicSelectOptions: UiSelectOption[] = topicOptions
    ? topicOptions.map(topic => ({ value: topic.id.toString(), label: topic.name }))
    : [];
  
  const currentTopicNameForDisplay = learningSubtopicToEdit && topicOptions 
    ? topicOptions.find(opt => opt.id.toString() === formData.topic_id)?.name 
    : null;

  return (
    <div className="form-container">
      <h3 className="form-title">
        {learningSubtopicToEdit ? 'Редактировать Подтему' : 'Создать Подтему'}
      </h3>
      {formError && <p className="form-error">{formError}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-inputs">
          <div className="form-group">
            <label htmlFor="topic_id_lst_form_field">Тема*</label>
            {learningSubtopicToEdit ? (
              <Input
                id="topic_id_lst_form_field_display"
                value={currentTopicNameForDisplay || `ID Темы: ${formData.topic_id}`}
                disabled={true}
              />
            ) : (
              uiTopicSelectOptions.length > 0 ? (
                <Select
                  id="topic_id_lst_form_field"
                  name="topic_id"
                  value={formData.topic_id}
                  onChange={handleChange}
                  options={uiTopicSelectOptions}
                  placeholder="-- Выберите тему --"
                  disabled={isSubmitting}
                  required
                />
              ) : (
                <Input
                  id="topic_id_lst_form_field_input"
                  name="topic_id"
                  type="number"
                  value={formData.topic_id}
                  onChange={handleChange}
                  placeholder="ID родительской темы (темы не загружены)"
                  disabled={isSubmitting}
                  required
                />
              )
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name_lst">Название Подтемы*</label>
            <Input id="name_lst" name="name" value={formData.name} onChange={handleChange} placeholder="Введите название подтемы" disabled={isSubmitting} required />
          </div>
          <div className="form-group">
            <label htmlFor="description_lst">Описание</label>
            <Textarea id="description_lst" name="description" value={formData.description} onChange={handleChange} placeholder="Краткое описание подтемы" disabled={isSubmitting} rows={3} />
          </div>
          <div className="form-group">
            <label htmlFor="experience_points_lst">Очки опыта*</label>
            <Input id="experience_points_lst" name="experience_points" type="number" value={formData.experience_points} onChange={handleChange} placeholder="Количество очков опыта" disabled={isSubmitting} required min="0"/>
          </div>
          <div className="form-group">
            <label htmlFor="order_lst">Порядок*</label>
            <Input id="order_lst" name="order" type="number" value={formData.order} onChange={handleChange} placeholder="Порядковый номер" disabled={isSubmitting} required min="0"/>
          </div>
          <div className="form-group">
            <ImageUpload id="image_file_lst" name="image_file" onChange={handleFileChange} previewUrl={formData.image_preview_url} existingImageUrl={formData.existing_image_url} label="Изображение подтемы (опционально)" disabled={isSubmitting}/>
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting} customVariant="save" variant="success">
            {isSubmitting ? (learningSubtopicToEdit ? 'Сохранение...' : 'Создание...') : (learningSubtopicToEdit ? 'Сохранить изменения' : 'Создать Подтему')}
          </Button>
          <Button type="button" onClick={handleCancel} disabled={isSubmitting} customVariant="cancel" variant="outline">
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
};