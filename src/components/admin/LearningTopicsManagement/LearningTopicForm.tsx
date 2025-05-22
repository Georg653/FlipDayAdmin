// src/components/admin/LearningTopicsManagement/LearningTopicForm.tsx
import React from 'react';
import type { LearningTopicFormProps } from '../../../types/admin/LearningTopics/learningTopic_props.types'; // Убедись, что типы пропсов обновлены
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import '../../../styles/admin/ui/Form.css';

export const LearningTopicForm: React.FC<LearningTopicFormProps> = ({
  formData, // formData теперь содержит image_url_manual и обновленный image_preview_url
  isSubmitting,
  formError,
  handleChange,     // Общий handleChange из хука
  handleFileChange, // Отдельный для файла из хука
  handleSubmit,
  handleCancel,     // Этот проп должен передаваться из LearningTopicsManagement
  learningTopicToEdit,
}) => {

  // image_preview_url теперь должен корректно обновляться в хуке
  // и содержать либо URL.createObjectURL(file), либо image_url_manual, либо existing_image_url

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
              name="name" // Это имя должно совпадать с ключом в formData
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
              name="description" // Имя поля в formData
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
              name="experience_points" // Имя поля в formData
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
              name="order" // Имя поля в formData
              type="number"
              value={formData.order}
              onChange={handleChange}
              placeholder="Порядковый номер темы"
              disabled={isSubmitting}
              required
              min="0"
            />
          </div>

          {/* Поле для ввода URL изображения */}
          <div className="form-group">
            <label htmlFor="image_url_manual_lt">URL изображения (если не загружаете файл)</label>
            <Input
              id="image_url_manual_lt"
              name="image_url_manual" // Имя поля в formData
              type="url"
              value={formData.image_url_manual}
              onChange={handleChange} // Используем общий handleChange
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting || !!formData.image_file} // Блокируем, если выбран файл
            />
          </div>

          {/* Компонент для загрузки файла изображения */}
          <div className="form-group">
            <ImageUpload
              id="image_file_lt"
              name="image_file" // Это имя не используется напрямую Input-ом, но для семантики
              onChange={handleFileChange} // Используем специальный handleFileChange
              previewUrl={formData.image_preview_url} // Это поле обновляется в хуке
              // existingImageUrl можно убрать, если image_preview_url всегда содержит правильное превью
              label="Или загрузите файл изображения"
              disabled={isSubmitting || !!formData.image_url_manual.trim()} // Блокируем, если введен URL
            />
            {formData.image_file && (
              <small>Выбран файл: {formData.image_file.name}</small>
            )}
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
            onClick={handleCancel} // handleCancel должен передаваться как проп
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