// src/components/admin/RoutesManagement/RoutePointsManager.tsx
import React, { useState } from 'react';
import type { RoutePointInfo, SelectablePoint } from '../../../types/admin/Routes/route.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import './RoutePointsManager.css';

interface RoutePointsManagerProps {
  selectedPoints: RoutePointInfo[];
  availablePoints: SelectablePoint[];
  loadingAvailablePoints: boolean;
  onAddPoint: (pointId: number) => void;
  onRemovePoint: (pointId: number) => void;
  onMovePoint: (pointId: number, direction: 'up' | 'down') => void;
}

// УБЕДИСЬ, ЧТО ЗДЕСЬ ЕСТЬ 'export const'
export const RoutePointsManager: React.FC<RoutePointsManagerProps> = ({
  selectedPoints,
  availablePoints,
  loadingAvailablePoints,
  onAddPoint,
  onRemovePoint,
  onMovePoint,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredAvailablePoints = availablePoints.filter(point => 
    point.name.toLowerCase().includes(searchTerm) && 
    !selectedPoints.find(sp => sp.id === point.id)
  );

  return (
    <div className="route-points-manager">
      <div className="points-columns-container">
        {/* Колонка доступных точек */}
        <div className="points-column available-points-column">
          <h5>Доступные точки для добавления</h5>
          <Input
            type="search"
            placeholder="Поиск точек..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginBottom: '10px' }}
          />
          {loadingAvailablePoints ? (
            <p>Загрузка точек...</p>
          ) : filteredAvailablePoints.length > 0 ? (
            <ul className="points-list">
              {filteredAvailablePoints.map((point) => (
                <li key={point.id} className="point-list-item">
                  <div className="point-info">
                    <span className="point-name">{point.name}</span>
                    <small className="point-id">(ID: {point.id})</small>
                  </div>
                  <Button onClick={() => onAddPoint(point.id)} size="sm" variant="outline">
                    Добавить →
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Нет доступных точек (или все уже добавлены/отфильтрованы).</p>
          )}
        </div>

        {/* Колонка выбранных точек */}
        <div className="points-column selected-points-column">
          <h5>Точки в маршруте (порядок важен)</h5>
          {selectedPoints.length > 0 ? (
            <ul className="points-list selected-points-draggable-list">
              {selectedPoints.map((point, index) => (
                <li key={point.__id || point.id} className="point-list-item selected-point-item">
                  <div className="point-order-controls">
                    <Button 
                        onClick={() => onMovePoint(point.id, 'up')} 
                        disabled={index === 0} 
                        size="sm" variant="outline" 
                        title="Вверх">↑</Button>
                    <Button 
                        onClick={() => onMovePoint(point.id, 'down')} 
                        disabled={index === selectedPoints.length - 1} 
                        size="sm" variant="outline" 
                        title="Вниз">↓</Button>
                  </div>
                  <div className="point-info">
                    <span className="point-name">{index + 1}. {point.name}</span>
                    <small className="point-id">(ID: {point.id})</small>
                  </div>
                  <Button onClick={() => onRemovePoint(point.id)} size="sm" variant="destructive">
                    Удалить
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Нет точек в маршруте. Добавьте из списка слева.</p>
          )}
        </div>
      </div>
    </div>
  );
};