// src/components/admin/RouteCategoriesManagement/RouteCategoryForm.tsx
import React from 'react';
import type { RouteCategoryFormOptions, RouteCategory } from '../../../types/admin/RouteCategories/routeCategory.types'; // Убедись, что RouteCategory импортируется
import { useRouteCategoryForm } from '../../../hooks/admin/RouteCategories/useRouteCategoryForm';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import '../../../styles/admin/ui/Form.css';

interface RouteCategoryFormPropsExtended extends RouteCategoryFormOptions {
  setShowForm: (show: boolean) => void;
}

export const RouteCategoryForm: React.FC<RouteCategoryFormPropsExtended> = ({
  onSuccess,
  categoryToEdit,
  setShowForm,
}) => {
  const {
    formData,
    handleChange,
    handleFileChange,
    handleSubmit,
    isSubmitting,
    formError,
    resetForm,
  } = useRouteCategoryForm({
    onSuccess: (data: RouteCategory) => {
      onSuccess?.(data);
      setShowForm(false);
      resetForm();
    },
    categoryToEdit
  });

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="form-container">
      <h3 className="form-title">
        {categoryToEdit ? 'Редактировать Категорию Маршрута' : 'Создать Категорию Маршрута'}
      </h3>
      {formError && <p className="form-error">{formError}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-inputs">
          {/* Название */}
          <div className="form-group">
            <label htmlFor="name_route_category">Название*</label>
            <Input
              id="name_route_category"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Введите название категории"
              required
            />
          </div>

          {/* Описание */}
          <div className="form-group">
            <label htmlFor="description_route_category">Описание</label>
            <Textarea
              id="description_route_category"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Введите описание категории"
              rows={3}
            />
          </div>

          {/* Загрузка изображения */}
          <div className="form-group">
            <ImageUpload
              id="image_file_route_category"
              name="image_file"
              onChange={handleFileChange}
              previewUrl={formData.image_preview_url}
              existingImageUrl={formData.existing_image_url}
              label="Изображение категории (опционально)"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting} customVariant="save" variant="success">
            {isSubmitting
              ? categoryToEdit ? 'Сохранение...' : 'Создание...'
              : categoryToEdit ? 'Сохранить изменения' : 'Создать'}
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