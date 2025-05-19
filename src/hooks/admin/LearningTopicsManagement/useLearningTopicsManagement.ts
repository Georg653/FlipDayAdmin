// src/hooks/admin/LearningTopicsManagement/useLearningTopicsManagement.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  LearningTopic,
  LearningTopicFilterParams,
  PaginatedLearningTopicsResponse,
} from '../../../types/admin/LearningTopics/learningTopic.types';
import { LearningTopicsApi } from '../../../services/admin/LearningTopics/learningTopicsApi';
import { ITEMS_PER_PAGE_LEARNING_TOPICS } from '../../../constants/admin/LearningTopics/learningTopics.constants';
import { useDebounce } from '../LearningTopics/useDebounce'; // Предполагаем, что useDebounce есть

export const useLearningTopicsManagement = () => {
  const [learningTopics, setLearningTopics] = useState<LearningTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_LEARNING_TOPICS);
  const [filterName, setFilterName] = useState('');
  const debouncedFilterName = useDebounce(filterName, 500);
  const [showForm, setShowForm] = useState(false);
  const [learningTopicToEdit, setLearningTopicToEdit] = useState<LearningTopic | null>(null);

  const fetchLearningTopics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: LearningTopicFilterParams = {
        offset: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
        name: debouncedFilterName || undefined,
      };
      const response: PaginatedLearningTopicsResponse = await LearningTopicsApi.getLearningTopics(params);
      setLearningTopics(response.items);
      if (response.items.length < itemsPerPage && currentPage === 1) {
        setTotalItems(response.items.length);
      } else if (response.items.length < itemsPerPage) {
        setTotalItems((currentPage - 1) * itemsPerPage + response.items.length);
      } else {
        setTotalItems(currentPage * itemsPerPage + 1); // Гадаем, что есть еще
      }
      if (response.items.length === 0 && currentPage === 1) {
        setTotalItems(0);
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось загрузить темы.';
      setError(message);
      setLearningTopics([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedFilterName]);

  useEffect(() => {
    fetchLearningTopics();
  }, [fetchLearningTopics]);

  const handleFilterNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleEdit = useCallback((topic: LearningTopic) => {
    setLearningTopicToEdit(topic);
    setShowForm(true);
  }, []);

  const handleShowAddForm = useCallback(() => {
    setLearningTopicToEdit(null);
    setShowForm(true);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту тему? Это удалит все связанные подтемы и страницы.')) return;
    setError(null);
    try {
      await LearningTopicsApi.deleteLearningTopic(id);
      if (learningTopics.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        fetchLearningTopics();
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось удалить тему.';
      setError(message);
    }
  };

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setLearningTopicToEdit(null);
    fetchLearningTopics();
  }, [fetchLearningTopics]);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setLearningTopicToEdit(null);
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    const totalPagesGuess = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPagesGuess || learningTopics.length === itemsPerPage) {
        setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalItems, itemsPerPage, learningTopics.length]);

  return {
    learningTopics, loading, error, currentPage, setCurrentPage, totalItems, itemsPerPage,
    setItemsPerPage, handlePreviousPage, handleNextPage,
    filterName, handleFilterNameChange,
    handleEdit, handleShowAddForm, handleDelete, handleFormSuccess, handleCancelForm,
    showForm, setShowForm, learningTopicToEdit,
  };
};