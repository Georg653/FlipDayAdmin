// src/components/ui/ImageUpload/ImageUpload.tsx
import React, { useState, useEffect, useRef } from 'react';
import './ImageUpload.css';
import { Button } from '../Button/Button'; // Предполагаем, что Button уже есть

interface ImageUploadProps {
  id: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string | null; // URL для превью (существующее или новое)
  existingImageUrl?: string | null; // URL существующего изображения (чтобы не показывать "No image" если оно есть)
  label?: string;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  id,
  name,
  onChange,
  previewUrl,
  existingImageUrl,
  label = "Upload Image",
  disabled,
}) => {
  const [currentPreview, setCurrentPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentPreview(previewUrl || existingImageUrl || null);
  }, [previewUrl, existingImageUrl]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Освобождаем Object URL, когда компонент размонтируется или превью меняется, если это был локальный Object URL
  useEffect(() => {
    const objectUrl = currentPreview;
    return () => {
      if (objectUrl && objectUrl.startsWith('blob:')) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentPreview]);


  return (
    <div className="image-upload-container">
      {label && <label htmlFor={id} className="image-upload-label">{label}</label>}
      <div className="image-upload-preview-area">
        {currentPreview ? (
          <img src={currentPreview} alt="Preview" className="image-upload-preview" />
        ) : (
          <div className="image-upload-placeholder">No image selected</div>
        )}
      </div>
      <input
        type="file"
        id={id}
        name={name}
        ref={fileInputRef}
        onChange={onChange}
        accept="image/*"
        style={{ display: 'none' }}
        disabled={disabled}
      />
      <Button type="button" onClick={handleButtonClick} variant="outline" size="sm" disabled={disabled} className="image-upload-button">
        {currentPreview ? 'Change Image' : 'Select Image'}
      </Button>
    </div>
  );
};