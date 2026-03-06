import React, { useState } from 'react';

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple mock login for demo
        if (email === 'admin@ecoscrap.com' && password === 'admin123') {
            onLoginSuccess('admin');
        } else {
            onLoginSuccess('user');
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <div className="glass" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px',
                textAlign: 'center'
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>Ingresar a <span className="gradient-text">EcoScrap</span></h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>Correo Electrónico</label>
                        <input
                            type="email"
                            className="glass"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                color: '#fff',
                                borderRadius: '8px'
                            }}
                            required
                        />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>Contraseña</label>
                        <input
                            type="password"
                            className="glass"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                color: '#fff',
                                borderRadius: '8px'
                            }}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Iniciar Sesión</button>
                </form>

                <div style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                    <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
                </div>

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid var(--glass-border)' }} />

                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                    ¿No tienes una cuenta? {' '}
                    <span
                        onClick={onSwitchToRegister}
                        style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
                    >
                        Regístrate aquí
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
