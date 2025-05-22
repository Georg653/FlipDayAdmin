// src/components/admin/NewsManagement/NewsHeader.tsx
import React from 'react';
import { Button } from '../../ui/Button/Button';
import '../../../styles/admin/ui/Header.css';

interface NewsHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
}

export const NewsHeader: React.FC<NewsHeaderProps> = ({
  isLoading,
  onShowForm,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Управление Новостями</h2>
        <Button onClick={onShowForm} disabled={isLoading} customVariant="save" variant="success">
          Добавить Новость
        </Button>
      </div>
    </div>
  );
};