// src/hooks/admin/News/useNewsManagement.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  NewsItem,
  NewsFilterParams,
} from '../../../types/admin/News/news.types';
import { NewsApi } from '../../../services/admin/News/newsApi';
import { ITEMS_PER_PAGE_NEWS } from '../../../constants/admin/News/news.constants';

export const useNewsManagement = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_NEWS);
  const [canGoNext, setCanGoNext] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newsItemToEdit, setNewsItemToEdit] = useState<NewsItem | null>(null);

  const fetchNews = useCallback(async (pageToFetch: number) => {
    setLoading(true);
    setError(null);
    try {
      const params: NewsFilterParams = {
        offset: (pageToFetch - 1) * itemsPerPage,
        limit: itemsPerPage + 1, // Запрашиваем на один элемент больше для определения canGoNext
      };
      const responseItems = await NewsApi.getNewsList(params);
      
      if (responseItems.length > itemsPerPage) {
        setCanGoNext(true);
        setNewsItems(responseItems.slice(0, itemsPerPage)); // Показываем только itemsPerPage элементов
      } else {
        setCanGoNext(false);
        setNewsItems(responseItems);
      }
      setCurrentPage(pageToFetch);

    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось загрузить новости.';
      setError(message);
      console.error(message);
      setNewsItems([]);
      setCanGoNext(false);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchNews(1); // Загружаем первую страницу при монтировании
  }, [fetchNews]);

  const handleEdit = useCallback((item: NewsItem) => {
    setNewsItemToEdit(item);
    setShowForm(true);
  }, []);

  const handleShowAddForm = useCallback(() => {
    setNewsItemToEdit(null);
    setShowForm(true);
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      return;
    }
    setError(null);
    try {
      await NewsApi.deleteNewsItem(id);
      console.log('Новость успешно удалена!');
      // Перезагружаем текущую страницу или предыдущую, если на текущей не осталось элементов
      // Это упрощенный вариант, можно сделать точнее, если знать totalItems
      if (newsItems.length === 1 && currentPage > 1) {
        fetchNews(currentPage - 1);
      } else {
        fetchNews(currentPage);
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Не удалось удалить новость.';
      console.error(message);
      setError(message);
    }
  };

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setNewsItemToEdit(null);
    fetchNews(newsItemToEdit ? currentPage : 1); // Если редактировали, остаемся на текущей, если создавали - на первую
  }, [fetchNews, newsItemToEdit, currentPage]);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setNewsItemToEdit(null);
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      fetchNews(currentPage - 1);
    }
  }, [currentPage, fetchNews]);

  const handleNextPage = useCallback(() => {
    if (canGoNext) {
      fetchNews(currentPage + 1);
    }
  }, [canGoNext, currentPage, fetchNews]);

  return {
    newsItems,
    loading,
    error,
    currentPage,
    itemsPerPage,
    setItemsPerPage: (newLimit: number) => { // Позволяем менять кол-во элементов на странице
        setItemsPerPage(newLimit);
        fetchNews(1); // При смене лимита, переходим на первую страницу
    },
    handlePreviousPage,
    handleNextPage,
    canGoNext,
    canGoPrevious: currentPage > 1,
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    handleCancelForm,
    showForm,
    setShowForm,
    newsItemToEdit,
  };
};