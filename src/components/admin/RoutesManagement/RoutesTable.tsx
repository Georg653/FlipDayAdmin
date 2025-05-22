// src/components/admin/RoutesManagement/RoutesTable.tsx
import React from 'react';
import type { Route } from '../../../types/admin/Routes/route.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination'; // Если используется
import '../../../styles/admin/ui/Table.css';

interface RoutesTableProps {
  routes: Route[];
  isLoading: boolean;
  error: string | null;
  onEdit: (route: Route) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  getCategoryName: (categoryId: number) => string; // Функция для получения имени категории
  itemsPerPage: number; // Для компонента Pagination
}

export const RoutesTable: React.FC<RoutesTableProps> = ({
  routes,
  isLoading,
  error,
  onEdit,
  onDelete,
  currentPage,
  handlePreviousPage,
  handleNextPage,
  canGoNext,
  canGoPrevious,
  getCategoryName,
  itemsPerPage,
}) => {

  if (isLoading && routes.length === 0) {
    return <div className="table-status-message table-status-loading">Загрузка маршрутов...</div>;
  }

  if (error) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }

  if (!isLoading && routes.length === 0) {
    return <div className="table-status-message table-status-empty">Маршруты не найдены.</div>;
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
              <th className="table-header-cell">Категория</th>
              <th className="table-header-cell">Описание</th>
              <th className="table-header-cell">Дист. (м)</th>
              <th className="table-header-cell">Время (мин)</th>
              <th className="table-header-cell">Бюджет</th>
              <th className="table-header-cell">Авто?</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.id} className="table-body-row">
                <td className="table-body-cell">{route.id}</td>
                <td className="table-body-cell">
                  {route.image ? (
                    <img src={route.image} alt={route.name} className="table-image-thumbnail" />
                  ) : (
                    <span className="table-no-image">Нет</span>
                  )}
                </td>
                <td className="table-body-cell">{route.name}</td>
                <td className="table-body-cell">{getCategoryName(route.route_category_id)}</td>
                <td className="table-body-cell table-cell-description">
                  {route.description && route.description.length > 50
                    ? `${route.description.substring(0, 50)}...`
                    : route.description || '—'}
                </td>
                <td className="table-body-cell">{route.distance}</td>
                <td className="table-body-cell">{route.estimated_time}</td>
                <td className="table-body-cell">{route.budget}</td>
                <td className="table-body-cell">{route.auto_generated ? 'Да' : 'Нет'}</td>
                <td className="table-body-cell">
                  <div className="table-actions-container">
                    <Button
                      variant="link"
                      className="table-action-button-edit"
                      onClick={() => onEdit(route)}
                      disabled={isLoading}
                      size="sm"
                    >
                      Ред.
                    </Button>
                    <Button
                      variant="link"
                      className="table-action-button-delete"
                      onClick={() => onDelete(route.id)}
                      disabled={isLoading || route.auto_generated} // Нельзя удалять auto_generated
                      size="sm"
                      title={route.auto_generated ? "Авто-сген. маршруты нельзя удалять" : "Удалить"}
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

      {(canGoPrevious || canGoNext) && (
         <div className="table-pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            totalItems={-1} // Так как мы не знаем общее количество
            itemsPerPage={itemsPerPage}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            isLoading={isLoading}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
          />
        </div>
      )}
    </div>
  );
};