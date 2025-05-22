// src/components/admin/RoutesManagement/RoutesHeader.tsx
import React from 'react';
import type { RouteCategory } from '../../../types/admin/Routes/route.types';
import { Button } from '../../ui/Button/Button';
import { Select } from '../../ui/Select/Select'; // Предполагаем, что Select принимает options: {value: string, label: string}[]
import '../../../styles/admin/ui/Header.css';
// import { Input } from '../../ui/Input/Input'; // Для поиска, если будет

interface RoutesHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  filterCategoryId: string | number; // Значение для селекта категорий
  onCategoryFilterChange: (value: string) => void; // Обработчик изменения селекта
  routeCategories: Pick<RouteCategory, 'id' | 'name'>[]; // Список категорий для селекта
  loadingRouteCategories: boolean;
  // filterSearch?: string;
  // onSearchFilterChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RoutesHeader: React.FC<RoutesHeaderProps> = ({
  isLoading,
  onShowForm,
  filterCategoryId,
  onCategoryFilterChange,
  routeCategories,
  loadingRouteCategories,
  // filterSearch,
  // onSearchFilterChange,
}) => {
  const categoryOptions = [
    { value: "", label: "Все категории" }, // Опция для сброса фильтра
    ...routeCategories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
  ];

  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Маршруты</h2>
        <Button onClick={onShowForm} disabled={isLoading} customVariant="save" variant="success">
          Добавить Маршрут
        </Button>
      </div>

      <div className="page-header-filters"> {/* Оставляем обертку для фильтров */}
        <div className="filter-item" style={{minWidth: '250px'}}> {/* Обертка для селекта */}
          <Select
            id="route_category_filter"
            name="route_category_filter"
            label="Фильтр по категории:"
            value={filterCategoryId.toString()} // Селект ожидает строку
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            options={categoryOptions}
            disabled={isLoading || loadingRouteCategories}
            placeholder={loadingRouteCategories ? "Загрузка категорий..." : undefined}
          />
        </div>
        {/* 
        <Input
          type="text"
          name="search_route"
          placeholder="Поиск по названию..."
          value={filterSearch}
          onChange={onSearchFilterChange}
          disabled={isLoading}
          className="filter-item"
        />
        */}
      </div>
    </div>
  );
};