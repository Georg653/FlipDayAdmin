// src/components/admin/RouteCategoriesManagement/RouteCategoriesManagement.tsx
import React from 'react';
import { RouteCategoriesHeader } from './RouteCategoriesHeader';
import { RouteCategoriesTable } from './RouteCategoriesTable';
import { RouteCategoryForm } from './RouteCategoryForm';
import { useRouteCategoriesManagement } from '../../../hooks/admin/RouteCategories/useRouteCategoriesManagement';
import '../../../styles/admin/ui/PageLayout.css';

export const RouteCategoriesManagement: React.FC = () => {
  const {
    categories,
    loading,
    error,
    currentPage,
    handlePreviousPage,
    handleNextPage,
    canGoNext,
    canGoPrevious,
    // filterSearch, // Если будут фильтры
    // handleSearchFilterChange, // Если будут фильтры
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    showForm,
    setShowForm,
    categoryToEdit,
  } = useRouteCategoriesManagement();

  return (
    <div className="page-container">
      <RouteCategoriesHeader
        isLoading={loading}
        onShowForm={handleShowAddForm}
        // filterSearch={filterSearch} // Передаем состояние фильтра
        // onSearchFilterChange={handleSearchFilterChange} // Передаем обработчик фильтра
      />

      {showForm && (
        <RouteCategoryForm
          setShowForm={setShowForm}
          categoryToEdit={categoryToEdit}
          onSuccess={handleFormSuccess}
        />
      )}

      <RouteCategoriesTable
        categories={categories}
        isLoading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
      />
    </div>
  );
};