// src/components/admin/ProposalsManagement/ProposalsManagement.tsx
import React from 'react';
import { ProposalsHeader } from './ProposalsHeader';
import { ProposalsTable } from './ProposalsTable';
import { ProposalStatusUpdateModal } from './ProposalStatusUpdateModal'; // Наша модалка/форма
import { useProposalsManagement } from '../../../hooks/admin/ProposalsManagement/useProposalsManagement';
import { ITEMS_PER_PAGE_PROPOSALS } from '../../../constants/admin/Proposals/proposals.constants';
import '../../../styles/admin/ui/PageLayout.css';

export const ProposalsManagement: React.FC = () => {
  const {
    proposals,
    loading,
    error,
    currentPage,
    itemsPerPage, // Получаем из хука, хотя он и константа
    canLoadMore,
    handlePreviousPage,
    handleNextPage,
    filterStatus,
    handleStatusFilterChange,
    
    isStatusModalOpen,
    proposalToUpdateStatus,
    isUpdatingStatus, // Для кнопки Submit в модалке
    statusUpdateError,  // Для отображения ошибки в модалке
    openStatusUpdateModal,
    closeStatusUpdateModal,
    handleUpdateStatus, // Функция, которую вызовет модалка при сабмите
  } = useProposalsManagement();

  return (
    <div className="page-container">
      <ProposalsHeader
        isLoading={loading} // Блокируем фильтр во время общей загрузки списка
        filterStatus={filterStatus}
        onStatusFilterChange={handleStatusFilterChange}
      />

      {/* Модальное окно/форма для обновления статуса */}
      <ProposalStatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={closeStatusUpdateModal}
        proposal={proposalToUpdateStatus}
        onSubmit={handleUpdateStatus} // Передаем функцию из хука
        isSubmitting={isUpdatingStatus} // Передаем флаг загрузки для этой конкретной операции
        formError={statusUpdateError}  // Передаем ошибку для этой конкретной операции
      />

      <ProposalsTable
        proposals={proposals}
        isLoading={loading}
        error={error}
        onUpdateStatusClick={openStatusUpdateModal} // При клике открываем модалку
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        canLoadMore={canLoadMore}
      />
    </div>
  );
};