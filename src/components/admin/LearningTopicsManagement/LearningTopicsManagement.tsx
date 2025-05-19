// src/components/admin/LearningTopicsManagement/LearningTopicsManagement.tsx
import React from 'react';
import { LearningTopicsHeader } from './LearningTopicsHeader';
import { LearningTopicsTable } from './LearningTopicsTable';
import { LearningTopicForm } from './LearningTopicForm';
import { useLearningTopicsManagement } from '../../../hooks/admin/LearningTopicsManagement/useLearningTopicsManagement';
import { useLearningTopicForm } from '../../../hooks/admin/LearningTopicsManagement/useLearningTopicForm';
import type { LearningTopic } from '../../../types/admin/LearningTopics/learningTopic.types';
import '../../../styles/admin/ui/PageLayout.css';

export const LearningTopicsManagement: React.FC = () => {
  const {
    learningTopics, loading, error, currentPage, totalItems, itemsPerPage,
    handlePreviousPage, handleNextPage, filterName, handleFilterNameChange,
    handleEdit, handleShowAddForm, handleDelete,
    showForm, setShowForm, learningTopicToEdit,
  } = useLearningTopicsManagement();

  const formLogic = useLearningTopicForm({
    onSuccess: (savedTopic: LearningTopic) => {
      setShowForm(false);
      // Хук useLearningTopicsManagement должен сам обновить список через свой handleFormSuccess
      // или мы должны вызвать функцию перезагрузки оттуда, если она экспортируется.
      // В нашем useLearningTopicsManagement.ts handleFormSuccess вызывает fetchLearningTopics.
      console.log("Тема успешно сохранена:", savedTopic);
      // formLogic.resetForm(); // Вызывается внутри хука или при следующем открытии
    },
    learningTopicToEdit: learningTopicToEdit,
  });
  
  const handleActualShowAddForm = () => {
    formLogic.resetForm();
    handleShowAddForm(); // из useLearningTopicsManagement
  };

  const handleActualEdit = (topic: LearningTopic) => {
    formLogic.resetForm(); // Сброс перед заполнением новыми данными
    handleEdit(topic); // из useLearningTopicsManagement, он установит learningTopicToEdit
  };

  const handleCancelForm = () => {
    setShowForm(false);
    formLogic.resetForm();
  };

  return (
    <div className="page-container">
      <LearningTopicsHeader
        isLoading={loading}
        onShowForm={handleActualShowAddForm}
        // filterNameInput={filterName} // Раскомментируй для фильтра
        // onFilterNameChange={handleFilterNameChange}
      />

      {showForm && (
        <LearningTopicForm
          formData={formLogic.formData}
          isSubmitting={formLogic.isSubmitting}
          formError={formLogic.formError}
          handleChange={formLogic.handleChange}
          handleFileChange={formLogic.handleFileChange}
          handleSubmit={formLogic.handleSubmit}
          setShowForm={setShowForm} // Для управления извне (хотя handleCancel есть)
          handleCancel={handleCancelForm}
          learningTopicToEdit={learningTopicToEdit}
        />
      )}

      <LearningTopicsTable
        learningTopics={learningTopics}
        isLoading={loading}
        error={error}
        onEdit={handleActualEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
    </div>
  );
};