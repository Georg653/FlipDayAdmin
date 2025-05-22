// src/components/admin/PointsManagement/PointsTable.tsx
import React from 'react';
import type { Point } from '../../../types/admin/Points/point.types';
import { Button } from '../../ui/Button/Button';
// Pagination компонент не будем использовать напрямую, если canGoNext/canGoPrevious
import '../../../styles/admin/ui/Table.css';

interface PointsTableProps {
  points: Point[];
  isLoading: boolean;
  error: string | null;
  onEdit: (point: Point) => void;
  onDelete: (id: number) => void;
  currentPage: number; // Для информации, если понадобится
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const PointsTable: React.FC<PointsTableProps> = ({
  points,
  isLoading,
  error,
  onEdit,
  onDelete,
  currentPage,
  handlePreviousPage,
  handleNextPage,
  canGoNext,
  canGoPrevious,
}) => {

  if (isLoading && points.length === 0) {
    return <div className="table-status-message table-status-loading">Загрузка точек...</div>;
  }

  if (error) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }

  if (!isLoading && points.length === 0) {
    return <div className="table-status-message table-status-empty">Точки не найдены.</div>;
  }

  return (
    <div className="table-container">
      <div className="table-scroll-wrapper">
        <table className="table-main">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Превью</th>
              <th className="table-header-cell">Название</th>
              <th className="table-header-cell">Описание</th>
              <th className="table-header-cell">Координаты</th>
              <th className="table-header-cell">Партнер</th>
              <th className="table-header-cell">Бюджет</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.id} className="table-body-row">
                <td className="table-body-cell">{point.id}</td>
                <td className="table-body-cell">
                  {point.image ? (
                    <img src={point.image} alt={point.name} className="table-image-thumbnail" />
                  ) : (
                    <span className="table-no-image">Нет изобр.</span>
                  )}
                </td>
                <td className="table-body-cell">{point.name}</td>
                <td className="table-body-cell table-cell-description">
                  {point.description && point.description.length > 50
                    ? `${point.description.substring(0, 50)}...`
                    : point.description || '—'}
                </td>
                <td className="table-body-cell">{`${point.latitude.toFixed(4)}, ${point.longitude.toFixed(4)}`}</td>
                <td className="table-body-cell">{point.is_partner ? 'Да' : 'Нет'}</td>
                <td className="table-body-cell">{point.budget}</td>
                <td className="table-body-cell">
                  <div className="table-actions-container">
                    <Button
                      variant="link"
                      className="table-action-button-edit"
                      onClick={() => onEdit(point)}
                      disabled={isLoading}
                      size="sm"
                      title="Редактировать точку"
                    >
                      Ред.
                    </Button>
                    <Button
                      variant="link"
                      className="table-action-button-delete"
                      onClick={() => onDelete(point.id)}
                      disabled={isLoading}
                      size="sm"
                      title="Удалить точку"
                    >
                      Удал.
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(canGoPrevious || canGoNext) && (
         <div className="table-pagination-wrapper">
            <div className="pagination-container" style={{ justifyContent: 'flex-end' }}>
              <div className="pagination-buttons">
                <Button
                  onClick={handlePreviousPage}
                  disabled={!canGoPrevious || isLoading}
                  variant="outline"
                  size="sm"
                >
                  Назад
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={!canGoNext || isLoading}
                  variant="outline"
                  size="sm"
                >
                  Вперед
                </Button>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};