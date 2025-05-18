// src/components/layout/AdminLayout.tsx
// или src/pages/Admin/AdminPage.tsx, если ты его переместил
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css'; // или AdminPage.css

const AdminLayout: React.FC = () => {
  // const handleLogout = () => {
  //   // Логика выхода пользователя
  //   console.log('Logout action');
  // };

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
                className={({ isActive }) =>
                  isActive ? 'admin-nav-link active' : 'admin-nav-link'
                }
              >
                Достижения
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/learning-pages"
                className={({ isActive }) =>
                  isActive ? 'admin-nav-link active' : 'admin-nav-link'
                }
              >
                Страницы обучения
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/learning-subtopics"
                className={({ isActive }) =>
                  isActive ? 'admin-nav-link active' : 'admin-nav-link'
                }
              >
                Подтемы обучения
              </NavLink>
            </li>
            {/* Сюда можно будет добавлять другие разделы */}
            {/* 
            <li>
              <NavLink 
                to="/admin/users" // Пример будущей ссылки
                className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}
              >
                Пользователи
              </NavLink>
            </li>
            */}
          </ul>
        </nav>
        <div className="admin-sidebar-footer">
          {/* <button onClick={handleLogout} className="admin-logout-button">Выход</button> */}
        </div>
      </aside>
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;