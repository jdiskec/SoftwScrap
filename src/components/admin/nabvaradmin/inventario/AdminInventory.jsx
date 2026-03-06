import React, { useState, useEffect } from 'react';
import CrearFactura from '../../facturas/crearfactura';

/**
 * Componente AdminInventory (Acopio e Inventario)
 * Gestiona el acopio de materiales y el inventario por bodega.
 * Integra el panel de compra para el ingreso de mercadería.
 */
const AdminInventory = () => {
    // Listado inicial de productos con códigos únicos
    const [products, setProducts] = useState(() => {
        try {
            const saved = localStorage.getItem('inventory_products');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Error cargando inventario:", e);
            return [];
        }
    });

    // Sincronizar con localStorage
    useEffect(() => {
        localStorage.setItem('inventory_products', JSON.stringify(products));
    }, [products]);

    // Estado de vista: 'visual', 'lista', 'compra'
    const [viewMode, setViewMode] = useState('visual');
    const [selectedWarehouse, setSelectedWarehouse] = useState('Todas');

    // Estados para edición manual (mantenidos para correcciones rápidas)
    const [newProduct, setNewProduct] = useState({ code: '', name: '', type: 'Cobre', stock: '', price: '', image: null, warehouse: 'Bodega Principal' });
    const [editingProduct, setEditingProduct] = useState(null);

    const metalTypes = [
        'Cobre', 'Aluminio', 'Bronce', 'Hierro', 'Plomo', 'Acero Inoxidable', 'Baterías', 'Radiadores', 'Otros'
    ];

    const warehouseList = ['Bodega Principal', 'Bodega Norte', 'Bodega Sur', 'Almacén Central'];

    /**
     * Refresca el inventario tras una compra exitosa.
     * Aquí se "replica" o se asegura el flujo de datos desde el panel de compra.
     */
    const handlePurchaseSuccess = () => {
        const saved = localStorage.getItem('inventory_products');
        if (saved) setProducts(JSON.parse(saved));
        setViewMode('lista');
        alert("✅ Acopio registrado e inventario actualizado.");
    };

    /**
     * Gestión manual de productos (vía formulario)
     */
    const handleAdd = (e) => {
        e.preventDefault();
        const updated = [...products, { ...newProduct, id: Date.now(), status: 'En Venta' }];
        setProducts(updated);
        setNewProduct({ code: '', name: '', type: 'Cobre', stock: '', price: '', image: null, warehouse: 'Bodega Principal' });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
        setEditingProduct(null);
    };

    const toggleStatus = (id) => {
        setProducts(products.map(p => {
            if (p.id === id) {
                return { ...p, status: p.status === 'En Venta' ? 'Agotado' : 'En Venta' };
            }
            return p;
        }));
    };

    const getStockByWarehouse = (warehouse) => {
        return products
            .filter(p => p.warehouse === warehouse)
            .reduce((acc, p) => acc + (parseFloat(p.stock) || 0), 0)
            .toFixed(2);
    };

    const filteredProducts = selectedWarehouse === 'Todas'
        ? products
        : products.filter(p => p.warehouse === selectedWarehouse);

    return (
        <div style={{ padding: '20px' }}>
            {/* Cabecera y Navegación Interna */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.8rem' }}>Gestión de <span className="gradient-text">Acopio e Inventario</span></h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', margin: '5px 0 0 0' }}>Panel centralizado para el ingreso y control de materiales.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setViewMode('compra')}
                        className="btn-primary"
                        style={{ padding: '10px 25px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'var(--secondary)', fontWeight: 'bold' }}
                    >
                        ➕ Registrar Acopio (Compra)
                    </button>
                    <button
                        onClick={() => setViewMode('visual')}
                        className="glass"
                        style={{ padding: '10px 20px', borderRadius: '10px', border: viewMode === 'visual' ? '1px solid var(--primary)' : '1px solid var(--glass-border)', background: viewMode === 'visual' ? 'rgba(0, 242, 254, 0.1)' : 'transparent', color: '#fff', cursor: 'pointer' }}
                    >
                        🗺️ Mapa
                    </button>
                    <button
                        onClick={() => setViewMode('lista')}
                        className="glass"
                        style={{ padding: '10px 20px', borderRadius: '10px', border: viewMode === 'lista' ? '1px solid var(--primary)' : '1px solid var(--glass-border)', background: viewMode === 'lista' ? 'rgba(0, 242, 254, 0.1)' : 'transparent', color: '#fff', cursor: 'pointer' }}
                    >
                        📋 Inventario
                    </button>
                </div>
            </div>

            {/* MODAL / PANEL DE COMPRA (ACOPIO) */}
            {viewMode === 'compra' && (
                <div className="glass" style={{ padding: '30px', borderRadius: '20px', marginBottom: '40px', border: '1px solid var(--secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1.4rem' }}>🛒 Panel de <span style={{ color: 'var(--secondary)' }}>Compra y Asignación de Material</span></h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Complete los datos de la factura de compra para ingresar stock automáticamente.</p>
                        </div>
                        <button onClick={() => setViewMode('lista')} className="glass" style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', color: '#fff', cursor: 'pointer' }}>Cancelar</button>
                    </div>
                    {/* El componente CrearFactura ahora es el ÚNICO método oficial para guardar compras/acopio */}
                    <CrearFactura onSuccess={handlePurchaseSuccess} isEmbedded={true} fixedType="compra" />
                </div>
            )}

            {/* VISTA VISUAL DE BODEGAS */}
            {viewMode === 'visual' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <div
                        onClick={() => setSelectedWarehouse('Todas')}
                        className="glass"
                        style={{
                            padding: '25px', borderRadius: '15px', cursor: 'pointer',
                            border: selectedWarehouse === 'Todas' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                            transition: 'all 0.3s ease',
                            background: selectedWarehouse === 'Todas' ? 'rgba(0, 242, 254, 0.05)' : 'rgba(255,255,255,0.02)'
                        }}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏢</div>
                        <h4 style={{ margin: '0 0 5px 0' }}>Vista General</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Total en stock: {products.reduce((acc, p) => acc + (parseFloat(p.stock) || 0), 0).toFixed(2)} kg</p>
                    </div>

                    {warehouseList.map(w => (
                        <div
                            key={w}
                            onClick={() => setSelectedWarehouse(w)}
                            className="glass"
                            style={{
                                padding: '25px', borderRadius: '15px', cursor: 'pointer',
                                border: selectedWarehouse === w ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                                transition: 'all 0.3s ease',
                                background: selectedWarehouse === w ? 'rgba(0, 242, 254, 0.05)' : 'rgba(255,255,255,0.02)',
                                minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <div style={{ fontSize: '2rem' }}>🏭</div>
                                    <div style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)' }}>{products.filter(p => p.warehouse === w).length} Mats.</div>
                                </div>
                                <h4 style={{ margin: '0 0 5px 0' }}>{w}</h4>
                                <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', margin: '15px 0', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${Math.min((parseFloat(getStockByWarehouse(w)) / 1000) * 100, 100)}%`, background: 'var(--primary)', borderRadius: '4px' }}></div>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0 }}><strong>Carga:</strong> {getStockByWarehouse(w)} kg</p>
                        </div>
                    ))}
                </div>
            )}

            {/* LISTADO Y FORMULARIO MANUAL */}
            {(viewMode === 'lista' || viewMode === 'visual') && (
                <>
                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h4 style={{ fontSize: '1.2rem', margin: 0 }}>Materiales en <span style={{ color: 'var(--primary)' }}>{selectedWarehouse}</span></h4>
                        {selectedWarehouse !== 'Todas' && (
                            <button onClick={() => setSelectedWarehouse('Todas')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', textDecoration: 'underline' }}>Ver todos</button>
                        )}
                    </div>

                    <div className="glass" style={{ overflowX: 'auto', borderRadius: '15px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                                    <th style={{ padding: '18px' }}>Imagen</th>
                                    <th style={{ padding: '18px' }}>Código</th>
                                    <th style={{ padding: '18px' }}>Material</th>
                                    <th style={{ padding: '18px' }}>Tipo</th>
                                    <th style={{ padding: '18px' }}>Bodega</th>
                                    <th style={{ padding: '18px' }}>Stock (kg)</th>
                                    <th style={{ padding: '18px' }}>Estado</th>
                                    <th style={{ padding: '18px', textAlign: 'right' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr><td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>No hay materiales registrados.</td></tr>
                                ) : filteredProducts.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '15px' }}>
                                            {p.image ? <img src={p.image} alt={p.name} style={{ height: '40px', width: '40px', objectFit: 'cover', borderRadius: '8px' }} /> : <div className="glass" style={{ width: '40px', height: '40px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }}>Scrap</div>}
                                        </td>
                                        <td style={{ padding: '15px' }}><span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{p.code}</span></td>
                                        <td style={{ padding: '15px' }}>{p.name}</td>
                                        <td style={{ padding: '15px' }}>{p.type}</td>
                                        <td style={{ padding: '15px' }}>{p.warehouse}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{p.stock} kg</td>
                                        <td style={{ padding: '15px' }}>
                                            <span onClick={() => toggleStatus(p.id)} style={{ cursor: 'pointer', fontSize: '0.7rem', padding: '4px 12px', borderRadius: '20px', background: p.status === 'En Venta' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)', color: p.status === 'En Venta' ? '#4ade80' : '#f87171', border: '1px solid currentColor' }}>{p.status}</span>
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                                                <button onClick={() => setEditingProduct(p)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>✏️</button>
                                                <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Formulario Manual (Opcional/Secundario) */}
                    <div style={{ marginTop: '40px' }}>
                        <button onClick={() => setEditingProduct(editingProduct ? null : {})} className="glass" style={{ padding: '10px 20px', borderRadius: '8px', color: 'var(--text-dim)', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                            {editingProduct ? 'Cerrar Editor' : '🛠️ Ajuste Manual de Inventario'}
                        </button>

                        {(editingProduct || !products.length) && (
                            <form onSubmit={editingProduct?.id ? handleUpdate : handleAdd} className="glass" style={{ padding: '25px', marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', alignItems: 'end' }}>
                                <h5 style={{ gridColumn: '1/-1', margin: '0 0 10px 0' }}>{editingProduct?.id ? '📝 Editar Material' : '➕ Nuevo Material (Manual)'}</h5>
                                <div><label style={{ fontSize: '0.7rem' }}>Código</label><input type="text" className="glass-input" value={editingProduct?.id ? editingProduct.code : newProduct.code} onChange={e => editingProduct?.id ? setEditingProduct({ ...editingProduct, code: e.target.value }) : setNewProduct({ ...newProduct, code: e.target.value })} /></div>
                                <div><label style={{ fontSize: '0.7rem' }}>Nombre</label><input type="text" className="glass-input" value={editingProduct?.id ? editingProduct.name : newProduct.name} onChange={e => editingProduct?.id ? setEditingProduct({ ...editingProduct, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })} /></div>
                                <div><label style={{ fontSize: '0.7rem' }}>Tipo</label><select className="glass-input" value={editingProduct?.id ? editingProduct.type : newProduct.type} onChange={e => editingProduct?.id ? setEditingProduct({ ...editingProduct, type: e.target.value }) : setNewProduct({ ...newProduct, type: e.target.value })}>{metalTypes.map(t => <option key={t} value={t} style={{ background: '#111' }}>{t}</option>)}</select></div>
                                <div><label style={{ fontSize: '0.7rem' }}>Bodega</label><select className="glass-input" value={editingProduct?.id ? editingProduct.warehouse : newProduct.warehouse} onChange={e => editingProduct?.id ? setEditingProduct({ ...editingProduct, warehouse: e.target.value }) : setNewProduct({ ...newProduct, warehouse: e.target.value })}>{warehouseList.map(w => <option key={w} value={w} style={{ background: '#111' }}>{w}</option>)}</select></div>
                                <div><label style={{ fontSize: '0.7rem' }}>Stock (kg)</label><input type="number" className="glass-input" value={editingProduct?.id ? editingProduct.stock : newProduct.stock} onChange={e => editingProduct?.id ? setEditingProduct({ ...editingProduct, stock: e.target.value }) : setNewProduct({ ...newProduct, stock: e.target.value })} /></div>
                                <button type="submit" className="btn-primary" style={{ padding: '10px' }}>{editingProduct?.id ? 'Guardar' : 'Añadir'}</button>
                            </form>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminInventory;
