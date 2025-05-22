// src/components/admin/RouteCategoriesManagement/RouteCategoriesTable.tsx
import React from 'react';
import type { RouteCategory } from '../../../types/admin/RouteCategories/routeCategory.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import '../../../styles/admin/ui/Table.css';

interface RouteCategoriesTableProps {
  categories: RouteCategory[];
  isLoading: boolean;
  error: string | null;
  onEdit: (category: RouteCategory) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  // itemsPerPage не нужен, так как пагинация без totalItems
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const RouteCategoriesTable: React.FC<RouteCategoriesTableProps> = ({
  categories,
  isLoading,
  error,
  onEdit,
  onDelete,
  currentPage,
  handlePreviousPage,
  handleNextPage,
  canGoNext,
  canGoPrevious,
}) => {

  if (isLoading && categories.length === 0) {
    return <div className="table-status-message table-status-loading">Загрузка категорий маршрутов...</div>;
  }

  if (error) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }

  if (!isLoading && categories.length === 0) {
    return <div className="table-status-message table-status-empty">Категории маршрутов не найдены.</div>;
  }

  return (
    <div className="table-container">
      <div className="table-scroll-wrapper">
        <table className="table-main">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Изобр.</th>
              <th className="table-header-cell">Название</th>
              <th className="table-header-cell">Описание</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="table-body-row">
                <td className="table-body-cell">{cat.id}</td>
                <td className="table-body-cell">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="table-image-thumbnail" />
                  ) : (
                    <span className="table-no-image">Нет изобр.</span>
                  )}
                </td>
                <td className="table-body-cell">{cat.name}</td>
                <td className="table-body-cell table-cell-description">
                  {cat.description && cat.description.length > 70
                    ? `${cat.description.substring(0, 70)}...`
                    : cat.description || '—'}
                </td>
                <td className="table-body-cell">
                  <div className="table-actions-container">
                    <Button
                      variant="link"
                      className="table-action-button-edit"
                      onClick={() => onEdit(cat)}
                      disabled={isLoading}
                      size="sm"
                    >
                      Ред.
                    </Button>
                    <Button
                      variant="link"
                      className="table-action-button-delete"
                      onClick={() => onDelete(cat.id)}
                      disabled={isLoading || cat.id === 1} // Блокируем удаление ID=1
                      size="sm"
                      title={cat.id === 1 ? "Эту категорию нельзя удалить" : "Удалить"}
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

      {/* Пагинация без totalItems, только Previous/Next */}
      {(canGoPrevious || canGoNext) && (
         <div className="table-pagination-wrapper"> {/* Используем тот же класс для стилей */}
            <div className="pagination-container" style={{ justifyContent: 'flex-end' }}> {/* Только кнопки */}
              <div className="pagination-buttons">
                <Button
                  onClick={handlePreviousPage}
                  disabled={!canGoPrevious || isLoading}
                  variant="outline"
                  size="sm"
                >
                  Назад
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={!canGoNext || isLoading}
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