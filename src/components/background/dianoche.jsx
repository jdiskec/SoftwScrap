import React, { useState, useEffect } from 'react';
import './dianoche.css';

const DiaNoche = () => {
    const [isNight, setIsNight] = useState(true); // EcoScrap es oscuro por defecto

    useEffect(() => {
        // Cargar preferencia guardada
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setIsNight(false);
            document.body.classList.add('light-mode');
        } else {
            setIsNight(true);
            document.body.classList.remove('light-mode');
        }
    }, []);

    const toggleTheme = () => {
        if (isNight) {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            setIsNight(false);
        } else {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            setIsNight(true);
        }
        // Despachar evento para que otros componentes sepan que el tema cambió
        window.dispatchEvent(new CustomEvent('theme-change', { detail: { isNight: !isNight } }));
    };

    return (
        <div className="theme-toggle-container">
            <button
                className={`theme-toggle-btn ${isNight ? 'night' : ''}`}
                onClick={toggleTheme}
                title={isNight ? "Cambiar a modo Día" : "Cambiar a modo Noche"}
            >
                <div className="label">
                    <span>☀️</span>
                    <span>🌙</span>
                </div>
                <div className="faro-slider">
                    {isNight ? '🌙' : '☀️'}
                </div>
            </button>
        </div>
    );
};

export default DiaNoche;
