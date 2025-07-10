// --- Путь: src/components/admin/PointsManagement/PointsTable.tsx ---

import React from 'react';
import type { PointsTableProps } from '../../../types/admin/Points/point_props.types';
import { Button } from '../../ui/Button/Button';
import { createImageUrl } from '../../../utils/media';
import '../../../styles/admin/ui/Table.css';

export const PointsTable: React.FC<PointsTableProps> = ({
  points,
  isLoading,
  error,
  onEdit,
  onDelete,
}) => {
  
  if (isLoading) {
    return <div className="table-status-message">Загрузка точек...</div>;
  }

  if (error) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }

  if (!points.length) {
    return <div className="table-status-message">Точки не найдены. Создайте первую.</div>;
  }

  return (
    <div className="table-container">
      <div className="table-scroll-wrapper">
        <table className="table-main">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Изображение</th>
              <th className="table-header-cell">Название</th>
              <th className="table-header-cell">Координаты (Lat, Lng)</th>
              <th className="table-header-cell">Партнерская</th>
              <th className="table-header-cell">Бюджет</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => {
              const imageUrl = createImageUrl(point.image);
              return (
                <tr key={point.id} className="table-body-row">
                  <td className="table-body-cell">{point.id}</td>
                  <td className="table-body-cell">
                    {imageUrl ? (
                      <img src={imageUrl} alt={point.name} className="table-image-thumbnail" />
                    ) : (
                      <span className="table-no-image">Нет</span>
                    )}
                  </td>
                  <td className="table-body-cell">{point.name}</td>
                  <td className="table-body-cell">{`${point.latitude}, ${point.longitude}`}</td>
                  <td className="table-body-cell">{point.is_partner ? 'Да' : 'Нет'}</td>
                  <td className="table-body-cell">{point.budget}</td>
                  <td className="table-body-cell">
                    <div className="table-actions-container">
                      <Button variant="link" size="sm" onClick={() => onEdit(point)}>Ред.</Button>
                      <Button variant="link" size="sm" className="table-action-button-delete" onClick={() => onDelete(point.id)}>Удал.</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};