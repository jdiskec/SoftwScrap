import React, { useState, useEffect } from 'react';
import './crearfactura.css';

/**
 * Componente CrearFactura
 * Permite la generación de facturas electrónicas e impresión de recibos.
 * Soporta modo embebido para integrarse en dashboards.
 * 
 * @param {Function} onBack - Función para regresar a la vista anterior (opcional).
 * @param {Function} onSuccess - Callback ejecutado tras generar exitosamente una factura.
 * @param {Boolean} isEmbedded - Si es true, ajusta el diseño para mostrarse dentro de otro componente.
 * @param {String} fixedType - Si se provee ('venta' o 'compra'), bloquea el tipo de factura.
 */
const CrearFactura = ({ onBack, onSuccess, isEmbedded = false, fixedType = null }) => {
    // Datos del Emisor (Configuración del Negocio)
    const [emisor] = useState({
        nombre: 'ECOSCRAP ECUADOR S.A.',
        ruc: '0102030405001',
        direccion: 'Av. de las Américas y Paseo de los Cañaris, Cuenca',
        telefono: '07-2456789 / 0987654321',
        ciudad: 'Cuenca'
    });

    // Estado para los datos del comprador
    const [cliente, setCliente] = useState({
        nombre: '',
        ruc: '',
        direccion: '',
        email: '',
        telefono: '',
        residencia: ''
    });

    // Estado para los items de la factura (materiales)
    const [items, setItems] = useState([{ codigo: '', material: '', peso: '', precio: '', total: 0, bodega: '' }]);

    // Otros datos de factura
    const [invoiceInfo, setInvoiceInfo] = useState({
        observaciones: '',
        formaPago: 'Efectivo',
        vendedor: 'Admin Central',
        nroDocumento: `001-001-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`
    });

    // Estados para control de impresión/modales
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [printerType, setPrinterType] = useState('normal');
    const [conIVA, setConIVA] = useState(true);
    const [tipoFactura, setTipoFactura] = useState(fixedType || 'venta');
    const [businessLogo, setBusinessLogo] = useState(null);

    // Cargar inventario real
    const [inventory, setInventory] = useState([]);
    useEffect(() => {
        try {
            const saved = localStorage.getItem('inventory_products');
            if (saved) setInventory(JSON.parse(saved));
        } catch (e) {
            console.error("Error cargando inventario:", e);
        }
    }, []);

    // Sincronizar tipoFactura con fixedType si cambia el prop
    useEffect(() => {
        if (fixedType) {
            setTipoFactura(fixedType);
        }
    }, [fixedType]);

    const handleClienteChange = (e) => {
        setCliente({ ...cliente, [e.target.name]: e.target.value });
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBusinessLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...items];
        newItems[index][name] = value;

        if (name === 'material') {
            const selectedProduct = inventory.find(p => p.name === value);
            if (selectedProduct) {
                newItems[index].codigo = selectedProduct.code;
                newItems[index].precio = selectedProduct.price;
                newItems[index].bodega = selectedProduct.warehouse || 'Bodega Principal';
            }
        }

        if (name === 'peso' || name === 'precio' || name === 'material') {
            const peso = parseFloat(newItems[index].peso) || 0;
            const precio = parseFloat(newItems[index].precio) || 0;
            newItems[index].total = (peso * precio).toFixed(2);
        }

        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { codigo: '', material: '', peso: '', precio: '', total: 0, bodega: '' }]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const calculateSubtotal = () => {
        return items.reduce((acc, item) => acc + parseFloat(item.total || 0), 0).toFixed(2);
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        if (tipoFactura === 'venta') {
            for (const item of items) {
                const product = inventory.find(p => p.code === item.codigo);
                if (product) {
                    const stockActual = parseFloat(product.stock) || 0;
                    const pesoVenta = parseFloat(item.peso) || 0;
                    if (pesoVenta > stockActual) {
                        alert(`Stock insuficiente para ${item.material}. Disponible: ${stockActual}kg`);
                        return;
                    }
                }
            }
        }
        setShowPrintModal(true);
    };

    const confirmPrint = () => {
        const subtotal = parseFloat(calculateSubtotal());
        const valorIva = conIVA ? subtotal * 0.15 : 0;
        const totalFinal = subtotal + valorIva;

        const nuevaFactura = {
            id: invoiceInfo.nroDocumento,
            tipo: tipoFactura,
            cliente: cliente.nombre,
            fecha: new Date().toISOString().split('T')[0],
            hora: new Date().toLocaleTimeString(),
            total: totalFinal,
            estado: 'Pagada',
            formaPago: invoiceInfo.formaPago,
            items: items
        };

        // 1. Guardar factura
        let facturasExistentes = [];
        try {
            facturasExistentes = JSON.parse(localStorage.getItem('facturas_emitidas') || '[]');
        } catch (e) {
            console.error("Error parsing facturas:", e);
        }
        localStorage.setItem('facturas_emitidas', JSON.stringify([nuevaFactura, ...facturasExistentes]));

        // 2. Actualizar Inventario
        const updatedInventory = [...inventory];
        items.forEach(item => {
            const productIndex = updatedInventory.findIndex(p => p.code === item.codigo || (p.name === item.material && p.warehouse === item.bodega));

            if (productIndex !== -1) {
                const currentStock = parseFloat(updatedInventory[productIndex].stock) || 0;
                const weight = parseFloat(item.peso) || 0;
                if (tipoFactura === 'venta') {
                    updatedInventory[productIndex].stock = (currentStock - weight).toFixed(2);
                } else {
                    updatedInventory[productIndex].stock = (currentStock + weight).toFixed(2);
                }

                if (parseFloat(updatedInventory[productIndex].stock) <= 0) {
                    updatedInventory[productIndex].status = 'Agotado';
                    updatedInventory[productIndex].stock = '0.00';
                } else {
                    updatedInventory[productIndex].status = 'En Venta';
                }
            } else if (tipoFactura === 'compra') {
                const nuevoMaterial = {
                    id: Date.now() + Math.random(),
                    code: item.codigo || `MT-${Math.floor(Math.random() * 1000)}`,
                    name: item.material,
                    type: 'Otros',
                    stock: parseFloat(item.peso).toFixed(2),
                    price: item.precio,
                    warehouse: item.bodega || 'Bodega Principal',
                    status: 'En Venta',
                    image: null
                };
                updatedInventory.push(nuevoMaterial);
            }
        });
        localStorage.setItem('inventory_products', JSON.stringify(updatedInventory));
        setInventory(updatedInventory);

        // 3. Guardar Cliente/Proveedor
        const key = tipoFactura === 'venta' ? 'clientes' : 'proveedores';
        let entities = [];
        try {
            entities = JSON.parse(localStorage.getItem(key) || '[]');
        } catch (e) {
            console.error("Error parsing entities:", e);
        }
        const yaExiste = entities.find(e => (e.ruc || e.ci) === cliente.ruc);
        if (!yaExiste) {
            const nuevo = {
                id: Date.now(),
                name: cliente.nombre,
                ruc: cliente.ruc,
                ci: cliente.ruc,
                phone: cliente.telefono,
                email: cliente.email,
                direccion: cliente.direccion
            };
            localStorage.setItem(key, JSON.stringify([nuevo, ...entities]));
        }

        const successMessage = `
            ✅ Documento ${nuevaFactura.id} procesado.
            - Factura guardada en: Historial de Facturamiento.
            - Mercadería asignada a: ${items.map(i => i.bodega || 'Bodega Principal').join(', ')}.
        `;
        alert(successMessage);

        if (onSuccess) onSuccess(nuevaFactura);
        setShowPrintModal(false);
        setItems([{ codigo: '', material: '', peso: '', precio: '', total: 0, bodega: '' }]);
        setCliente({ nombre: '', ruc: '', direccion: '', email: '', telefono: '', residencia: '' });
    };

    return (
        <div className={`crear-factura-container ${isEmbedded ? 'embedded' : ''}`}>
            {!isEmbedded && (
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                    <button onClick={onBack} className="glass" style={{ padding: '8px 15px', border: '1px solid var(--glass-border)', color: '#fff', cursor: 'pointer' }}>← Volver</button>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Generar <span className="gradient-text">Nueva Factura</span></h3>
                </div>
            )}
            {isEmbedded && (
                <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>➕ Nueva Emisión de Factura</h4>
                </div>
            )}

            {!fixedType && (
                <div className="invoice-type-selector glass no-print">
                    <button
                        type="button"
                        onClick={() => setTipoFactura('venta')}
                        className={`${tipoFactura === 'venta' ? 'active venta' : ''}`}
                    >
                        🛒 Venta (Ingreso)
                    </button>
                    <button
                        type="button"
                        onClick={() => setTipoFactura('compra')}
                        className={`${tipoFactura === 'compra' ? 'active compra' : ''}`}
                    >
                        📦 Compra (Gasto/Inventario)
                    </button>
                </div>
            )}

            <form onSubmit={handleGenerate} className="glass invoice-form no-print">
                <div className="invoice-section">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>{tipoFactura === 'venta' ? 'Nombre / Comprador' : 'Proveedor'}</label>
                            <input type="text" name="nombre" value={cliente.nombre} onChange={handleClienteChange} className="glass-input" required />
                        </div>
                        <div className="form-group">
                            <label>RUC / Cédula</label>
                            <input type="text" name="ruc" value={cliente.ruc} onChange={handleClienteChange} className="glass-input" required />
                        </div>
                        <div className="form-group">
                            <label>Dirección</label>
                            <input type="text" name="direccion" value={cliente.direccion} onChange={handleClienteChange} className="glass-input" />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input type="text" name="telefono" value={cliente.telefono} onChange={handleClienteChange} className="glass-input" />
                        </div>
                        <div className="form-group">
                            <label>Nro. Residencia</label>
                            <input type="text" name="residencia" value={cliente.residencia} onChange={handleClienteChange} className="glass-input" />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={cliente.email} onChange={handleClienteChange} className="glass-input" />
                        </div>
                        <div className="form-group">
                            <label>Forma de Pago</label>
                            <select
                                value={invoiceInfo.formaPago}
                                onChange={(e) => setInvoiceInfo({ ...invoiceInfo, formaPago: e.target.value })}
                                className="glass-input"
                            >
                                <option value="Efectivo" style={{ background: '#111' }}>Efectivo</option>
                                <option value="Transferencia" style={{ background: '#111' }}>Transferencia</option>
                                <option value="Cheque" style={{ background: '#111' }}>Cheque</option>
                                <option value="Voucher" style={{ background: '#111' }}>Tarjeta / Voucher</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Observaciones</label>
                            <input
                                type="text"
                                value={invoiceInfo.observaciones}
                                onChange={(e) => setInvoiceInfo({ ...invoiceInfo, observaciones: e.target.value })}
                                className="glass-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Logo del Negocio (Opcional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="glass-input"
                                style={{ paddingTop: '8px' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="invoice-section">
                    <h5 style={{ marginBottom: '15px' }}>Detalle de Materiales</h5>
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th style={{ width: '120px' }}>Código</th>
                                <th style={{ width: '150px' }}>Bodega / BoD</th>
                                <th>Material</th>
                                <th>Peso (kg)</th>
                                <th>Precio Unit.</th>
                                <th>Total</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input type="text" name="codigo" value={item.codigo} onChange={(e) => handleItemChange(index, e)} className="glass-input" placeholder="MT-XXX" />
                                    </td>
                                    <td>
                                        <select
                                            name="bodega"
                                            value={item.bodega}
                                            onChange={(e) => handleItemChange(index, e)}
                                            className="glass-input"
                                            required={tipoFactura === 'compra'}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Bodega Principal">Bodega Principal</option>
                                            <option value="Bodega Norte">Bodega Norte</option>
                                            <option value="Bodega Sur">Bodega Sur</option>
                                            <option value="Almacén Central">Almacén Central</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="material"
                                            value={item.material}
                                            onChange={(e) => handleItemChange(index, e)}
                                            className="glass-input"
                                            placeholder="Ej: Cobre #1"
                                            list="inventory-list"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input type="number" name="peso" value={item.peso} onChange={(e) => handleItemChange(index, e)} className="glass-input" placeholder="0.00" required />
                                    </td>
                                    <td>
                                        <input type="number" name="precio" value={item.precio} onChange={(e) => handleItemChange(index, e)} className="glass-input" placeholder="0.00" step="0.01" required />
                                    </td>
                                    <td>
                                        <span className="total-display">${item.total}</span>
                                    </td>
                                    <td>
                                        <button type="button" onClick={() => removeItem(index)} className="btn-remove">✕</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="button" onClick={addItem} className="btn-add-item">+ Añadir Material</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px', marginTop: '30px' }}>
                    <div className="driver-info-box glass" style={{ padding: '15px', flex: 1, fontSize: '0.85rem', background: 'rgba(0, 242, 254, 0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <input
                                type="checkbox"
                                id="ivaToggle"
                                checked={conIVA}
                                onChange={(e) => setConIVA(e.target.checked)}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="ivaToggle" style={{ fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>
                                Aplicar IVA (15%)
                            </label>
                        </div>
                        <p style={{ color: 'var(--text-dim)' }}>💡 <strong>Pro-Tip:</strong> Verifica que los códigos de material coincidan con el inventario para una trazabilidad perfecta.</p>
                    </div>

                    <div className="invoice-summary" style={{ margin: 0 }}>
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>${calculateSubtotal()}</span>
                        </div>
                        {conIVA && (
                            <div className="summary-row">
                                <span>IVA (15%):</span>
                                <span>${(calculateSubtotal() * 0.15).toFixed(2)}</span>
                            </div>
                        )}
                        {!conIVA && (
                            <div className="summary-row">
                                <span>IVA (0%):</span>
                                <span>$0.00</span>
                            </div>
                        )}
                        <div className="summary-row total" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
                            <span>TOTAL:</span>
                            <span>${(conIVA ? calculateSubtotal() * 1.15 : calculateSubtotal()).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="form-actions" style={{ marginTop: '30px', gap: '15px', display: 'flex' }}>
                    <button type="button" onClick={() => setShowPreview(true)} className="glass-btn" style={{ padding: '15px 30px' }}>
                        👁️ Vista Previa
                    </button>
                    <button type="submit" className="btn-primary" style={{ padding: '15px 40px', flex: isEmbedded ? 1 : 'unset' }}>
                        📄 Procesar Factura e Imprimir
                    </button>
                </div>

                <datalist id="inventory-list">
                    {inventory.map(p => (
                        <option key={p.id} value={p.name}>{p.code} - {p.type}</option>
                    ))}
                </datalist>
            </form>

            <div className="print-only receipt-print" style={{ color: '#000', fontSize: '10px', padding: '15px', fontFamily: 'Arial, sans-serif' }}>
                {/* ... (Print template content - simplified or same as before) */}
                <div className="invoice-container">
                    <div className="header-main" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <h2 style={{ margin: '0' }}>{emisor.nombre}</h2>
                            <p>RUC: {emisor.ruc}</p>
                            <p>{emisor.direccion}</p>
                        </div>
                        <div style={{ border: '1px solid #000', padding: '10px' }}>
                            <p>Nro: {invoiceInfo.nroDocumento}</p>
                        </div>
                    </div>
                </div>
            </div>

            {showPreview && (
                <div className="modal-overlay" style={{ zIndex: 3000 }}>
                    <div className="glass" style={{ width: '95%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '40px', background: '#fff', color: '#000' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <h3 style={{ margin: 0 }}>Vista Previa de Impresión</h3>
                            <button onClick={() => setShowPreview(false)} style={{ background: '#eee', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>Cerrar</button>
                        </div>
                        <div style={{ padding: '20px', border: '1px solid #ddd' }}>
                            {/* ... simplified preview ... */}
                            <h2>{emisor.nombre}</h2>
                            <p>Nro: {invoiceInfo.nroDocumento}</p>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr><th>Detalle</th><th>Peso</th><th>Precio</th><th>Total</th></tr>
                                </thead>
                                <tbody>
                                    {items.map((item, idx) => (
                                        <tr key={idx}><td>{item.material}</td><td>{item.peso}</td><td>{item.precio}</td><td>{item.total}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                                <strong>Total: ${(conIVA ? calculateSubtotal() * 1.15 : calculateSubtotal()).toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPrintModal && (
                <div className="modal-overlay">
                    <div className="glass modal-content">
                        <h3>⚙️ Configuración de Impresión</h3>
                        <div className="printer-options" style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                            <div className={`printer-card ${printerType === 'thermal' ? 'active' : ''}`} onClick={() => setPrinterType('thermal')} style={{ padding: '20px', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                                <strong>Térmica</strong>
                            </div>
                            <div className={`printer-card ${printerType === 'normal' ? 'active' : ''}`} onClick={() => setPrinterType('normal')} style={{ padding: '20px', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                                <strong>Estándar</strong>
                            </div>
                        </div>
                        <div className="modal-actions" style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setShowPrintModal(false)} className="glass-btn">Cancelar</button>
                            <button onClick={confirmPrint} className="btn-primary">Confirmar e Imprimir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrearFactura;
