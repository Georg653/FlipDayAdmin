// src/services/admin/Proposals/proposalsApi.ts

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { buildQueryString } from '../api/buildQuery';
import type {
  Proposal,
  ProposalFilterParams,
  ProposalStatusUpdatePayload,
} from '../../../types/admin/Proposals/proposal.types'; // Убедись, что импорты type корректны

export const ProposalsApi = {
  /**
   * Получает список предложений с пагинацией и фильтрацией по статусу.
   * API не возвращает total, поэтому мы просто получаем массив.
   */
  getProposals: async (params: ProposalFilterParams = {}): Promise<Proposal[]> => {
    const queryParams: Record<string, any> = {
      limit: params.limit,
      offset: params.offset,
    };
    // Обрабатываем status_filter: ProposalStatus | null
    // API ожидает status_filter=pending и т.д. Если null, параметр не передаем.
    if (params.status_filter) { // Передаем, если не null и не пустая строка
      queryParams.status_filter = params.status_filter;
    }

    const query = buildQueryString(queryParams);
    const response = await axiosInstance.get<Proposal[]>(`${ENDPOINTS.PROPOSALS}${query}`);
    return response.data; // API возвращает просто массив Proposal[]
  },

  /**
   * Получает одно предложение по ID.
   * proposalId - это строка (UUID).
   */
  getProposalById: async (proposalId: string): Promise<Proposal> => {
    return (await axiosInstance.get<Proposal>(ENDPOINTS.PROPOSAL_DETAIL(proposalId))).data;
  },

  /**
   * Обновляет статус предложения по ID.
   * proposalId - это строка (UUID).
   * payload содержит { status: NewProposalStatus }
   */
  updateProposalStatus: async (
    proposalId: string,
    payload: ProposalStatusUpdatePayload
  ): Promise<Proposal> => { // API возвращает обновленный объект Proposal
    return (await axiosInstance.patch<Proposal>(
      ENDPOINTS.PROPOSAL_UPDATE_STATUS(proposalId),
      payload // Тело запроса - это объект { status: "new_status" }
      // Заголовки Content-Type: application/json по умолчанию для Axios, если не FormData
    )).data;
  },
};