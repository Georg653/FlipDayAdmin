// --- Путь: src/hooks/previews/usePreviewData.ts ---
// ПОЛНАЯ ИСПРАВЛЕННАЯ ВЕРСИЯ

import { useMemo, useEffect, useRef } from 'react';
import type { ContentBlockFormData, ApiContentBlock } from '../../types/common/content.types';
import type { ContentPreviewData } from '../../components/previews/ContentPreview/ContentPreview';
import { createImageUrl } from '../../utils/media';

// Тип для данных из формы, которые влияют на превью
type FormDataType = {
  title?: string | null;
  description?: string | null;
  preview_file?: File | null;
  preview_url?: string | null;
  background_file?: File | null;
  background_url?: string | null;
  content: ContentBlockFormData[];
  page_number?: string;
};

export const usePreviewData = (formData: FormDataType): ContentPreviewData => {
  // Используем Ref для хранения списка временных URL, чтобы их можно было очистить
  const objectUrls = useRef<string[]>([]);

  // Эффект, который сработает один раз при размонтировании компонента и очистит все созданные URL
  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      urls.forEach(URL.revokeObjectURL);
    };
  }, []);

  // useMemo пересчитывает данные для превью только когда меняется formData
  return useMemo(() => {
    // Перед каждым пересчетом очищаем старые временные URL
    objectUrls.current.forEach(URL.revokeObjectURL);
    objectUrls.current = [];

    /**
     * Создает "живой" URL.
     * Если передан новый файл (File), создает временный blob: URL.
     * Если файла нет, использует существующий URL/ключ и обрабатывает его через createImageUrl.
     */
    const createLiveUrl = (file?: File | null, existingUrl?: string | null): string | null => {
      if (file) {
        const url = URL.createObjectURL(file);
        objectUrls.current.push(url); // Запоминаем URL, чтобы потом очистить
        return url;
      }
      return createImageUrl(existingUrl);
    };

    // Преобразуем контент из формата формы в формат для превью
    const contentForPreview: ApiContentBlock[] = formData.content.map(formBlock => {
      switch (formBlock.type) {
        case 'image':
        case 'video':
        case 'audio':
          return { ...formBlock, src: createLiveUrl(formBlock.file, formBlock.src) } as ApiContentBlock;
        case 'album':
        case 'slider':
          return {
            ...formBlock,
            src: (formBlock.items || []).map(item => createLiveUrl(item.file, item.url)).filter(Boolean) as string[],
          } as ApiContentBlock;
        default:
          // Текстовые блоки и тесты не содержат файлов, просто передаем их дальше
          return formBlock as ApiContentBlock;
      }
    });

    return {
      title: formData.title || (formData.page_number ? `Страница №${formData.page_number}` : ''),
      description: formData.description,
      mainImage: createLiveUrl(formData.preview_file, formData.preview_url),
      backgroundImage: createLiveUrl(formData.background_file, formData.background_url),
      content: contentForPreview,
    };
  }, [formData]);
};