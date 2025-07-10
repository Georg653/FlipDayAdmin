// src/components/previews/NewsPreview/NewsPreview.tsx
import React from 'react';
import type { NewsFormData, NewsItem, ContentBlock } from '../../../types/admin/News/news.types';
import './NewsPreview.css';
import CustomAudioPlayer from './CustomAudioPlayer';
import { createImageUrl } from '../../../utils/media';

interface NewsPreviewProps {
  data: Partial<NewsFormData & NewsItem>;
}

const renderContentBlock = (block: ContentBlock, index: number): React.ReactElement | null => {
  const key = block.__id || block.id?.toString() || `block-${index}`;

  switch (block.type) {
    case 'heading':
      const level = block.level;
      if (level === 1) return <h1 key={key}>{block.content}</h1>;
      if (level === 2) return <h2 key={key}>{block.content}</h2>;
      if (level === 3) return <h3 key={key}>{block.content}</h3>;
      if (level === 4) return <h4 key={key}>{block.content}</h4>;
      if (level === 5) return <h5 key={key}>{block.content}</h5>;
      if (level === 6) return <h6 key={key}>{block.content}</h6>;
      return <h2 key={key}>{block.content || '[Заголовок]'}</h2>;
    case 'text':
      return <p key={key} dangerouslySetInnerHTML={{ __html: (block.content || '').replace(/\n/g, '<br />') }} />;
    case 'image':
      const imgSrc = block.src instanceof File ? URL.createObjectURL(block.src) : createImageUrl(block.src as string | null);
      return <figure key={key}>{imgSrc && <img src={imgSrc} alt={block.text || 'Изображение'} className="preview-image"/>}{block.text && <figcaption>{block.text}</figcaption>}</figure>;
    case 'audio':
      const audioSrc = block.src instanceof File ? URL.createObjectURL(block.src) : createImageUrl(block.src as string | null);
      return <div key={key}>{audioSrc && <CustomAudioPlayer src={audioSrc} title={block.text ?? undefined} />}</div>;
    default:
      return null;
  }
};


export const NewsPreview: React.FC<NewsPreviewProps> = ({ data }) => {
  const objectUrls = React.useRef<string[]>([]);
  React.useEffect(() => {
    return () => objectUrls.current.forEach(URL.revokeObjectURL);
  }, []);
  
  const getFileUrl = (file: File | null | undefined): string | null => {
    if (!file) return null;
    const url = URL.createObjectURL(file);
    objectUrls.current.push(url);
    return url;
  };
  
  if (!data || Object.keys(data).length === 0) {
    return <div className="news-preview-container news-preview-placeholder">Нет данных для предпросмотра.</div>;
  }
  
  const title = data.title || '[Заголовок]';
  const description = data.description || '';
  const content = data.content || [];
  
  const mainImageUrl = getFileUrl(data.preview_file) || createImageUrl(data.preview);
  // --- ИСПРАВЛЕНАЯ СТРОКА ---
  const backgroundImageUrl = getFileUrl(data.background_file) || createImageUrl(data.background_file_url);

  const previewStyle: React.CSSProperties = backgroundImageUrl ? {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {};
  
  return (
    <div className="news-preview-container" style={previewStyle}>
      <div className="news-preview-scroll-area">
        <h1 className="preview-main-title">{title}</h1>
        {mainImageUrl && <img src={mainImageUrl} alt={title} className="preview-main-image" />}
        {description && <p className="preview-description" dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br />') }} />}
        <div className="preview-content-blocks">{content.map(renderContentBlock)}</div>
      </div>
    </div>
  );
};

export default NewsPreview;