// src/components/admin/AchievementsManagement/AchievementForm.tsx
import React from 'react';
import { useAchievementForm } from '../../../hooks/admin/AchievementsManagement/useAchievementForm';
import type { AchievementFormOptions, Achievement } from '../../../types/admin/Achievements/achievement.types'; // Убедись, что Achievement импортируется, если onSuccess его ожидает
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { Select } from '../../ui/Select/Select'; // Наш простой нативный селект
import { ACHIEVEMENT_TYPE_OPTIONS } from '../../../constants/admin/Achievements/achievements.constants';
import '../../../styles/admin/ui/Form.css';

interface AchievementFormPropsExtended extends AchievementFormOptions {
  setShowForm: (show: boolean) => void;
}

export const AchievementForm: React.FC<AchievementFormPropsExtended> = ({
  onSuccess,
  achievementToEdit,
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
  } = useAchievementForm({
    onSuccess: (data: Achievement) => { // Явно типизировал data
      onSuccess?.(data);
      setShowForm(false);
      resetForm();
    },
    achievementToEdit
  });

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="form-container">
      <h3 className="form-title">
        {achievementToEdit ? 'Редактировать Достижение' : 'Создать Достижение'}
      </h3>
      {formError && <p className="form-error">{formError}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-inputs">
          {/* Название */}
          <div className="form-group">
            <label htmlFor="name_achievement">Название*</label>
            <Input
              id="name_achievement"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Введите название"
              required
            />
          </div>

          {/* Описание */}
          <div className="form-group">
            <label htmlFor="description_achievement">Описание</label>
            <Textarea
              id="description_achievement"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Введите описание достижения"
              rows={3}
            />
          </div>

          {/* Тип Достижения */}
          <div className="form-group">
            {/* Лейбл для селекта будет внутри компонента Select, если он так сделан.
                Если компонент Select не имеет своего лейбла, раскомментируй этот. */}
            {/* <label htmlFor="achievement_type_achievement">Тип достижения*</label> */}
            <Select
              id="achievement_type_achievement"
              name="achievement_type"
              label="Тип достижения*" // Передаем лейбл в компонент Select
              value={formData.achievement_type}
              onChange={handleChange}
              options={ACHIEVEMENT_TYPE_OPTIONS}
              placeholder="Выберите тип" // Этот плейсхолдер для первой disabled опции
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Значение Критерия */}
          <div className="form-group">
            <label htmlFor="criteria_value_achievement">Значение критерия*</label>
            <Input
              id="criteria_value_achievement"
              name="criteria_value"
              type="number"
              value={formData.criteria_value}
              onChange={handleChange}
              placeholder="Например: 10, 50, 100"
              disabled={isSubmitting}
              required
              step="any" // Для возможности ввода дробных чисел, если нужно
            />
          </div>

          {/* Единица измерения критерия */}
          <div className="form-group">
            <label htmlFor="criteria_unit_achievement">Единица измерения*</label>
            <Input
              id="criteria_unit_achievement"
              name="criteria_unit"
              value={formData.criteria_unit}
              onChange={handleChange}
              placeholder="Например: км, очки, темы"
              disabled={isSubmitting}
              required
            />
            {/* Если для criteria_unit тоже будет Select, его нужно будет добавить сюда */}
            {/* Например, если опции зависят от achievement_type:
            <Select
              id="criteria_unit_achievement"
              name="criteria_unit"
              label="Единица измерения*"
              value={formData.criteria_unit}
              onChange={handleChange}
              options={dynamicCriteriaUnitOptions} // эти опции нужно будет формировать
              placeholder="Выберите единицу"
              disabled={isSubmitting || !formData.achievement_type}
              required
            /> */}
          </div>

          {/* Загрузка изображения */}
          <div className="form-group">
            {/* Лейбл для ImageUpload будет внутри компонента, если он так сделан */}
            <ImageUpload
              id="image_file_achievement"
              name="image_file" // Атрибут name для input type="file"
              onChange={handleFileChange}
              previewUrl={formData.image_preview_url}
              existingImageUrl={formData.existing_image_url}
              label="Изображение достижения (опционально)"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting} customVariant="save" variant="success"> {/* Добавил variant="success" */}
            {isSubmitting
              ? achievementToEdit ? 'Сохранение...' : 'Создание...'
              : achievementToEdit ? 'Сохранить изменения' : 'Создать'}
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