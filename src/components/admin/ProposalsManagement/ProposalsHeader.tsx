// src/components/admin/ProposalsManagement/ProposalsHeader.tsx
import React from 'react';
import type { ProposalStatus } from '../../../types/admin/Proposals/proposal.types';
import { PROPOSAL_STATUS_OPTIONS } from '../../../constants/admin/Proposals/proposals.constants';
import { Select } from '../../ui/Select/Select'; // Наш простой нативный селект
import '../../../styles/admin/ui/Header.css'; // Общие стили для заголовков страниц

interface ProposalsHeaderProps {
  isLoading: boolean;
  // Кнопки "Добавить" нет, т.к. нет API для создания предложений из админки
  filterStatus: ProposalStatus | null; // Текущий выбранный статус для фильтрации
  onStatusFilterChange: (value: string) => void; // value будет "all" или ProposalStatus
}

export const ProposalsHeader: React.FC<ProposalsHeaderProps> = ({
  isLoading,
  filterStatus,
  onStatusFilterChange,
}) => {
  // Преобразуем ProposalStatus | null в строку для значения селекта
  const selectValue = filterStatus === null ? "all" : filterStatus;

  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Управление Предложениями</h2>
        {/* Кнопки "Добавить" нет */}
      </div>

      <div className="page-header-filters">
        <div className="filter-item" style={{ minWidth: '250px' }}> {/* Увеличил немного ширину для длинных названий статусов */}
          <Select
            id="status_filter_proposal"
            label="Фильтр по статусу:"
            value={selectValue}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            options={PROPOSAL_STATUS_OPTIONS} // Используем опции из констант
            disabled={isLoading}
          />
        </div>
        {/* Здесь можно будет добавить другие фильтры, если понадобятся */}
      </div>
    </div>
  );
};