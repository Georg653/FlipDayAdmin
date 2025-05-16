// src/components/admin/LearningPagesManagement/LearningPagesHeader.tsx
import React from 'react';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
// import { Select, SelectOption } from '../../ui/Select/Select'; // Если будет API для подтем
import '../../../styles/admin/ui/Header.css';

interface LearningPagesHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  currentSubtopicIdInput: string; // Значение для инпута subtopic_id
  onSubtopicIdChange: (value: string) => void; // Обработчик изменения инпута
  // subtopicOptions?: SelectOption[]; // Опции для селекта подтем, если будет
  // loadingSubtopics?: boolean; // Для индикации загрузки подтем
  // selectedSubtopicName?: string; // Для отображения названия выбранной подтемы
}

export const LearningPagesHeader: React.FC<LearningPagesHeaderProps> = ({
  isLoading,
  onShowForm,
  currentSubtopicIdInput,
  onSubtopicIdChange,
  // subtopicOptions,
  // loadingSubtopics,
  // selectedSubtopicName,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Позволяем вводить только цифры
    const value = e.target.value.replace(/[^0-9]/g, '');
    onSubtopicIdChange(value);
  };

  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Управление Страницами Обучения</h2>
        <Button 
          onClick={onShowForm} 
          disabled={isLoading || !currentSubtopicIdInput.trim()} // Блокируем, если ID подтемы не введен
          customVariant="save"
          title={!currentSubtopicIdInput.trim() ? "Сначала введите ID подтемы" : "Добавить страницу"}
        >
          Добавить страницу
        </Button>
      </div>

      <div className="page-header-filters" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--admin-border-color, #e0e0e0)' }}>
        <div className="filter-item" style={{ maxWidth: '300px' }}>
          <label htmlFor="subtopic_id_filter_lp" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
            ID Подтемы (для просмотра/добавления страниц)*
          </label>
          <Input
            id="subtopic_id_filter_lp"
            type="text" // Используем text, чтобы применить replace для цифр
            inputMode="numeric" // Подсказка для мобильных клавиатур
            pattern="[0-9]*"
            name="subtopic_id_filter"
            placeholder="Введите ID подтемы"
            value={currentSubtopicIdInput}
            onChange={handleInputChange}
            disabled={isLoading /* || loadingSubtopics */}
          />
          {/* {selectedSubtopicName && <p style={{marginTop: '0.25rem', fontSize: '0.9em'}}>Выбрана подтема: {selectedSubtopicName}</p>} */}
          {/* Если будет API для подтем:
           <Select
             id="subtopic_id_filter_lp"
             name="subtopic_id_filter"
             label="Выберите Подтему*"
             value={currentSubtopicIdInput}
             onChange={(e) => onSubtopicIdChange(e.target.value)} // или кастомный обработчик для селекта
             options={subtopicOptions || []}
             placeholder="Выберите подтему из списка"
             disabled={isLoading || loadingSubtopics}
             required
           />
          */}
        </div>
        {/* Другие фильтры здесь, если понадобятся */}
      </div>
    </div>
  );
};