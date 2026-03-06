import React, { useState, useEffect } from 'react';

const Materiales = () => {
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('inventory_products');
        if (saved) setInventory(JSON.parse(saved));
    }, []);

    const metalTypes = [
        'Cobre', 'Aluminio', 'Bronce', 'Hierro', 'Plomo', 'Acero Inoxidable', 'Baterías', 'Radiadores', 'Otros'
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Catálogo de <span className="gradient-text">Materiales Disponibles</span></h3>
            <p style={{ color: 'var(--text-dim)', marginBottom: '30px' }}>Resumen de materiales clasificados por tipo de metal en acopio.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {metalTypes.map(type => {
                    const items = inventory.filter(item => item.type === type);
                    const totalWeight = items.reduce((acc, item) => acc + parseFloat(item.stock), 0);

                    if (items.length === 0) return null;

                    return (
                        <div key={type} className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ margin: 0, color: 'var(--primary)' }}>{type}</h4>
                                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{items.length} productos</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {items.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '5px' }}>
                                        <span>{item.name}</span>
                                        <span style={{ fontWeight: 'bold' }}>{item.stock} kg</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                <span>Total Acumulado:</span>
                                <span style={{ color: '#4ade80' }}>{totalWeight.toFixed(2)} kg</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {inventory.length === 0 && (
                <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
                    <p>No hay materiales registrados en el inventario.</p>
                </div>
            )}
        </div>
    );
};

export default Materiales;
