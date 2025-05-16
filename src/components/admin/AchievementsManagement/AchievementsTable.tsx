// src/components/admin/AchievementsManagement/AchievementsTable.tsx
import React from 'react';
import type { Achievement } from '../../../types/admin/Achievements/achievement.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import '../../../styles/admin/ui/Table.css';

interface AchievementsTableProps {
  achievements: Achievement[]; // Теперь здесь должен быть массив благодаря achievements || [] из родителя
  isLoading: boolean;
  error: string | null;
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}

export const AchievementsTable: React.FC<AchievementsTableProps> = ({
  achievements,
  isLoading,
  error,
  onEdit,
  onDelete,
  currentPage,
  totalItems,
  itemsPerPage,
  handlePreviousPage,
  handleNextPage,
}) => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Проверяем, что achievements это массив перед использованием .length
  if (isLoading && (!Array.isArray(achievements) || achievements.length === 0)) {
    return <div className="table-status-message table-status-loading">Loading achievements...</div>;
  }

  if (error) {
    return <div className="table-status-message table-status-error">Error: {error}</div>;
  }

  if (!isLoading && (!Array.isArray(achievements) || achievements.length === 0)) {
    return <div className="table-status-message table-status-empty">No achievements found.</div>;
  }

  // Если мы здесь, achievements - это массив (может быть пустым, если !isLoading)
  return (
    <div className="table-container">
      <div className="table-scroll-wrapper">
        <table className="table-main">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Image</th>
              <th className="table-header-cell">Name</th>
              <th className="table-header-cell">Type</th>
              <th className="table-header-cell">Criteria</th>
              <th className="table-header-cell">Description</th>
              <th className="table-header-cell">Updated At</th>
              <th className="table-header-cell table-header-cell-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* achievements точно массив здесь */}
            {achievements.map((ach) => (
              <tr key={ach.id} className="table-body-row">
                <td className="table-body-cell">{ach.id}</td>
                <td className="table-body-cell">
                  {ach.image ? (
                    <img src={ach.image} alt={ach.name} className="table-image-thumbnail" />
                  ) : (
                    <span className="table-no-image">No img</span>
                  )}
                </td>
                <td className="table-body-cell">{ach.name}</td>
                <td className="table-body-cell">{ach.achievement_type}</td>
                <td className="table-body-cell">{`${ach.criteria_value} ${ach.criteria_unit}`}</td>
                <td className="table-body-cell table-cell-description">
                  {ach.description && ach.description.length > 50
                    ? `${ach.description.substring(0, 50)}...`
                    : ach.description || '—'}
                </td>
                <td className="table-body-cell">{formatDate(ach.updated_at)}</td>
                <td className="table-body-cell">
                  <div className="table-actions-container">
                    <Button
                      variant="link"
                      className="table-action-button-edit"
                      onClick={() => onEdit(ach)}
                      disabled={isLoading}
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      className="table-action-button-delete"
                      onClick={() => onDelete(ach.id)}
                      disabled={isLoading}
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="table-pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};