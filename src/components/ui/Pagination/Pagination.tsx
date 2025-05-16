// src/components/ui/Pagination/Pagination.tsx
import React from 'react';
import { Button } from '../Button/Button'; // Предполагаем, что Button уже есть
import '../../../styles/admin/Pagination.css'; // Стили для пагинации

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  handlePreviousPage,
  handleNextPage,
  isLoading,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1 && totalItems > 0) { // Если одна страница, но есть записи - не рендерим кнопки, но можем показать инфо
    return (
      <div className="pagination-container">
         <p className="pagination-info">
          Showing {startItem} to {endItem} of {totalItems} results
        </p>
      </div>
    );
  }
  if (totalPages <=1) return null; // Если страниц 0 или 1, не рендерим пагинацию

  return (
    <div className="pagination-container">
      {totalItems > 0 && (
        <p className="pagination-info">
          Showing {startItem} to {endItem} of {totalItems} results (Page {currentPage} of {totalPages})
        </p>
      )}
      <div className="pagination-buttons">
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || isLoading}
          variant="outline"
          size="sm"
        >
          Previous
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || isLoading}
          variant="outline"
          size="sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};