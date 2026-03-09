import React, { useState, useEffect } from 'react';
import './crearfactura.css';
import FunctionLupa from './functionlupa';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// Icon mapping to match project style
const byPrefixAndName = {
    fasds: {
        'magnifying-glass': faMagnifyingGlass
    }
};

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
    const [items, setItems] = useState([{ codigo: '', material: '', peso: '', precio: '', total: 0, bodega: '', iva: 15 }]);

    // Otros datos de factura
    const [invoiceInfo, setInvoiceInfo] = useState({
        observaciones: '',
        formaPago: 'Efectivo',
        vendedor: 'Admin Central',
        nroDocumento: `001-001-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
        tipoDocumento: 'Factura',
        caja: 'Caja Principal',
        comisionPorcentaje: 0,
        descuentoPorcentaje: 0,
        descuentoValor: 0
    });

    // Estados para control de impresión/modales
    const [showPrintModal, setShowPrintModal] = useState(false);
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

    const handleSelectCliente = (selected) => {
        setCliente({
            nombre: selected.name || '',
            ruc: selected.ci || selected.ruc || '',
            direccion: selected.direccion || '',
            email: selected.email || '',
            telefono: selected.phone || selected.telefono || '',
            residencia: selected.residencia || ''
        });
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
        setItems([...items, { codigo: '', material: '', peso: '', precio: '', total: 0, bodega: '', iva: 15 }]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const calculateTotals = () => {
        let subtotal15 = 0;
        let subtotal0 = 0;

        items.forEach(item => {
            const val = parseFloat(item.total || 0);
            if (parseInt(item.iva) === 15) {
                subtotal15 += val;
            } else {
                subtotal0 += val;
            }
        });

        const bruto = subtotal15 + subtotal0;
        const comision = bruto * (parseFloat(invoiceInfo.comisionPorcentaje || 0) / 100);

        // Lógica de Descuento
        const descPct = parseFloat(invoiceInfo.descuentoPorcentaje || 0);
        const descFixed = parseFloat(invoiceInfo.descuentoValor || 0);
        const totalDesc = (bruto * (descPct / 100)) + descFixed;

        // Distribución proporcional del descuento para reportar sub-totales con descuento
        const ratio15 = bruto > 0 ? (subtotal15 / bruto) : 1;
        const ratio0 = bruto > 0 ? (subtotal0 / bruto) : 0;

        const desc15 = totalDesc * ratio15;
        const desc0 = totalDesc * ratio0;

        const subConDesc15 = Math.max(0, subtotal15 - desc15);
        const subConDesc0 = Math.max(0, subtotal0 - desc0);

        const iva15Val = subConDesc15 * 0.15;
        const finalTotal = subConDesc15 + subConDesc0 + iva15Val + comision;

        return {
            sub15: subtotal15.toFixed(2),
            sub0: subtotal0.toFixed(2),
            comisionVal: comision.toFixed(2),
            totalDesc: totalDesc.toFixed(2),
            subConDesc15: subConDesc15.toFixed(2),
            subConDesc0: subConDesc0.toFixed(2),
            iva15: iva15Val.toFixed(2),
            total: finalTotal.toFixed(2)
        };
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
        const totals = calculateTotals();
        const totalFinal = totals.total;

        const nuevaFactura = {
            id: invoiceInfo.nroDocumento,
            tipo: tipoFactura,
            tipoDocumento: invoiceInfo.tipoDocumento,
            caja: invoiceInfo.caja,
            cliente: cliente.nombre,
            fecha: new Date().toISOString().split('T')[0],
            hora: new Date().toLocaleTimeString(),
            total: totalFinal,
            estado: 'Pagada',
            formaPago: invoiceInfo.formaPago,
            items: items,
            comision: totals.comisionVal,
            descuento: totals.totalDesc
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
        setItems([{ codigo: '', material: '', peso: '', precio: '', total: 0, bodega: '', iva: 15 }]);
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                    <FunctionLupa
                        tipo={tipoFactura}
                        onSelect={handleSelectCliente}
                        icon={
                            <>
                                <FontAwesomeIcon icon={byPrefixAndName.fasds['magnifying-glass']} />
                                <span style={{ marginLeft: '8px', fontSize: '0.9rem' }}>Buscar {tipoFactura === 'venta' ? 'Cliente' : 'Proveedor'}</span>
                            </>
                        }
                    />
                </div>
                <div className="invoice-section">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>{tipoFactura === 'venta' ? 'Nombre / Comprador' : 'Proveedor'}</label>
                            <input
                                type="text"
                                name="nombre"
                                value={cliente.nombre}
                                onChange={handleClienteChange}
                                className="glass-input"
                                required
                            />
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
                            <label>Tipo Documento</label>
                            <select
                                value={invoiceInfo.tipoDocumento}
                                onChange={(e) => setInvoiceInfo({ ...invoiceInfo, tipoDocumento: e.target.value })}
                                className="glass-input"
                            >
                                <option value="Factura" style={{ background: '#111' }}>Factura</option>
                                <option value="Nota de Venta" style={{ background: '#111' }}>Nota de Venta</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Caja</label>
                            <select
                                value={invoiceInfo.caja}
                                onChange={(e) => setInvoiceInfo({ ...invoiceInfo, caja: e.target.value })}
                                className="glass-input"
                            >
                                <option value="Caja Principal" style={{ background: '#111' }}>Caja Principal</option>
                                <option value="Caja 2" style={{ background: '#111' }}>Caja 2</option>
                                <option value="Caja Chica" style={{ background: '#111' }}>Caja Chica</option>
                            </select>
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
                                <th style={{ width: '80px' }}>IVA</th>
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
                                        <select
                                            name="iva"
                                            value={item.iva}
                                            onChange={(e) => handleItemChange(index, e)}
                                            className="glass-input"
                                            style={{ padding: '5px' }}
                                        >
                                            <option value="15" style={{ background: '#111' }}>15%</option>
                                            <option value="0" style={{ background: '#111' }}>0%</option>
                                        </select>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '30px' }}>
                    {/* Configuraciones de Costos y Descuentos */}
                    <div className="cost-settings glass" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="form-group">
                            <label>Comisión (%)</label>
                            <input
                                type="number"
                                value={invoiceInfo.comisionPorcentaje}
                                onChange={(e) => setInvoiceInfo({ ...invoiceInfo, comisionPorcentaje: e.target.value })}
                                className="glass-input"
                                placeholder="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Descuento (%)</label>
                            <input
                                type="number"
                                value={invoiceInfo.descuentoPorcentaje}
                                onChange={(e) => setInvoiceInfo({ ...invoiceInfo, descuentoPorcentaje: e.target.value })}
                                className="glass-input"
                                placeholder="0"
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Descuento (valor fijo $)</label>
                            <input
                                type="number"
                                value={invoiceInfo.descuentoValor}
                                onChange={(e) => setInvoiceInfo({ ...invoiceInfo, descuentoValor: e.target.value })}
                                className="glass-input"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Resumen Final Detallado */}
                    <div className="invoice-summary" style={{ margin: 0 }}>
                        <div className="summary-row">
                            <span>Subtotal IVA 15%:</span>
                            <span>${calculateTotals().sub15}</span>
                        </div>
                        <div className="summary-row">
                            <span>Subtotal IVA 0%:</span>
                            <span>${calculateTotals().sub0}</span>
                        </div>
                        <div className="summary-row" style={{ color: 'var(--primary)' }}>
                            <span>Comisión:</span>
                            <span>+${calculateTotals().comisionVal}</span>
                        </div>
                        <div className="summary-row" style={{ color: '#f87171' }}>
                            <span>Descuento Total:</span>
                            <span>-${calculateTotals().totalDesc}</span>
                        </div>
                        <div className="summary-row" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                            <span>Subt. con desc. IVA 15%:</span>
                            <span>${calculateTotals().subConDesc15}</span>
                        </div>
                        <div className="summary-row" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                            <span>Subt. con desc. IVA 0%:</span>
                            <span>${calculateTotals().subConDesc0}</span>
                        </div>
                        <div className="summary-row">
                            <span>IVA (15%):</span>
                            <span>${calculateTotals().iva15}</span>
                        </div>
                        <div className="summary-row total" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
                            <span>TOTAL:</span>
                            <span>${calculateTotals().total}</span>
                        </div>
                    </div>
                </div>

                <div className="form-actions" style={{ marginTop: '30px', gap: '15px', display: 'flex' }}>
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
