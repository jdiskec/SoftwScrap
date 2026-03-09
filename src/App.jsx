import React, { useState, useEffect } from 'react'
import Inicio from './components/navbar/inicio'
import Login from './components/puertas/login/login'
import Registro from './components/puertas/registro/registro'
import AdminDashboard from './components/admin/AdminDashboard'
import './index.css'

function App() {
  const [view, setView] = useState('admin'); // home, login, register, admin

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
    console.log('Login success handler called with role:', role);
    // Todos los inicios de sesión exitosos redirigen al panel administrativo
    setView('admin');
  };

  useEffect(() => {
    console.log('Current application view:', view);
  }, [view]);

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
        console.log('Rendering AdminDashboard');
        return <AdminDashboard onLogout={() => {
          console.log('Logging out...');
          setView('home');
        }} />;
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
