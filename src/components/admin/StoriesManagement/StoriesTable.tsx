// src/components/admin/StoriesManagement/StoriesTable.tsx
import React from 'react';
import type { Story } from '../../../types/admin/Stories/story.types';
import { Button } from '../../ui/Button/Button';
// Pagination компонент не используется напрямую, но его стили могут быть нужны
// import { Pagination } from '../../ui/Pagination/Pagination'; 
import '../../../styles/admin/ui/Table.css';
import '../../../styles/admin/Pagination.css'; // Импортируем стили пагинации, т.к. используем ее классы

interface StoriesTableProps {
  stories: Story[];
  isLoading: boolean;
  error: string | null;
  onEdit: (story: Story) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  canLoadMore?: boolean;
  itemsPerPage: number;
}

export const StoriesTable: React.FC<StoriesTableProps> = ({
  stories,
  isLoading,
  error,
  onEdit,
  onDelete,
  currentPage,
  handlePreviousPage,
  handleNextPage,
  canLoadMore,
  itemsPerPage,
}) => {
  // console.log('[StoriesTable] Props:', { stories, isLoading, error, currentPage, canLoadMore });

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Рассчитываем отображаемые элементы
  const currentItems = Array.isArray(stories) ? stories : [];
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = startItem + currentItems.length - 1;

  if (isLoading) { // Показываем загрузку, если isLoading true, независимо от наличия stories
    return <div className="table-status-message table-status-loading">Загрузка историй...</div>;
  }

  if (error) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }

  if (currentItems.length === 0) {
    return <div className="table-status-message table-status-empty">Истории не найдены.</div>;
  }

  return (
    <div className="table-container">
      <div className="table-scroll-wrapper">
        <table className="table-main">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Превью</th>
              <th className="table-header-cell">Название</th>
              <th className="table-header-cell">Активна</th>
              <th className="table-header-cell">Элементы</th>
              <th className="table-header-cell">Истекает</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((story) => (
              <tr key={story.id} className="table-body-row">
                <td className="table-body-cell">{story.id}</td>
                <td className="table-body-cell">
                  {story.preview ? (
                    <img src={story.preview} alt={story.name || 'Превью истории'} className="table-image-thumbnail" />
                  ) : (
                    <span className="table-no-image">Нет превью</span>
                  )}
                </td>
                <td className="table-body-cell">{story.name || 'Без названия'}</td>
                <td className="table-body-cell">{story.is_active ? 'Да' : 'Нет'}</td>
                <td className="table-body-cell">{story.content_items?.length || 0}</td>
                <td className="table-body-cell">{formatDate(story.expires_at)}</td>
                <td className="table-body-cell">
                  <div className="table-actions-container">
                    <Button
                      variant="link"
                      onClick={() => onEdit(story)}
                      disabled={isLoading} // isLoading здесь уже будет false
                      size="sm"
                      className="table-action-button-edit"
                    >
                      Ред.
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => onDelete(story.id)}
                      disabled={isLoading} // isLoading здесь уже будет false
                      size="sm"
                      className="table-action-button-delete"
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

      {(currentPage > 1 || canLoadMore) && currentItems.length > 0 && (
        <div className="table-pagination-wrapper">
           <div className="pagination-container">
            <p className="pagination-info">
              Показано {startItem}-{endItem}
            </p>
            <div className="pagination-buttons">
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1} // isLoading здесь уже будет false
                variant="outline"
                size="sm"
              >
                Назад
              </Button>
              <Button
                onClick={handleNextPage}
                disabled={!canLoadMore} // isLoading здесь уже будет false
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