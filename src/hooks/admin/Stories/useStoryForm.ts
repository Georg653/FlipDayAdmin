// src/hooks/admin/StoriesManagement/useStoryForm.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  Story,
  StoryCreatePayload,
  StoryUpdatePayload,
  StoryFormData,
  StoryFormOptions,
  StoryContentItem,
  StoryContentType,
} from '../../../types/admin/Stories/story.types'; // Убедись, что все эти типы экспортируются из story.types.ts
import { initialStoryFormData } from '../../../types/admin/Stories/story.types'; // initialStoryFormData - значение, импортируем отдельно
import { StoriesApi } from '../../../services/admin/Stories/storiesApi';
// import { useNotification } from '../../../contexts/admin/NotificationContext'; // Если используешь

export const useStoryForm = (options: StoryFormOptions) => {
  const { onSuccess, storyToEdit } = options;
  // const { showNotification } = useNotification();

  const [formData, setFormData] = useState<StoryFormData>(initialStoryFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setFormData(initialStoryFormData);
    setFormError(null);
  }, []);

  useEffect(() => {
    if (storyToEdit) {
      // Освобождаем предыдущий Object URL, если он был создан для preview_url
      if (formData.preview_url && formData.preview_url.startsWith('blob:')) {
        URL.revokeObjectURL(formData.preview_url);
      }
      setFormData({
        name: storyToEdit.name || "",
        is_active: storyToEdit.is_active,
        preview_file: null, // Сбрасываем файл при редактировании
        preview_url: storyToEdit.preview, // Показываем URL с сервера
        existing_preview_url: storyToEdit.preview, // Сохраняем URL с сервера
        content_items: storyToEdit.content_items ? JSON.parse(JSON.stringify(storyToEdit.content_items)) : [], // Глубокое копирование
        expires_at: storyToEdit.expires_at ? new Date(storyToEdit.expires_at).toISOString().split('T')[0] : "",
      });
      setFormError(null);
    } else {
      resetForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyToEdit, resetForm]); // formData добавлено в зависимости не нужно, т.к. это вызовет цикл

  // Освобождаем Object URL при размонтировании компонента или изменении preview_url
  useEffect(() => {
    const currentPreviewUrl = formData.preview_url;
    return () => {
      if (currentPreviewUrl && currentPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentPreviewUrl);
      }
    };
  }, [formData.preview_url]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: StoryFormData) => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError(null);
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev: StoryFormData) => ({
      ...prev,
      [name]: checked,
    }));
    if (formError) setFormError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev: StoryFormData) => {
      // Освобождаем старый Object URL, если он был
      if (prev.preview_url && prev.preview_url.startsWith('blob:')) {
        URL.revokeObjectURL(prev.preview_url);
      }
      return {
        ...prev,
        preview_file: file,
        preview_url: file ? URL.createObjectURL(file) : prev.existing_preview_url, // Показываем новое превью или старое с сервера
      };
    });
    if (formError) setFormError(null);
  };

  const addContentItem = () => {
    setFormData((prev: StoryFormData) => ({
      ...prev,
      content_items: [...prev.content_items, { type: "image", content: "" }], // По умолчанию добавляем image
    }));
  };

  // Эта функция теперь будет использоваться в StoryForm.tsx через setFormData
  // Но оставим ее здесь как пример, если бы она экспортировалась
  const _updateContentItemDirectlyInHook = (index: number, field: keyof StoryContentItem, value: string | StoryContentType) => {
    setFormData((prev: StoryFormData) => {
      const newContentItems = [...prev.content_items];
      if (newContentItems[index]) {
        // @ts-ignore - для поля type, value может быть string, но мы ожидаем StoryContentType из селекта
        newContentItems[index] = { ...newContentItems[index], [field]: value };
      }
      return { ...prev, content_items: newContentItems };
    });
  };

  const removeContentItem = (index: number) => {
    setFormData((prev: StoryFormData) => ({
      ...prev,
      content_items: prev.content_items.filter((_, i: number) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Валидация
    if (!formData.preview_file && !formData.existing_preview_url) { // Проверяем и существующий URL при редактировании
      setFormError('Превью-изображение обязательно.');
      setIsSubmitting(false);
      return;
    }
    if (formData.content_items.length === 0) {
        setFormError('Добавьте хотя бы один элемент контента.');
        setIsSubmitting(false);
        return;
    }
    if (formData.content_items.some(item => !item.content.trim())) {
        setFormError('URL/Содержимое для каждого элемента контента истории обязательно.');
        setIsSubmitting(false);
        return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const storyDataPayload: StoryCreatePayload = {
      name: formData.name.trim() || null,
      is_active: formData.is_active,
      content_items: formData.content_items,
      expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
    };

    try {
      let result: Story;
      const isEditing = !!storyToEdit;

      if (isEditing && storyToEdit) {
        const updatePayload: StoryUpdatePayload = { ...storyDataPayload };
        // Если имя было null и осталось пустым, оно должно остаться null
        if (formData.name.trim() === "" && storyToEdit.name === null) {
            updatePayload.name = null;
        }
        // Если имя было каким-то и стало пустым, API может ожидать null
        else if (formData.name.trim() === "" && storyToEdit.name !== null) {
            updatePayload.name = null; // Или "" если API это допускает
        }

        result = await StoriesApi.updateStory(
          storyToEdit.id,
          updatePayload,
          formData.preview_file // Передаем файл, если он выбран
        );
        console.log('История успешно обновлена!');
        // showNotification?.('История успешно обновлена!', 'success');
      } else {
        if (!formData.preview_file) { // Дополнительная проверка, если логика обошла первую
          setFormError('Превью-изображение обязательно для новой истории.');
          setIsSubmitting(false);
          return;
        }
        result = await StoriesApi.createStory(
          storyDataPayload,
          formData.preview_file
        );
        console.log('История успешно создана!');
        // showNotification?.('История успешно создана!', 'success');
      }
      onSuccess?.(result);
    } catch (error: any) {
      console.error("Ошибка сохранения истории:", error);
      const message = error.response?.data?.detail || error.message || `Не удалось ${storyToEdit ? 'обновить' : 'создать'} историю.`;
      let errorMessage = "Произошла неизвестная ошибка.";

      if (typeof message === 'string') {
        errorMessage = message;
      } else if (Array.isArray(message) && message.length > 0 && message[0].msg) { // Проверка для FastAPI ошибок валидации
        errorMessage = message.map(err => `${err.loc?.slice(-1)[0] || 'поле'} - ${err.msg}`).join('; ');
      }
      console.error(errorMessage);
      // showNotification?.(errorMessage, 'error');
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData, // Экспортируем setFormData, чтобы StoryForm мог напрямую менять content_items
    handleChange,
    handleCheckboxChange,
    handleFileChange,
    handleSubmit,
    isSubmitting,
    formError,
    resetForm,
    addContentItem,
    // updateContentItem: _updateContentItemDirectlyInHook, // Если бы мы хотели экспортировать эту
    removeContentItem,
  };
};