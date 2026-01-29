"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Layers,
    FileSpreadsheet,
    Package,
    Users,
    Truck,
    ArrowRightLeft,
    Calendar,
    Search,
    Download,
    Filter
} from "lucide-react"
import { getFacturas, getClientes } from "@/components/funciones/funciones"

// Keys for local storage
const COMPRAS_KEY = "facturacion_compras"
const INVENTARIO_KEY = "kipusoftware_inventario"

type ReportType =
    | "ventas"
    | "balance_general"
    | "estado_resultados"
    | "flujo_caja"
    | "libro_ventas"
    | "libro_compras"
    | "inventario"
    | "cuentas_cobrar"
    | "cuentas_pagar"
    | "chequera"

export default function Reportes() {
    const [activeReport, setActiveReport] = useState<ReportType>("balance_general")
    const [dateRange, setDateRange] = useState({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    })

    // Data loading
    const [data, setData] = useState({
        facturas: [] as any[],
        compras: [] as any[],
        productos: [] as any[],
        clientes: [] as any[],
        kardex: [] as any[],
        anticipos: [] as any[]
    })

    useEffect(() => {
        const facturas = getFacturas()
        const clientes = getClientes()
        const rawCompras = localStorage.getItem("facturacion_compras")
        const compras = rawCompras ? JSON.parse(rawCompras) : []
        const rawInv = localStorage.getItem("productos_inventario")
        const productos = rawInv ? JSON.parse(rawInv) : []
        const rawKardex = localStorage.getItem("kardex_inventario")
        const kardex = rawKardex ? JSON.parse(rawKardex) : []
        const rawAnticipos = localStorage.getItem("facturacion_anticipos")
        const anticipos = rawAnticipos ? JSON.parse(rawAnticipos) : []

        setData({ facturas, compras, productos, clientes, kardex, anticipos })
    }, [])

    // Calculations for Reports
    const reportsData = useMemo(() => {
        const { facturas, compras, productos } = data

        // Filter by date
        const fFacturas = facturas.filter(f => f.fecha >= dateRange.from && f.fecha <= dateRange.to)
        const fCompras = compras.filter(c => c.fecha >= dateRange.from && c.fecha <= dateRange.to)

        // Reporte de Ventas
        const totalVentas = fFacturas.reduce((acc, f) => acc + f.total, 0)
        const totalCostoVentas = fFacturas.reduce((acc, f) => {
            // Logic: try to find the cost from inventory or purchases
            // Simplified: assume 70% cost for demo if not found
            return acc + (f.subtotal * 0.7)
        }, 0)

        // Estado de Resultados
        const utilidadBruta = totalVentas - totalCostoVentas
        const gastosOperativos = 0 // Future implementation

        // Flujo de Caja
        const entradas = totalVentas
        const salidas = fCompras.reduce((acc, c) => acc + c.total, 0)

        return {
            ventas: {
                total: totalVentas,
                utilidad: utilidadBruta,
                items: fFacturas
            },
            compras: {
                total: salidas,
                items: fCompras
            },
            flujo: {
                entradas,
                salidas,
                neto: entradas - salidas
            },
            inventario: {
                valorTotal: productos.reduce((acc, p) => acc + (p.cantidad * p.precio), 0),
                itemsCount: productos.length,
                stockBajo: productos.filter(p => p.cantidad < 5).length
            },
            saldos: {
                porCobrar: data.anticipos.reduce((acc, a) => acc + a.saldoPendiente, 0)
            },
            chequera: {
                total: [
                    ...compras.filter(c => c.metodoPago === "cheque").map(c => ({ fecha: c.fecha, monto: c.total, ref: c.documento, tipo: "Compra" })),
                    ...data.anticipos.flatMap(a => a.pagos.filter((p: any) => p.metodoPago === "cheque").map((p: any) => ({ fecha: p.fecha, monto: p.monto, ref: p.referencia || a.id, tipo: "Abono/Anticipo" })))
                ]
            }
        }
    }, [data, dateRange])

    return (
        <main className="ml-[260px] min-h-screen p-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <BarChart3 className="h-10 w-10 text-blue-600" />
                        Reportes Inteligentes
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                        Analiza el rendimiento de tu negocio con datos en tiempo real.
                    </p>
                </header>

                {/* Global Filters */}
                <Card className="mb-8 border-none shadow-md bg-white dark:bg-slate-800">
                    <CardContent className="p-6 flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Rango de Fechas</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="date"
                                        className="w-40 h-10 border-slate-200 dark:border-slate-700"
                                        value={dateRange.from}
                                        onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
                                    />
                                    <span className="text-slate-400">a</span>
                                    <Input
                                        type="date"
                                        className="w-40 h-10 border-slate-200 dark:border-slate-700"
                                        value={dateRange.to}
                                        onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="ml-auto flex gap-3">
                            <Button variant="outline" className="gap-2">
                                <Download className="h-4 w-4" /> Exportar PDF
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                                <Filter className="h-4 w-4" /> Aplicar Filtros
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Menu Reports */}
                    <aside className="lg:col-span-1 space-y-2">
                        <ReportMenuItem
                            id="balance_general"
                            label="Balance de la App"
                            icon={<BarChart3 className="h-5 w-5" />}
                            active={activeReport === "balance_general"}
                            onClick={() => setActiveReport("balance_general")}
                        />
                        <ReportMenuItem
                            id="ventas"
                            label="Reporte de Ventas"
                            icon={<TrendingUp className="h-5 w-5" />}
                            active={activeReport === "ventas"}
                            onClick={() => setActiveReport("ventas")}
                        />
                        <ReportMenuItem
                            id="estado_resultados"
                            label="Estado de Resultados"
                            icon={<Layers className="h-5 w-5" />}
                            active={activeReport === "estado_resultados"}
                            onClick={() => setActiveReport("estado_resultados")}
                        />
                        <ReportMenuItem
                            id="flujo_caja"
                            label="Flujo de Caja"
                            icon={<ArrowRightLeft className="h-5 w-5" />}
                            active={activeReport === "flujo_caja"}
                            onClick={() => setActiveReport("flujo_caja")}
                        />
                        <ReportMenuItem
                            id="libro_ventas"
                            label="Libro de Ventas (SRI)"
                            icon={<FileSpreadsheet className="h-5 w-5" />}
                            active={activeReport === "libro_ventas"}
                            onClick={() => setActiveReport("libro_ventas")}
                        />
                        <ReportMenuItem
                            id="libro_compras"
                            label="Libro de Compras (SRI)"
                            icon={<Truck className="h-5 w-5" />}
                            active={activeReport === "libro_compras"}
                            onClick={() => setActiveReport("libro_compras")}
                        />
                        <ReportMenuItem
                            id="inventario"
                            label="Reporte de Inventario"
                            icon={<Package className="h-5 w-5" />}
                            active={activeReport === "inventario"}
                            onClick={() => setActiveReport("inventario")}
                        />
                        <ReportMenuItem
                            id="cuentas_cobrar"
                            label="Cuentas por Cobrar"
                            icon={<Users className="h-5 w-5" />}
                            active={activeReport === "cuentas_cobrar"}
                            onClick={() => setActiveReport("cuentas_cobrar")}
                        />
                        <ReportMenuItem
                            id="chequera"
                            label="Chequera"
                            icon={<FileSpreadsheet className="h-5 w-5" />}
                            active={activeReport === "chequera"}
                            onClick={() => setActiveReport("chequera")}
                        />
                    </aside>

                    {/* Report Content */}
                    <div className="lg:col-span-3">
                        {activeReport === "balance_general" && <BalanceGeneralView data={reportsData} />}
                        {activeReport === "ventas" && <VentasView data={reportsData.ventas} />}
                        {activeReport === "estado_resultados" && <EstadoResultadosView data={reportsData} />}
                        {activeReport === "flujo_caja" && <FlujoCajaView data={reportsData.flujo} />}
                        {activeReport === "libro_ventas" && <LibroSRIView type="Ventas" items={reportsData.ventas.items} />}
                        {activeReport === "libro_compras" && <LibroSRIView type="Compras" items={reportsData.compras.items} />}
                        {activeReport === "inventario" && <InventarioView items={data.productos} />}
                        {activeReport === "cuentas_cobrar" && <CuentasView type="Por Cobrar" facturas={data.facturas} />}
                        {activeReport === "chequera" && <ChequeraView data={reportsData.chequera} />}
                    </div>
                </div>
            </div>
        </main>
    )
}

function ReportMenuItem({ id, label, icon, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium ${active
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none translate-x-1"
                : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
                }`}
        >
            {icon}
            {label}
        </button>
    )
}

// Sub-components for each report type
function VentasView({ data }: any) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard title="Total Ventas" value={`$${data.total.toFixed(2)}`} color="blue" />
                <MetricCard title="Utilidad Bruta Est." value={`$${data.utilidad.toFixed(2)}`} color="green" />
            </div>
            <Card className="border-none shadow-sm dark:bg-slate-800">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Search className="h-4 w-4 text-blue-500" /> Detalle de Transacciones
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-slate-400 text-left border-b dark:border-slate-700">
                                <th className="pb-3 px-2">Fecha</th>
                                <th className="pb-3 px-2">Cliente</th>
                                <th className="pb-3 px-2">Documento</th>
                                <th className="pb-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-700">
                            {data.items.map((it: any) => (
                                <tr key={it.secuencial}>
                                    <td className="py-3 px-2">{it.fecha}</td>
                                    <td className="py-3 px-2 font-medium">{it.cliente.razonSocial}</td>
                                    <td className="py-3 px-2 text-slate-500 font-mono">{it.secuencial}</td>
                                    <td className="py-3 text-right font-bold text-blue-600">${it.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    )
}

function EstadoResultadosView({ data }: any) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card className="border-none shadow-md overflow-hidden dark:bg-slate-800">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
                <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white">Estado de Pérdidas y Ganancias</h2>

                    <div className="space-y-4">
                        <ProfitLine label="(+) Ingresos por Ventas" value={data.ventas.total} type="plus" />
                        <ProfitLine label="(-) Costo de Ventas (Estimado)" value={data.ventas.total - data.ventas.utilidad} type="minus" />
                        <div className="h-px bg-slate-200 dark:bg-slate-700 my-4" />
                        <ProfitLine label="(=) UTILIDAD BRUTA" value={data.ventas.utilidad} type="total" />
                        <ProfitLine label="(-) Gastos Operativos" value={0} type="minus" />
                        <div className="h-px bg-slate-200 dark:bg-slate-700 my-4 border-double border-b-2" />
                        <ProfitLine label="(=) UTILIDAD NETA" value={data.ventas.utilidad} type="final" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function FlujoCajaView({ data }: any) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard title="Entradas" value={`$${data.entradas.toFixed(2)}`} color="green" icon={<TrendingUp />} />
                <MetricCard title="Salidas" value={`$${data.salidas.toFixed(2)}`} color="red" icon={<TrendingDown />} />
                <MetricCard title="Saldo Neto" value={`$${data.neto.toFixed(2)}`} color={data.neto >= 0 ? "blue" : "red"} icon={<ArrowRightLeft />} />
            </div>
        </div>
    )
}

function LibroSRIView({ type, items }: any) {
    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <Card className="border-none shadow-sm dark:bg-slate-800">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Libro de {type} (Formato SRI)</CardTitle>
                    <Button size="sm" variant="outline" className="gap-2">
                        <Download className="h-3 w-3" /> Excel
                    </Button>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-700">
                                <th className="p-2 text-left">RUC/ID</th>
                                <th className="p-2 text-left">Nombre</th>
                                <th className="p-2 text-left">Documento</th>
                                <th className="p-2 text-right">Base</th>
                                <th className="p-2 text-right">IVA</th>
                                <th className="p-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((it: any) => (
                                <tr key={it.id || it.secuencial} className="border-b dark:border-slate-700">
                                    <td className="p-2">{it.cliente?.identificacion || it.proveedorRuc}</td>
                                    <td className="p-2 truncate max-w-[150px]">{it.cliente?.razonSocial || it.proveedorNombre}</td>
                                    <td className="p-2 font-mono">{it.secuencial || it.documento}</td>
                                    <td className="p-2 text-right">${(it.baseImponible || (it.total / 1.15)).toFixed(2)}</td>
                                    <td className="p-2 text-right">${(it.valorIVA || (it.total - (it.total / 1.15))).toFixed(2)}</td>
                                    <td className="p-2 text-right font-bold">${it.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    )
}

function InventarioView({ items }: any) {
    const stockValuation = items.reduce((acc: number, it: any) => acc + (it.cantidad * it.precio), 0)
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <MetricCard title="Valorización Total del Stock (Costo)" value={`$${stockValuation.toFixed(2)}`} color="blue" />
            <Card className="border-none shadow-sm dark:bg-slate-800">
                <CardHeader><CardTitle className="text-sm">Alertas de Rotación</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {items.filter((it: any) => it.cantidad < 5).map((it: any) => (
                            <div key={it.id} className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg">
                                <span className="text-sm font-medium">{it.nombre}</span>
                                <span className="text-xs text-amber-700 dark:text-amber-400 font-bold">Stock Bajo: {it.cantidad} unidades</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function CuentasView({ type, facturas }: any) {
    // Simplified: accounts with "pending" (future prop)
    // For now, listing all for visibility
    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <Card className="border-none shadow-sm dark:bg-slate-800">
                <CardHeader><CardTitle>{type}</CardTitle></CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-slate-400 text-left border-b dark:border-slate-700">
                                <th className="pb-2">Entidad</th>
                                <th className="pb-2">Vencimiento</th>
                                <th className="pb-2 text-right">Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facturas.slice(0, 5).map((f: any) => (
                                <tr key={f.secuencial} className="border-b dark:border-slate-700">
                                    <td className="py-3">{f.cliente.razonSocial}</td>
                                    <td className="py-3 text-slate-500">30 días</td>
                                    <td className="py-3 text-right font-bold text-red-600">${f.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    )
}

// Utility components
function MetricCard({ title, value, color, icon }: any) {
    const colors: any = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800",
        green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
        red: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border-rose-100 dark:border-rose-800",
        amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800",
        indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800"
    }

    return (
        <Card className="border-none shadow-sm dark:bg-slate-800 overflow-hidden">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                        <p className="text-3xl font-black">{value}</p>
                    </div>
                    {icon && <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>}
                </div>
            </CardContent>
        </Card>
    )
}

// New Views for the requested balance
function BalanceGeneralView({ data }: any) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard title="Inventario Total" value={`$${data.inventario.valorTotal.toFixed(2)}`} color="blue" icon={<Package className="h-4 w-4" />} />
                <MetricCard title="Ventas Totales" value={`$${data.ventas.total.toFixed(2)}`} color="green" icon={<TrendingUp className="h-4 w-4" />} />
                <MetricCard title="Entradas (Dinero)" value={`$${data.flujo.entradas.toFixed(2)}`} color="indigo" icon={<ArrowRightLeft className="h-4 w-4" />} />
                <MetricCard title="Salidas (Compras)" value={`$${data.flujo.salidas.toFixed(2)}`} color="red" icon={<TrendingDown className="h-4 w-4" />} />
                <MetricCard title="Saldos por Cobrar" value={`$${data.saldos.porCobrar.toFixed(2)}`} color="amber" icon={<Users className="h-4 w-4" />} />
                <MetricCard title="Cheques en Cartera" value={data.chequera.total.length} color="indigo" icon={<FileSpreadsheet className="h-4 w-4" />} />
            </div>

            <Card className="border-none shadow-sm dark:bg-slate-800">
                <CardHeader>
                    <CardTitle className="text-lg">Resumen de Operaciones</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">Patrimonio en Mercadería</p>
                                <p className="text-sm text-slate-500">Valorización actual del inventario a precio de costo</p>
                            </div>
                            <span className="text-xl font-black text-blue-600">${data.inventario.valorTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">Flujo Neto</p>
                                <p className="text-sm text-slate-500">Diferencia entre ventas y compras en el periodo</p>
                            </div>
                            <span className={`text-xl font-black ${data.flujo.neto >= 0 ? "text-green-600" : "text-red-600"}`}>
                                ${data.flujo.neto.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function ChequeraView({ data }: any) {
    const totalCheques = data.total.reduce((acc: number, c: any) => acc + c.monto, 0)
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <MetricCard title="Total en Cheques" value={`$${totalCheques.toFixed(2)}`} color="blue" icon={<FileSpreadsheet />} />
            <Card className="border-none shadow-sm dark:bg-slate-800">
                <CardHeader>
                    <CardTitle>Listado de Cheques Registrados</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-slate-400 text-left border-b dark:border-slate-700">
                                <th className="pb-3 px-2">Fecha</th>
                                <th className="pb-3 px-2">Tipo</th>
                                <th className="pb-3 px-2">Referencia</th>
                                <th className="pb-3 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-700">
                            {data.total.map((c: any, i: number) => (
                                <tr key={i}>
                                    <td className="py-3 px-2">{c.fecha}</td>
                                    <td className="py-3 px-2">
                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                            {c.tipo}
                                        </span>
                                    </td>
                                    <td className="py-3 px-2 text-slate-500 font-mono">{c.ref}</td>
                                    <td className="py-3 text-right font-bold text-slate-900 dark:text-white">${c.monto.toFixed(2)}</td>
                                </tr>
                            ))}
                            {data.total.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-slate-500">No se encontraron cheques registrados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    )
}

function ProfitLine({ label, value, type }: any) {
    const styles: any = {
        plus: "text-slate-600 dark:text-slate-300",
        minus: "text-rose-500 font-medium",
        total: "text-slate-900 dark:text-white font-bold text-lg",
        final: "text-blue-600 dark:text-blue-400 font-black text-2xl"
    }
    return (
        <div className="flex justify-between items-center py-1">
            <span className={styles[type === 'final' ? 'total' : type]}>{label}</span>
            <span className={styles[type]}>${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
    )
}
