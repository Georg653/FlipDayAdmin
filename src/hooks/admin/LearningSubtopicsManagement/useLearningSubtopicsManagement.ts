// --- Путь: src/hooks/admin/LearningSubtopicsManagement/useLearningSubtopicsManagement.ts ---
// ИСПРАВЛЕННАЯ ВЕРСИЯ

import { useState, useEffect, useCallback } from 'react';
import type { LearningSubtopic, TopicOption } from '../../../types/admin/LearningSubtopics/learningSubtopic.types';
import { LearningSubtopicsApi } from '../../../services/admin/LearningSubtopics/learningSubtopicsApi';

const ITEMS_PER_PAGE = 10;

export const useLearningSubtopicsManagement = () => {
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const [subtopics, setSubtopics] = useState<LearningSubtopic[]>([]);
  const [subtopicsLoading, setSubtopicsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [subtopicToEdit, setSubtopicToEdit] = useState<LearningSubtopic | null>(null);

  // 1. Загрузка списка тем
  useEffect(() => {
    const fetchTopics = async () => {
      setTopicsLoading(true);
      setError(null);
      try {
        const data = await LearningSubtopicsApi.getAllTopics();
        const formattedTopics = data.map(t => ({ value: String(t.id), label: t.name }));
        setTopics(formattedTopics);
        // Если темы загрузились, устанавливаем первую как выбранную по умолчанию
        if (data.length > 0) {
          setSelectedTopicId(String(data[0].id));
        }
      } catch (err) {
        setError('Ошибка загрузки списка тем.');
      } finally {
        setTopicsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  // 2. Функция для загрузки подтем
  const fetchSubtopics = useCallback(async (topicId: number, page: number) => {
    setSubtopicsLoading(true);
    setError(null);
    setSubtopics([]); // Очищаем старые подтемы перед загрузкой новых
    try {
      const data = await LearningSubtopicsApi.getSubtopicsByTopicId(topicId, {
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
      });
      setSubtopics(data);
      setHasNextPage(data.length === ITEMS_PER_PAGE);
    } catch (err: any) {
      let errorMessage = 'Ошибка загрузки подтем.';
      if (err.response?.data?.detail) {
        errorMessage = JSON.stringify(err.response.data.detail);
      }
      setError(errorMessage);
    } finally {
      setSubtopicsLoading(false);
    }
  }, []);

  // 3. Эффект, который реагирует на смену selectedTopicId
  useEffect(() => {
    // Если ID темы выбран (не null и не пустая строка)
    if (selectedTopicId) {
      // При смене темы всегда сбрасываем на 1-ю страницу
      setCurrentPage(1);
      fetchSubtopics(Number(selectedTopicId), 1);
    } else {
      // Если тема не выбрана (например, после удаления всех тем), очищаем список
      setSubtopics([]);
    }
  }, [selectedTopicId, fetchSubtopics]);

  // 4. Эффект, который реагирует на смену страницы (но не темы!)
  useEffect(() => {
    // Этот эффект сработает только при изменении currentPage, если это не первая страница
    // (первую загружает эффект выше)
    if (selectedTopicId && currentPage > 1) {
      fetchSubtopics(Number(selectedTopicId), currentPage);
    }
  }, [currentPage]);


  // --- Обработчики ---
  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopicId(e.target.value);
    // Теперь нам не нужно здесь вызывать setCurrentPage(1), это сделает useEffect выше
  };

  // Остальные обработчики (handleEdit, handleDelete и т.д.) остаются без изменений
  // ... (здесь твой код для handleEdit, handleDelete, handleFormSuccess и т.д.)
  const handleEdit = (subtopic: LearningSubtopic) => {
    setSubtopicToEdit(subtopic);
    setShowForm(true);
  };

  const handleShowAddForm = () => {
    if (!selectedTopicId) return;
    setSubtopicToEdit(null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту подтему?')) return;
    
    const originalSubtopics = [...subtopics];
    setSubtopics(current => current.filter(st => st.id !== id));
    
    try {
      await LearningSubtopicsApi.deleteSubtopic(id);
      if (subtopics.length === 1 && currentPage > 1) {
        setCurrentPage(p => p - 1);
      } else if (subtopics.length === 1 && currentPage === 1) {
        // Если удалили последний элемент на первой странице, перезагружаем
        fetchSubtopics(Number(selectedTopicId), 1);
      }
    } catch (err: any) {
      setError('Ошибка удаления подтемы.');
      setSubtopics(originalSubtopics);
    }
  };
  
  const handleFormSuccess = (updatedSubtopic: LearningSubtopic) => {
    setShowForm(false);
    setSubtopicToEdit(null);
    
    if (String(updatedSubtopic.topic_id) === selectedTopicId) {
        fetchSubtopics(Number(selectedTopicId), currentPage);
    } else {
      setSelectedTopicId(String(updatedSubtopic.topic_id));
      // setCurrentPage(1) вызовется автоматически эффектом
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };
  const handleNextPage = () => {
    if (hasNextPage) setCurrentPage(p => p + 1);
  };

  const isLoading = topicsLoading || subtopicsLoading;

  return {
    topics, selectedTopicId, handleTopicChange, subtopics, error,
    isLoading, handleEdit, handleDelete, handleShowAddForm, handleFormSuccess,
    showForm, setShowForm, subtopicToEdit, currentPage,
    canGoNext: hasNextPage, canGoPrevious: currentPage > 1,
    handleNextPage, handlePreviousPage,
    parentTopicId: selectedTopicId ? Number(selectedTopicId) : null,
  };
};