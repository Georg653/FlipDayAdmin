// src/types/admin/Proposals/proposal_props.types.ts

import type { Proposal, ProposalStatus, ProposalStatusFormData } from './proposal.types';

export interface ProposalsHeaderProps {
  isLoading: boolean;
  // Кнопки "Добавить" нет
  filterStatus: ProposalStatus | null;
  onStatusFilterChange: (value: string) => void; // value будет "all" или ProposalStatus
}

export interface ProposalsTableProps {
  proposals: Proposal[];
  isLoading: boolean;
  error: string | null;
  // onEdit и onDelete нет, есть onUpdateStatus
  onUpdateStatusClick: (proposal: Proposal) => void; // Открывает модалку/форму для смены статуса
  
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  canLoadMore?: boolean;
  itemsPerPage: number;
}

export interface ProposalStatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: Proposal | null; // Предложение, для которого меняем статус
  onSubmit: (proposalId: string, newStatus: ProposalStatus) => Promise<void>; // Функция для отправки PATCH запроса
  isSubmitting: boolean;
  formError: string | null;
}