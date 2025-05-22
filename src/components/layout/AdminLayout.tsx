// src/components/layout/AdminLayout.tsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>Админ-панель</h3>
        </div>
        <nav className="admin-nav">
          <ul>
            <li>
              <NavLink 
                to="/admin/achievements" 
                className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}
              >
                Достижения
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/news" 
                className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}
              >
                Новости
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/stories"
                className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}
              >
                Истории
              </NavLink>
            </li>
            {/* --- ДОБАВЛЯЕМ ССЫЛКУ НА ПРЕДЛОЖЕНИЯ --- */}
            <li>
              <NavLink 
                to="/admin/proposals"  // Путь для раздела "Предложения"
                className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}
              >
                Предложения
              </NavLink>
            </li>
            {/* --- КОНЕЦ ДОБАВЛЕНИЯ --- */}
            <li className="nav-group-header">Обучение</li>
            <li>
              <NavLink 
                to="/admin/learning-topics" 
                className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}
              >
                Темы
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/learning-subtopics" 
                className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}
              >
                Подтемы
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/learning-pages" 
                className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}
              >
                Страницы тем
              </NavLink>
            </li>
          </ul>
        </nav>
        {/* ... sidebar-footer ... */}
      </aside>
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;