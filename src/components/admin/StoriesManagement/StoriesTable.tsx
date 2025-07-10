// --- Путь: src/components/admin/StoriesManagement/StoriesTable.tsx ---

import React from 'react';
import type { Story } from '../../../types/admin/Stories/story.types';
import type { StoriesTableProps } from '../../../types/admin/Stories/story_props.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import { createImageUrl } from '../../../utils/media';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import '../../../styles/admin/ui/Table.css';

export const StoriesTable: React.FC<StoriesTableProps> = ({
  stories,
  isLoading,
  error,
  onEdit,
  onDelete,
  onToggleStatus,
  currentPage,
  handlePreviousPage,
  handleNextPage,
  canGoNext,
  canGoPrevious,
}) => {
  
  // Более надежная функция форматирования даты
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return '—';
    try {
      // Бэк отдает дату без 'Z', поэтому new Date может парсить ее как локальную.
      // Чтобы быть уверенными, что это UTC, и корректно отобразить в локальном времени,
      // добавляем 'Z' вручную.
      const date = new Date(dateString.includes('Z') ? dateString : dateString + 'Z');
      
      // Проверяем, валидна ли дата после парсинга
      if (isNaN(date.getTime())) {
        return 'Неверная дата';
      }

      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Ошибка даты';
    }
  };

  if (isLoading) {
    return <div className="table-status-message">Загрузка историй...</div>;
  }

  if (error) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }

  // Обновленное сообщение для пустого списка
  if (!stories.length && !isLoading) {
    return <div className="table-status-message">Истории не найдены. Попробуйте изменить фильтры или создайте новую.</div>;
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
              <th className="table-header-cell">Статус</th>
              <th className="table-header-cell" style={{textAlign: 'center'}}>Активна</th>
              <th className="table-header-cell">Слайдов</th>
              <th className="table-header-cell">Просмотров</th>
              <th className="table-header-cell">Истекает</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => {
              const imageUrl = createImageUrl(story.preview);
              return (
                <tr key={story.id} className="table-body-row">
                  <td className="table-body-cell">{story.id}</td>
                  <td className="table-body-cell">
                    {imageUrl ? (
                      <img src={imageUrl} alt={story.name || 'Превью'} className="table-image-thumbnail" />
                    ) : (
                      <span className="table-no-image">Нет</span>
                    )}
                  </td>
                  <td className="table-body-cell">{story.name || 'Без названия'}</td>
                  <td className="table-body-cell">
                    <span className={`status-badge ${story.is_active ? 'status-active' : 'status-inactive'}`}>
                      {story.is_active ? 'Активна' : 'Неактивна'}
                    </span>
                  </td>
                  <td className="table-body-cell" style={{textAlign: 'center'}}>
                    <Checkbox
                      id={`toggle-${story.id}`}
                      label=""
                      checked={story.is_active}
                      onChange={() => onToggleStatus(story)}
                    />
                  </td>
                  <td className="table-body-cell" style={{textAlign: 'center'}}>{story.content_items?.length ?? 0}</td>
                  <td className="table-body-cell" style={{textAlign: 'center'}}>{story.views ?? 0}</td>
                  <td className="table-body-cell">{formatDate(story.expires_at)}</td>
                  <td className="table-body-cell">
                    <div className="table-actions-container">
                      <Button variant="link" size="sm" onClick={() => onEdit(story)}>Ред.</Button>
                      <Button variant="link" size="sm" className="table-action-button-delete" onClick={() => onDelete(story.id)}>Удал.</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {(canGoPrevious || canGoNext) && (
        <div className="table-pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            totalItems={-1}
            itemsPerPage={0}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};