import React, { useState } from 'react';
import Facturas from './Facturascompra';
import Gastos from './gastos';
import CuentasPorPagar from './cuentasporpagar';
import CategoriaGasto from './categoriagasto';
import './compras.css';

/**
 * Componente Compras
 * Actúa como contenedor principal para la gestión de compras, facturas, gastos y proveedores.
 */
const Compras = () => {
    const [activeSubTab, setActiveSubTab] = useState('resumen');
    const [recentPurchases, setRecentPurchases] = useState(() => {
        const saved = localStorage.getItem('compras_realizadas');
        return saved ? JSON.parse(saved).slice(0, 5) : [];
    });

    const subMenuItems = [
        { id: 'resumen', label: 'Resumen', icon: '🏠' },
        { id: 'facturas', label: 'Facturas', icon: '📝' },
        { id: 'gastos', label: 'Gastos', icon: '💸' },
        { id: 'cuentas', label: 'Cuentas por pagar', icon: '💳' },
        { id: 'categorias', label: 'Categoría - Gastos', icon: '📁' },
        { id: 'proveedores', label: 'Proveedores', icon: '🤝' },
    ];

    const renderContent = () => {
        switch (activeSubTab) {
            case 'resumen':
                return (
                    <div className="resumen-compras animate-fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                            <div className="glass stat-card" style={{ padding: '20px' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Total Compras Hoy</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>$ 0.00</div>
                            </div>
                            <div className="glass stat-card" style={{ padding: '20px' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Pendientes por Pagar</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f87171' }}>$ 0.00</div>
                            </div>
                            <div className="glass stat-card" style={{ padding: '20px' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Transacciones del Mes</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{recentPurchases.length}</div>
                            </div>
                        </div>

                        <div className="glass" style={{ padding: '25px', borderRadius: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h4 style={{ margin: 0 }}>🛍️ Compras Recientes</h4>
                                <button
                                    onClick={() => setActiveSubTab('facturas')}
                                    className="btn-primary"
                                    style={{ padding: '8px 15px', fontSize: '0.85rem' }}
                                >
                                    🔍 Divisar todas las compras
                                </button>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-dim)' }}>
                                        <th style={{ padding: '15px' }}>Fecha</th>
                                        <th style={{ padding: '15px' }}>Proveedor</th>
                                        <th style={{ padding: '15px' }}>Total</th>
                                        <th style={{ padding: '15px' }}>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPurchases.length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-dim)' }}>No hay compras registradas aún.</td></tr>
                                    ) : (
                                        recentPurchases.map(c => (
                                            <tr key={c.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                                <td style={{ padding: '15px' }}>{c.fecha}</td>
                                                <td style={{ padding: '15px' }}>{c.cliente || 'S/N'}</td>
                                                <td style={{ padding: '15px', fontWeight: 'bold' }}>$ {c.total}</td>
                                                <td style={{ padding: '15px' }}>
                                                    <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '10px', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80' }}>Pagado</span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'facturas':
                return <Facturas />;
            case 'gastos':
                return <Gastos />;
            case 'cuentas':
                return <CuentasPorPagar />;
            case 'categorias':
                return <CategoriaGasto />;
            case 'proveedores':
                // ...
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
