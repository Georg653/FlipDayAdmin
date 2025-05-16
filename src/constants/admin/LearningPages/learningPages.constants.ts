// src/constants/admin/LearningPages/learningPages.constants.ts

export const ITEMS_PER_PAGE_LEARNING_PAGES = 10; // Или другое значение по умолчанию

// Если бы у нас были строго типизированные блоки контента на фронте,
// можно было бы определить их типы здесь:
/*
export enum LearningPageBlockType {
  HEADING = "heading",
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  ALBUM = "album",
  SLIDER = "slider",
  TEST = "test",
}

export const LEARNING_PAGE_BLOCK_TYPE_OPTIONS = [
  { value: LearningPageBlockType.HEADING, label: "Заголовок" },
  { value: LearningPageBlockType.TEXT, label: "Текст" },
  { value: LearningPageBlockType.IMAGE, label: "Изображение" },
  // ... и т.д.
];
*/
// Но пока мы работаем с content_json_string, это не так критично.
// Пользователь будет сам вводить "type" в JSON.