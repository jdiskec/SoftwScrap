import React from 'react';
import './background.css';

const Background = ({ children }) => {
    const [isNight, setIsNight] = React.useState(true);

    React.useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        setIsNight(savedTheme !== 'light');

        const handleThemeChange = (e) => {
            setIsNight(e.detail.isNight);
        };

        window.addEventListener('theme-change', handleThemeChange);
        return () => window.removeEventListener('theme-change', handleThemeChange);
    }, []);

    return (
        <div className={`main-layout ${isNight ? 'dark-theme' : 'light-theme'}`}>
            {/* Capa de ambiente para modo claro */}
            {!isNight && <div className="day-ambient-glow" />}
            {children}
        </div>
    );
};

export default Background;
