// --- Путь: src/components/admin/RoutesManagement/RoutesHeader.tsx ---

import React from 'react';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Select } from '../../ui/Select/Select';
import type { SelectOption } from '../../ui/Select/Select';
import type { RoutesHeaderProps } from '../../../types/admin/Routes/route_props.types';
import '../../../styles/admin/ui/Header.css';

export const RoutesHeader: React.FC<RoutesHeaderProps> = ({
  isLoading,
  onShowForm,
  categories,
  categoryFilter,
  onCategoryFilterChange,
  searchFilter,
  onSearchFilterChange,
}) => {
  // Преобразуем загруженные категории в формат для компонента Select
  const categoryOptions: SelectOption[] = [
    { value: 'all', label: 'Все категории' },
    ...categories.map(cat => ({ value: String(cat.id), label: cat.name })),
  ];

  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Управление маршрутами</h2>
        <Button onClick={onShowForm} disabled={isLoading} variant="success">
          Добавить маршрут
        </Button>
      </div>

      <div className="page-header-filters">
        <Input
          type="text"
          name="search_filter"
          placeholder="Поиск по названию..."
          value={searchFilter}
          onChange={onSearchFilterChange}
          disabled={isLoading}
          className="filter-item"
        />
        <Select
          id="route-category-filter"
          label="Фильтр по категории"
          options={categoryOptions}
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          disabled={isLoading || categories.length === 0}
          className="filter-item"
        />
      </div>
    </div>
  );
};