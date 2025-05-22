// src/components/admin/StoriesManagement/StoriesHeader.tsx
import React from 'react';
import { Button } from '../../ui/Button/Button';
import { Select } from '../../ui/Select/Select'; // Наш простой нативный селект
import { STORY_IS_ACTIVE_FILTER_OPTIONS } from '../../../constants/admin/Stories/stories.constants';
import '../../../styles/admin/ui/Header.css';

interface StoriesHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  filterIsActive: boolean | null; // null для "все", true для "активные", false для "неактивные"
  onIsActiveFilterChange: (value: string) => void; // value будет "all", "true", "false"
}

export const StoriesHeader: React.FC<StoriesHeaderProps> = ({
  isLoading,
  onShowForm,
  filterIsActive,
  onIsActiveFilterChange,
}) => {
  // Преобразуем boolean | null в строку для значения селекта
  const selectValue = filterIsActive === null ? "all" : filterIsActive ? "true" : "false";

  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Управление Историями</h2>
        <Button onClick={onShowForm} disabled={isLoading} customVariant="save" variant="success">
          Добавить Историю
        </Button>
      </div>

      <div className="page-header-filters"> {/* Раскомментировал блок для фильтров */}
        <div className="filter-item" style={{ minWidth: '200px' }}> {/* Добавил minWidth для селекта */}
          <Select
            id="is_active_filter_story"
            label="Фильтр по активности:"
            value={selectValue}
            onChange={(e) => onIsActiveFilterChange(e.target.value)}
            options={STORY_IS_ACTIVE_FILTER_OPTIONS}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};