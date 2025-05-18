// src/components/admin/LearningSubtopicsManagement/LearningSubtopicsManagement.tsx
import React from 'react';
import { LearningSubtopicsHeader } from './LearningSubtopicsHeader';
import { LearningSubtopicsTable } from './LearningSubtopicsTable';
import { LearningSubtopicForm } from './LearningSubtopicForm';
import { useLearningSubtopicsManagement } from '../../../hooks/admin/LearningSubtopicsManagement/useLearningSubtopicsManagement';
import { useLearningSubtopicForm } from '../../../hooks/admin/LearningSubtopicsManagement/useLearningSubtopicForm'; // Импортируем хук формы
import type { LearningSubtopic } from '../../../types/admin/LearningSubtopics/learningSubtopic.types'; // Для onSuccess
import '../../../styles/admin/ui/PageLayout.css';

export const LearningSubtopicsManagement: React.FC = () => {
  const {
    learningSubtopics, loading, error, currentPage, totalItems, itemsPerPage,
    handlePreviousPage, handleNextPage, currentTopicId, setCurrentTopicId,
    topicOptions, loadingTopics, 
    handleEdit: openEditForm, // Переименуем, чтобы не конфликтовать с formLogic
    handleShowAddForm: openAddForm, // Переименуем
    handleDelete,
    showForm, setShowForm, learningSubtopicToEdit, topicIdForForm,
  } = useLearningSubtopicsManagement();

  const currentTopicIdInputValue = currentTopicId === null ? "" : currentTopicId.toString();

  // Вызываем хук формы здесь
  const formLogic = useLearningSubtopicForm({
    onSuccess: (savedSubtopic: LearningSubtopic) => {
      setShowForm(false); // Закрываем форму
      // Хук useLearningSubtopicsManagement должен сам обновить список,
      // так как его fetchLearningSubtopics зависит от currentPage, currentTopicId и т.д.
      // Мы можем вызвать его функцию для перезагрузки, если она есть,
      // или он сам обновится, если его зависимости (например, currentTopicId) изменились.
      // В нашем useLearningSubtopicsManagement.ts handleFormSuccess уже вызывает fetchLearningSubtopics.
      // Поэтому здесь дополнительно ничего не нужно, кроме setShowForm(false) и formLogic.resetForm().
      // Для чистоты, убедимся, что resetForm вызывается.
      console.log("Форма успешно отправлена (Subtopic), данные:", savedSubtopic);
      formLogic.resetForm(); // Сбрасываем данные формы после успешной отправки
      // Если нужно принудительно обновить список сразу (хотя useLearningSubtopicsManagement должен это делать):
      // fetchLearningSubtopics(); // Эта функция должна быть экспортирована из useLearningSubtopicsManagement
    },
    learningSubtopicToEdit: learningSubtopicToEdit,
    topicIdForCreate: topicIdForForm,
  });

  const handleActualShowAddForm = () => {
    formLogic.resetForm(); // Сбрасываем/инициализируем форму перед открытием
    openAddForm(); // Это вызовет setLearningSubtopicToEdit(null), setTopicIdForForm(currentTopicId), setShowForm(true)
  };
  
  const handleActualEdit = (subtopic: LearningSubtopic) => {
    formLogic.resetForm(); // Сбрасываем/инициализируем форму перед открытием на редактирование
    openEditForm(subtopic); // Это вызовет setLearningSubtopicToEdit(subtopic), setTopicIdForForm(subtopic.topic_id), setShowForm(true)
  };

  const handleCancelForm = () => {
    setShowForm(false);
    formLogic.resetForm();
  };

  return (
    <div className="page-container">
      <LearningSubtopicsHeader
        isLoading={loading || loadingTopics}
        onShowForm={handleActualShowAddForm} // Используем новый обработчик
        currentTopicIdInput={currentTopicIdInputValue}
        onTopicIdChange={setCurrentTopicId}
        topicOptions={topicOptions}
        loadingTopics={loadingTopics}
      />

      {showForm && (
        <LearningSubtopicForm
          formData={formLogic.formData}
          isSubmitting={formLogic.isSubmitting}
          formError={formLogic.formError}
          handleChange={formLogic.handleChange}
          handleFileChange={formLogic.handleFileChange}
          handleSubmit={formLogic.handleSubmit}
          setShowForm={setShowForm} // Для кнопки "Отмена", чтобы она могла закрыть форму
          handleCancel={handleCancelForm} // Передаем обработчик отмены
          learningSubtopicToEdit={learningSubtopicToEdit} // Для заголовка формы
          topicOptions={topicOptions} // Для будущего селекта
        />
      )}

      <LearningSubtopicsTable
        learningSubtopics={learningSubtopics}
        isLoading={loading}
        error={error}
        onEdit={handleActualEdit} // Используем новый обработчик
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