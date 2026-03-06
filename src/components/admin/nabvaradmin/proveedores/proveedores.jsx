import React, { useState, useEffect } from 'react';

const Proveedores = () => {
    const [proveedores, setProveedores] = useState(() => {
        const saved = localStorage.getItem('proveedores');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Recicladora del Sur', ruc: '1792345678001', phone: '0987654321', email: 'vargas@recicla.com' },
            { id: 2, name: 'Metales Cuenca', ruc: '0102345678001', phone: '074123456', email: 'info@metalescuenca.com' }
        ];
    });

    const [newProv, setNewProv] = useState({ name: '', ruc: '', phone: '', email: '' });

    useEffect(() => {
        localStorage.setItem('proveedores', JSON.stringify(proveedores));
    }, [proveedores]);

    const handleAdd = (e) => {
        e.preventDefault();
        setProveedores([...proveedores, { ...newProv, id: Date.now() }]);
        setNewProv({ name: '', ruc: '', phone: '', email: '' });
    };

    const handleDelete = (id) => {
        setProveedores(proveedores.filter(p => p.id !== id));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Registro de <span className="gradient-text">Proveedores</span></h3>

            <form onSubmit={handleAdd} className="glass" style={{
                padding: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px'
            }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem' }}>Nombre / Razón Social</label>
                    <input type="text" className="glass" style={{ width: '100%', padding: '10px' }} value={newProv.name} onChange={(e) => setNewProv({ ...newProv, name: e.target.value })} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem' }}>RUC / CI</label>
                    <input type="text" className="glass" style={{ width: '100%', padding: '10px' }} value={newProv.ruc} onChange={(e) => setNewProv({ ...newProv, ruc: e.target.value })} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem' }}>Teléfono</label>
                    <input type="text" className="glass" style={{ width: '100%', padding: '10px' }} value={newProv.phone} onChange={(e) => setNewProv({ ...newProv, phone: e.target.value })} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem' }}>Email</label>
                    <input type="email" className="glass" style={{ width: '100%', padding: '10px' }} value={newProv.email} onChange={(e) => setNewProv({ ...newProv, email: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '10px', gridColumn: '1 / -1' }}>Registrar Proveedor</button>
            </form>

            <div className="glass" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-dim)' }}>
                            <th style={{ padding: '15px' }}>Nombre</th>
                            <th style={{ padding: '15px' }}>RUC</th>
                            <th style={{ padding: '15px' }}>Teléfono</th>
                            <th style={{ padding: '15px' }}>Email</th>
                            <th style={{ padding: '15px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proveedores.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '15px' }}>{p.name}</td>
                                <td style={{ padding: '15px' }}>{p.ruc}</td>
                                <td style={{ padding: '15px' }}>{p.phone}</td>
                                <td style={{ padding: '15px' }}>{p.email}</td>
                                <td style={{ padding: '15px' }}>
                                    <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Proveedores;
