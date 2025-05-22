// src/components/admin/ProposalsManagement/ProposalStatusUpdateModal.tsx
import React, { useState, useEffect } from 'react';
import type { Proposal, ProposalStatus, ProposalStatusFormData } from '../../../types/admin/Proposals/proposal.types';
import { PROPOSAL_STATUS_OPTIONS, PROPOSAL_STATUS_MAP } from '../../../constants/admin/Proposals/proposals.constants';
import { Button } from '../../ui/Button/Button';
import { Select } from '../../ui/Select/Select';
import '../../../styles/admin/ui/Form.css'; // Общие стили для форм
import './ProposalStatusUpdateModal.css'; // Специфичные стили для этой модалки/формы

interface ProposalStatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: Proposal | null;
  onSubmit: (proposalId: string, newStatus: ProposalStatus) => Promise<void>;
  isSubmitting: boolean; // Индикатор загрузки для кнопки Submit
  formError: string | null; // Ошибка от операции обновления статуса
}

export const ProposalStatusUpdateModal: React.FC<ProposalStatusUpdateModalProps> = ({
  isOpen,
  onClose,
  proposal,
  onSubmit,
  isSubmitting,
  formError,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ProposalStatus>('pending');
  // const [adminComment, setAdminComment] = useState(''); // Если бы было поле для комментария

  useEffect(() => {
    if (proposal) {
      setSelectedStatus(proposal.status);
      // setAdminComment(''); // Сбрасываем комментарий при открытии
    }
  }, [proposal]);

  if (!isOpen || !proposal) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(proposal.id, selectedStatus);
    // onClose(); // Закрытие модалки лучше делать в хуке useProposalsManagement после успешного onSubmit
  };

  // Убираем опцию "Все статусы" и текущий статус из списка для выбора
  const availableStatusOptions = PROPOSAL_STATUS_OPTIONS.filter(
    option => option.value !== "all" && option.value !== proposal.status
  ).map(opt => ({ value: opt.value as ProposalStatus, label: opt.label }));


  return (
    <div className="modal-overlay"> {/* Этот div для затемнения фона */}
      <div className="modal-content form-container proposal-status-modal"> {/* Используем form-container для консистентности */}
        <h3 className="form-title">Обновить статус предложения #{proposal.id}</h3>
        <p><strong>Заголовок:</strong> {proposal.title}</p>
        <p><strong>Текущий статус:</strong> {PROPOSAL_STATUS_MAP[proposal.status] || proposal.status}</p>
        
        {formError && <p className="form-error">{formError}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-inputs">
            <div className="form-group">
              <Select
                id="proposal_new_status"
                label="Новый статус*"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ProposalStatus)}
                options={availableStatusOptions}
                disabled={isSubmitting || availableStatusOptions.length === 0}
                required
                placeholder={availableStatusOptions.length === 0 ? "Нет доступных статусов" : "Выберите новый статус"}
              />
               {availableStatusOptions.length === 0 && <p className="form-field-info">Для этого предложения нет других доступных статусов.</p>}
            </div>

            {/* Если бы было поле для комментария администратора:
            <div className="form-group">
              <label htmlFor="admin_comment_proposal">Комментарий администратора (опционально)</label>
              <Textarea
                id="admin_comment_proposal"
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                rows={3}
                disabled={isSubmitting}
              />
            </div>
            */}
          </div>

          <div className="form-actions">
            <Button type="submit" disabled={isSubmitting || availableStatusOptions.length === 0} customVariant="save" variant="success">
              {isSubmitting ? 'Обновление...' : 'Обновить статус'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              customVariant="cancel"
              variant="outline"
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};