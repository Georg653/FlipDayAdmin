// --- Путь: src/components/previews/ContentPreview/ContentPreview.tsx ---
// ПОЛНОСТЬЮ ПЕРЕПИСАННАЯ ВЕРСИЯ

import React from 'react';
import { createImageUrl } from '../../../utils/media';
import CustomAudioPlayer from '../../ui/CustomAudioPlayer/CustomAudioPlayer';
import './ContentPreview.css';

// --- ИМПОРТИРУЕМ ВСЕ КОНКРЕТНЫЕ ТИПЫ БЛОКОВ ---
import type {
    ApiContentBlock,
    HeadingBlock,
    TextBlock,
    ImageBlock,
    VideoBlock,
    AudioBlock,
    AlbumBlock,
    SliderBlock,
    TestBlock
} from '../../../types/common/content.types';

// Тип для данных, которые принимает превью. Теперь он строгий.
export interface ContentPreviewData {
  title?: string | null;
  description?: string | null;
  mainImage?: string | null;       // Принимаем только готовый URL (S3 или blob)
  backgroundImage?: string | null; // Принимаем только готовый URL (S3 или blob)
  content: ApiContentBlock[];
}

interface ContentPreviewProps {
  data: Partial<ContentPreviewData>;
}

// Рендер-функция для блока контента. Теперь она строго типизирована.
const renderContentBlock = (block: ApiContentBlock, index: number): React.ReactElement => {
  const key = `preview-block-${index}`;

  switch (block.type) {
    case 'heading':
      const heading = block as HeadingBlock;
      const Tag = `h${heading.level || 2}` as const;
      return <Tag key={key} className="preview-heading">{heading.content}</Tag>;

    case 'text':
      const text = block as TextBlock;
      return <p key={key} className="preview-text" dangerouslySetInnerHTML={{ __html: (text.content || '').replace(/\n/g, '<br />') }} />;
    
    case 'image':
      const image = block as ImageBlock;
      const imgSrc = createImageUrl(image.src);
      return (
        <figure key={key} className="preview-image-block">
          {imgSrc ? <img src={imgSrc} alt="Изображение" className="preview-image"/> : <div className="preview-image-placeholder">Изображение</div>}
          {image.text && <figcaption className="preview-image-caption">{image.text}</figcaption>}
        </figure>
      );

    case 'audio':
      const audio = block as AudioBlock;
      const audioSrc = createImageUrl(audio.src);
      return <div key={key} className="preview-audio-block">{audioSrc ? <CustomAudioPlayer src={audioSrc} title={audio.text} /> : null}</div>;
    
    case 'video':
        const video = block as VideoBlock;
        const videoSrc = createImageUrl(video.src);
        return <div key={key} className="preview-video-block">{videoSrc ? <video src={videoSrc} controls className="preview-video-player" /> : null}</div>;

    case 'album':
    case 'slider':
      const collection = block as AlbumBlock | SliderBlock;
      const items = (collection.src || []).map(createImageUrl);
      return (
        <div key={key} className="preview-album-block">
          <h5 className="preview-album-title">{collection.type === 'album' ? 'Альбом' : 'Слайдер'}</h5>
          <div className="preview-album-images">
            {items.map((itemSrc, i) => itemSrc ? <img key={i} src={itemSrc} alt="" className="preview-album-image"/> : null)}
          </div>
        </div>
      );

    case 'test':
      const test = block as TestBlock;
      return (
        <div key={key} className="preview-test-block">
          {test.question && <p className="preview-test-question">{test.question}</p>}
          <div className="preview-test-options">
            {test.options.map((opt, i) => (
              <span key={opt.id} className={`preview-test-option ${test.correct_option_id === opt.id || (!test.correct_option_id && i === 0) ? 'simulated-correct' : ''}`}>{opt.text}</span>
            ))}
          </div>
          {test.message && <p className="preview-test-message">{test.message}</p>}
        </div>
      );
      
    default:
      // Эта ветка должна быть недостижима, если все типы обработаны
      const exhaustiveCheck: never = block;
      return <div key={key} className="preview-unknown-block">Неподдерживаемый блок: {JSON.stringify(exhaustiveCheck)}</div>;
  }
};


export const ContentPreview: React.FC<ContentPreviewProps> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div className="content-preview-container preview-placeholder">Нет данных для предпросмотра.</div>;
  }
  
  const title = data.title || '[Заголовок]';
  const description = data.description || '';
  const content = data.content || [];
  
  const mainImageUrl = data.mainImage ? createImageUrl(data.mainImage) : null;
  const backgroundImageUrl = data.backgroundImage ? createImageUrl(data.backgroundImage) : null;

  const previewScreenStyle: React.CSSProperties = backgroundImageUrl ? {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImageUrl})`,
  } : {};
  
  const screenContentClasses = `news-preview-screen-content ${backgroundImageUrl ? 'has-background' : ''}`;

  return (
    <div className="content-preview-container">
        <div className="preview-header-bar">
            <span className="preview-back-button-placeholder">‹</span>
            <h1 className="preview-main-title">{title}</h1>
        </div>
        <div className={screenContentClasses} style={previewScreenStyle}>
            {mainImageUrl && <img src={mainImageUrl} alt={title} className="preview-main-image" />}
            {description && <p className="preview-description" dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br />') }} />}
            <div className="preview-content-blocks">
                {content.length > 0 ? content.map(renderContentBlock) : <div className="preview-no-content">Контент пуст. Добавьте блоки.</div>}
            </div>
        </div>
    </div>
  );
};