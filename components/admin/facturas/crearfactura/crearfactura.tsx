/**
 * @file crearfactura.tsx
 * @description Componente de interfaz de usuario para la creación y gestión de facturas electrónicas.
 * Permite ingresar datos del cliente, agregar productos del inventario y realizar cálculos automáticos de impuestos.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save, X, Search, Package, Image as ImageIcon } from "lucide-react";
import { useCrearFactura } from "@/components/funciones/funciones";
import { CopyFac, type FacturaData } from "@/components/admin/copyfac/copyfact";
import { useInventario } from "../../inventario/funcioninventario";
import { usePermisos } from "../../permisos/permisos";
import { usePanelPermisos } from "../../paneldepermisos/paneldepermisos";
import { ShieldAlert, Check } from "lucide-react";

/**
 * Componente principal CrearFactura
 * 
 * Este componente orquestará la creación de una nueva factura utilizando hooks personalizados
 * para la lógica de negocio y la gestión de inventario.
 */
export function CrearFactura() {
    // Hook personalizado para manejar la lógica de la factura (clientes, detalles, cálculos)
    const {
        fecha, setFecha,
        secuencial, setSecuencial,
        cliente, setCliente,
        errores,
        detalles,
        subtotal,
        totalDescuento,
        baseImponible,
        valorIVA,
        ivaRate,
        setIvaRate,
        total,
        handleClienteChange,
        addDetalle,
        addDetalleConProducto,
        removeDetalle,
        updateDetalle,
        guardarFactura
    } = useCrearFactura();

    // Gestión de Permisos
    const { usuarioActual, tienePermiso, esAdmin } = usePermisos();
    const { solicitarPermiso } = usePanelPermisos();
    const [solicitandoIva, setSolicitandoIva] = useState(false);
    const [motivoIva, setMotivoIva] = useState("");
    const [ivaTemporal, setIvaTemporal] = useState(0.15);

    // Hook para interactuar con los productos registrados en el inventario
    const { obtenerProductoPorCodigo, buscarProductos } = useInventario();

    // Estados locales para la funcionalidad de búsqueda de productos
    const [buscarProductoOpen, setBuscarProductoOpen] = useState(false);
    const [terminoBusquedaDetalle, setTerminoBusquedaDetalle] = useState("");

    // Lista filtrada de productos basada en el término de búsqueda
    const productosInventario = buscarProductos(terminoBusquedaDetalle);

    /**
     * Busca un producto por su código y actualiza automáticamente la descripción y el precio en la fila del detalle.
     * @param id - Identificador único de la fila del detalle
     * @param codigo - Código del producto a buscar
     */
    const buscarYActualizarPorCodigo = (id: string, codigo: string) => {
        const producto = obtenerProductoPorCodigo(codigo);
        if (producto) {
            updateDetalle(id, "descripcion", producto.nombre);
            updateDetalle(id, "precioUnitario", producto.precio);
        }
    };

    // Estados para el manejo de la impresión
    const [printOpen, setPrintOpen] = useState(false);
    const [facturaPrint, setFacturaPrint] = useState<FacturaData | null>(null);

    /**
     * Maneja el guardado de la factura y ofrece la opción de imprimirla inmediatamente.
     */
    /**
     * Maneja el cambio de IVA, solicitando permiso si el usuario no es admin.
     */
    const handleIvaChange = (nuevaTasa: number) => {
        if (nuevaTasa === ivaRate) return;

        if (tienePermiso("cambiar_iva")) {
            setIvaRate(nuevaTasa);
        } else {
            setIvaTemporal(nuevaTasa);
            setSolicitandoIva(true);
        }
    };

    /**
     * Envía la solicitud de cambio de IVA al administrador.
     */
    const enviarSolicitudIva = () => {
        if (!usuarioActual) return;
        solicitarPermiso(
            { id: usuarioActual.id, nombre: usuarioActual.nombre },
            "Cambio de IVA",
            `El empleado solicita cambiar el IVA al ${(ivaTemporal * 100).toFixed(0)}% por el motivo: ${motivoIva}`
        );
        setSolicitandoIva(false);
        setMotivoIva("");
    };

    const handleGuardar = () => {
        guardarFactura();
        const confirmar = window.confirm("¿Desea imprimir la factura?");
        if (confirmar) {
            // Estructura de datos final para el módulo de impresión
            const factura: FacturaData = {
                secuencial,
                fecha,
                cliente,
                detalles: detalles.map(d => ({
                    ...d,
                    cantidad: Number(d.cantidad) || 0,
                    precioUnitario: Number(d.precioUnitario) || 0,
                    descuento: Number(d.descuento) || 0
                })),
                subtotal,
                totalDescuento,
                baseImponible,
                valorIVA,
                ivaRate,
                total,
            };
            setFacturaPrint(factura);
            setPrintOpen(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-6 shadow-sm">
                {/* Cabecera de la Factura: Título y Fecha */}
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Nueva Factura</h2>
                    <div className="flex gap-4 items-center">
                        <div className="text-right">
                            <label className="block text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Fecha de Emisión</label>
                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className="mt-1 block w-40 text-right bg-transparent border-none text-slate-900 dark:text-slate-100 font-semibold focus:ring-0"
                            />
                        </div>
                    </div>
                </div>

                {/* Sección 1: Datos de Emisión (Secuencial) y Datos del Cliente */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    {/* Input para el Número Secuencial (formato: 001-001-000000001) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">No. Factura (Secuencial)</label>
                        <input
                            value={secuencial}
                            onChange={(e) => setSecuencial(e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-numeric"
                            placeholder="001-001-000000001"
                        />
                    </div>

                    {/* Selección de Tipo de Identificación (Cédula/RUC) e Identificación */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Identificación (RUC/CI)</label>
                        <div className="flex gap-2">
                            <select
                                className="h-10 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm"
                                value={cliente.tipoIdentificacion}
                                onChange={(e) => setCliente({ ...cliente, tipoIdentificacion: e.target.value })}
                            >
                                <option value="cedula">Cédula</option>
                                <option value="ruc">RUC</option>
                            </select>
                            <input
                                value={cliente.identificacion}
                                onChange={(e) => handleClienteChange("identificacion", e.target.value)}
                                className={`flex-1 h-10 px-3 rounded-md border ${errores.identificacion ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100`}
                                placeholder="Número de identificación"
                                maxLength={13}
                            />
                        </div>
                        {errores.identificacion && <p className="text-xs text-red-500">{errores.identificacion}</p>}
                    </div>

                    {/* Razón Social o Nombre del Cliente */}
                    <div className="space-y-2 md:col-span-2 lg:col-span-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Razón Social</label>
                        <input
                            value={cliente.razonSocial}
                            onChange={(e) => handleClienteChange("razonSocial", e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                            placeholder="Nombre o Razón Social"
                            maxLength={300}
                        />
                    </div>

                    {/* Dirección del Cliente */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Dirección</label>
                        <input
                            value={cliente.direccion}
                            onChange={(e) => handleClienteChange("direccion", e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                            placeholder="Dirección del cliente"
                            maxLength={300}
                        />
                    </div>

                    {/* Teléfono de contacto */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Teléfono</label>
                        <input
                            value={cliente.telefono}
                            onChange={(e) => handleClienteChange("telefono", e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                            placeholder="0999999999"
                            maxLength={15}
                        />
                    </div>

                    {/* Correo Electrónico del Cliente */}
                    <div className="space-y-2 lg:col-span-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                        <input
                            type="email"
                            value={cliente.email}
                            onChange={(e) => handleClienteChange("email", e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                            placeholder="cliente@ejemplo.com"
                            maxLength={100}
                        />
                    </div>
                </div>

                {/* Sección 2: Tabla de Detalles de Factura */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Detalle de Productos/Servicios</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 dark:text-white uppercase bg-slate-50 dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg w-32">Búsqueda Rápida (Código)</th>
                                    <th className="px-4 py-3">Cant.</th>
                                    <th className="px-4 py-3">Descripción / Item</th>
                                    <th className="px-4 py-3 text-right">Precio Unit.</th>
                                    <th className="px-4 py-3 text-right">Desc. ($)</th>
                                    <th className="px-4 py-3 text-right">Total Fila</th>
                                    <th className="px-4 py-3 rounded-tr-lg w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {detalles.map((detalle) => (
                                    <tr key={detalle.id} className="bg-white dark:bg-slate-800">
                                        {/* Input de Búsqueda por Código en tiempo real */}
                                        <td className="px-2 py-2">
                                            <div className="flex gap-1">
                                                <input
                                                    type="text"
                                                    placeholder="Escriba código..."
                                                    className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-xs"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            buscarYActualizarPorCodigo(detalle.id, (e.target as HTMLInputElement).value);
                                                        }
                                                    }}
                                                    onBlur={(e) => buscarYActualizarPorCodigo(detalle.id, e.target.value)}
                                                />
                                            </div>
                                        </td>
                                        {/* Cantidad del ítem */}
                                        <td className="px-2 py-2">
                                            <input
                                                type="number"
                                                min="1"
                                                value={detalle.cantidad}
                                                onChange={(e) => updateDetalle(detalle.id, "cantidad", e.target.value)}
                                                className="w-16 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center font-numeric"
                                            />
                                        </td>
                                        {/* Descripción del producto o servicio */}
                                        <td className="px-2 py-2">
                                            <input
                                                value={detalle.descripcion}
                                                onChange={(e) => updateDetalle(detalle.id, "descripcion", e.target.value)}
                                                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                                                placeholder="Descripción del item"
                                            />
                                        </td>
                                        {/* Precio Unitario */}
                                        <td className="px-2 py-2">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={detalle.precioUnitario}
                                                onChange={(e) => updateDetalle(detalle.id, "precioUnitario", e.target.value)}
                                                className="w-24 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-right ml-auto block font-numeric"
                                            />
                                        </td>
                                        {/* Descuento monetario por fila */}
                                        <td className="px-2 py-2">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={detalle.descuento}
                                                onChange={(e) => updateDetalle(detalle.id, "descuento", e.target.value)}
                                                className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-right ml-auto block font-numeric"
                                            />
                                        </td>
                                        {/* Cálculo del Total de la fila (Cantidad * Precio - Descuento) */}
                                        <td className="px-4 py-2 text-right font-medium text-slate-900 dark:text-slate-100 font-numeric">
                                            ${((Number(detalle.cantidad || 0) * Number(detalle.precioUnitario || 0)) - Number(detalle.descuento || 0)).toFixed(2)}
                                        </td>
                                        {/* Botón para eliminar la fila */}
                                        <td className="px-2 py-2 text-center">
                                            <button
                                                onClick={() => removeDetalle(detalle.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Botones para agregar ítems */}
                    <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" onClick={addDetalle} className="gap-2">
                            <Plus className="w-4 h-4" /> Agregar Item Vacío
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => setBuscarProductoOpen(true)} className="gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200">
                            <Search className="w-4 h-4" /> Buscar en Catálogo (Inventario)
                        </Button>
                    </div>
                </div>

                {/* Sección 3: Resumen de Totales */}
                <div className="flex flex-col md:flex-row justify-end gap-8 border-t border-slate-100 dark:border-slate-700 pt-6 font-numeric">
                    <div className="w-full md:w-80 space-y-3">
                        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                            <span>Total Descuentos</span>
                            <span>-${totalDescuento.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                            <span>Base Imponible (Sin IVA)</span>
                            <span>${baseImponible.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
                            <span className="flex items-center gap-2">
                                IVA ({(ivaRate * 100).toFixed(0)}%)
                                <select
                                    className="ml-2 bg-transparent border border-slate-200 dark:border-slate-700 rounded text-[10px] px-1 focus:ring-1 focus:ring-blue-500"
                                    value={ivaRate}
                                    onChange={(e) => handleIvaChange(Number(e.target.value))}
                                >
                                    <option value={0.15}>15% (General)</option>
                                    <option value={0.08}>8% (Turismo)</option>
                                    <option value={0}>0% (Exento)</option>
                                </select>
                            </span>
                            <span>${valorIVA.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-slate-100 pt-3 border-t border-slate-100 dark:border-slate-700">
                            <span>TOTAL FINAL A PAGAR</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Sección Final: Botones de Acción Global */}
                <div className="mt-8 flex gap-3 justify-end">
                    <Button variant="outline" className="gap-2">
                        <X className="w-4 h-4" /> Cancelar / Limpiar
                    </Button>
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleGuardar}>
                        <Save className="w-4 h-4" /> Guardar y Procesar Factura
                    </Button>
                </div>
            </div>

            {/* Componente Modal para la gestión de impresión */}
            <CopyFac open={printOpen} onClose={() => setPrintOpen(false)} factura={facturaPrint} />

            {/* Modal flotante de Búsqueda de Productos en Inventario */}
            {buscarProductoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 border-none">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                                <Search className="w-6 h-6 text-blue-600" />
                                Catálogo de Productos Registrados
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => setBuscarProductoOpen(false)} className="rounded-full">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="p-6">
                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    autoFocus
                                    placeholder="Escribe nombre o código del producto..."
                                    className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    value={terminoBusquedaDetalle}
                                    onChange={(e) => setTerminoBusquedaDetalle(e.target.value)}
                                />
                            </div>

                            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                {productosInventario.length === 0 ? (
                                    <div className="text-center py-16">
                                        <Package className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                                        <p className="text-slate-500 dark:text-slate-400 text-lg">No se encontraron productos en el inventario.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                                        {productosInventario.map(prod => (
                                            <div
                                                key={prod.id}
                                                className="flex flex-col p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer transition-all group"
                                                onClick={() => {
                                                    addDetalleConProducto(prod.nombre, prod.precio, prod.codigo);
                                                    setBuscarProductoOpen(false);
                                                    setTerminoBusquedaDetalle("");
                                                }}
                                            >
                                                <div className="flex gap-3 mb-3">
                                                    {prod.foto ? (
                                                        <img
                                                            src={prod.foto}
                                                            alt={prod.nombre}
                                                            className="w-16 h-16 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                            <ImageIcon className="w-8 h-8" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{prod.nombre}</p>
                                                        <p className="text-xs text-blue-600 font-mono">{prod.codigo}</p>
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{prod.descripcion || 'Sin descripción'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                                                    <span className="text-xs font-semibold px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                                                        Stock: {prod.cantidad}
                                                    </span>
                                                    <p className="font-black text-slate-900 dark:text-white">${prod.precio.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal de Solicitud de Permiso para IVA */}
            {solicitandoIva && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-amber-50 dark:bg-amber-950/20 flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-full text-amber-600">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Permiso Requerido</h3>
                                <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Cambio de tasa de IVA al {(ivaTemporal * 100).toFixed(0)}%</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                No tiene permisos de administrador para modificar impuestos. Describa el motivo para enviar una solicitud de validación.
                            </p>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-400">Motivo de la excepción:</label>
                                <textarea
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                                    placeholder="Ej: Cliente con carnet de discapacidad, producto exento Art. 55..."
                                    value={motivoIva}
                                    onChange={(e) => setMotivoIva(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setSolicitandoIva(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                                    onClick={enviarSolicitudIva}
                                    disabled={!motivoIva.trim()}
                                >
                                    <Check className="w-4 h-4" /> Enviar Solicitud
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
