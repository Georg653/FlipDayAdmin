// --- Путь: src/components/admin/StoriesManagement/StoriesManagement.tsx ---

import React from 'react';
import { useStoriesManagement } from '../../../hooks/admin/Stories/useStoriesManagement';
import { StoriesHeader } from './StoriesHeader';
import { StoriesTable } from './StoriesTable';
import { StoryForm } from './StoryForm';
import { Modal } from '../../ui/Modal/Modal';
import '../../../styles/admin/ui/PageLayout.css';

export const StoriesManagement: React.FC = () => {
  const {
    stories,
    loading,
    error,
    handleEdit,
    handleDelete,
    handleShowAddForm,
    handleFormSuccess,
    showForm,
    setShowForm,
    storyToEdit,
    currentPage,
    canGoNext,
    canGoPrevious,
    handleNextPage,
    handlePreviousPage,
    activeFilter,
    handleFilterChange,
    handleToggleStatus, // <--- ПОЛУЧАЕМ
  } = useStoriesManagement();

  return (
    <div className="page-container">
      <StoriesHeader
        isLoading={loading}
        onShowForm={handleShowAddForm}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={storyToEdit ? 'Редактировать историю' : 'Создать новую историю'}
        size="xl"
      >
        <StoryForm
          storyToEdit={storyToEdit}
          onSuccess={(story) => {
            handleFormSuccess(story); 
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <StoriesTable
        stories={stories}
        isLoading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus} // <--- ПЕРЕДАЕМ
        currentPage={currentPage}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
      />
    </div>
  );
};