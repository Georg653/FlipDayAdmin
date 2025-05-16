// src/components/admin/AchievementsManagement/AchievementsManagement.tsx
import React from 'react';
import { AchievementsHeader } from './AchievementsHeader';
import { AchievementsTable } from './AchievementsTable';
import { AchievementForm } from './AchievementForm';
import { useAchievementsManagement } from '../../../hooks/admin/AchievementsManagement/useAchievementsManagement';
import '../../../styles/admin/ui/PageLayout.css';

export const AchievementsManagement: React.FC = () => {
  const {
    achievements,
    loading,
    error,
    currentPage,
    totalItems,
    itemsPerPage,
    handlePreviousPage,
    handleNextPage,
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    showForm,
    setShowForm,
    achievementToEdit,
  } = useAchievementsManagement();

  return (
    <div className="page-container">
      <AchievementsHeader
        isLoading={loading}
        onShowForm={handleShowAddForm}
      />

      {showForm && (
        <AchievementForm
          setShowForm={setShowForm}
          achievementToEdit={achievementToEdit}
          onSuccess={handleFormSuccess}
        />
      )}

      <AchievementsTable
        achievements={achievements || []} // <--- Гарантируем, что передается массив
        isLoading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
    </div>
  );
};