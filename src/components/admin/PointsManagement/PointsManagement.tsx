// --- Путь: src/components/admin/PointsManagement/PointsManagement.tsx ---

import React from 'react';
import { usePointsManagement } from '../../../hooks/admin/Points/usePointsManagement';
import { PointsHeader } from './PointsHeader';
import { PointsTable } from './PointsTable';
import { PointForm } from './PointForm';
import { Modal } from '../../ui/Modal/Modal';
import '../../../styles/admin/ui/PageLayout.css';

export const PointsManagement: React.FC = () => {
  const {
    points,
    loading,
    error,
    handleEdit,
    handleDelete,
    handleShowAddForm,
    handleFormSuccess,
    showForm,
    setShowForm,
    pointToEdit,
  } = usePointsManagement();

  return (
    <div className="page-container">
      <PointsHeader
        isLoading={loading}
        onShowForm={handleShowAddForm}
      />

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={pointToEdit ? 'Редактировать точку' : 'Создать новую точку'}
        size="xl" // Используем большой размер, т.к. может быть конструктор контента
      >
        <PointForm
          pointToEdit={pointToEdit}
          onSuccess={() => {
            handleFormSuccess();
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <PointsTable
        points={points}
        isLoading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};