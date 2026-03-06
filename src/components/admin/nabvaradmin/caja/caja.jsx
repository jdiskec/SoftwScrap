import React, { useState, useEffect } from 'react';

const Caja = () => {
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({ ingresos: 0, egresos: 0, balance: 0 });
    const [filter, setFilter] = useState('dia'); // dia, semana, mes

    useEffect(() => {
        try {
            // Cargar transacciones de caja
            const cajaData = JSON.parse(localStorage.getItem('caja_diaria') || '[]');

            // Cargar ventas (ingresos)
            const sales = JSON.parse(localStorage.getItem('facturas_emitidas') || '[]');
            const salesTransactions = sales.map(s => ({
                id: `v-${s.id}`,
                type: 'ingreso',
                description: `Venta a ${s.cliente || 'Cliente'}`,
                amount: parseFloat(s.total) || 0,
                date: s.date
            }));

            // Combinar con egresos de compras si existieran en caja_diaria
            const combined = [...salesTransactions, ...cajaData];

            // Ordenar por fecha descendente
            combined.sort((a, b) => new Date(b.date) - new Date(a.date));

            setTransactions(combined);
            calculateStats(combined);
        } catch (e) {
            console.error("Error en modulo de caja:", e);
        }
    }, []);

    const calculateStats = (data) => {
        const ingresos = data.filter(t => t.type === 'ingreso').reduce((acc, t) => acc + t.amount, 0);
        const egresos = data.filter(t => t.type === 'egreso').reduce((acc, t) => acc + t.amount, 0);
        setStats({ ingresos, egresos, balance: ingresos - egresos });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Control de <span className="gradient-text">Caja</span></h3>

            {/* Resumen de Caja */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="glass" style={{ padding: '20px', borderLeft: '4px solid #4ade80' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Total Ingresos</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#4ade80' }}>${stats.ingresos.toFixed(2)}</div>
                </div>
                <div className="glass" style={{ padding: '20px', borderLeft: '4px solid #f87171' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Total Egresos</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f87171' }}>${stats.egresos.toFixed(2)}</div>
                </div>
                <div className="glass" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Saldo en Caja</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>${stats.balance.toFixed(2)}</div>
                </div>
            </div>

            <div className="glass" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h4 style={{ margin: 0 }}>Movimientos Recientes</h4>
                    <select
                        className="glass"
                        style={{ padding: '5px 15px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="dia" style={{ background: '#111' }}>Cierre Diario</option>
                        <option value="semana" style={{ background: '#111' }}>Resumen Semanal</option>
                        <option value="mes" style={{ background: '#111' }}>Resumen Mensual</option>
                    </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                                <th style={{ padding: '12px' }}>Fecha</th>
                                <th style={{ padding: '12px' }}>Descripción</th>
                                <th style={{ padding: '12px' }}>Tipo</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '12px', fontSize: '0.9rem' }}>{t.date}</td>
                                    <td style={{ padding: '12px', fontSize: '0.9rem' }}>{t.description}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            padding: '2px 8px',
                                            borderRadius: '8px',
                                            background: t.type === 'ingreso' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                                            color: t.type === 'ingreso' ? '#4ade80' : '#f87171'
                                        }}>
                                            {t.type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: t.type === 'ingreso' ? '#4ade80' : '#f87171' }}>
                                        {t.type === 'ingreso' ? '+' : '-'}${t.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button className="btn-primary" style={{ marginTop: '20px', width: '100%', padding: '12px' }}>Realizar Cierre de Caja ({filter})</button>
            </div>
        </div>
    );
};

export default Caja;
