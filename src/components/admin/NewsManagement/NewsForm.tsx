// src/components/admin/NewsManagement/NewsForm.tsx
import React from 'react';
import type { NewsFormOptions, NewsItem } from '../../../types/admin/News/news.types';
import { useNewsForm } from '../../../hooks/admin/News/useNewsForm';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { Modal } from '../../ui/Modal/Modal';
import { ContentBlockForm } from './ContentBlockForm';
import { ContentBlockList } from './ContentBlockList';
import '../../../styles/admin/ui/Form.css';

interface NewsFormPropsExtended extends NewsFormOptions {
  setShowForm: (show: boolean) => void;
}

export const NewsForm: React.FC<NewsFormPropsExtended> = ({
  onSuccess,
  newsItemToEdit,
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
    isBlockModalOpen,
    editingBlock,
    editingBlockIndex, // <--- ИСПРАВЛЕНО: Добавлен сюда
    handleAddBlock,
    handleEditBlock,
    handleDeleteBlock,
    handleSaveBlock,
    handleCloseBlockModal,
    moveBlock,
  } = useNewsForm({
    onSuccess: (data: NewsItem) => {
      onSuccess?.(data);
      setShowForm(false);
      resetForm();
    },
    newsItemToEdit
  });

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <>
      <div className="form-container">
        <h3 className="form-title">
          {newsItemToEdit ? 'Редактировать Новость' : 'Создать Новость'}
        </h3>
        {formError && <p className="form-error">{formError}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-inputs">
            <div className="form-group">
              <label htmlFor="title_news">Заголовок*</label>
              <Input id="title_news" name="title" value={formData.title} onChange={handleChange} disabled={isSubmitting} placeholder="Введите заголовок новости" required />
            </div>

            <div className="form-group">
              <label htmlFor="description_news">Краткое описание*</label>
              <Textarea id="description_news" name="description" value={formData.description} onChange={handleChange} disabled={isSubmitting} placeholder="Введите краткое описание" rows={3} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="preview_url_manual_news">URL превью (если не загружаете файл)</label>
              <Input id="preview_url_manual_news" name="preview_url_manual" type="url" value={formData.preview_url_manual} onChange={handleChange} disabled={isSubmitting || !!formData.preview_file} placeholder="https://example.com/image.jpg" />
            </div>

            <div className="form-group">
              <ImageUpload id="preview_file_news" name="preview_file" onChange={handleFileChange} previewUrl={formData.preview_file ? URL.createObjectURL(formData.preview_file) : formData.existing_preview_url} existingImageUrl={formData.existing_preview_url} label="Превью-изображение (файл)" disabled={isSubmitting || !!formData.preview_url_manual.trim()} />
              {formData.preview_file && (<small>Выбран файл: {formData.preview_file.name}</small>)}
            </div>

            <div className="form-group">
              <label>Контент страницы</label>
              <ContentBlockList
                blocks={formData.content}
                onEditBlock={handleEditBlock}
                onDeleteBlock={handleDeleteBlock}
                onMoveBlock={moveBlock}
              />
              <Button type="button" onClick={handleAddBlock} size="sm" variant='outline' style={{ marginTop: '1rem' }}>
                Добавить блок контента
              </Button>
            </div>
          </div>

          <div className="form-actions">
            <Button type="submit" disabled={isSubmitting} customVariant="save" variant="success">
              {isSubmitting ? (newsItemToEdit ? 'Сохранение...' : 'Создание...') : (newsItemToEdit ? 'Сохранить изменения' : 'Создать Новость')}
            </Button>
            <Button type="button" onClick={handleCancel} disabled={isSubmitting} customVariant="cancel" variant="outline">
              Отмена
            </Button>
          </div>
        </form>
      </div>

      {isBlockModalOpen && (
        <Modal
          isOpen={isBlockModalOpen}
          onClose={handleCloseBlockModal}
          title={editingBlock && editingBlockIndex !== null ? 'Редактировать блок' : 'Добавить новый блок'}
          size="lg"
        >
          <ContentBlockForm
            initialBlock={editingBlock}
            onSave={handleSaveBlock}
            onCancel={handleCloseBlockModal}
          />
        </Modal>
      )}
    </>
  );
};