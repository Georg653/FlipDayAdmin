// --- Путь: src/components/admin/LearningPagesManagement/LearningPagesTable.tsx ---

import React from 'react';
import type { LearningPagesTableProps } from '../../../types/admin/LearningPages/learningPage_props.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import '../../../styles/admin/ui/Table.css';

export const LearningPagesTable: React.FC<LearningPagesTableProps> = ({
  pages,
  isLoading,
  error,
  onEdit,
  onDelete,
  currentPage,
  canGoNext,
  canGoPrevious,
  handleNextPage,
  handlePreviousPage,
}) => {
  if (isLoading) {
    return <div className="table-status-message">Загрузка страниц...</div>;
  }

  if (error) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }
  
  if (!pages.length) {
    return <div className="table-status-message">Страницы не найдены. Выберите другую подтему или создайте первую страницу для текущей.</div>;
  }

  return (
    <div className="table-container">
      <div className="table-scroll-wrapper">
        <table className="table-main">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Номер страницы</th>
              <th className="table-header-cell">Род. подтема (ID)</th>
              <th className="table-header-cell">Количество блоков</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="table-body-row">
                <td className="table-body-cell">{page.id}</td>
                <td className="table-body-cell" style={{ textAlign: 'center' }}>{page.page_number}</td>
                <td className="table-body-cell" style={{ textAlign: 'center' }}>{page.subtopic_id}</td>
                <td className="table-body-cell" style={{ textAlign: 'center' }}>{page.content?.length ?? 0}</td>
                <td className="table-body-cell">
                  <div className="table-actions-container">
                    <Button variant="link" size="sm" onClick={() => onEdit(page)}>Ред.</Button>
                    <Button variant="link" size="sm" className="table-action-button-delete" onClick={() => onDelete(page.id)}>Удал.</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {(canGoPrevious || canGoNext) && (
        <div className="table-pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            totalItems={-1}
            itemsPerPage={0}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};