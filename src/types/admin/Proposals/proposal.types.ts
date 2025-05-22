// src/types/admin/Proposals/proposal.types.ts

export type ProposalStatus = 
  | "pending" 
  | "approved" 
  | "needed_feedback" 
  | "finished" 
  | "canceled";

// Структура Proposal, как она приходит с API
export interface Proposal {
  id: string; // UUID
  title: string;
  description: string;
  status: ProposalStatus;
  votes: number;
  user_vote: number; // Для админки может быть не так важно, но есть в ответе
  user_id: number;
  // created_at и updated_at отсутствуют в схеме API
}

// Данные для обновления статуса
export interface ProposalStatusUpdatePayload {
  status: ProposalStatus;
}

// Для списка предложений (API возвращает массив, total мы не получаем)
// export interface PaginatedProposalsResponse { // Этот интерфейс не нужен, т.к. нет total
//   items: Proposal[];
// }

export interface ProposalFilterParams {
  status_filter?: ProposalStatus | null; // null для "все"
  limit?: number;
  offset?: number;
}

// Опции для хука управления статусом (если будет отдельная форма/модалка)
export interface ProposalStatusUpdateFormOptions {
  proposalToUpdate: Proposal | null;
  onSuccess?: (updatedProposal: Proposal) => void;
  onClose: () => void;
}

// Данные для формы/модалки обновления статуса
export interface ProposalStatusFormData {
  new_status: ProposalStatus;
  // admin_comment: string; // Если бы мы могли добавлять комментарий
}

export const initialProposalStatusFormData: ProposalStatusFormData = {
  new_status: "pending", // или другой дефолтный
  // admin_comment: "",
};