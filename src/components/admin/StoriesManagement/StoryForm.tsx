// src/components/admin/StoriesManagement/StoryForm.tsx
import React from 'react';
import { useStoryForm } from '../../../hooks/admin/Stories/useStoryForm';

import type { 
    StoryFormOptions, 
    Story, 
    StoryContentItem,
    StoryContentType,
    StoryFormData // Импортируем для явной типизации в handleContentItemChange
} from '../../../types/admin/Stories/story.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { Select } from '../../ui/Select/Select';
import { STORY_CONTENT_ITEM_TYPES } from '../../../constants/admin/Stories/stories.constants';
import '../../../styles/admin/ui/Form.css';
import './StoryForm.css';

interface StoryFormPropsExtended extends StoryFormOptions {
  setShowForm: (show: boolean) => void;
}

export const StoryForm: React.FC<StoryFormPropsExtended> = ({
  onSuccess,
  storyToEdit,
  setShowForm,
}) => {
  const {
    formData,
    setFormData, // Импортируем setFormData
    handleChange,
    handleCheckboxChange,
    handleFileChange,
    handleSubmit,
    isSubmitting,
    formError,
    resetForm,
    addContentItem,
    // updateContentItem, // Мы будем использовать локальную функцию для обновления через setFormData
    removeContentItem,
  } = useStoryForm({
    onSuccess: (data: Story) => {
      onSuccess?.(data);
      setShowForm(false);
      resetForm();
    },
    storyToEdit
  });

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  // Локальная функция для обновления элемента контента, использующая setFormData
  const handleContentItemChange = (
    index: number,
    field: keyof StoryContentItem,
    value: string | StoryContentType // Тип значения может быть строкой или StoryContentType
  ) => {
    setFormData((prevFormData: StoryFormData) => { // Явно типизируем prevFormData
      const newContentItems = prevFormData.content_items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return { ...prevFormData, content_items: newContentItems };
    });
  };

  return (
    <div className="form-container">
      <h3 className="form-title">
        {storyToEdit ? 'Редактировать Историю' : 'Создать Историю'}
      </h3>
      {formError && <p className="form-error">{formError}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-inputs">
          {/* Название Истории */}
          <div className="form-group">
            <label htmlFor="name_story">Название истории (необязательно)</label>
            <Input
              id="name_story"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите название истории"
              disabled={isSubmitting}
            />
          </div>

          {/* Активность */}
          <div className="form-group form-group-checkbox">
            <Checkbox
              id="is_active_story"
              name="is_active" // Это имя будет в handleChange, но мы используем handleCheckboxChange
              checked={formData.is_active}
              onChange={(checked) => handleCheckboxChange("is_active", checked)}
              disabled={isSubmitting}
            />
            <label htmlFor="is_active_story">Активна</label>
          </div>
          
          {/* Дата истечения срока */}
          <div className="form-group">
            <label htmlFor="expires_at_story">Дата истечения (необязательно)</label>
            <Input
              id="expires_at_story"
              name="expires_at"
              type="date"
              value={formData.expires_at}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Превью-изображение */}
          <div className="form-group">
            <ImageUpload
              id="preview_file_story"
              name="preview_file"
              onChange={handleFileChange}
              previewUrl={formData.preview_url}
              existingImageUrl={formData.existing_preview_url}
              label="Превью-изображение (обязательно для новой)"
              disabled={isSubmitting}
            />
             {(!formData.preview_file && !formData.existing_preview_url) && <p className="form-field-error">Превью обязательно для новой истории.</p>}
          </div>

          <fieldset className="form-group content-items-fieldset">
            <legend>Элементы контента истории</legend>
            {formData.content_items.map((item: StoryContentItem, index: number) => (
              <div key={index} className="content-item-block">
                <h4>Элемент #{index + 1}</h4>
                <div className="form-group">
                  <Select
                    id={`content_item_type_${index}`}
                    // name не используется т.к. мы обновляем через handleContentItemChange
                    label="Тип контента"
                    value={item.type}
                    onChange={(e) => handleContentItemChange(index, "type", e.target.value as StoryContentType)}
                    options={STORY_CONTENT_ITEM_TYPES}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`content_item_content_${index}`}>URL контента*</label>
                  <Input
                    id={`content_item_content_${index}`}
                    value={item.content}
                    onChange={(e) => handleContentItemChange(index, "content", e.target.value)}
                    placeholder="Введите URL (для image/video)"
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => removeContentItem(index)}
                  variant="destructive"
                  size="sm"
                  disabled={isSubmitting}
                  className="remove-content-item-button"
                >
                  Удалить элемент
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={addContentItem}
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              className="add-content-item-button"
            >
              Добавить элемент контента
            </Button>
            {formData.content_items.length === 0 && <p className="form-field-error">Добавьте хотя бы один элемент контента.</p>}
          </fieldset>
        </div>

        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting} customVariant="save" variant="success">
            {isSubmitting
              ? storyToEdit ? 'Сохранение...' : 'Создание...'
              : storyToEdit ? 'Сохранить изменения' : 'Создать'}
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