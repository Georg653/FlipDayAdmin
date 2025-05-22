// src/components/admin/RouteCategoriesManagement/RouteCategoriesHeader.tsx
import React from 'react';
import { Button } from '../../ui/Button/Button';
import '../../../styles/admin/ui/Header.css';
// import { Input } from '../../ui/Input/Input'; // Если будут фильтры

interface RouteCategoriesHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  // filterSearch?: string;
  // onSearchFilterChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RouteCategoriesHeader: React.FC<RouteCategoriesHeaderProps> = ({
  isLoading,
  onShowForm,
  // filterSearch,
  // onSearchFilterChange,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Категории Маршрутов</h2>
        <Button onClick={onShowForm} disabled={isLoading} customVariant="save" variant="success">
          Добавить Категорию
        </Button>
      </div>

      {/* Место для фильтров */}
      {/* <div className="page-header-filters">
        <Input
          type="text"
          name="search_route_category"
          placeholder="Поиск по названию..."
          value={filterSearch}
          onChange={onSearchFilterChange}
          disabled={isLoading}
          className="filter-item" // Если используешь такой класс для стилизации
        />
      </div> */}
    </div>
  );
};