import React, { useState } from 'react';
import Facturas from './facturas/facturas';
import DiaNoche from '../background/dianoche';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";

// Icon mapping according to requested naming
const byPrefixAndName = {
    fatl: {
        'bag-shopping': faBagShopping
    }
};

// Importación de nuevos componentes
import AdminInventory from './nabvaradmin/inventario/AdminInventory';
import Compras from './nabvaradmin/compras/compras';
import Ventas from './nabvaradmin/ventas/ventas';
import Caja from './nabvaradmin/caja/caja';
import Proveedores from './nabvaradmin/proveedores/proveedores';
import Clientes from './nabvaradmin/Clientes/clientes';
import Materiales from './nabvaradmin/materiales/materiales';
import Reportes from './nabvaradmin/Reportes/reportes';

/**
 * Componente AdminDashboard
 * Centro de control administrativo de EcoScrap.
 * Maneja la navegación interna entre los diferentes módulos administrativos.
 * 
 * @param {Function} onLogout - Función para cerrar la sesión administrativa.
 */
const AdminDashboard = ({ onLogout }) => {
    // Control de la pestaña activa en el panel lateral
    const [activeTab, setActiveTab] = useState('facturas');

    const menuItems = [
        { id: 'facturas', label: '📝 Facturación', component: <Facturas /> },
        {
            id: 'inventario',
            label: 'Compras',
            icon: <FontAwesomeIcon icon={byPrefixAndName.fatl['bag-shopping']} style={{ marginRight: '10px' }} />,
            component: <Compras />
        },
        { id: 'ventas', label: '💰 Ventas', component: <Ventas /> },
        { id: 'caja', label: '🏦 Caja', component: <Caja /> },
        { id: 'proveedores', label: '🤝 Proveedores', component: <Proveedores /> },
        { id: 'clientes', label: '👥 Clientes', component: <Clientes /> },
        { id: 'materiales', label: '🏗️ Materiales', component: <Materiales /> },
        { id: 'reportes', label: '📊 Reportes', component: <Reportes /> },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
            {/* Panel Lateral (Sidebar) */}
            <div className="glass" style={{
                width: '280px',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '0 20px 20px 0',
                borderLeft: 'none',
                position: 'sticky',
                top: 0,
                height: '100vh',
                overflowY: 'auto'
            }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '30px' }}>
                    Eco<span className="gradient-text">Admin</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className="glass"
                            style={{
                                textAlign: 'left', padding: '12px 20px', borderRadius: '12px',
                                border: activeTab === item.id ? '1px solid var(--primary)' : '1px solid transparent',
                                background: activeTab === item.id ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                                color: 'var(--text-main)', cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}

                    <div style={{ margin: '10px 0', borderTop: '1px solid var(--glass-border)' }}></div>

                    {/* Acceso rápido a la web pública */}
                    <button
                        onClick={onLogout}
                        className="glass"
                        style={{
                            textAlign: 'left', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--secondary)',
                            background: 'rgba(79, 172, 254, 0.1)',
                            color: 'var(--secondary)', cursor: 'pointer'
                        }}
                    >
                        🏠 Ir a Inicio Público
                    </button>
                </nav>

                {/* Acción de Cerrar Sesión */}
                <button
                    onClick={onLogout}
                    className="glass"
                    style={{
                        marginTop: '20px', padding: '12px', borderRadius: '12px',
                        background: 'rgba(248, 113, 113, 0.1)', color: '#f87171',
                        border: '1px solid rgba(248, 113, 113, 0.2)', cursor: 'pointer'
                    }}
                >
                    Cerrar Sesión
                </button>
            </div>

            {/* Área de Contenido Principal */}
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Panel de Control</h2>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Bienvenido, administrador del sistema.</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                        <DiaNoche />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: '600' }}>Administrador Central</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Cuenca, Ecuador</div>
                            </div>
                            <div className="glass" style={{
                                width: '45px', height: '45px', borderRadius: '50%',
                                background: 'var(--primary)', display: 'flex',
                                justifyContent: 'center', alignItems: 'center',
                                color: '#000', fontWeight: 'bold'
                            }}>
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Renderizado condicional de módulos */}
                <main>
                    {menuItems.find(item => item.id === activeTab)?.component || (
                        <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📊</div>
                            <h3>Resumen del Sistema</h3>
                            <p style={{ color: 'var(--text-dim)', marginTop: '10px', maxWidth: '400px', margin: '10px auto' }}>
                                Seleccione una opción del menú lateral para comenzar.
                            </p>
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
};

export default AdminDashboard;
