import React, { useState } from 'react';
import './facturas.css';
import CrearFactura from './crearfactura';

/**
 * Componente Facturas
 * Dashboard principal para la gestión de facturación electrónica.
 * Integra la creación de facturas y el historial de emisiones en una sola vista.
 */
const Facturas = () => {
    // Historial de facturas predeterminadas/generadas
    const [facturas, setFacturas] = useState(() => {
        try {
            const saved = localStorage.getItem('facturas_emitidas');
            const data = saved ? JSON.parse(saved) : [
                { id: 'VEN-001', tipo: 'venta', cliente: 'Metalúrgica del Sur', fecha: '2026-02-01', total: 1250.50, estado: 'Pagada' }
            ];
            // Solo mostrar ventas
            return data.filter(f => f.tipo === 'venta');
        } catch (e) {
            console.error("Error cargando facturas:", e);
            return [];
        }
    });

    /**
     * Callback para añadir una nueva factura al historial tras su creación exitosa.
     * @param {Object} nuevaFactura - Objeto con los datos de la factura generada.
     */
    const handleCreateSuccess = (nuevaFactura) => {
        // Solo guardamos si es venta (aunque fixedType ya lo garantiza)
        if (nuevaFactura.tipo === 'venta') {
            const updated = [nuevaFactura, ...facturas];
            setFacturas(updated);
            localStorage.setItem('facturas_emitidas', JSON.stringify([nuevaFactura, ...JSON.parse(localStorage.getItem('facturas_emitidas') || '[]')]));
        }
    };

    return (
        <div className="facturas-container">
            <h3 style={{ fontSize: '1.8rem', marginBottom: '30px' }}>Gestión Integral de <span className="gradient-text">Facturación de Ventas</span></h3>

            {/* Módulo de Emisión: Se muestra embebido para facilitar el flujo de trabajo */}
            <div className="factura-creator-wrapper" style={{ marginBottom: '50px' }}>
                <CrearFactura onSuccess={handleCreateSuccess} isEmbedded={true} fixedType="venta" />
            </div>

            {/* Separador visual industrial */}
            <div style={{ margin: '40px 0', borderTop: '2px solid var(--glass-border)' }}></div>

            {/* Panel de Historial / Dashboard */}
            <div className="facturas-dashboard-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '1.4rem' }}>Historial de Facturas Emitidas</h4>
                    <div className="glass" style={{ padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        Total: {facturas.length} registros
                    </div>
                </div>

                <div className="glass facturas-table-container">
                    <table className="facturas-table">
                        <thead>
                            <tr>
                                <th>Nº Factura</th>
                                <th>Tipo</th>
                                <th>Entidad (Cliente/Prov.)</th>
                                <th>Ubicación (Bodega)</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facturas.map(f => (
                                <tr key={f.id}>
                                    <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{f.id}</td>
                                    <td>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            background: f.tipo === 'venta' ? 'rgba(0, 242, 254, 0.1)' : 'rgba(79, 172, 254, 0.1)',
                                            color: f.tipo === 'venta' ? 'var(--primary)' : 'var(--secondary)',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase'
                                        }}>
                                            {f.tipo === 'venta' ? '🛒 Venta' : '📦 Compra'}
                                        </span>
                                    </td>
                                    <td>{f.cliente}</td>
                                    <td>
                                        {f.items && f.items.length > 0 ? (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {[...new Set(f.items.map(i => i.bodega || 'B. Principal'))].map(b => (
                                                    <span key={b} style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
                                                        {b}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>N/A</span>
                                        )}
                                    </td>
                                    <td>{f.fecha}</td>
                                    <td style={{ fontWeight: '600' }}>${f.total.toFixed(2)}</td>
                                    <td>
                                        <span className={`status-badge ${f.estado.toLowerCase()}`}>
                                            {f.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button className="btn-icon" title="Ver Detalle">👁️</button>
                                            <button className="btn-icon" title="Reimprimir">🖨️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Facturas;
