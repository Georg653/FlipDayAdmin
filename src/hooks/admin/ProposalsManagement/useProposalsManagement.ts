// src/hooks/admin/ProposalsManagement/useProposalsManagement.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  Proposal,
  ProposalFilterParams,
  ProposalStatus,
  ProposalStatusUpdatePayload,
} from '../../../types/admin/Proposals/proposal.types';
import { ProposalsApi } from '../../../services/admin/Proposals/proposalsApi';
import { ITEMS_PER_PAGE_PROPOSALS } from '../../../constants/admin/Proposals/proposals.constants';
// import { useNotification } from '../../../contexts/admin/NotificationContext'; // Если есть

export const useProposalsManagement = () => {
  // const { showNotification } = useNotification();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true); // Начальная загрузка
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = ITEMS_PER_PAGE_PROPOSALS;
  const [canLoadMore, setCanLoadMore] = useState(false); // Для упрощенной пагинации

  const [filterStatus, setFilterStatus] = useState<ProposalStatus | null>(null); // null - все статусы

  // Состояние для модального окна/формы обновления статуса
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [proposalToUpdateStatus, setProposalToUpdateStatus] = useState<Proposal | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); // Локальный лоадер для обновления статуса
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);

  const fetchProposals = useCallback(async (pageToFetch: number, currentStatusFilter: ProposalStatus | null) => {
    setLoading(true);
    setError(null);
    try {
      const params: ProposalFilterParams = {
        offset: (pageToFetch - 1) * itemsPerPage,
        limit: itemsPerPage,
        status_filter: currentStatusFilter,
      };
      const responseProposals = await ProposalsApi.getProposals(params);
      
      setProposals(responseProposals || []);
      setCanLoadMore(responseProposals && responseProposals.length === itemsPerPage);

    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось загрузить предложения.';
      setError(message);
      // showNotification?.(message, 'error');
      console.error("Error fetching proposals:", message, err);
      setProposals([]);
      setCanLoadMore(false);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchProposals(currentPage, filterStatus);
  }, [currentPage, filterStatus, fetchProposals]);

  const handleStatusFilterChange = useCallback((value: string) => { // value из селекта: "all" или ProposalStatus
    if (value === "all") {
      setFilterStatus(null);
    } else {
      setFilterStatus(value as ProposalStatus);
    }
    setCurrentPage(1); // Сбрасываем на первую страницу при смене фильтра
    // useEffect выше вызовет fetchProposals
  }, []);

  const openStatusUpdateModal = useCallback((proposal: Proposal) => {
    setProposalToUpdateStatus(proposal);
    setStatusUpdateError(null); // Сбрасываем предыдущую ошибку модалки
    setIsStatusModalOpen(true);
  }, []);

  const closeStatusUpdateModal = useCallback(() => {
    setProposalToUpdateStatus(null);
    setIsStatusModalOpen(false);
  }, []);

  const handleUpdateStatus = async (proposalId: string, newStatus: ProposalStatus) => {
    if (!proposalToUpdateStatus || proposalId !== proposalToUpdateStatus.id) return;

    setIsUpdatingStatus(true);
    setStatusUpdateError(null);
    try {
      const payload: ProposalStatusUpdatePayload = { status: newStatus };
      const updatedProposal = await ProposalsApi.updateProposalStatus(proposalId, payload);
      
      // Обновляем предложение в локальном списке
      setProposals(prevProposals => 
        prevProposals.map(p => p.id === updatedProposal.id ? updatedProposal : p)
      );
      // showNotification?.('Статус предложения успешно обновлен!', 'success');
      console.log('Статус предложения успешно обновлен!');
      closeStatusUpdateModal();
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось обновить статус предложения.';
      // showNotification?.(message, 'error');
      console.error("Error updating proposal status:", message, err);
      setStatusUpdateError(message); // Показываем ошибку в модалке
    } finally {
      setIsUpdatingStatus(false);
    }
  };


  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (canLoadMore) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  }, [canLoadMore]);

  return {
    proposals,
    loading,
    error,
    currentPage,
    itemsPerPage, // Возвращаем для информации в таблице
    canLoadMore,
    handlePreviousPage,
    handleNextPage,
    filterStatus,
    handleStatusFilterChange,
    
    isStatusModalOpen,
    proposalToUpdateStatus,
    isUpdatingStatus,
    statusUpdateError,
    openStatusUpdateModal,
    closeStatusUpdateModal,
    handleUpdateStatus,
  };
};