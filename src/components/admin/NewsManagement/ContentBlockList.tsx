// src/components/admin/NewsManagement/ContentBlockList.tsx
import React from 'react';
import type { ContentBlock } from '../../../types/admin/News/news.types';
import { Button } from '../../ui/Button/Button';
import './ContentBlockList.css'; // Создай этот файл стилей

interface ContentBlockListProps {
  blocks: ContentBlock[];
  onEditBlock: (index: number) => void;
  onDeleteBlock: (index: number) => void;
  onMoveBlock: (index: number, direction: 'up' | 'down') => void;
}

export const ContentBlockList: React.FC<ContentBlockListProps> = ({
  blocks,
  onEditBlock,
  onDeleteBlock,
  onMoveBlock,
}) => {
  if (!blocks || blocks.length === 0) {
    return <p className="content-block-list-empty">Пока нет блоков контента. Добавьте первый блок.</p>;
  }

  const getBlockPreview = (block: ContentBlock) => {
    switch(block.type) {
        case 'heading': return `H${block.level || '-'}: ${block.content?.substring(0,30) || ''}...`;
        case 'text': return `Текст: ${block.content?.substring(0,30) || ''}...`;
        case 'image': return `Изображение: ${block.src || 'Нет URL'}`;
        case 'video': return `Видео: ${block.src || 'Нет URL'}`;
        case 'audio': return `Аудио: ${block.src || 'Нет URL'}`;
        case 'album': return `Альбом: ${(Array.isArray(block.src) ? block.src.length : 0)} фото`;
        case 'slider': return `Слайдер: ${(Array.isArray(block.src) ? block.src.length : 0)} фото`;
        case 'test': return `Тест: ${block.question?.substring(0,30) || ''}...`;
        default: return `Блок: ${block.type}`;
    }
  }

  return (
    <div className="content-block-list">
      {blocks.map((block, index) => (
        <div key={block.__id || block.id || index} className="content-block-item">
          <div className="content-block-item-preview">
            <span className="block-type-badge">{block.type}</span>
            {getBlockPreview(block)}
          </div>
          <div className="content-block-item-actions">
            <Button onClick={() => onMoveBlock(index, 'up')} disabled={index === 0} size="sm" variant="outline">↑</Button>
            <Button onClick={() => onMoveBlock(index, 'down')} disabled={index === blocks.length - 1} size="sm" variant="outline">↓</Button>
            <Button onClick={() => onEditBlock(index)} size="sm" variant="outline">Ред.</Button>
            <Button onClick={() => onDeleteBlock(index)} size="sm" variant="destructive">Удал.</Button>
          </div>
        </div>
      ))}
    </div>
  );
};