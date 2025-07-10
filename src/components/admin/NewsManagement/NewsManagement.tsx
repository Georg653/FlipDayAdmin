// --- Путь: src/components/admin/NewsManagement/NewsManagement.tsx ---

import React from 'react';
import { useNewsManagement } from '../../../hooks/admin/News/useNewsManagement';
import { NewsHeader } from './NewsHeader';
import { NewsTable } from './NewsTable';
import { NewsForm } from './NewsForm';
import { Modal } from '../../ui/Modal/Modal';
import '../../../styles/admin/ui/PageLayout.css';
import type { News } from '../../../types/admin/News/news.types';

export const NewsManagement: React.FC = () => {
  const {
    newsItems, loading, error, handleEdit, handleDelete, handleShowAddForm,
    handleFormSuccess, showForm, setShowForm, newsToEdit,
    // Пагинация
    currentPage, canGoNext, canGoPrevious, handleNextPage, handlePreviousPage,
    // Фильтр
    titleFilter, handleFilterChange,
  } = useNewsManagement();

  return (
    <div className="page-container">
      <NewsHeader
        isLoading={loading}
        onShowForm={handleShowAddForm}
        filterValue={titleFilter}
        onFilterChange={handleFilterChange}
      />

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={newsToEdit ? 'Редактировать новость' : 'Создать новую новость'}
        size="xl" // Используем самый большой размер модалки для конструктора
      >
        <NewsForm
          newsToEdit={newsToEdit}
          onSuccess={(newsItem: News) => {
            handleFormSuccess(newsItem);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <NewsTable
        newsItems={newsItems}
        isLoading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
      />
    </div>
  );
};