// --- Путь: src/components/ui/ImageUpload/ImageUpload.tsx ---

import React, { useRef, useEffect } from 'react';
import './ImageUpload.css';
import { Button } from '../Button/Button';

interface ImageUploadProps {
  id: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string | null;
  label?: string;
  disabled?: boolean;
  // НОВЫЙ ПРОПС для расположения кнопки
  buttonPosition?: 'bottom' | 'right';
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  id,
  name,
  onChange,
  previewUrl,
  label,
  disabled,
  buttonPosition = 'bottom', // По умолчанию кнопка снизу
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Эффект для очистки Object URL
  useEffect(() => {
    const objectUrl = previewUrl;
    return () => {
      if (objectUrl && objectUrl.startsWith('blob:')) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [previewUrl]);


  return (
    <div className={`image-upload-container layout-${buttonPosition}`}>
      {label && <label htmlFor={id} className="image-upload-label">{label}</label>}
      <div className="image-upload-main-area">
        <div className="image-upload-preview-area">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="image-upload-preview" />
          ) : (
            <div className="image-upload-placeholder">No image selected</div>
          )}
        </div>
        <div className="image-upload-button-wrapper">
            <input
              type="file"
              id={id}
              name={name}
              ref={fileInputRef}
              onChange={onChange}
              accept="image/*,video/*" // Разрешаем и видео
              style={{ display: 'none' }}
              disabled={disabled}
            />
            <Button type="button" onClick={handleButtonClick} variant="outline" size="sm" disabled={disabled}>
              {previewUrl ? 'Change' : 'Select'}
            </Button>
        </div>
      </div>
    </div>
  );
};