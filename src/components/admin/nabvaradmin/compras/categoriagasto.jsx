import React, { useState, useEffect } from 'react';

const CategoriaGasto = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '#00f2fe' });

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('compras_categories') || '[]');
        if (saved.length === 0) {
            // Unas iniciales por defecto si no hay ninguna
            const initial = [
                { id: 1, name: 'Materia Prima', description: 'Metales, chatarra y reciclaje', color: '#4ade80' },
                { id: 2, name: 'Suministros', description: 'Gasolina, embalajes, herramientas', color: '#fbbf24' },
                { id: 3, name: 'Servicios Básicos', description: 'Luz, agua, internet', color: '#22c55e' },
                { id: 4, name: 'Mantenimiento', description: 'Reparación de maquinaria o local', color: '#f87171' }
            ];
            localStorage.setItem('compras_categories', JSON.stringify(initial));
            setCategories(initial);
        } else {
            setCategories(saved);
        }
    }, []);

    const handleAdd = (e) => {
        e.preventDefault();
        const updated = [...categories, { ...newCategory, id: Date.now() }];
        setCategories(updated);
        localStorage.setItem('compras_categories', JSON.stringify(updated));
        setNewCategory({ name: '', description: '', color: '#00f2fe' });
    };

    const handleDelete = (id) => {
        const updated = categories.filter(c => c.id !== id);
        setCategories(updated);
        localStorage.setItem('compras_categories', JSON.stringify(updated));
    };

    return (
        <div className="categoria-gasto-container animate-fade-in">
            <h4 style={{ marginBottom: '20px' }}>📦 Gestión de <span className="gradient-text">Categorías de Gastos</span></h4>

            <form onSubmit={handleAdd} className="glass" style={{ padding: '20px', marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '15px', alignItems: 'end' }}>
                <div>
                    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Nombre</label>
                    <input type="text" className="glass-input" value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} placeholder="Ej: Operativos" required />
                </div>
                <div>
                    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Descripción</label>
                    <input type="text" className="glass-input" value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })} placeholder="Para qué se usa..." />
                </div>
                <div>
                    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Color</label>
                    <input type="color" value={newCategory.color} onChange={e => setNewCategory({ ...newCategory, color: e.target.value })} style={{ width: '40px', height: '40px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }} />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '12px 25px' }}>Añadir</button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {categories.map(c => (
                    <div key={c.id} className="glass category-card" style={{ padding: '20px', borderLeft: `5px solid ${c.color}`, position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h5 style={{ margin: 0, fontSize: '1.2rem' }}>{c.name}</h5>
                            <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>✕</button>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', margin: '10px 0' }}>{c.description}</p>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>ID: {c.id}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriaGasto;
