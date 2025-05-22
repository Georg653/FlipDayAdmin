// src/components/admin/RoutesManagement/RoutesManagement.tsx
import React from 'react';
import { RoutesHeader } from './RoutesHeader';
import { RoutesTable } from './RoutesTable';
import { RouteForm } from './RouteForm'; // Наша основная форма для маршрута
import { useRoutesManagement } from '../../../hooks/admin/Routes/useRoutesManagement';
import '../../../styles/admin/ui/PageLayout.css';

export const RoutesManagement: React.FC = () => {
  const {
    routes,
    loading,
    error,
    currentPage,
    itemsPerPage,
    handlePreviousPage,
    handleNextPage,
    canGoNext,
    canGoPrevious,
    filterCategoryId,
    handleCategoryFilterChange,
    routeCategories,
    loadingCategories,
    // filterSearch, // Если будут фильтры
    // handleSearchFilterChange, // Если будут фильтры
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    showForm,
    setShowForm,
    routeToEdit,
    getCategoryNameById,
  } = useRoutesManagement();

  return (
    <div className="page-container">
      <RoutesHeader
        isLoading={loading || loadingCategories} // Учитываем загрузку категорий для фильтра
        onShowForm={handleShowAddForm}
        filterCategoryId={filterCategoryId}
        onCategoryFilterChange={handleCategoryFilterChange}
        routeCategories={routeCategories}
        loadingRouteCategories={loadingCategories}
        // filterSearch={filterSearch}
        // onSearchFilterChange={handleSearchFilterChange}
      />

      {showForm && (
        <RouteForm
          setShowForm={setShowForm}
          routeToEdit={routeToEdit}
          onSuccess={handleFormSuccess}
        />
      )}

      <RoutesTable
        routes={routes}
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
        getCategoryName={getCategoryNameById}
      />
    </div>
  );
};