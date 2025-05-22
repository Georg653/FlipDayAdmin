// src/hooks/admin/LearningSubtopicsManagement/useLearningSubtopicsManagement.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  LearningSubtopic,
  LearningSubtopicFilterParams,
} from '../../../types/admin/LearningSubtopics/learningSubtopic.types';
import type { TopicOption as LearningTopicOptionForSelect } from '../../../types/admin/LearningTopics/learningTopic.types';
import { LearningSubtopicsApi } from '../../../services/admin/LearningSubtopics/learningSubtopicsApi';
import { ITEMS_PER_PAGE_LEARNING_SUBTOPICS } from '../../../constants/admin/LearningSubtopics/learningSubtopics.constants';

export const useLearningSubtopicsManagement = () => {
  const [learningSubtopics, setLearningSubtopics] = useState<LearningSubtopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Убедимся, что это всегда строка
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_LEARNING_SUBTOPICS);
  const [currentTopicId, setCurrentTopicId] = useState<number | null>(null);
  const [topicOptions, setTopicOptions] = useState<LearningTopicOptionForSelect[]>([]);
  const [loadingTopics, setLoadingTopics] = useState<boolean>(false);
  const [showForm, setShowForm] = useState(false);
  const [learningSubtopicToEdit, setLearningSubtopicToEdit] = useState<LearningSubtopic | null>(null);
  const [topicIdForForm, setTopicIdForForm] = useState<number | null>(null);

  const parseErrorMessage = (err: any, defaultMessage: string): string => {
    const detail = err.response?.data?.detail;
    if (Array.isArray(detail)) {
      return detail.map((e: any) => `${e.loc?.join('->') || 'field'}: ${e.msg}`).join('; ');
    }
    return String(detail || defaultMessage);
  };

  const fetchTopics = useCallback(async () => {
    setLoadingTopics(true);
    setError(null);
    try {
      const response = await LearningSubtopicsApi.getTopics(); // Убрали параметры
      setTopicOptions(response.items);
    } catch (err: any) {
      const errorMessage = parseErrorMessage(err, 'Не удалось загрузить список тем.');
      console.error("Failed to load topics for select:", errorMessage, err);
      setError(errorMessage);
      setTopicOptions([]);
    } finally {
      setLoadingTopics(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const fetchLearningSubtopics = useCallback(async () => {
    if (!currentTopicId) {
      setLearningSubtopics([]);
      setTotalItems(0);
      setError("Пожалуйста, выберите тему для отображения подтем.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params: LearningSubtopicFilterParams = {
        offset: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      };
      const response = await LearningSubtopicsApi.getLearningSubtopicsForTopic(currentTopicId, params);
      setLearningSubtopics(response.items);
      if (response.items.length < itemsPerPage) {
        setTotalItems((currentPage - 1) * itemsPerPage + response.items.length);
      } else {
        setTotalItems(currentPage * itemsPerPage + 1); 
      }
      if (response.items.length === 0 && currentPage === 1) {
          setTotalItems(0);
      }
    } catch (err: any) {
      let errorMessage = parseErrorMessage(err, 'Не удалось загрузить подтемы.');
      if (err.response?.status === 404 && typeof err.response?.data?.detail === 'string' && err.response.data.detail.includes("Topic with id")) {
        errorMessage = `Тема с ID ${currentTopicId} не найдена или не содержит подтем.`;
      }
      setError(errorMessage);
      setLearningSubtopics([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentTopicId, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentTopicId) {
      fetchLearningSubtopics();
    } else {
      setLearningSubtopics([]);
      setTotalItems(0);
      if (topicOptions.length > 0) {
        setError("Пожалуйста, выберите тему для отображения подтем.");
      } else if (!loadingTopics && error === null) { // Если темы не грузятся и нет другой ошибки
        // setError("Список тем пуст или не удалось загрузить."); // Можно добавить это, если fetchTopics завершился без ошибок, но список пуст
      }
    }
  }, [currentTopicId, fetchLearningSubtopics, topicOptions.length, loadingTopics, error]); // Добавил error в зависимости

  const handleTopicChange = (topicIdString: string) => {
    const id = parseInt(topicIdString, 10);
    setCurrentTopicId(isNaN(id) || id <= 0 ? null : id);
    setCurrentPage(1);
    setError(null);
  };

  const handleEdit = useCallback((subtopic: LearningSubtopic) => {
    setLearningSubtopicToEdit(subtopic);
    setTopicIdForForm(subtopic.topic_id);
    setShowForm(true);
  }, []);

  const handleShowAddForm = useCallback(() => {
    if (!currentTopicId) {
      alert("Сначала выберите тему!");
      setError("Сначала выберите тему, для которой хотите создать подтему.");
      return;
    }
    setLearningSubtopicToEdit(null);
    setTopicIdForForm(currentTopicId);
    setShowForm(true);
  }, [currentTopicId]);

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту подтему?')) return;
    setError(null);
    try {
      await LearningSubtopicsApi.deleteLearningSubtopic(id);
      if (learningSubtopics.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        fetchLearningSubtopics();
      }
    } catch (err: any) {
      const errorMessage = parseErrorMessage(err, 'Не удалось удалить подтему.');
      setError(errorMessage);
    }
  };

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setLearningSubtopicToEdit(null);
    setTopicIdForForm(null);
    fetchLearningSubtopics();
  }, [fetchLearningSubtopics]);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setLearningSubtopicToEdit(null);
    setTopicIdForForm(null);
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    const totalPagesGuess = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPagesGuess || learningSubtopics.length === itemsPerPage) {
        setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalItems, itemsPerPage, learningSubtopics.length]);

  return {
    learningSubtopics, loading, error, currentPage, setCurrentPage, totalItems, itemsPerPage,
    setItemsPerPage, handlePreviousPage, handleNextPage, currentTopicId,
    setCurrentTopicId: handleTopicChange, topicOptions, loadingTopics,
    handleEdit, handleShowAddForm, handleDelete, handleFormSuccess, handleCancelForm,
    showForm, setShowForm, learningSubtopicToEdit, topicIdForForm,
  };
};