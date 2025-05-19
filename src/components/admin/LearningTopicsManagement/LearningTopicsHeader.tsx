// src/components/admin/LearningTopicsManagement/LearningTopicsHeader.tsx
import React from 'react';
import type { LearningTopicsHeaderProps } from '../../../types/admin/LearningTopics/learningTopic_props.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import '../../../styles/admin/ui/Header.css';

export const LearningTopicsHeader: React.FC<LearningTopicsHeaderProps> = ({
  isLoading,
  onShowForm,
  // filterNameInput, // Раскомментируй, если будут фильтры
  // onFilterNameChange,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Управление Темами Обучения</h2>
        <Button onClick={onShowForm} disabled={isLoading} customVariant="save">
          Добавить Тему
        </Button>
      </div>
      {/* 
      <div className="page-header-filters">
        <Input
          type="text"
          placeholder="Фильтр по названию темы..."
          value={filterNameInput}
          onChange={onFilterNameChange}
          disabled={isLoading}
        />
      </div>
      */}
    </div>
  );
};