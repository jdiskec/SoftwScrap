import React, { useState, useEffect } from 'react';

const InventoryPanel = () => {
    const [inventory, setInventory] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const saved = localStorage.getItem('inventory_products');
        if (saved) {
            const rawData = JSON.parse(saved);
            // Mapear los datos del inventario administrativo al formato del panel público
            const mappedData = rawData.map(item => ({
                id: item.id,
                name: item.name,
                category: item.type === 'Hierro' || item.type === 'Acero Inoxidable' ? 'Ferrous' : 'Non-Ferrous',
                weight: parseFloat(item.stock) || 0,
                price: parseFloat(item.price) || 0,
                trend: '+0.0%', // Tendencia simulada o fija por ahora
                color: getColorByType(item.type)
            }));
            setInventory(mappedData);
        }
    }, []);

    const getColorByType = (type) => {
        const colors = {
            'Cobre': '#b87333',
            'Aluminio': '#c0c0c0',
            'Bronce': '#e1c16e',
            'Hierro': '#71797e',
            'Acero Inoxidable': '#e5e4e2',
            'Plomo': '#36454f',
            'Baterías': '#4b0082'
        };
        return colors[type] || '#888';
    };

    const filteredData = filter === 'All'
        ? inventory
        : inventory.filter(item => item.category === filter);

    return (
        <div className="glass" style={{
            margin: '40px 20px',
            padding: '40px',
            maxWidth: '1200px',
            marginLeft: 'auto',
            marginRight: 'auto'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px'
            }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Global <span className="gradient-text">Inventory</span></h2>
                    <p style={{ color: 'var(--text-dim)' }}>Real-time stock management for high-capacity recycling.</p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {['All', 'Ferrous', 'Non-Ferrous'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className="glass"
                            style={{
                                padding: '8px 20px',
                                border: filter === cat ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                                background: filter === cat ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                                color: filter === cat ? 'var(--primary)' : 'var(--text-main)',
                                borderRadius: '12px'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-dim)' }}>
                            <th style={{ padding: '20px' }}>Material</th>
                            <th style={{ padding: '20px' }}>Category</th>
                            <th style={{ padding: '20px' }}>Weight (kg)</th>
                            <th style={{ padding: '20px' }}>Price/kg</th>
                            <th style={{ padding: '20px' }}>Market Trend</th>
                            <th style={{ padding: '20px' }}>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? filteredData.map((item) => (
                            <tr key={item.id} style={{
                                borderBottom: '1px solid var(--glass-border)',
                                transition: 'background 0.3s ease'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }}></div>
                                    {item.name}
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        background: item.category === 'Ferrous' ? 'rgba(255,255,255,0.1)' : 'rgba(0, 242, 254, 0.1)',
                                        color: item.category === 'Ferrous' ? '#fff' : 'var(--primary)'
                                    }}>
                                        {item.category}
                                    </span>
                                </td>
                                <td style={{ padding: '20px', fontWeight: '600' }}>{item.weight.toLocaleString()}</td>
                                <td style={{ padding: '20px' }}>${item.price.toFixed(2)}</td>
                                <td style={{
                                    padding: '20px',
                                    color: item.trend.startsWith('+') ? '#4ade80' : item.trend.startsWith('-') ? '#f87171' : 'inherit'
                                }}>
                                    {item.trend}
                                </td>
                                <td style={{ padding: '20px', fontWeight: '700' }}>
                                    ${(item.weight * item.price).toLocaleString()}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                                    No hay materiales disponibles en el inventario actual.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{
                marginTop: '30px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '40px',
                padding: '20px',
                borderTop: '1px solid var(--glass-border)'
            }}>
                <div>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Total Weight:</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {filteredData.reduce((acc, curr) => acc + curr.weight, 0).toLocaleString()} kg
                    </div>
                </div>
                <div>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Estimated Value:</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        ${filteredData.reduce((acc, curr) => acc + (curr.weight * curr.price), 0).toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryPanel;
