// --- Путь: src/utils/media.ts ---

/**
 * Создает полный, абсолютный и корректный URL для медиа-файла с бэкенда.
 * Эта версия знает про префикс /media/ и защищена от всех косяков.
 * @param relativePath - Относительный путь от API (e.g., stories/previews/image.jpg)
 * @returns Полный URL (e.g., http://localhost:8003/media/stories/previews/image.jpg) или null.
 */
export const createImageUrl = (relativePath: string | null | undefined): string | null => {
  if (!relativePath) {
    return null;
  }
  
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  const backendUrl = "http://localhost:9000";//import.meta.env.VITE_BACKEND_URL;

  if (!backendUrl) {
    console.error("КРИТИЧЕСКАЯ ОШИБКА: Переменная VITE_BACKEND_URL не задана в файле .env!");
    return relativePath;
  }

  // --- ВОТ ГЛАВНОЕ ИЗМЕНЕНИЕ ---
  // Мы предполагаем, что все медиа-файлы лежат по пути /media/
  // А бэк отдает путь без этого префикса (например, 'stories/previews/...')
  const mediaPrefix = '/media/';

  // Убираем слэш в конце у backendUrl
  const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
  
  // Убираем возможный слэш в начале у пути с бэка, чтобы не было двойных
  const cleanRelativePath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  
  return `${cleanBackendUrl}${mediaPrefix}${cleanRelativePath}`;
};