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
                to="/admin/learning-pages" // Путь теперь существует
                className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}
              >
                Страницы обучения {/* <--- ССЫЛКА АКТИВНА */}
              </NavLink>
            </li>
            {/* ... другие ссылки ... */}
          </ul>
        </nav>
        {/* ... admin-sidebar-footer ... */}
      </aside>
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;