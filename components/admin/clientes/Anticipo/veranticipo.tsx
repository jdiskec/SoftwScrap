"use client"

import React, { useState, useMemo } from "react"
import {
    Anticipo,
    getAnticipos,
    getClientes,
    registrarPagoAnticipo,
    PagoAnticipo
} from "@/components/funciones/funciones"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Plus,
    Search,
    ChevronDown,
    ChevronUp,
    DollarSign,
    Calendar,
    CheckCircle2,
    Clock,
    Printer
} from "lucide-react"

export function VerAnticipo({ initialBusqueda = "" }: { initialBusqueda?: string }) {
    const [anticipos, setAnticipos] = useState<Anticipo[]>(() => getAnticipos())
    const clientes = useMemo(() => getClientes(), [])
    const [busqueda, setBusqueda] = useState(initialBusqueda)
    const [expandedId, setExpandedId] = useState<string | null>(null)

    // Modal State for New Payment
    const [pagoModal, setPagoModal] = useState<{ open: boolean; anticipoId: string | null }>({
        open: false,
        anticipoId: null
    })

    const [nuevoPago, setNuevoPago] = useState<Omit<PagoAnticipo, "id">>({
        fecha: new Date().toISOString().split("T")[0],
        monto: 0,
        metodoPago: "efectivo",
        referencia: ""
    })

    const actualizarData = () => {
        setAnticipos(getAnticipos())
    }

    const filtered = useMemo(() => {
        const q = busqueda.toLowerCase().trim()
        return anticipos.filter(a => {
            const cliente = clientes.find(c => c.identificacion === a.clienteId)
            return (
                a.clienteId.includes(q) ||
                cliente?.razonSocial.toLowerCase().includes(q) ||
                a.descripcion.toLowerCase().includes(q)
            )
        })
    }, [anticipos, busqueda, clientes])

    const handleRegistrarPago = () => {
        if (!pagoModal.anticipoId) return
        if (nuevoPago.monto <= 0) {
            alert("El monto debe ser mayor a 0")
            return
        }

        const pago: PagoAnticipo = {
            id: crypto.randomUUID(),
            ...nuevoPago
        }

        const success = registrarPagoAnticipo(pagoModal.anticipoId, pago)
        if (success) {
            alert("Pago registrado correctamente")
            actualizarData()
            setPagoModal({ open: false, anticipoId: null })
            setNuevoPago({
                fecha: new Date().toISOString().split("T")[0],
                monto: 0,
                metodoPago: "efectivo",
                referencia: ""
            })
        }
    }

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id)
    }

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-purple-600" />
                            Control de Anticipos y Pagos
                        </CardTitle>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Buscar por cliente o detalle..."
                                className="pl-10 h-10"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                    <th className="px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Secuencial</th>
                                    <th className="px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Cliente</th>
                                    <th className="px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Descripción</th>
                                    <th className="px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-right">Monto Total</th>
                                    <th className="px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-right">Saldo</th>
                                    <th className="px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-center">Estado</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-slate-700">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-slate-500 italic">
                                            <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            No se encontraron anticipos registrados.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((a) => {
                                        const cliente = clientes.find(c => c.identificacion === a.clienteId)
                                        const isExpanded = expandedId === a.id

                                        return (
                                            <React.Fragment key={a.id}>
                                                <tr
                                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                                                    onClick={() => toggleExpand(a.id)}
                                                >
                                                    <td className="px-4 py-4 font-mono font-bold text-purple-600">
                                                        {a.secuencial || "N/A"}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="font-bold text-slate-900 dark:text-white">
                                                            {cliente?.razonSocial || "Desconocido"}
                                                        </div>
                                                        <div className="text-xs text-slate-500">{a.clienteId}</div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                                                        {a.descripcion}
                                                    </td>
                                                    <td className="px-4 py-4 text-right font-numeric font-bold">
                                                        ${a.montoTotal.toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <span className={`font-black font-numeric ${a.saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                            ${a.saldoPendiente.toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${a.estado === 'pagado' ? 'bg-green-100 text-green-700' :
                                                            a.estado === 'parcial' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {a.estado}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr>
                                                        <td colSpan={7} className="px-6 py-6 bg-slate-50/50 dark:bg-slate-900/30">
                                                            <div className="animate-in slide-in-from-top-2 duration-300">
                                                                <div className="flex justify-between items-center mb-4">
                                                                    <h5 className="font-bold text-xs text-slate-500 uppercase tracking-[0.2em]">Historial de Pagos y Abonos</h5>
                                                                    {a.estado !== 'pagado' && (
                                                                        <Button
                                                                            size="sm"
                                                                            className="bg-purple-600 hover:bg-purple-700 gap-2 h-8 px-4 text-xs font-bold"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                setPagoModal({ open: true, anticipoId: a.id })
                                                                            }}
                                                                        >
                                                                            <Plus className="w-3 h-3" /> Nuevo Abono
                                                                        </Button>
                                                                    )}
                                                                </div>

                                                                <div className="rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
                                                                    <table className="w-full text-sm">
                                                                        <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-700">
                                                                            <tr>
                                                                                <th className="px-4 py-3 text-left font-bold text-slate-400 text-[10px] uppercase">Fecha</th>
                                                                                <th className="px-4 py-3 text-left font-bold text-slate-400 text-[10px] uppercase">Método</th>
                                                                                <th className="px-4 py-3 text-left font-bold text-slate-400 text-[10px] uppercase">Referencia</th>
                                                                                <th className="px-4 py-3 text-right font-bold text-slate-400 text-[10px] uppercase">Monto</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y dark:divide-slate-700">
                                                                            {a.pagos.length === 0 ? (
                                                                                <tr>
                                                                                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">
                                                                                        No se han registrado abonos aún.
                                                                                    </td>
                                                                                </tr>
                                                                            ) : (
                                                                                a.pagos.map((p) => (
                                                                                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                                                                                        <td className="px-4 py-3 font-numeric">{p.fecha}</td>
                                                                                        <td className="px-4 py-3 capitalize">{p.metodoPago}</td>
                                                                                        <td className="px-4 py-3 text-slate-500">{p.referencia || "-"}</td>
                                                                                        <td className="px-4 py-3 text-right font-black text-green-600 font-numeric tracking-tight">+${p.monto.toFixed(2)}</td>
                                                                                    </tr>
                                                                                ))
                                                                            )}
                                                                        </tbody>
                                                                        {a.pagos.length > 0 && (
                                                                            <tfoot className="bg-slate-50/50 dark:bg-slate-900/50 border-t dark:border-slate-700">
                                                                                <tr>
                                                                                    <td colSpan={3} className="px-4 py-3 text-right font-black text-slate-500 text-[10px] uppercase">Total Recaudado:</td>
                                                                                    <td className="px-4 py-3 text-right font-black text-green-600 font-numeric text-base">
                                                                                        ${a.pagos.reduce((total, p) => total + p.monto, 0).toFixed(2)}
                                                                                    </td>
                                                                                </tr>
                                                                            </tfoot>
                                                                        )}
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Modal para Registrar Pago */}
            {pagoModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="border-b dark:border-slate-700">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Plus className="w-5 h-5 text-purple-600" />
                                Registrar Nuevo Pago
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Fecha del Pago</label>
                                <Input
                                    type="date"
                                    value={nuevoPago.fecha}
                                    onChange={(e) => setNuevoPago({ ...nuevoPago, fecha: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Monto del Pago ($)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="pl-10 font-numeric text-lg font-bold"
                                        value={nuevoPago.monto || ""}
                                        onChange={(e) => setNuevoPago({ ...nuevoPago, monto: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Método de Pago</label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={nuevoPago.metodoPago}
                                    onChange={(e) => setNuevoPago({ ...nuevoPago, metodoPago: e.target.value as any })}
                                >
                                    <option value="efectivo">Efectivo</option>
                                    <option value="transferencia">Transferencia</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Referencia (Opcional)</label>
                                <Input
                                    placeholder="Nro. Comprobante, etc."
                                    value={nuevoPago.referencia}
                                    onChange={(e) => setNuevoPago({ ...nuevoPago, referencia: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setPagoModal({ open: false, anticipoId: null })}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                                    onClick={handleRegistrarPago}
                                >
                                    Confirmar Pago
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
