// --- Путь: src/components/admin/PointsManagement/PointsHeader.tsx ---

import React from 'react';
import { Button } from '../../ui/Button/Button';
import type { PointsHeaderProps } from '../../../types/admin/Points/point_props.types';
import '../../../styles/admin/ui/Header.css';

export const PointsHeader: React.FC<PointsHeaderProps> = ({
  isLoading,
  onShowForm,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Точки на карте</h2>
        <Button onClick={onShowForm} disabled={isLoading} variant="success">
          Добавить точку
        </Button>
      </div>
    </div>
  );
};