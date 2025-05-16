// src/components/admin/LearningPagesManagement/LearningPagesTable.tsx
import React from 'react';
import type { LearningPage, LearningPageContentBlock } from '../../../types/admin/LearningPages/learningPage.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import '../../../styles/admin/ui/Table.css';

interface LearningPagesTableProps {
  learningPages: LearningPage[];
  isLoading: boolean;
  error: string | null;
  onEdit: (learningPage: LearningPage) => void; // Убедись, что subtopic_id будет доступен при вызове onEdit
  onDelete: (id: number) => void;
  currentPage: number;
  totalItems: number; // Помним, что это значение будет неточным
  itemsPerPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  // currentSubtopicId?: number | null; // Можно передавать для информации или если в будущем понадобится
}

export const LearningPagesTable: React.FC<LearningPagesTableProps> = ({
  learningPages,
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
  const getFirstTextContent = (content: LearningPageContentBlock[]): string => {
    if (!content || content.length === 0) return '—';
    // Пытаемся найти первый текстовый блок или заголовок
    const textBlock = content.find(block => 
        (block.type === 'text' && block.content) || 
        (block.type === 'heading' && block.content)
    );
    let previewText = textBlock?.content || JSON.stringify(content[0]).substring(0, 50); // Если нет текста, берем часть JSON первого блока

    if (previewText && previewText.length > 70) {
      previewText = `${previewText.substring(0, 70)}...`;
    }
    return previewText || '—';
  };

  if (isLoading && (!Array.isArray(learningPages) || learningPages.length === 0)) {
    return <div className="table-status-message table-status-loading">Загрузка страниц обучения...</div>;
  }

  if (error) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }

  if (!isLoading && (!Array.isArray(learningPages) || learningPages.length === 0)) {
    return <div className="table-status-message table-status-empty">Страницы обучения не найдены для выбранной подтемы.</div>;
  }

  return (
    <div className="table-container">
      <div className="table-scroll-wrapper">
        <table className="table-main">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">ID Стр.</th>
              <th className="table-header-cell">№ Стр.</th>
              {/* <th className="table-header-cell">Заголовок/Начало контента</th> // Вместо title */}
              <th className="table-header-cell" style={{minWidth: '300px'}}>Начало контента</th>
              <th className="table-header-cell">Кол-во блоков</th>
              <th className="table-header-cell">Всего стр. в подтеме</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {learningPages.map((page) => (
              <tr key={page.id} className="table-body-row">
                <td className="table-body-cell">{page.id}</td>
                <td className="table-body-cell">{page.page_number}</td>
                <td className="table-body-cell">{getFirstTextContent(page.content)}</td>
                <td className="table-body-cell">{page.content?.length || 0}</td>
                <td className="table-body-cell">{page.total_pages}</td>
                <td className="table-body-cell">
                  <div className="table-actions-container">
                    <Button
                      variant="link"
                      className="table-action-button-edit"
                      onClick={() => onEdit(page)}
                      disabled={isLoading}
                      size="sm"
                    >
                      Ред.
                    </Button>
                    <Button
                      variant="link"
                      className="table-action-button-delete"
                      onClick={() => onDelete(page.id)}
                      disabled={isLoading}
                      size="sm"
                    >
                      Удал.
                    </Button>
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
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};