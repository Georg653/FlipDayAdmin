// src/components/admin/LearningTopicsManagement/LearningTopicsTable.tsx
import React from 'react';
import type { LearningTopicsTableProps } from '../../../types/admin/LearningTopics/learningTopic_props.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import '../../../styles/admin/ui/Table.css';

export const LearningTopicsTable: React.FC<LearningTopicsTableProps> = ({
  learningTopics,
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
  if (isLoading && (!Array.isArray(learningTopics) || learningTopics.length === 0)) {
    return <div className="table-status-message table-status-loading">Загрузка тем...</div>;
  }
  if (error) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }
  if (!isLoading && (!Array.isArray(learningTopics) || learningTopics.length === 0)) {
    return <div className="table-status-message table-status-empty">Темы обучения не найдены.</div>;
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
              {/* <th className="table-header-cell">Прогресс</th>  Если захотим показывать completion_percentage */}
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {learningTopics.map((topic) => (
              <tr key={topic.id} className="table-body-row">
                <td className="table-body-cell">{topic.id}</td>
                <td className="table-body-cell">
                  {topic.image ? (
                    <img src={topic.image} alt={topic.name} className="table-image-thumbnail" />
                  ) : ( <span className="table-no-image">Нет</span> )}
                </td>
                <td className="table-body-cell">{topic.name}</td>
                <td className="table-body-cell table-cell-description">
                  {(topic.description && topic.description.length > 50)
                    ? `${topic.description.substring(0, 50)}...`
                    : topic.description || '—'}
                </td>
                <td className="table-body-cell">{topic.experience_points}</td>
                <td className="table-body-cell">{topic.order}</td>
                {/* <td className="table-body-cell">{topic.completion_percentage !== undefined ? `${topic.completion_percentage}%` : 'N/A'}</td> */}
                <td className="table-body-cell">
                  <div className="table-actions-container">
                    <Button variant="link" onClick={() => onEdit(topic)} disabled={isLoading} size="sm">Ред.</Button>
                    <Button variant="link" className="table-action-button-delete" onClick={() => onDelete(topic.id)} disabled={isLoading} size="sm">Удал.</Button>
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
            currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage}
            handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};