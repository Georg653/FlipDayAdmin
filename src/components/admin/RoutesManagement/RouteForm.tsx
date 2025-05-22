// src/components/admin/RoutesManagement/RouteForm.tsx
import React from 'react';
import type { RouteFormOptions, Route, RouteCategory } from '../../../types/admin/Routes/route.types'; // Убедимся, что RouteCategory импортируется
import { useRouteForm } from '../../../hooks/admin/Routes/useRouteForm';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { Select } from '../../ui/Select/Select';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { RoutePointsManager } from './RoutePointsManager'; // Компонент для управления точками
import '../../../styles/admin/ui/Form.css';
// import './RouteForm.css'; // Если нужны специфичные стили для этой формы

interface RouteFormPropsExtended extends RouteFormOptions {
  setShowForm: (show: boolean) => void;
}

export const RouteForm: React.FC<RouteFormPropsExtended> = ({
  onSuccess,
  routeToEdit,
  setShowForm,
}) => {
  const {
    formData,
    setFormData, // Может понадобиться для RoutePointsManager
    handleChange,
    handleCheckboxChange,
    handleFileChange,
    handleSubmit,
    isSubmitting,
    formError,
    resetForm,
    routeCategories,
    loadingRouteCategories,
    allAvailablePoints,
    loadingAvailablePoints,
    handleAddPointToRoute,
    handleRemovePointFromRoute,
    handleMovePointInRoute,
  } = useRouteForm({
    onSuccess: (data: Route) => {
      onSuccess?.(data);
      setShowForm(false);
      // resetForm(); // Вызывается в useEffect хука useRouteForm
    },
    routeToEdit
  });

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const categoryOptions = routeCategories.map(cat => ({ value: cat.id.toString(), label: cat.name }));
  // Можно добавить опцию "Выберите категорию" если нужно
  // if (!formData.route_category_id) { // или если создаем новый
  //   categoryOptions.unshift({ value: "", label: "Выберите категорию..."});
  // }

  return (
    <div className="form-container">
      <h3 className="form-title">
        {routeToEdit ? 'Редактировать Маршрут' : 'Создать Маршрут'}
      </h3>
      {formError && <p className="form-error">{formError}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-inputs-grid"> {/* Для двух колонок */}
          {/* Левая колонка: Основные данные маршрута */}
          <div className="form-column">
            <h4>Основные данные маршрута</h4>
            <div className="form-group">
              <label htmlFor="name_route">Название маршрута*</label>
              <Input id="name_route" name="name" value={formData.name} onChange={handleChange} disabled={isSubmitting} required />
            </div>

            <div className="form-group">
              <label htmlFor="description_route">Описание маршрута*</label>
              <Textarea id="description_route" name="description" value={formData.description} onChange={handleChange} disabled={isSubmitting} rows={3} required />
            </div>

            <div className="form-group">
              <Select
                id="route_category_id_route"
                name="route_category_id"
                label="Категория маршрута*"
                value={formData.route_category_id}
                onChange={handleChange}
                options={categoryOptions}
                disabled={isSubmitting || loadingRouteCategories}
                placeholder={loadingRouteCategories ? "Загрузка категорий..." : "Выберите категорию"}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="distance_route">Дистанция (число, например, в метрах)*</label>
              <Input id="distance_route" name="distance" type="number" step="any" value={formData.distance} onChange={handleChange} disabled={isSubmitting} required />
            </div>

            <div className="form-group">
              <label htmlFor="estimated_time_route">Примерное время (число, например, в минутах)*</label>
              <Input id="estimated_time_route" name="estimated_time" type="number" step="1" value={formData.estimated_time} onChange={handleChange} disabled={isSubmitting} required />
            </div>

            <div className="form-group">
              <label htmlFor="budget_route">Бюджет (число)*</label>
              <Input id="budget_route" name="budget" type="number" step="any" value={formData.budget} onChange={handleChange} disabled={isSubmitting} required />
            </div>
            
            {/* auto_generated нельзя редактировать, но можно отобразить если редактируем */}
            {routeToEdit && (
                 <div className="form-group form-group-checkbox">
                    <Checkbox id="auto_generated_route" name="auto_generated" checked={formData.auto_generated} onChange={() => {}} disabled={true} />
                    <label htmlFor="auto_generated_route" style={{ marginLeft: '0.5rem' }}>Автоматически сгенерирован (нельзя изменить)</label>
                </div>
            )}


            <div className="form-group">
              <ImageUpload
                id="image_file_route"
                name="image_file"
                onChange={handleFileChange}
                previewUrl={formData.image_file ? URL.createObjectURL(formData.image_file) : formData.existing_image_url}
                existingImageUrl={formData.existing_image_url}
                label="Превью-изображение маршрута"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Правая колонка: Управление точками маршрута */}
          <div className="form-column">
            <h4>Точки в маршруте*</h4>
            <RoutePointsManager
                selectedPoints={formData.selected_points}
                availablePoints={
                    allAvailablePoints.map(p => ({
                        ...p,
                        isSelected: !!formData.selected_points.find(sp => sp.id === p.id)
                    }))
                }
                loadingAvailablePoints={loadingAvailablePoints}
                onAddPoint={handleAddPointToRoute}
                onRemovePoint={handleRemovePointFromRoute}
                onMovePoint={handleMovePointInRoute}
            />
            {formData.selected_points.length === 0 && <p className="form-error" style={{marginTop: '0.5rem'}}>Маршрут должен содержать хотя бы одну точку.</p>}
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting} customVariant="save" variant="success">
            {isSubmitting ? (routeToEdit ? 'Сохранение...' : 'Создание...') : (routeToEdit ? 'Сохранить изменения' : 'Создать Маршрут')}
          </Button>
          <Button type="button" onClick={handleCancel} disabled={isSubmitting} customVariant="cancel" variant="outline">
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
};