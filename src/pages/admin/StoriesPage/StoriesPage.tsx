// src/pages/admin/StoriesPage/StoriesPage.tsx
import React from 'react';
// Исправленный путь:
import { StoriesManagement } from '../../../components/admin/StoriesManagement/StoriesManagement'; 
// import styles from './StoriesPage.module.css';

const StoriesPage: React.FC = () => {
  return (
    <div>
      <StoriesManagement />
    </div>
  );
};

export default StoriesPage;