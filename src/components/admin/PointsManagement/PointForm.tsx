// src/components/admin/PointsManagement/PointForm.tsx
import React from 'react';
import type { PointFormOptions, Point, PointContentResponse } from '../../../types/admin/Points/point.types'; // Убедимся, что все нужные типы импортированы
import { usePointForm } from '../../../hooks/admin/Points/usePointForm';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { Checkbox } from '../../ui/Checkbox/Checkbox'; // Твой компонент Checkbox
import { ContentBlockFormModal } from './ContentBlockFormModal';
import '../../../styles/admin/ui/Form.css';

interface PointFormPropsExtended extends PointFormOptions {
  setShowForm: (show: boolean) => void;
}

export const PointForm: React.FC<PointFormPropsExtended> = ({
  onSuccess,
  pointToEdit,
  setShowForm,
}) => {
  const {
    formData,
    // setFormData, // Не используется напрямую здесь, если вся логика в хуке
    handleChange,
    handleCheckboxChange, // Теперь с новой сигнатурой (name, checked)
    handleFileChange,
    handleSubmit,
    isSubmitting,
    formError,
    resetForm,
    isBlockModalOpen,
    editingBlock,
    handleAddBlock,
    handleEditBlock,
    handleDeleteBlock,
    handleSaveBlock,
    handleCloseBlockModal,
    moveBlock,
  } = usePointForm({
    onSuccess: (data: Point) => {
      onSuccess?.(data);
      setShowForm(false);
      // resetForm(); // resetForm вызывается в usePointForm useEffect при смене pointToEdit на null или при инициализации
    },
    pointToEdit
  });

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <>
      <div className="form-container">
        <h3 className="form-title">
          {pointToEdit ? 'Редактировать Точку' : 'Создать Точку'}
        </h3>
        {formError && <p className="form-error">{formError}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-inputs-grid">
            <div className="form-column">
              <h4>Основные данные</h4>
              <div className="form-group">
                <label htmlFor="name_point">Название*</label>
                <Input id="name_point" name="name" value={formData.name} onChange={handleChange} disabled={isSubmitting} required />
              </div>

              <div className="form-group">
                <label htmlFor="description_point">Описание*</label>
                <Textarea id="description_point" name="description" value={formData.description} onChange={handleChange} disabled={isSubmitting} rows={3} required />
              </div>

              <div className="form-group">
                <label htmlFor="latitude_point">Широта*</label>
                <Input id="latitude_point" name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} disabled={isSubmitting} required />
              </div>

              <div className="form-group">
                <label htmlFor="longitude_point">Долгота*</label>
                <Input id="longitude_point" name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} disabled={isSubmitting} required />
              </div>
              
              <div className="form-group">
                <label htmlFor="budget_point">Бюджет (число)</label>
                <Input id="budget_point" name="budget" type="number" step="any" value={formData.budget} onChange={handleChange} disabled={isSubmitting} />
              </div>

              <div className="form-group form-group-checkbox">
                <Checkbox 
                  id="is_partner_point"
                  checked={formData.is_partner} 
                  onChange={(newCheckedState) => handleCheckboxChange('is_partner', newCheckedState)} // <<<--- ИСПРАВЛЕННЫЙ ВЫЗОВ
                  disabled={isSubmitting}
                  // label="Партнерская точка?" // Используй этот пропс, если твой Checkbox его отображает
                />
                {/* Если твой Checkbox не отображает label, используй этот внешний label: */}
                <label htmlFor="is_partner_point" style={{ marginLeft: '0.5rem' }}>Партнерская точка?</label>
              </div>

              <div className="form-group">
                <ImageUpload
                  id="image_file_point"
                  name="image_file"
                  onChange={handleFileChange}
                  previewUrl={formData.image_file ? URL.createObjectURL(formData.image_file) : formData.existing_image_url}
                  existingImageUrl={formData.existing_image_url}
                  label="Превью-изображение точки"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-column">
              <h4>Контент страницы точки</h4>
              <div className="form-group">
                <label htmlFor="point_content_background">URL фона для контента (опционально)</label>
                <Input id="point_content_background" name="point_content_background" value={formData.point_content_background} onChange={handleChange} disabled={isSubmitting} placeholder="https://example.com/background.jpg"/>
              </div>

              <div className="form-group">
                <label>Блоки контента:</label>
                {formData.point_content_blocks.length === 0 && <p style={{fontSize: '0.9em', color: '#666'}}>Пока нет блоков контента.</p>}
                <ul className="content-blocks-list">
                  {formData.point_content_blocks.map((block, index) => (
                    <li key={block.__id || `block-${index}`} className="content-block-item"> {/* Добавил fallback для key */}
                      <span className="content-block-type">Тип: {block.type}</span>
                      <div className="content-block-preview">
                        {block.type === 'heading' && <h4>{block.content?.substring(0,30)}... (Ур. {block.level})</h4>}
                        {block.type === 'text' && <p>{block.content?.substring(0, 50)}...</p>}
                        {block.type === 'image' && block.src && <img src={block.src as string} alt="preview" style={{width: '50px', height: 'auto', objectFit: 'cover'}}/>}
                        {(block.type === 'album' || block.type === 'slider') && block.src && Array.isArray(block.src) && block.src.length > 0 &&
                         <img src={block.src[0]} alt="preview" style={{width: '50px', height: 'auto', objectFit: 'cover'}}/>
                        }
                        {block.type === 'video' && <span>Видео: {block.text || (block.src as string)?.substring(0,30)}...</span>}
                        {block.type === 'audio' && <span>Аудио: {block.text || (block.src as string)?.substring(0,30)}...</span>}
                        {block.type === 'test' && <span>Тест: {block.question?.substring(0,30)}...</span>}
                      </div>
                      <div className="content-block-actions">
                        <Button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0} size="sm" variant="outline" title="Переместить вверх">↑</Button>
                        <Button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === formData.point_content_blocks.length - 1} size="sm" variant="outline" title="Переместить вниз">↓</Button>
                        <Button type="button" onClick={() => handleEditBlock(index)} size="sm" variant="outline" title="Редактировать блок">Ред.</Button>
                        <Button type="button" onClick={() => handleDeleteBlock(index)} size="sm" variant="destructive" title="Удалить блок">Удал.</Button>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button type="button" onClick={handleAddBlock} variant="outline" style={{marginTop: '1rem'}}>
                  Добавить блок контента
                </Button>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Button type="submit" disabled={isSubmitting} customVariant="save" variant="success">
              {isSubmitting ? (pointToEdit ? 'Сохранение...' : 'Создание...') : (pointToEdit ? 'Сохранить изменения' : 'Создать Точку')}
            </Button>
            <Button type="button" onClick={handleCancel} disabled={isSubmitting} customVariant="cancel" variant="outline">
              Отмена
            </Button>
          </div>
        </form>
      </div>

      <ContentBlockFormModal
        isOpen={isBlockModalOpen}
        onClose={handleCloseBlockModal}
        onSave={handleSaveBlock}
        initialBlockData={editingBlock}
      />
    </>
  );
};