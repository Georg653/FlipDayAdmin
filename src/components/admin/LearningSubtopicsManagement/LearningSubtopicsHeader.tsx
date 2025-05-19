// src/components/admin/LearningSubtopicsManagement/LearningSubtopicsHeader.tsx
import React from 'react';
import type { LearningSubtopicsHeaderProps } from '../../../types/admin/LearningSubtopics/learningSubtopic_props.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Select } from '../../ui/Select/Select';
import type { SelectOption as UiSelectOption } from '../../ui/Select/Select';
import '../../../styles/admin/ui/Header.css';

export const LearningSubtopicsHeader: React.FC<LearningSubtopicsHeaderProps> = ({
  isLoading,
  onShowForm,
  currentTopicIdInput,
  onTopicIdChange,
  topicOptions, // Это LearningTopicOptionForSelect[] | undefined (если хук еще не отработал)
  loadingTopics,
}) => {

  // Более безопасное преобразование
  const uiTopicSelectOptions: UiSelectOption[] = 
    Array.isArray(topicOptions) // Проверяем, что это массив
      ? topicOptions.map(topic => ({ value: topic.id.toString(), label: topic.name }))
      : []; // Если не массив (например, undefined на первом рендере), то пустой массив

  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Управление Подтемами Обучения</h2>
        <Button 
          onClick={onShowForm} 
          disabled={isLoading || loadingTopics || !currentTopicIdInput.trim()}
          customVariant="save"
          title={!currentTopicIdInput.trim() ? "Сначала выберите тему" : "Добавить подтему"}
        >
          Добавить подтему
        </Button>
      </div>

      <div className="page-header-filters" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--admin-border-color, #e0e0e0)' }}>
        <div className="filter-item" style={{ maxWidth: '400px' }}>
          {loadingTopics ? (
            <p>Загрузка тем...</p>
          ) : uiTopicSelectOptions.length > 0 ? ( // Проверяем длину uiTopicSelectOptions
            <Select
              id="topic_id_filter_lst_select"
              name="topic_id_filter_select"
              label="Выберите Тему*"
              value={currentTopicIdInput}
              onChange={(e) => onTopicIdChange(e.target.value)}
              options={uiTopicSelectOptions} // Передаем уже преобразованные опции
              placeholder="-- Выберите тему --"
              disabled={isLoading}
              required
            />
          ) : (
            <>
              <label htmlFor="topic_id_filter_lst_input_fallback" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                ID Темы (введите вручную)*
              </label>
              <Input
                id="topic_id_filter_lst_input_fallback"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="topic_id_filter_input_fallback"
                placeholder="ID темы (темы не загружены)"
                value={currentTopicIdInput}
                onChange={(e) => onTopicIdChange(e.target.value.replace(/[^0-9]/g, ''))}
                disabled={isLoading}
              />
              {!loadingTopics && <small>Не удалось загрузить список тем или тем нет. Введите ID вручную.</small>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};