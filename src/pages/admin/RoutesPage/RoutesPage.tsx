// src/pages/admin/RoutesPage/RoutesPage.tsx
import React from 'react';
import { RoutesManagement } from '../../../components/admin/RoutesManagement/RoutesManagement'; // Импортируем главный управляющий компонент
// import styles from './RoutesPage.module.css'; // Если нужны специфичные стили

const RoutesPage: React.FC = () => {
  return (
    // <div className={styles.pageContainer}> // Если используешь CSS Modules
    <div>
      <RoutesManagement />
    </div>
  );
};

export default RoutesPage;