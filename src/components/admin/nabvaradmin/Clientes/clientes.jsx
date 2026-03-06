import React, { useState, useEffect } from 'react';

const Clientes = () => {
    const [clientes, setClientes] = useState(() => {
        const saved = localStorage.getItem('clientes');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Consumidor Final', ci: '9999999999', phone: '0000000', email: 'cf@null.com' },
            { id: 2, name: 'Juan Perez', ci: '0105678912', phone: '0995544332', email: 'juan@mail.com' }
        ];
    });

    const [newCli, setNewCli] = useState({ name: '', ci: '', phone: '', email: '', direccion: '', residencia: '' });

    useEffect(() => {
        localStorage.setItem('clientes', JSON.stringify(clientes));
    }, [clientes]);

    const handleAdd = (e) => {
        e.preventDefault();
        setClientes([...clientes, { ...newCli, id: Date.now() }]);
        setNewCli({ name: '', ci: '', phone: '', email: '', direccion: '', residencia: '' });
    };

    const handleDelete = (id) => {
        setClientes(clientes.filter(c => c.id !== id));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Gestión de <span className="gradient-text">Clientes</span></h3>

            <form onSubmit={handleAdd} className="glass" style={{
                padding: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px'
            }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem' }}>Nombre Completo</label>
                    <input type="text" className="glass" style={{ width: '100%', padding: '10px' }} value={newCli.name} onChange={(e) => setNewCli({ ...newCli, name: e.target.value })} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem' }}>Cédula / RUC</label>
                    <input type="text" className="glass" style={{ width: '100%', padding: '10px' }} value={newCli.ci} onChange={(e) => setNewCli({ ...newCli, ci: e.target.value })} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem' }}>Teléfono</label>
                    <input type="text" className="glass" style={{ width: '100%', padding: '10px' }} value={newCli.phone} onChange={(e) => setNewCli({ ...newCli, phone: e.target.value })} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem' }}>Email</label>
                    <input type="email" className="glass" style={{ width: '100%', padding: '10px' }} value={newCli.email} onChange={(e) => setNewCli({ ...newCli, email: e.target.value })} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem' }}>Dirección</label>
                    <input type="text" className="glass" style={{ width: '100%', padding: '10px' }} value={newCli.direccion} onChange={(e) => setNewCli({ ...newCli, direccion: e.target.value })} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem' }}>Nro. Residencia</label>
                    <input type="text" className="glass" style={{ width: '100%', padding: '10px' }} value={newCli.residencia} onChange={(e) => setNewCli({ ...newCli, residencia: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '10px', gridColumn: '1 / -1' }}>Registrar Cliente</button>
            </form>

            <div className="glass" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-dim)' }}>
                            <th style={{ padding: '15px' }}>Nombre</th>
                            <th style={{ padding: '15px' }}>ID / Cédula</th>
                            <th style={{ padding: '15px' }}>Teléfono</th>
                            <th style={{ padding: '15px' }}>Email</th>
                            <th style={{ padding: '15px' }}>Dirección</th>
                            <th style={{ padding: '15px' }}>Nro. Residencia</th>
                            <th style={{ padding: '15px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(c => (
                            <tr key={c.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '15px' }}>{c.name}</td>
                                <td style={{ padding: '15px' }}>{c.ci}</td>
                                <td style={{ padding: '15px' }}>{c.phone}</td>
                                <td style={{ padding: '15px' }}>{c.email}</td>
                                <td style={{ padding: '15px' }}>{c.direccion}</td>
                                <td style={{ padding: '15px' }}>{c.residencia}</td>
                                <td style={{ padding: '15px' }}>
                                    <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clientes;
