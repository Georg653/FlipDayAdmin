// src/components/admin/LearningSubtopicsManagement/LearningSubtopicsTable.tsx
import React from 'react';
import type { LearningSubtopicsTableProps } from '../../../types/admin/LearningSubtopics/learningSubtopic_props.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import '../../../styles/admin/ui/Table.css';

export const LearningSubtopicsTable: React.FC<LearningSubtopicsTableProps> = ({
  learningSubtopics,
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
  // Сначала проверяем на ошибку, так как она может быть важнее, чем isLoading или пустой массив
  if (error) {
    return <div className="table-status-message table-status-error">Ошибка: {typeof error === 'string' ? error : JSON.stringify(error)}</div>;
  }

  if (isLoading && (!Array.isArray(learningSubtopics) || learningSubtopics.length === 0)) {
    return <div className="table-status-message table-status-loading">Загрузка подтем...</div>;
  }

  if (!isLoading && (!Array.isArray(learningSubtopics) || learningSubtopics.length === 0)) {
    return <div className="table-status-message table-status-empty">Подтемы не найдены для выбранной темы или темы не загружены.</div>;
  }

  return (
    <div className="table-container">
      <div className="table-scroll-wrapper">
        <table className="table-main">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Изобр.</th>
              <th className="table-header-cell">Название</th>
              <th className="table-header-cell">Описание</th>
              <th className="table-header-cell">Опыт</th>
              <th className="table-header-cell">Порядок</th>
              <th className="table-header-cell">ID Темы</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {learningSubtopics.map((subtopic) => (
              <tr key={subtopic.id} className="table-body-row">
                <td className="table-body-cell">{subtopic.id}</td>
                <td className="table-body-cell">
                  {subtopic.image ? (
                    <img src={subtopic.image} alt={subtopic.name} className="table-image-thumbnail" />
                  ) : (
                    <span className="table-no-image">Нет</span>
                  )}
                </td>
                <td className="table-body-cell">{subtopic.name}</td>
                <td className="table-body-cell table-cell-description">
                  {(subtopic.description && subtopic.description.length > 50)
                    ? `${subtopic.description.substring(0, 50)}...`
                    : subtopic.description || '—'}
                </td>
                <td className="table-body-cell">{subtopic.experience_points}</td>
                <td className="table-body-cell">{subtopic.order}</td>
                <td className="table-body-cell">{subtopic.topic_id}</td>
                <td className="table-body-cell">
                  <div className="table-actions-container">
                    <Button
                      variant="link"
                      onClick={() => onEdit(subtopic)}
                      disabled={isLoading}
                      size="sm"
                    >
                      Ред.
                    </Button>
                    <Button
                      variant="link"
                      className="table-action-button-delete"
                      onClick={() => onDelete(subtopic.id)}
                      disabled={isLoading}
                      size="sm"
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

      {totalItems > 0 && Array.isArray(learningSubtopics) && learningSubtopics.length > 0 && (
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