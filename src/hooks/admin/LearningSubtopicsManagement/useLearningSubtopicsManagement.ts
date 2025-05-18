// src/hooks/admin/LearningSubtopicsManagement/useLearningSubtopicsManagement.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  LearningSubtopic,
  LearningSubtopicFilterParams,
  TopicOption,
} from '../../../types/admin/LearningSubtopics/learningSubtopic.types';
import { LearningSubtopicsApi } from '../../../services/admin/LearningSubtopics/learningSubtopicsApi';
import { ITEMS_PER_PAGE_LEARNING_SUBTOPICS } from '../../../constants/admin/LearningSubtopics/learningSubtopics.constants';

export const useLearningSubtopicsManagement = () => {
  const [learningSubtopics, setLearningSubtopics] = useState<LearningSubtopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_LEARNING_SUBTOPICS);
  const [currentTopicId, setCurrentTopicId] = useState<number | null>(null);
  const [topicOptions, setTopicOptions] = useState<TopicOption[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [learningSubtopicToEdit, setLearningSubtopicToEdit] = useState<LearningSubtopic | null>(null);
  const [topicIdForForm, setTopicIdForForm] = useState<number | null>(null);

  const fetchTopics = useCallback(async () => {
    // setLoadingTopics(true);
    // try {
    //   const response = await LearningSubtopicsApi.getTopics({ limit: 1000 });
    //   setTopicOptions(response.items);
    //   if (response.items.length > 0 && !currentTopicId) {
    //     // setCurrentTopicId(response.items[0].id); // Можно выбрать первую тему по умолчанию
    //   }
    // } catch (err) {
    //   console.error("Failed to load topics", err);
    // } finally {
    //   setLoadingTopics(false);
    // }
  }, [/* currentTopicId */]); // Зависимость убрана, пока не используется

  useEffect(() => {
    fetchTopics(); // Вызываем один раз для загрузки тем, если API будет
  }, [fetchTopics]);

  const fetchLearningSubtopics = useCallback(async () => {
    if (!currentTopicId) {
      setLearningSubtopics([]);
      setTotalItems(0);
      setError("Пожалуйста, выберите или введите ID темы.");
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
      const message = err.response?.data?.detail || 'Не удалось загрузить подтемы.';
      if (err.response?.status === 404 && err.response?.data?.detail?.includes("Topic")) {
        setError(`Тема с ID ${currentTopicId} не найдена.`);
      } else {
        setError(message);
      }
      console.error(message, err);
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
    }
  }, [currentTopicId, fetchLearningSubtopics]);

  const handleTopicChange = (topicIdString: string) => {
    const id = parseInt(topicIdString, 10);
    setCurrentTopicId(isNaN(id) || id <= 0 ? null : id);
    setCurrentPage(1);
    setError(null);
  };

  const handleEdit = useCallback((subtopic: LearningSubtopic) => {
    setLearningSubtopicToEdit(subtopic);
    setTopicIdForForm(subtopic.topic_id); // Используем topic_id из самой подтемы
    setShowForm(true);
  }, []);

  const handleShowAddForm = useCallback(() => {
    if (!currentTopicId) {
      alert("Сначала выберите или введите ID темы!");
      setError("Сначала выберите или введите ID темы, для которой хотите создать подтему.");
      return;
    }
    setLearningSubtopicToEdit(null);
    setTopicIdForForm(currentTopicId);
    setShowForm(true);
  }, [currentTopicId]);

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту подтему и все связанные страницы?')) return;
    setError(null);
    try {
      await LearningSubtopicsApi.deleteLearningSubtopic(id);
      console.log('Подтема успешно удалена!');
      if (learningSubtopics.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        fetchLearningSubtopics();
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось удалить подтему.';
      console.error(message, err);
      setError(message);
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