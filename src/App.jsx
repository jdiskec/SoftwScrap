import React, { useState, useEffect } from 'react'
import Inicio from './components/navbar/inicio'
import Login from './components/puertas/login/login'
import Registro from './components/puertas/registro/registro'
import AdminDashboard from './components/admin/AdminDashboard'
import './index.css'

function App() {
  const [view, setView] = useState('home'); // home, login, register, admin

  useEffect(() => {
    const handleLoginNav = () => setView('login');
    const handleAdminDirect = () => setView('admin');

    window.addEventListener('nav-login', handleLoginNav);
    window.addEventListener('nav-admin-direct', handleAdminDirect);

    return () => {
      window.removeEventListener('nav-login', handleLoginNav);
      window.removeEventListener('nav-admin-direct', handleAdminDirect);
    };
  }, []);

  const handleLoginSuccess = (role) => {
    // Todos los inicios de sesión exitosos redirigen al panel administrativo
    setView('admin');
  };

  const renderView = () => {
    switch (view) {
      case 'login':
        return <Login
          onSwitchToRegister={() => setView('register')}
          onLoginSuccess={handleLoginSuccess}
        />;
      case 'register':
        return <Registro onSwitchToLogin={() => setView('login')} />;
      case 'admin':
        return <AdminDashboard onLogout={() => setView('home')} />;
      default:
        return <Inicio />;
    }
  };

  return (
    <div className="app-container">
      {renderView()}
    </div>
  )
}

export default App
