import React, { useState } from 'react';
import './registro.css';

const Registro = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        celular: '',
        region: 'Azuay - Cuenca',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Registro enviado. Por favor verifica tu correo y celular.');
        onSwitchToLogin();
    };

    return (
        <div className="registro-container">
            <div className="glass registro-card">
                <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Crear <span className="gradient-text">Cuenta</span></h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: '30px', fontSize: '0.9rem' }}>Únete a la mayor red de reciclaje de metales en Ecuador.</p>

                <form onSubmit={handleSubmit} className="registro-form">
                    <div className="form-group">
                        <label>Nombre Completo / Empresa</label>
                        <input type="text" name="nombre" required onChange={handleChange} className="glass-input" />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input type="email" name="email" required onChange={handleChange} className="glass-input" placeholder="ejemplo@correo.com" />
                        </div>
                        <div className="form-group">
                            <label>Número de Celular</label>
                            <input type="tel" name="celular" required onChange={handleChange} className="glass-input" placeholder="099XXXXXXX" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Región / Ciudad</label>
                        <select name="region" onChange={handleChange} className="glass-input" style={{ appearance: 'none' }}>
                            <option>Azuay - Cuenca</option>
                            <option>Guayas - Guayaquil</option>
                            <option>Pichincha - Quito</option>
                            <option>Manabí - Manta</option>
                            <option>El Oro - Machala</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Contraseña</label>
                        <input type="password" name="password" required onChange={handleChange} className="glass-input" />
                    </div>

                    <div className="verification-info">
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
                            ℹ️ Se enviará un código de verificación a tu correo y celular.
                        </span>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Registrarse</button>
                </form>

                <p style={{ marginTop: '25px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                    ¿Ya tienes cuenta? {' '}
                    <span
                        onClick={onSwitchToLogin}
                        style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
                    >
                        Inicia sesión
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Registro;
