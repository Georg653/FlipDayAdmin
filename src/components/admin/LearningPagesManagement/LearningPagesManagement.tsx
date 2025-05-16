// src/components/admin/LearningPagesManagement/LearningPagesManagement.tsx
import React from 'react';
import { LearningPagesHeader } from './LearningPagesHeader';
import { LearningPagesTable } from './LearningPagesTable';
import { LearningPageForm } from './LearningPageForm';
import { useLearningPagesManagement } from '../../../hooks/admin/LearningPagesManagement/useLearningPagesManagement';
import '../../../styles/admin/ui/PageLayout.css';

export const LearningPagesManagement: React.FC = () => {
  const {
    learningPages,
    loading,
    error,
    currentPage,
    totalItems,
    itemsPerPage,
    handlePreviousPage,
    handleNextPage,
    currentSubtopicId,       // Число или null
    setCurrentSubtopicId,    // Функция (string) => void
    // subtopicOptions,      // Если будет API для подтем
    // loadingSubtopics,     // Если будет API для подтем
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    showForm,
    setShowForm,
    learningPageToEdit,
    subtopicIdForForm,       // Передаем в форму
  } = useLearningPagesManagement();

  // Преобразуем currentSubtopicId (number | null) в строку для инпута
  const currentSubtopicIdInputValue = currentSubtopicId === null ? "" : currentSubtopicId.toString();

  return (
    <div className="page-container">
      <LearningPagesHeader
        isLoading={loading /*|| loadingSubtopics*/}
        onShowForm={handleShowAddForm}
        currentSubtopicIdInput={currentSubtopicIdInputValue}
        onSubtopicIdChange={setCurrentSubtopicId} // Передаем обработчик из хука
        // subtopicOptions={subtopicOptions}
        // loadingSubtopics={loadingSubtopics}
        // selectedSubtopicName={subtopicOptions?.find(opt => opt.id === currentSubtopicId)?.name}
      />

    
      {showForm && (
        <LearningPageForm
          setShowForm={setShowForm}
          learningPageToEdit={learningPageToEdit}
          onSuccess={handleFormSuccess}
          subtopicIdForCreate={subtopicIdForForm} // <--- Теперь типы должны совпадать
        />
      )}


      <LearningPagesTable
        learningPages={learningPages}
        isLoading={loading}
        error={error} // Передаем ошибку в таблицу
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalItems={totalItems} // Помним, что это будет неточным
        itemsPerPage={itemsPerPage}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        // currentSubtopicId={currentSubtopicId} // Можно передать для информации
      />
    </div>
  );
};