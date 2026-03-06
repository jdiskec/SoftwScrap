import React, { useState } from 'react';
import Facturas from './Facturas';
import Gastos from './gastos';
import CuentasPorPagar from './cuentasporpagar';
import CategoriaGasto from './categoriagasto';
import './compras.css';

/**
 * Componente Compras
 * Actúa como contenedor principal para la gestión de compras, facturas, gastos y proveedores.
 */
const Compras = () => {
    const [activeSubTab, setActiveSubTab] = useState('facturas');

    const subMenuItems = [
        { id: 'facturas', label: 'Facturas', icon: '📝' },
        { id: 'gastos', label: 'Gastos', icon: '💸' },
        { id: 'cuentas', label: 'Cuentas por pagar', icon: '💳' },
        { id: 'categorias', label: 'Categoría - Gastos', icon: '📁' },
        { id: 'proveedores', label: 'Proveedores', icon: '🤝' },
    ];

    const renderContent = () => {
        switch (activeSubTab) {
            case 'facturas':
                return <Facturas />;
            case 'gastos':
                return <Gastos />;
            case 'cuentas':
                return <CuentasPorPagar />;
            case 'categorias':
                return <CategoriaGasto />;
            case 'proveedores':
                // Nota: Podríamos importar el componente de proveedores aquí o uno específico para compras
                return (
                    <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
                        <h3>Módulo de Proveedores</h3>
                        <p style={{ color: 'var(--text-dim)' }}>Gestión de contactos y registros de proveedores.</p>
                    </div>
                );
            default:
                return <Facturas />;
        }
    };

    return (
        <div className="compras-container">
            <div className="compras-header" style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Gestión de <span className="gradient-text">Compras</span></h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Administra facturas de compra, gastos operativos y cuentas por pagar.</p>
            </div>

            {/* Subnavegación Dropdown/Tabs */}
            <div className="sub-nav-container" style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {subMenuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSubTab(item.id)}
                        className={`glass sub-nav-btn ${activeSubTab === item.id ? 'active' : ''}`}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '12px',
                            border: activeSubTab === item.id ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                            background: activeSubTab === item.id ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255,255,255,0.02)',
                            color: activeSubTab === item.id ? 'var(--primary)' : 'var(--text-main)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </div>

            <main className="compras-content">
                {renderContent()}
            </main>
        </div>
    );
};

export default Compras;
