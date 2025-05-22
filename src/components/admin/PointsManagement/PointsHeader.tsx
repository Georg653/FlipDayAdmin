// src/components/admin/PointsManagement/PointsHeader.tsx
import React from 'react';
import { Button } from '../../ui/Button/Button';
import '../../../styles/admin/ui/Header.css';
// import { Input } from '../../ui/Input/Input';
// import { Select } from '../../ui/Select/Select'; // Если будет фильтр по категориям

// interface RouteCategoryOption { id: number; name: string; } // Тип для опций категорий

interface PointsHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  // filterSearch?: string;
  // onSearchFilterChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // filterCategory?: string;
  // onCategoryFilterChange?: (value: string) => void;
  // routeCategories?: RouteCategoryOption[]; // Для селекта категорий
}

export const PointsHeader: React.FC<PointsHeaderProps> = ({
  isLoading,
  onShowForm,
  // filterSearch,
  // onSearchFilterChange,
  // filterCategory,
  // onCategoryFilterChange,
  // routeCategories = [],
}) => {
  // const categoryOptions = routeCategories.map(cat => ({ value: cat.id.toString(), label: cat.name }));
  // categoryOptions.unshift({ value: '', label: 'Все категории'});

  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Точки (Локации)</h2>
        <Button onClick={onShowForm} disabled={isLoading} customVariant="save" variant="success">
          Добавить Точку
        </Button>
      </div>

      {/* 
      <div className="page-header-filters grid-filters"> // Пример фильтров
        <Input
          type="text"
          name="search_point"
          placeholder="Поиск по названию..."
          value={filterSearch}
          onChange={onSearchFilterChange}
          disabled={isLoading}
          className="filter-item"
        />
        <Select
            id="category_filter_point"
            name="category_filter"
            label="Фильтр по категории:"
            value={filterCategory}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            options={categoryOptions}
            disabled={isLoading}
            className="filter-item"
        />
      </div>
      */}
    </div>
  );
};