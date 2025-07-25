// --- Путь: src/components/previews/StoryPreview/StoryPreview.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React, { useState, useEffect } from 'react';
import { createImageUrl } from '../../../utils/media';
import './StoryPreview.css';
import type { StoryContentItem } from '../../../types/admin/Stories/story.types';

// Используем сырые данные из формы, которые могут содержать File
// --- ИСПРАВЛЕНИЕ: Разрешаем file быть null ---
type StoryContentItemForPreview = Partial<StoryContentItem> & { file?: File | null };

interface StoryPreviewProps {
  slides: StoryContentItemForPreview[];
}

export const StoryPreview: React.FC<StoryPreviewProps> = ({ slides }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const getSlideUrl = (slide: StoryContentItemForPreview): string | null => {
    if (slide.file) return URL.createObjectURL(slide.file);
    if (slide.content) return createImageUrl(slide.content);
    return null;
  };
  
  const activeSlide = slides[activeSlideIndex];
  const slideDuration = (activeSlide?.duration || 5) * 1000; // в миллисекундах

  useEffect(() => {
    // Сбрасываем на первый слайд, если набор слайдов изменился
    setActiveSlideIndex(0);
  }, [slides]);
  
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setTimeout(() => {
        setActiveSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, slideDuration);

      return () => clearTimeout(timer);
    }
  }, [activeSlideIndex, slides, slideDuration]);

  if (!slides || slides.length === 0) {
    return (
      <div className="story-preview-container">
        <div className="story-preview-placeholder">Нет слайдов для предпросмотра</div>
      </div>
    );
  }

  return (
    <div className="story-preview-container">
      <div className="story-progress-bars">
        {slides.map((_, index) => (
          <div key={index} className="progress-bar-wrapper">
            <div
              className="progress-bar-fill"
              style={{ animationDuration: `${(slides[index]?.duration || 5)}s` }}
              data-active={index === activeSlideIndex}
              data-seen={index < activeSlideIndex}
            />
          </div>
        ))}
      </div>

      <div className="story-slide-content">
        {slides.map((slide, index) => {
          const url = getSlideUrl(slide);
          if (!url) return null;
          
          const isActive = index === activeSlideIndex;
          
          return (
            <div key={index} className={`story-slide ${isActive ? 'active' : ''}`}>
              {slide.type === 'image' && <img src={url} alt={`Слайд ${index + 1}`} />}
              {slide.type === 'video' && <video src={url} autoPlay muted loop playsInline />}
            </div>
          );
        })}
      </div>
    </div>
  );
};