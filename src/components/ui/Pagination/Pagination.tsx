// --- Путь: src/components/ui/Pagination/Pagination.tsx ---
// ПОЛНАЯ ПЕРЕПИСАННАЯ ВЕРСИЯ

import React from 'react';
import { Button } from '../Button/Button';
import './Pagination.css'; // Убедись, что стили подключены

interface PaginationProps {
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  isLoading?: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  
  // Эти пропсы мы оставляем для обратной совместимости,
  // но в текущей логике "слепой" пагинации они не используются
  totalItems?: number;
  itemsPerPage?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  handlePreviousPage,
  handleNextPage,
  isLoading,
  canGoNext,
  canGoPrevious,
}) => {
  // --- УПРОЩЕННАЯ И НАДЕЖНАЯ ЛОГИКА ---

  // 1. Определяем, нужно ли вообще показывать пагинацию.
  // Она нужна только если есть возможность перейти на предыдущую ИЛИ на следующую страницу.
  const shouldShowPagination = canGoPrevious || canGoNext;

  // Если пагинация не нужна, просто ничего не рендерим.
  if (!shouldShowPagination) {
    return null;
  }

  // 2. Определяем, заблокированы ли кнопки.
  // Кнопка "Назад" заблокирована, если идет загрузка ИЛИ если canGoPrevious = false.
  const isPrevDisabled = isLoading || !canGoPrevious;
  
  // Кнопка "Вперед" заблокирована, если идет загрузка ИЛИ если canGoNext = false.
  const isNextDisabled = isLoading || !canGoNext;

  return (
    <div className="pagination-container">
      <p className="pagination-info">
        Страница {currentPage}
      </p>
      
      <div className="pagination-buttons">
        <Button
          onClick={handlePreviousPage}
          disabled={isPrevDisabled}
          variant="outline"
          size="sm"
        >
          Назад
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={isNextDisabled}
          variant="outline"
          size="sm"
        >
          Вперед
        </Button>
      </div>
    </div>
  );
};