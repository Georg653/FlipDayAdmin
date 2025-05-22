// src/components/admin/PointsManagement/PointsManagement.tsx
import React from 'react';
import { PointsHeader } from './PointsHeader';
import { PointsTable } from './PointsTable';
import { PointForm } from './PointForm';
import { usePointsManagement } from '../../../hooks/admin/Points/usePointsManagement';
import '../../../styles/admin/ui/PageLayout.css';

export const PointsManagement: React.FC = () => {
  const {
    points,
    loading, // Глобальный лоадинг для списка
    error,
    currentPage,
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
    pointToEdit,
    pointContentToEdit, // Контент для редактирования
    loadingContent,     // Индикатор загрузки контента для формы
  } = usePointsManagement();

  // Определяем, показывать ли индикатор загрузки для формы
  // (только если редактируем, форма открыта И контент еще грузится)
  const showFormLoadingIndicator = pointToEdit && showForm && loadingContent;

  return (
    <div className="page-container">
      <PointsHeader
        isLoading={loading} // Блокируем кнопку "Добавить", пока грузится основной список
        onShowForm={handleShowAddForm}
      />

      {showForm && (
        showFormLoadingIndicator ? (
          <div className="form-container" style={{textAlign: 'center', padding: '2rem', border: '1px dashed #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9'}}>
            <p style={{fontSize: '1rem', color: '#555'}}>Загрузка данных точки для редактирования...</p>
            {/* Можно добавить простой CSS-спиннер, если очень хочется, но и текст подойдет */}
          </div>
        ) : (
          <PointForm
            setShowForm={setShowForm}
            pointToEdit={pointToEdit ? { ...pointToEdit, contentData: pointContentToEdit } : undefined}
            onSuccess={handleFormSuccess}
          />
        )
      )}

      <PointsTable
        points={points}
        isLoading={loading} // Этот лоадинг для таблицы (пока грузится список)
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