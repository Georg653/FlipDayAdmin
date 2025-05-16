// src/hooks/admin/LearningPagesManagement/useLearningPagesManagement.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  LearningPage,
  LearningPageFilterParams,
  // PaginatedLearningPagesResponse, // API не возвращает эту структуру для списка
  // SubtopicOption, // Если будет API для подтем
} from '../../../types/admin/LearningPages/learningPage.types';
import { LearningPagesApi } from '../../../services/admin/LearningPages/learningPagesApi';
import { ITEMS_PER_PAGE_LEARNING_PAGES } from '../../../constants/admin/LearningPages/learningPages.constants';
// import { useNotification } from '../../../contexts/admin/NotificationContext';
// import { useDebounce } from '../Other/useDebounce';

export const useLearningPagesManagement = () => {
  // const { showNotification } = useNotification();

  const [learningPages, setLearningPages] = useState<LearningPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // Это будет проблемой, см. ниже
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_LEARNING_PAGES);

  // Состояние для выбранного/введенного subtopic_id
  const [currentSubtopicId, setCurrentSubtopicId] = useState<number | null>(null);
  // const [subtopicOptions, setSubtopicOptions] = useState<SubtopicOption[]>([]); // Для селекта
  // const [loadingSubtopics, setLoadingSubtopics] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [learningPageToEdit, setLearningPageToEdit] = useState<LearningPage | null>(null);
  // Для передачи subtopic_id в форму при редактировании или создании в контексте подтемы
  const [subtopicIdForForm, setSubtopicIdForForm] = useState<number | null>(null);


  // Загрузка списка подтем (если будет API)
  /*
  const fetchSubtopics = useCallback(async () => {
    setLoadingSubtopics(true);
    try {
      const response = await LearningPagesApi.getSubtopics({ limit: 1000 }); // Загружаем много
      setSubtopicOptions(response.items);
      if (response.items.length > 0 && !currentSubtopicId) {
        // setCurrentSubtopicId(response.items[0].id); // Выбрать первую подтему по умолчанию
      }
    } catch (err) {
      console.error("Failed to load subtopics", err);
      // showNotification?.('Failed to load subtopics.', 'error');
    } finally {
      setLoadingSubtopics(false);
    }
  }, [currentSubtopicId]);

  useEffect(() => {
    // fetchSubtopics();
  }, [fetchSubtopics]);
  */

  const fetchLearningPages = useCallback(async () => {
    if (!currentSubtopicId) {
      setLearningPages([]);
      setTotalItems(0);
      setError("Пожалуйста, выберите или введите ID подтемы.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params: LearningPageFilterParams = {
        offset: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      };
      // API возвращает PaginatedLearningPagesResponse, где total - это заглушка
      const response = await LearningPagesApi.getLearningPagesForSubtopic(currentSubtopicId, params);
      setLearningPages(response.items);
      
      // ВАЖНО: API не возвращает реальный total.
      // Если response.items.length < itemsPerPage, это может быть последняя страница.
      // Если response.items.length === itemsPerPage, может быть еще.
      // Без total от API, пагинация будет неточной.
      // Пока что, если пришло меньше, чем itemsPerPage, считаем, что это все.
      // Если пришло ровно itemsPerPage, предполагаем, что может быть еще одна страница.
      if (response.items.length < itemsPerPage) {
        setTotalItems((currentPage - 1) * itemsPerPage + response.items.length);
      } else {
        // Это лишь догадка, что есть еще одна страница.
        setTotalItems(currentPage * itemsPerPage + 1); 
      }
      if (response.items.length === 0 && currentPage === 1) {
          setTotalItems(0);
      }


    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось загрузить страницы обучения.';
      if (err.response?.status === 404 && err.response?.data?.detail?.includes("Subtopic")) {
        setError(`Подтема с ID ${currentSubtopicId} не найдена.`);
      } else {
        setError(message);
      }
      // showNotification?.(message, 'error');
      console.error(message, err);
      setLearningPages([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentSubtopicId, currentPage, itemsPerPage]);

  useEffect(() => {
    // Загружаем страницы только если выбран subtopic_id
    if (currentSubtopicId) {
      fetchLearningPages();
    } else {
      setLearningPages([]); // Очищаем, если subtopic_id не выбран
      setTotalItems(0);
    }
  }, [currentSubtopicId, fetchLearningPages]); // Перезагрузка при смене subtopic_id

  const handleSubtopicChange = (subtopicIdString: string) => {
    const id = parseInt(subtopicIdString, 10);
    setCurrentSubtopicId(isNaN(id) || id <= 0 ? null : id);
    setCurrentPage(1); // Сброс на первую страницу при смене подтемы
    setError(null);
  };

  const handleEdit = useCallback((page: LearningPage) => {
    setLearningPageToEdit(page);
    setSubtopicIdForForm(currentSubtopicId); // Передаем текущий subtopic_id в форму
    setShowForm(true);
  }, [currentSubtopicId]);

  const handleShowAddForm = useCallback(() => {
    if (!currentSubtopicId) {
        // showNotification?.("Сначала выберите подтему!", "warning");
        alert("Сначала выберите или введите ID подтемы!");
        setError("Сначала выберите или введите ID подтемы, для которой хотите создать страницу.");
        return;
    }
    setLearningPageToEdit(null);
    setSubtopicIdForForm(currentSubtopicId); // Передаем текущий subtopic_id в форму
    setShowForm(true);
  }, [currentSubtopicId]);

  const handleDelete = async (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Вы уверены, что хотите удалить эту страницу обучения?')) {
      return;
    }
    setError(null);
    try {
      await LearningPagesApi.deleteLearningPage(id);
      // showNotification?.('Страница обучения успешно удалена!', 'success');
      console.log('Страница обучения успешно удалена!');
      if (learningPages.length === 1 && currentPage > 1) {
        setCurrentPage(prevPage => prevPage - 1);
      } else {
        fetchLearningPages();
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось удалить страницу обучения.';
      // showNotification?.(message, 'error');
      console.error(message, err);
      setError(message);
    }
  };

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setLearningPageToEdit(null);
    setSubtopicIdForForm(null);
    fetchLearningPages();
  }, [fetchLearningPages]);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setLearningPageToEdit(null);
    setSubtopicIdForForm(null);
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    // Логика для totalItems здесь будет неточной
    const totalPagesGuess = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPagesGuess || learningPages.length === itemsPerPage) { // Если набрали полную страницу, предполагаем что есть следующая
        setCurrentPage(prevPage => prevPage + 1);
    }
  }, [currentPage, totalItems, itemsPerPage, learningPages.length]);

  return {
    learningPages,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalItems,
    itemsPerPage,
    setItemsPerPage,
    handlePreviousPage,
    handleNextPage,
    currentSubtopicId,
    setCurrentSubtopicId: handleSubtopicChange, // Обработчик изменения subtopic_id
    // subtopicOptions, // Для селекта
    // loadingSubtopics, // Для селекта
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    handleCancelForm,
    showForm,
    setShowForm,
    learningPageToEdit,
    subtopicIdForForm, // Передаем в AchievementsManagement для формы
  };
};