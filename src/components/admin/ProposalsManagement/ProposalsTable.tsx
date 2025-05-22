// src/components/admin/ProposalsManagement/ProposalsTable.tsx
import React from 'react';
import type { Proposal } from '../../../types/admin/Proposals/proposal.types';
import { PROPOSAL_STATUS_MAP } from '../../../constants/admin/Proposals/proposals.constants';
import { Button } from '../../ui/Button/Button';
// Pagination стили могут быть нужны, если используем классы из Pagination.css
import '../../../styles/admin/Pagination.css'; 
import '../../../styles/admin/ui/Table.css';

interface ProposalsTableProps {
  proposals: Proposal[];
  isLoading: boolean;
  error: string | null;
  onUpdateStatusClick: (proposal: Proposal) => void; // Открывает модалку для смены статуса
  
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  canLoadMore?: boolean;
  itemsPerPage: number;
}

export const ProposalsTable: React.FC<ProposalsTableProps> = ({
  proposals,
  isLoading,
  error,
  onUpdateStatusClick,
  currentPage,
  handlePreviousPage,
  handleNextPage,
  canLoadMore,
  itemsPerPage,
}) => {
  const currentItems = Array.isArray(proposals) ? proposals : [];
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = startItem + currentItems.length - 1;

  if (isLoading) {
    return <div className="table-status-message table-status-loading">Загрузка предложений...</div>;
  }

  if (error) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }

  if (currentItems.length === 0) {
    return <div className="table-status-message table-status-empty">Предложения не найдены.</div>;
  }

  return (
    <div className="table-container">
      <div className="table-scroll-wrapper">
        <table className="table-main">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Заголовок</th>
              <th className="table-header-cell">Описание</th>
              <th className="table-header-cell">Статус</th>
              <th className="table-header-cell">Голоса</th>
              <th className="table-header-cell">User ID</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((proposal) => (
              <tr key={proposal.id} className="table-body-row">
                <td className="table-body-cell" title={proposal.id}>{proposal.id.substring(0, 8)}...</td> {/* Показываем часть UUID */}
                <td className="table-body-cell">{proposal.title}</td>
                <td className="table-body-cell table-cell-description">
                  {proposal.description && proposal.description.length > 70
                    ? `${proposal.description.substring(0, 70)}...`
                    : proposal.description || '—'}
                </td>
                <td className="table-body-cell">
                  <span className={`status-badge status-${proposal.status}`}>
                    {PROPOSAL_STATUS_MAP[proposal.status] || proposal.status}
                  </span>
                </td>
                <td className="table-body-cell">{proposal.votes}</td>
                <td className="table-body-cell">{proposal.user_id}</td>
                <td className="table-body-cell">
                  <div className="table-actions-container">
                    <Button
                      variant="outline" // Сделаем кнопку более заметной
                      size="sm"
                      onClick={() => onUpdateStatusClick(proposal)}
                      className="table-action-button-edit" // Можно переименовать класс или оставить
                    >
                      Изменить статус
                    </Button>
                    {/* Здесь не будет кнопок Edit/Delete, т.к. API их не предоставляет */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(currentPage > 1 || canLoadMore) && currentItems.length > 0 && (
        <div className="table-pagination-wrapper">
           <div className="pagination-container">
            {currentItems.length > 0 && ( // Убедимся, что есть что показывать
                <p className="pagination-info">
                Показано {startItem}-{endItem}
                </p>
            )}
            <div className="pagination-buttons">
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Назад
              </Button>
              <Button
                onClick={handleNextPage}
                disabled={!canLoadMore}
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