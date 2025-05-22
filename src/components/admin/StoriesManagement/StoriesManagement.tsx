// src/components/admin/StoriesManagement/StoriesManagement.tsx
import React from 'react';
import { StoriesHeader } from './StoriesHeader';
import { StoriesTable } from './StoriesTable';
import { StoryForm } from './StoryForm';
import { useStoriesManagement } from '../../../hooks/admin/Stories/useStoriesManagement';
import { ITEMS_PER_PAGE_STORIES } from '../../../constants/admin/Stories/stories.constants';
import '../../../styles/admin/ui/PageLayout.css';

export const StoriesManagement: React.FC = () => {
  const {
    stories,
    loading,
    error,
    currentPage,
    handlePreviousPage,
    handleNextPage,
    canLoadMore,
    filterIsActive,
    handleIsActiveFilterChange,
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    showForm,
    setShowForm,
    storyToEdit,
  } = useStoriesManagement();

  // console.log('[StoriesManagement] State from hook:', {loading, error, storiesCount: stories.length});

  return (
    <div className="page-container">
      <StoriesHeader
        isLoading={loading} // Передаем loading для блокировки кнопки "Добавить"
        onShowForm={handleShowAddForm}
        filterIsActive={filterIsActive}
        onIsActiveFilterChange={handleIsActiveFilterChange}
      />

      {showForm && (
        <StoryForm
          setShowForm={setShowForm}
          storyToEdit={storyToEdit}
          onSuccess={handleFormSuccess}
        />
      )}

      <StoriesTable
        stories={stories}
        isLoading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        canLoadMore={canLoadMore}
        itemsPerPage={ITEMS_PER_PAGE_STORIES}
      />
    </div>
  );
};