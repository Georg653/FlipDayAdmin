// src/components/admin/LearningTopicsManagement/LearningTopicForm.tsx
import React from 'react';
import type { LearningTopicFormProps } from '../../../types/admin/LearningTopics/learningTopic_props.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import '../../../styles/admin/ui/Form.css';

export const LearningTopicForm: React.FC<LearningTopicFormProps> = ({
  formData,
  isSubmitting,
  formError,
  handleChange,
  handleFileChange,
  handleSubmit,
  handleCancel,
  learningTopicToEdit,
}) => {

  return (
    <div className="form-container">
      <h3 className="form-title">
        {learningTopicToEdit ? 'Редактировать Тему' : 'Создать Тему Обучения'}
      </h3>
      {formError && <p className="form-error">{formError}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-inputs">
          <div className="form-group">
            <label htmlFor="name_lt">Название Темы*</label>
            <Input
              id="name_lt"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите название темы"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description_lt">Описание</label>
            <Textarea
              id="description_lt"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Краткое описание темы"
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience_points_lt">Очки опыта*</label>
            <Input
              id="experience_points_lt"
              name="experience_points"
              type="number"
              value={formData.experience_points}
              onChange={handleChange}
              placeholder="Количество очков опыта"
              disabled={isSubmitting}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="order_lt">Порядок*</label>
            <Input
              id="order_lt"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
              placeholder="Порядковый номер темы"
              disabled={isSubmitting}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <ImageUpload
              id="image_file_lt"
              name="image_file"
              onChange={handleFileChange}
              previewUrl={formData.image_preview_url}
              existingImageUrl={formData.existing_image_url}
              label="Изображение темы (опционально)"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting} customVariant="save" variant="success">
            {isSubmitting
              ? learningTopicToEdit ? 'Сохранение...' : 'Создание...'
              : learningTopicToEdit ? 'Сохранить изменения' : 'Создать Тему'}
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            customVariant="cancel"
            variant="outline"
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
};