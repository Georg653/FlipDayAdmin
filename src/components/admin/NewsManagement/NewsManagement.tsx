// src/components/admin/NewsManagement/NewsManagement.tsx
import React from 'react';
import { NewsHeader } from './NewsHeader';
import { NewsTable } from './NewsTable';
import { NewsForm } from './NewsForm';
import { useNewsManagement } from '../../../hooks/admin/News/useNewsManagement';
import '../../../styles/admin/ui/PageLayout.css';

export const NewsManagement: React.FC = () => {
  const {
    newsItems,
    loading,
    error,
    currentPage,
    itemsPerPage,
    handlePreviousPage,
    handleNextPage,
    canGoNext,
    canGoPrevious,
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    showForm,
    setShowForm,
    newsItemToEdit,
  } = useNewsManagement();

  return (
    <div className="page-container">
      <NewsHeader
        isLoading={loading}
        onShowForm={handleShowAddForm}
      />

      {showForm && (
        <NewsForm
          setShowForm={setShowForm}
          newsItemToEdit={newsItemToEdit}
          onSuccess={handleFormSuccess}
        />
      )}

      <NewsTable
        newsItems={newsItems}
        isLoading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
      />
    </div>
  );
};