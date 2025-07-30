// --- Путь: src/components/ui/ImageUpload/ImageUpload.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React, { useState, useRef, useEffect } from 'react';
import './ImageUpload.css';
import { Button } from '../Button/Button';

interface ImageUploadProps {
  id: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string | null;
  label?: string;
  disabled?: boolean;
  buttonPosition?: 'bottom' | 'right';
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  id, name, onChange, previewUrl, label, disabled, buttonPosition = 'bottom',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPreview, setCurrentPreview] = useState<string | null>(null);

  useEffect(() => {
    // --- ИСПРАВЛЕНИЕ: Гарантируем, что в setCurrentPreview не попадет undefined ---
    setCurrentPreview(previewUrl ?? null);
  }, [previewUrl]);

  const handleButtonClick = () => { fileInputRef.current?.click(); };

  return (
    <div className={`image-upload-container layout-${buttonPosition}`}>
      {label && <label htmlFor={id} className="image-upload-label">{label}</label>}
      <div className="image-upload-main-area">
        <div className="image-upload-preview-area">
          {currentPreview ? (
            <img src={currentPreview} alt="Preview" className="image-upload-preview" />
          ) : (
            <div className="image-upload-placeholder">No image selected</div>
          )}
        </div>
        <div className="image-upload-button-wrapper">
            <input
              type="file" id={id} name={name} ref={fileInputRef}
              onChange={onChange} accept="image/*,video/*"
              style={{ display: 'none' }} disabled={disabled} />
            <Button type="button" onClick={handleButtonClick} variant="outline" size="sm" disabled={disabled}>
              {currentPreview ? 'Изменить' : 'Выбрать'}
            </Button>
        </div>
      </div>
    </div>
  );
};