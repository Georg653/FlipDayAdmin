// --- Путь: src/components/admin/StoriesManagement/StoryForm.tsx ---

import React from 'react';
import { useStoryForm } from '../../../hooks/admin/Stories/useStoryForm';
import type { StoryFormProps } from '../../../types/admin/Stories/story_props.types';
import type { StoryContentItemFormData } from '../../../types/admin/Stories/story.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { Select } from '../../ui/Select/Select';
import type { SelectOption } from '../../ui/Select/Select'; // Исправленный импорт
import '../../../styles/admin/ui/Form.css';
import './StoryForm.css';

const contentTypeOptions: SelectOption[] = [
  { value: 'image', label: 'Изображение' },
  { value: 'video', label: 'Видео' },
];

export const StoryForm: React.FC<StoryFormProps> = ({
  storyToEdit,
  onSuccess,
  onCancel,
}) => {
  const {
    formData,
    isSubmitting,
    formError,
    handleChange,
    handlePreviewFileChange,
    handleRemovePreview,
    addContentItem,
    removeContentItem,
    handleContentItemChange,
    handleContentItemFileChange,
    handleSubmit,
  } = useStoryForm({ storyToEdit, onSuccess });

  return (
    <form onSubmit={handleSubmit} noValidate className="form-container story-form">
      {formError && <p className="form-error">Ошибка: {formError}</p>}
      
      <div className="form-grid">
        {/* --- ЛЕВАЯ КОЛОНКА: Основные настройки --- */}
        <div className="form-column">
          <div className="form-group">
            <label htmlFor="name">Название истории</label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled={isSubmitting} />
          </div>

          <div className="form-group">
            <label htmlFor="expires_at">Дата и время истечения</label>
            <Input id="expires_at" name="expires_at" type="datetime-local" value={formData.expires_at} onChange={handleChange} disabled={isSubmitting} />
          </div>

          <div className="form-group">
            <Checkbox
              id="is_active"
              name="is_active"
              label="История активна"
              checked={formData.is_active}
              onChange={(checked) => handleChange({ target: { name: 'is_active', value: checked, type: 'checkbox' } } as any)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <ImageUpload
              id="story_preview"
              name="preview_file"
              label="Превью истории"
              onChange={handlePreviewFileChange}
              previewUrl={formData.preview_local_url}
              disabled={isSubmitting || formData.remove_preview}
            />
          </div>

          {storyToEdit?.preview && (
            <div className="form-group">
              <Checkbox
                id="remove_preview"
                name="remove_preview"
                label="Удалить текущее превью"
                checked={formData.remove_preview}
                onChange={handleRemovePreview}
                disabled={isSubmitting}
              />
            </div>
          )}
        </div>

        {/* --- ПРАВАЯ КОЛОНКА: Слайды --- */}
        <div className="form-column">
          <h4>Слайды истории</h4>
          <div className="story-content-items-list">
            {formData.content_items.map((item, index) => (
              <ContentItemForm
                key={item.id}
                item={item}
                index={index}
                isSubmitting={isSubmitting}
                onRemove={() => removeContentItem(item.id)}
                onItemChange={handleContentItemChange}
                onFileChange={handleContentItemFileChange}
              />
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addContentItem} disabled={isSubmitting}>
            + Добавить слайд
          </Button>
        </div>
      </div>
      
      <div className="form-actions">
        <Button type="submit" disabled={isSubmitting} variant="success">
          {isSubmitting ? 'Сохранение...' : 'Сохранить историю'}
        </Button>
        <Button type="button" onClick={onCancel} disabled={isSubmitting} variant="outline">
          Отмена
        </Button>
      </div>
    </form>
  );
};

// --- Вложенный компонент для одного слайда ---
interface ContentItemFormProps {
  item: StoryContentItemFormData;
  index: number;
  isSubmitting: boolean;
  onRemove: () => void;
  onItemChange: (id: string, field: keyof StoryContentItemFormData, value: any) => void;
  onFileChange: (id: string, file: File | null) => void;
}

const ContentItemForm: React.FC<ContentItemFormProps> = ({
  item,
  index,
  isSubmitting,
  onRemove,
  onItemChange,
  onFileChange,
}) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(item.id, e.target.files?.[0] || null);
  };
  
  return (
    <div className="story-content-item">
      <div className="content-item-header">
        <h5>Слайд {index + 1}</h5>
        <Button type="button" variant="destructive" size="sm" onClick={onRemove} disabled={isSubmitting}>
          Удалить
        </Button>
      </div>
      <div className="form-group">
        <Select
          label="Тип контента"
          id={`type-${item.id}`}
          options={contentTypeOptions}
          value={item.type}
          onChange={(e) => onItemChange(item.id, 'type', e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className="form-group">
        <label htmlFor={`duration-${item.id}`}>Длительность (сек)</label>
        <Input
          id={`duration-${item.id}`}
          type="number"
          value={item.duration}
          onChange={(e) => onItemChange(item.id, 'duration', e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className="form-group">
        <ImageUpload
          id={`content_file-${item.id}`}
          name="content_file"
          label="Файл контента (картинка/видео)"
          onChange={handleFile}
          previewUrl={item.content_preview}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};