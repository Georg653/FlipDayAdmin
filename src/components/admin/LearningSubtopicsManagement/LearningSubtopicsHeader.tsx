// src/components/admin/LearningSubtopicsManagement/LearningSubtopicsHeader.tsx
import React from 'react';
import type { LearningSubtopicsHeaderProps } from '../../../types/admin/LearningSubtopics/learningSubtopic_props.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
// import { Select } from '../../ui/Select/Select';
import '../../../styles/admin/ui/Header.css';

export const LearningSubtopicsHeader: React.FC<LearningSubtopicsHeaderProps> = ({
  isLoading,
  onShowForm,
  currentTopicIdInput,
  onTopicIdChange,
  topicOptions,
  loadingTopics,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    onTopicIdChange(value);
  };

  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Управление Подтемами Обучения</h2>
        <Button 
          onClick={onShowForm} 
          disabled={isLoading || !currentTopicIdInput.trim()}
          customVariant="save"
          title={!currentTopicIdInput.trim() ? "Сначала введите ID темы" : "Добавить подтему"}
        >
          Добавить подтему
        </Button>
      </div>

      <div className="page-header-filters" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--admin-border-color, #e0e0e0)' }}>
        <div className="filter-item" style={{ maxWidth: '300px' }}>
          <label htmlFor="topic_id_filter_lst" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
            ID Темы (для просмотра/добавления подтем)*
          </label>
          <Input
            id="topic_id_filter_lst"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="topic_id_filter"
            placeholder="Введите ID темы"
            value={currentTopicIdInput}
            onChange={handleInputChange}
            disabled={isLoading || loadingTopics}
          />
          {/* 
          <Select
            id="topic_id_filter_lst"
            name="topic_id_filter"
            label="Выберите Тему*"
            value={currentTopicIdInput}
            onChange={(e) => onTopicIdChange(e.target.value)}
            options={topicOptions || []}
            placeholder="Выберите тему из списка"
            disabled={isLoading || loadingTopics}
            required
          />
          */}
        </div>
      </div>
    </div>
  );
};