// src/components/admin/NewsManagement/NewsTable.tsx
import React from 'react';
import type { NewsItem } from '../../../types/admin/News/news.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import '../../../styles/admin/ui/Table.css';

interface NewsTableProps {
  newsItems: NewsItem[];
  isLoading: boolean;
  error: string | null;
  onEdit: (newsItem: NewsItem) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  itemsPerPage: number;
}

export const NewsTable: React.FC<NewsTableProps> = ({
  newsItems,
  isLoading,
  error,
  onEdit,
  onDelete,
  currentPage,
  handlePreviousPage,
  handleNextPage,
  canGoNext,
  canGoPrevious,
  itemsPerPage,
}) => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  if (isLoading && (!Array.isArray(newsItems) || newsItems.length === 0)) {
    return <div className="table-status-message table-status-loading">Загрузка новостей...</div>;
  }

  if (error) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }

  if (!isLoading && (!Array.isArray(newsItems) || newsItems.length === 0)) {
    return <div className="table-status-message table-status-empty">Новости не найдены.</div>;
  }

  return (
    <div className="table-container">
      <div className="table-scroll-wrapper">
        <table className="table-main">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Превью</th>
              <th className="table-header-cell">Заголовок</th>
              <th className="table-header-cell">Описание</th>
              <th className="table-header-cell">Дата создания</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {newsItems.map((item) => {
              // Логируем URL, который приходит от API для каждой новости
              console.log(`Новость ID ${item.id} - item.preview от API: "${item.preview}"`);
              
              // Используем item.preview напрямую в src
              const imageUrl = item.preview; 

              return (
                <tr key={item.id} className="table-body-row">
                  <td className="table-body-cell">{item.id}</td>
                  <td className="table-body-cell">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={item.title} 
                        className="table-image-thumbnail" 
                        onError={(e) => { 
                          console.error(`ОШИБКА ЗАГРУЗКИ КАРТИНКИ для новости "${item.title}" по URL: ${imageUrl}`);
                          // Можно временно скрыть сломанную иконку или заменить на плейсхолдер
                          // (e.target as HTMLImageElement).style.display = 'none'; 
                          // ===(e.target as HTMLImageElement).src = '/path/to/placeholder-image.png';
                        }}
                      />
                    ) : (
                      <span className="table-no-image">Нет</span>
                    )}
                  </td>
                  <td className="table-body-cell">{item.title}</td>
                  <td className="table-body-cell table-cell-description">
                    {item.description && item.description.length > 70
                      ? `${item.description.substring(0, 70)}...`
                      : item.description || '—'}
                  </td>
                  <td className="table-body-cell">{formatDate(item.created_at)}</td>
                  <td className="table-body-cell">
                    <div className="table-actions-container">
                      <Button
                        variant="link"
                        className="table-action-button-edit"
                        onClick={() => onEdit(item)}
                        disabled={isLoading}
                        size="sm"
                      >
                        Ред.
                      </Button>
                      <Button
                        variant="link"
                        className="table-action-button-delete"
                        onClick={() => onDelete(item.id)}
                        disabled={isLoading}
                        size="sm"
                      >
                        Удал.
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

        <div className="table-pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            totalItems={-1} 
            itemsPerPage={itemsPerPage}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            isLoading={isLoading}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
          />
        </div>
    </div>
  );
};