// src/components/ui/Pagination/Pagination.tsx
import React from 'react';
import { Button } from '../Button/Button';
import '../../../styles/admin/Pagination.css'; // Убедись, что стили подключены

interface PaginationProps {
  currentPage: number;
  totalItems: number; // Будет использоваться, если > 0, иначе считаем "слепой" пагинацией
  itemsPerPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  isLoading?: boolean;
  canGoNext?: boolean; // Для "слепой" пагинации
  canGoPrevious?: boolean; // Для "слепой" пагинации
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  handlePreviousPage,
  handleNextPage,
  isLoading,
  canGoNext, // Получаем новый проп
  canGoPrevious, // Получаем новый проп
}) => {
  // Определяем, используем ли мы полную пагинацию (с totalItems) или "слепую"
  const isBlindPagination = totalItems <= 0; // Если totalItems не передан или 0, считаем слепой

  let totalPages = 0;
  let startItem = 0;
  let endItem = 0;
  let itemsOnCurrentPage = 0; // Понадобится для отображения, если нет totalItems

  if (!isBlindPagination) {
    totalPages = Math.ceil(totalItems / itemsPerPage);
    startItem = (currentPage - 1) * itemsPerPage + 1;
    endItem = Math.min(currentPage * itemsPerPage, totalItems);
  } else {
    // Для слепой пагинации мы не знаем totalPages или totalItems
    // startItem и endItem будут относительными для текущей страницы
    startItem = (currentPage - 1) * itemsPerPage + 1;
    // endItem можно рассчитать, если знать, сколько элементов пришло (но это не передается сюда)
    // itemsOnCurrentPage = newsItems.length (это было бы в NewsTable)
    // Пока просто отобразим номер страницы
  }

  const isPrevDisabled = isLoading || (isBlindPagination ? !canGoPrevious : currentPage === 1);
  const isNextDisabled = isLoading || (isBlindPagination ? !canGoNext : currentPage === totalPages);
  
  // Не рендерим пагинацию вообще, если:
  // 1. Это слепая пагинация, первая страница, и нет возможности идти ни назад, ни вперед.
  // 2. Это не слепая пагинация, и всего одна страница или меньше.
  // 3. Идет загрузка (чтобы избежать моргания, если потом появятся данные) - хотя это можно и не делать
  if (!isLoading && isBlindPagination && currentPage === 1 && !canGoNext && !canGoPrevious) {
    // Если мы на первой странице и canGoNext false, то это может быть единственная страница
    // или последняя страница при переходе назад.
    // Можно вообще ничего не показывать или только номер страницы, если itemsPerPage > 0
    if (itemsPerPage > 0 && !canGoNext && !canGoPrevious && currentPage === 1) {
        // Это случай, когда записей меньше или равно itemsPerPage и это первая/единственная страница
        // Можно решить не показывать пагинацию вообще в таком случае, это делается в NewsTable
        // return null; // Или только информацию
    }
  }
  if (!isLoading && !isBlindPagination && totalPages <= 1) {
    // Если есть totalItems, но страниц всего одна или ноль
    if (totalItems > 0 && totalItems <= itemsPerPage) {
        // Можно показать информацию, если хочется, но не кнопки
        // return (
        //   <div className="pagination-container">
        //     <p className="pagination-info">
        //       Показано с {startItem} по {endItem} из {totalItems} результатов
        //     </p>
        //   </div>
        // );
    }
    return null; // Если страниц 0 или 1, не рендерим пагинацию
  }


  // Если это слепая пагинация и это первая страница и нет возможности идти вперед,
  // то возможно, не стоит показывать пагинацию вообще, если на странице нет записей (это проверяется в NewsTable)
  // или если записей меньше, чем itemsPerPage.

  // Однако, если мы уже не на первой странице (canGoPrevious === true), то кнопки должны быть.
  // Если это первая страница, но есть canGoNext, кнопки тоже должны быть.

  // Поэтому основное условие для показа - есть ли куда идти или мы не на единственной странице
  const shouldShowPagination = isPrevDisabled === false || isNextDisabled === false || (!isBlindPagination && totalPages > 1);

  if (!shouldShowPagination && !isLoading) return null; // Если нечего показывать и не идет загрузка


  return (
    <div className="pagination-container">
      {isBlindPagination ? (
        <p className="pagination-info">Страница {currentPage}</p>
      ) : (
        totalItems > 0 && (
          <p className="pagination-info">
            Показано с {startItem} по {endItem} из {totalItems} (Страница {currentPage} из {totalPages})
          </p>
        )
      )}
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