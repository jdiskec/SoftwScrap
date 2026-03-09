import React, { useState, useEffect } from 'react';
import './Facturascompra.css';

/**
 * Componente Facturascompra
 * Maneja la visualización de facturas de compra y la creación de nuevas con lógica avanzada.
 */
const Facturascompra = () => {
    const [view, setView] = useState('list'); // 'list', 'create', 'report'
    const [filters, setFilters] = useState({
        desde: '',
        hasta: '',
        sucursal: 'Todas'
    });

    const [compras, setCompras] = useState([]);
    const [inventory, setInventory] = useState([]);

    // Estado para el formulario de "Añadir Factura"
    const [formData, setFormData] = useState({
        sucursal: 'Matriz Cuenca',
        proveedor: '',
        tipoDocumento: 'Factura',
        sustentoTributario: 'Crédito Tributario para declaración de IVA',
        fecha: new Date().toISOString().split('T')[0],
        nroDocumento: '',
        nroAutorizacion: '',
        almacen: 'Bodega Principal',
        categoria: 'Materia Prima',
        formaPago: 'Contado',
        disponibleCaja: 1540.50,
        caja: 'Caja Principal',
        totalPagar: 0,
        billete: 0,
        cambio: 0,
        detalleIVA15: 0,
        detalleIVA0: 0,
        descuento: 0,
        descuentoPorcentaje: 0,
        descuentoValor: 0,
        comisionPorcentaje: 0,
        montoICE: 0,
        iva15: 0,
        total: 0
    });

    const [items, setItems] = useState([
        { id: 1, codBarra: '', producto: '', precio: 0, existencia: 0, cantidad: 0, descuento: 0, unidad: 'kg', iva: 15, subtotal: 0 }
    ]);

    useEffect(() => {
        const savedCompras = localStorage.getItem('compras_realizadas');
        if (savedCompras) setCompras(JSON.parse(savedCompras));

        const savedInventory = localStorage.getItem('inventory_products');
        if (savedInventory) setInventory(JSON.parse(savedInventory));

        const savedCategories = localStorage.getItem('compras_categories');
        if (savedCategories) setCategories(JSON.parse(savedCategories));
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const addItem = () => {
        const newItem = {
            id: items.length + 1,
            codBarra: '',
            producto: '',
            precio: 0,
            existencia: 0,
            cantidad: 0,
            descuento: 0,
            unidad: 'kg',
            iva: 15,
            subtotal: 0
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleItemChange = (id, field, value) => {
        const newItems = items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'cantidad' || field === 'precio' || field === 'descuento') {
                    const cant = parseFloat(updatedItem.cantidad) || 0;
                    const pre = parseFloat(updatedItem.precio) || 0;
                    const desc = parseFloat(updatedItem.descuento) || 0;
                    updatedItem.subtotal = (cant * pre) - desc;
                }
                return updatedItem;
            }
            return item;
        });
        setItems(newItems);
        calculateTotals(newItems);
    };

    const calculateTotals = (currentItems) => {
        let subtotal15 = 0;
        let subtotal0 = 0;

        currentItems.forEach(item => {
            const sub = parseFloat(item.subtotal) || 0;
            if (parseInt(item.iva) === 15) {
                subtotal15 += sub;
            } else {
                subtotal0 += sub;
            }
        });

        const bruto = subtotal15 + subtotal0;
        const comision = bruto * (parseFloat(formData.comisionPorcentaje || 0) / 100);

        // Descuentos
        const descPct = parseFloat(formData.descuentoPorcentaje || 0);
        const descFixed = parseFloat(formData.descuentoValor || 0);
        const totalDesc = (bruto * (descPct / 100)) + descFixed;

        // Distribución proporcional
        const ratio15 = bruto > 0 ? (subtotal15 / bruto) : 1;
        const ratio0 = bruto > 0 ? (subtotal0 / bruto) : 0;

        const desc15 = totalDesc * ratio15;
        const desc0 = totalDesc * ratio0;

        const subConDesc15 = Math.max(0, subtotal15 - desc15);
        const subConDesc0 = Math.max(0, subtotal0 - desc0);

        const iva15Val = subConDesc15 * 0.15;
        const finalTotal = subConDesc15 + subConDesc0 + iva15Val + comision;

        setFormData(prev => ({
            ...prev,
            detalleIVA15: subtotal15,
            detalleIVA0: subtotal0,
            descuento: totalDesc,
            iva15: iva15Val,
            total: finalTotal,
            totalPagar: finalTotal
        }));
    };

    const handleSaveFactura = (e) => {
        e.preventDefault();
        // Lógica para guardar similar a compras.jsx original
        const nuevaCompra = {
            id: formData.nroDocumento || `COM-${Date.now()}`,
            cliente: formData.proveedor,
            fecha: formData.fecha,
            total: formData.total,
            items: items.map(i => ({ ...i, material: i.producto, peso: i.cantidad })),
            sucursal: formData.sucursal,
            categoria: formData.categoria,
            formaPago: formData.formaPago
        };

        const updatedCompras = [nuevaCompra, ...compras];
        setCompras(updatedCompras);
        localStorage.setItem('compras_realizadas', JSON.stringify(updatedCompras));

        alert('Factura guardada correctamente');
        setView('list');
    };

    const renderListView = () => (
        <div className="facturas-list-view">
            <div className="filters-bar glass" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'flex-end', marginBottom: '20px' }}>
                <div className="filter-group">
                    <label>Sucursal</label>
                    <select name="sucursal" value={filters.sucursal} onChange={handleFilterChange} className="glass-input">
                        <option value="Todas">Todas</option>
                        <option value="Matriz Cuenca">Matriz Cuenca</option>
                        <option value="Sucursal Guayaquil">Sucursal Guayaquil</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Desde</label>
                    <input type="date" name="desde" value={filters.desde} onChange={handleFilterChange} className="glass-input" />
                </div>
                <div className="filter-group">
                    <label>Hasta</label>
                    <input type="date" name="hasta" value={filters.hasta} onChange={handleFilterChange} className="glass-input" />
                </div>
                <div style={{ flex: 1 }}></div>
                <div className="stats-mini-window glass" style={{ padding: '10px 20px', textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Monto Total Filtrado</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                        ${compras.reduce((acc, c) => acc + (parseFloat(c.total) || 0), 0).toFixed(2)}
                    </div>
                </div>
                <div className="action-buttons" style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setView('report')} className="glass-btn" style={{ padding: '10px 20px' }}>📊 Reporte</button>
                    <button onClick={() => setView('create')} className="btn-primary" style={{ padding: '10px 20px' }}>➕ Añadir</button>
                </div>
            </div>

            <div className="glass table-container">
                <table className="facturas-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Nro. Documento</th>
                            <th>Proveedor</th>
                            <th>Sucursal</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {compras.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No se encontraron facturas.</td></tr>
                        ) : (
                            compras.map(c => (
                                <tr key={c.id}>
                                    <td>{c.fecha}</td>
                                    <td>{c.id}</td>
                                    <td>{c.cliente}</td>
                                    <td>{c.sucursal || 'Matriz'}</td>
                                    <td style={{ fontWeight: 'bold' }}>${(parseFloat(c.total) || 0).toFixed(2)}</td>
                                    <td>
                                        <button className="btn-icon">👁️</button>
                                        <button className="btn-icon">🗑️</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderCreateView = () => (
        <div className="factura-create-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => setView('list')} className="glass-btn">⬅️ Volver</button>
                <h3>Crear Nueva <span className="gradient-text">Factura de Compra</span></h3>
            </div>

            <form onSubmit={handleSaveFactura} className="invoice-complex-form">
                <div className="form-sections-grid">
                    {/* Datos Generales */}
                    <div className="glass form-section">
                        <h5 style={{ color: 'var(--primary)', marginBottom: '15px' }}>📋 Datos Generales</h5>
                        <div className="form-grid-3">
                            <div className="form-group">
                                <label>Sucursal</label>
                                <select value={formData.sucursal} onChange={(e) => setFormData({ ...formData, sucursal: e.target.value })} className="glass-input">
                                    <option>Matriz Cuenca</option>
                                    <option>Sucursal Guayaquil</option>
                                    <option>+ Añadir Sucursal</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Proveedor</label>
                                <input type="text" value={formData.proveedor} onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })} className="glass-input" placeholder="Nombre o RUC" required />
                            </div>
                            <div className="form-group">
                                <label>Tipo Documento</label>
                                <select
                                    className="glass-input"
                                    value={formData.tipoDocumento}
                                    onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value })}
                                >
                                    <option value="Factura">Factura</option>
                                    <option value="Nota de Venta">Nota de Venta</option>
                                    <option value="Liquidación de Compra">Liquidación de Compra</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Caja</label>
                                <select
                                    className="glass-input"
                                    value={formData.caja}
                                    onChange={(e) => setFormData({ ...formData, caja: e.target.value })}
                                >
                                    <option value="Caja Principal">Caja Principal</option>
                                    <option value="Caja 2">Caja 2</option>
                                    <option value="Caja Chica">Caja Chica</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>Sustento Tributario</label>
                                <select className="glass-input">
                                    <option>Crédito Tributario para declaración de IVA</option>
                                    <option>Costo o Gasto para declaración de I.R.</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Fecha</label>
                                <input type="date" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} className="glass-input" />
                            </div>
                            <div className="form-group">
                                <label>Nro. Documento</label>
                                <input type="text" value={formData.nroDocumento} onChange={(e) => setFormData({ ...formData, nroDocumento: e.target.value })} className="glass-input" placeholder="000-000-000000000" />
                            </div>
                            <div className="form-group">
                                <label>Nro. Autorización</label>
                                <input type="text" className="glass-input" placeholder="10 dígitos o 49" />
                            </div>
                            <div className="form-group">
                                <label>Almacén</label>
                                <select className="glass-input">
                                    <option>Bodega Principal</option>
                                    <option>Patio de Chatarra</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Categoría</label>
                                <select
                                    className="glass-input"
                                    value={formData.categoria}
                                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                >
                                    {categories.length > 0 ? (
                                        categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
                                    ) : (
                                        <>
                                            <option>Materia Prima</option>
                                            <option>Suministros</option>
                                            <option>Activos Fijos</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Productos */}
                    <div className="glass form-section" style={{ gridColumn: 'span 2' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h5 style={{ color: 'var(--primary)', margin: 0 }}>🛒 Lista de Productos</h5>
                            <button type="button" onClick={addItem} className="btn-add-item" style={{ margin: 0, padding: '5px 15px' }}>+ Agregar Fila</button>
                        </div>
                        <div className="table-wrapper">
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Acción</th>
                                        <th>Nro</th>
                                        <th>Cod Barra</th>
                                        <th>Producto</th>
                                        <th>Precio</th>
                                        <th>Exis.</th>
                                        <th>Cant.</th>
                                        <th>% Desc</th>
                                        <th>Unidad</th>
                                        <th>IVA</th>
                                        <th>SubTotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, idx) => (
                                        <tr key={item.id}>
                                            <td><button type="button" onClick={() => removeItem(item.id)} className="btn-remove">✕</button></td>
                                            <td>{idx + 1}</td>
                                            <td><input type="text" className="table-input" value={item.codBarra} onChange={(e) => handleItemChange(item.id, 'codBarra', e.target.value)} /></td>
                                            <td><input type="text" className="table-input" value={item.producto} onChange={(e) => handleItemChange(item.id, 'producto', e.target.value)} list="inventory-list-facturas" /></td>
                                            <td><input type="number" className="table-input" value={item.precio} onChange={(e) => handleItemChange(item.id, 'precio', e.target.value)} /></td>
                                            <td>{item.existencia}</td>
                                            <td><input type="number" className="table-input" value={item.cantidad} onChange={(e) => handleItemChange(item.id, 'cantidad', e.target.value)} /></td>
                                            <td><input type="number" className="table-input" value={item.descuento} onChange={(e) => handleItemChange(item.id, 'descuento', e.target.value)} /></td>
                                            <td>
                                                <select className="table-input" value={item.unidad} onChange={(e) => handleItemChange(item.id, 'unidad', e.target.value)}>
                                                    <option>kg</option>
                                                    <option>lb</option>
                                                    <option>unidad</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select className="table-input" value={item.iva} onChange={(e) => handleItemChange(item.id, 'iva', parseInt(e.target.value))}>
                                                    <option value="15">15%</option>
                                                    <option value="0">0%</option>
                                                </select>
                                            </td>
                                            <td style={{ fontWeight: 'bold' }}>${item.subtotal.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pago y Totales */}
                    <div className="glass form-section" style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
                        {/* Forma de Pago y Caja */}
                        <div>
                            <h5 style={{ color: 'var(--primary)', marginBottom: '15px' }}>💳 Pago y Caja</h5>
                            <div className="form-group">
                                <label>Método</label>
                                <select value={formData.formaPago} onChange={(e) => setFormData({ ...formData, formaPago: e.target.value })} className="glass-input">
                                    <option>Contado</option>
                                    <option>Crédito</option>
                                </select>
                            </div>
                            <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.8rem' }}>Caja: <span style={{ color: 'var(--primary)' }}>{formData.caja}</span></div>
                                <div style={{ fontSize: '0.8rem' }}>Disponible: <span style={{ color: '#4ade80' }}>${formData.disponibleCaja.toFixed(2)}</span></div>
                            </div>
                        </div>

                        {/* Calculadora de Cambio */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <h5 style={{ color: 'var(--primary)', marginBottom: '15px' }}>💰 Pago</h5>
                            <div className="form-group">
                                <label>Total a Pagar</label>
                                <div className="display-total">${formData.totalPagar.toFixed(2)}</div>
                            </div>
                            <div className="form-group">
                                <label>Paga con / Billete</label>
                                <input type="number" className="glass-input highlight-input" value={formData.billete} onChange={(e) => {
                                    const billete = parseFloat(e.target.value) || 0;
                                    setFormData({ ...formData, billete, cambio: billete - formData.totalPagar });
                                }} />
                            </div>
                            <div className="cambio-display" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                marginTop: '10px',
                                padding: '20px',
                                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(21, 128, 61, 0.2) 100%)',
                                borderRadius: '16px',
                                border: '1px solid rgba(34, 197, 94, 0.3)',
                                boxShadow: '0 8px 32px rgba(34, 197, 94, 0.15)'
                            }}>
                                <span style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))' }}>💰</span>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: '#86efac', fontWeight: '500' }}>Cambio (Resultado)</div>
                                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#22c55e' }}>
                                        ${(formData.cambio > 0 ? formData.cambio : 0).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desglose de Factura */}
                        <div className="totales-breakdown" style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '-10px', right: '10px', fontSize: '0.7rem', color: 'var(--text-dim)', background: 'var(--bg-main)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                🧾 Resumen de Auditoría
                            </div>
                            <div className="summary-row"><span>Subtotal IVA 15%:</span><span>${formData.detalleIVA15.toFixed(2)}</span></div>
                            <div className="summary-row"><span>Subtotal IVA 0%:</span><span>${formData.detalleIVA0.toFixed(2)}</span></div>
                            <div className="summary-row" style={{ color: 'var(--primary)' }}><span>Comisión:</span><span>+${(formData.total - (formData.detalleIVA15 + formData.detalleIVA0 - formData.descuento + (formData.detalleIVA15 * 0.15))).toFixed(2)}</span></div>
                            <div className="summary-row" style={{ color: '#f87171' }}><span>Descuento Total:</span><span>-${formData.descuento.toFixed(2)}</span></div>

                            <div className="summary-row" style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>
                                <span>Comisión (%)</span>
                                <input type="number" value={formData.comisionPorcentaje} onChange={(e) => setFormData({ ...formData, comisionPorcentaje: e.target.value })} className="table-input" style={{ width: '60px' }} />
                            </div>
                            <div className="summary-row" style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>
                                <span>Desc. (%)</span>
                                <input type="number" value={formData.descuentoPorcentaje} onChange={(e) => setFormData({ ...formData, descuentoPorcentaje: e.target.value })} className="table-input" style={{ width: '60px' }} />
                            </div>
                            <div className="summary-row" style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>
                                <span>Desc. ($)</span>
                                <input type="number" value={formData.descuentoValor} onChange={(e) => setFormData({ ...formData, descuentoValor: e.target.value })} className="table-input" style={{ width: '60px' }} />
                            </div>

                            <div className="summary-row"><span>IVA 15%:</span><span>${formData.iva15.toFixed(2)}</span></div>
                            <div className="summary-row total"><span>TOTAL:</span><span>${formData.total.toFixed(2)}</span></div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button type="button" onClick={() => alert('Generando XML...')} className="glass-btn" style={{ flex: 1, padding: '10px' }}>📦 XML</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2, padding: '10px' }}>💾 Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <datalist id="inventory-list-facturas">
                {inventory.map(p => (
                    <option key={p.id} value={p.name}>{p.code}</option>
                ))}
            </datalist>
        </div>
    );

    const renderReportView = () => (
        <div className="facturas-report-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => setView('list')} className="glass-btn">⬅️ Volver</button>
                <h3>Estadísticas Generales de <span className="gradient-text">Compras</span></h3>
            </div>

            <div className="report-grid">
                <div className="glass report-card">
                    <h5>Gasto Total del Mes</h5>
                    <div className="stat-value">$12,450.00</div>
                    <div className="stat-trend positive">+15% vs mes anterior</div>
                </div>
                <div className="glass report-card">
                    <h5>Facturas Pendientes</h5>
                    <div className="stat-value">5</div>
                    <div className="stat-label">Cuentas por pagar</div>
                </div>
                <div className="glass report-card">
                    <h5>Categoría más Comprada</h5>
                    <div className="stat-value">Chatarra Ferroosa</div>
                    <div className="stat-label">65% del volumen total</div>
                </div>
                <div className="glass report-card" style={{ gridColumn: 'span 2' }}>
                    <h5>Flujo de Compras (Últimos 7 días)</h5>
                    <div style={{ height: '100px', display: 'flex', alignItems: 'flex-end', gap: '5px' }}>
                        {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                            <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--primary)', borderRadius: '4px' }}></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );


    return (
        <div className="facturas-container">
            {view === 'list' && renderListView()}
            {view === 'create' && renderCreateView()}
            {view === 'report' && renderReportView()}
        </div>
    );
};

export default Facturascompra;
