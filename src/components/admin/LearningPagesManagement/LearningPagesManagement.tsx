// --- Путь: src/components/admin/LearningPagesManagement/LearningPagesManagement.tsx ---

import React from 'react';
import { useLearningPagesManagement } from '../../../hooks/admin/LearningPagesManagement/useLearningPagesManagement';
import { LearningPagesHeader } from './LearningPagesHeader';
import { LearningPagesTable } from './LearningPagesTable';
import { LearningPageForm } from './LearningPageForm';
import { Modal } from '../../ui/Modal/Modal';
import '../../../styles/admin/ui/PageLayout.css';

export const LearningPagesManagement: React.FC = () => {
  const {
    topics, selectedTopicId, handleTopicChange,
    subtopics, selectedSubtopicId, handleSubtopicChange,
    pages, error, isLoading,
    handleEdit, handleDelete, handleShowAddForm, handleFormSuccess,
    showForm, setShowForm, pageToEdit,
    currentPage, canGoNext, canGoPrevious,
    handleNextPage, handlePreviousPage,
    parentSubtopicId, // ID подтемы для создания новой страницы
  } = useLearningPagesManagement();

  return (
    <div className="page-container">
      <LearningPagesHeader
        isLoading={isLoading}
        onShowForm={handleShowAddForm}
        topics={topics}
        subtopics={subtopics}
        selectedTopicId={selectedTopicId}
        selectedSubtopicId={selectedSubtopicId}
        onTopicChange={handleTopicChange}
        onSubtopicChange={handleSubtopicChange}
        isAddButtonDisabled={!selectedSubtopicId} // Кнопка "Добавить" неактивна, пока не выбрана подтема
      />

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={pageToEdit ? 'Редактировать страницу' : 'Создать новую страницу'}
        size="xl" // Используем большой размер для конструктора
      >
        <LearningPageForm
          pageToEdit={pageToEdit}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
          parentSubtopicId={parentSubtopicId} // Передаем ID подтемы для новой страницы
        />
      </Modal>

      <LearningPagesTable
        pages={pages}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
      />
    </div>
  );
};