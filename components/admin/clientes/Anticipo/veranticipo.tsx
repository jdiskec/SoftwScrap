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

export function VerAnticipo() {
    const [anticipos, setAnticipos] = useState<Anticipo[]>(() => getAnticipos())
    const clientes = useMemo(() => getClientes(), [])
    const [busqueda, setBusqueda] = useState("")
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
                    <div className="grid gap-4">
                        {filtered.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No se encontraron anticipos registrados.</p>
                            </div>
                        ) : (
                            filtered.map((a) => {
                                const cliente = clientes.find(c => c.identificacion === a.clienteId)
                                const isExpanded = expandedId === a.id

                                return (
                                    <Card key={a.id} className="overflow-hidden border border-slate-100 dark:border-slate-700 hover:border-purple-200 transition-colors">
                                        <div
                                            className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/30 dark:bg-slate-800/50"
                                            onClick={() => toggleExpand(a.id)}
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className={`p-2 rounded-lg ${a.estado === 'pagado' ? 'bg-green-100 text-green-600' :
                                                        a.estado === 'parcial' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                                                    }`}>
                                                    {a.estado === 'pagado' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-900 dark:text-white">
                                                        {cliente?.razonSocial || "Cliente no encontrado"}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 uppercase tracking-wider">{a.descripcion}</p>
                                                </div>
                                                <div className="hidden md:block text-right px-6">
                                                    <p className="text-xs text-slate-400">Total Anticipo</p>
                                                    <p className="font-bold text-slate-900 dark:text-white font-numeric">
                                                        ${a.montoTotal.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="text-right px-6 border-l dark:border-slate-700">
                                                    <p className="text-xs text-slate-400">Saldo Pendiente</p>
                                                    <p className={`font-black text-lg font-numeric ${a.saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'
                                                        }`}>
                                                        ${a.saldoPendiente.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700 animate-in slide-in-from-top-2 duration-300">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-widest">Historial de Pagos</h5>
                                                    {a.estado !== 'pagado' && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-purple-600 hover:bg-purple-700 gap-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setPagoModal({ open: true, anticipoId: a.id })
                                                            }}
                                                        >
                                                            <Plus className="w-4 h-4" /> Registrar Pago
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="rounded-lg border dark:border-slate-700 overflow-hidden">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-slate-50 dark:bg-slate-900">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left font-medium text-slate-500">Fecha</th>
                                                                <th className="px-4 py-2 text-left font-medium text-slate-500">Método</th>
                                                                <th className="px-4 py-2 text-left font-medium text-slate-500">Referencia</th>
                                                                <th className="px-4 py-2 text-right font-medium text-slate-500">Monto</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y dark:divide-slate-700">
                                                            {a.pagos.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400 italic">
                                                                        No se han registrado pagos para este anticipo.
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                a.pagos.map((p) => (
                                                                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                                                                        <td className="px-4 py-2 font-numeric">{p.fecha}</td>
                                                                        <td className="px-4 py-2 capitalize">{p.metodoPago}</td>
                                                                        <td className="px-4 py-2 text-slate-500">{p.referencia || "-"}</td>
                                                                        <td className="px-4 py-2 text-right font-bold text-green-600 font-numeric">+${p.monto.toFixed(2)}</td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                        {a.pagos.length > 0 && (
                                                            <tfoot className="bg-slate-50/50 dark:bg-slate-900/50 border-t dark:border-slate-700">
                                                                <tr>
                                                                    <td colSpan={3} className="px-4 py-2 text-right font-medium text-slate-500 italic">Total Pagado:</td>
                                                                    <td className="px-4 py-2 text-right font-black text-green-600 font-numeric">
                                                                        ${a.pagos.reduce((total, p) => total + p.monto, 0).toFixed(2)}
                                                                    </td>
                                                                </tr>
                                                            </tfoot>
                                                        )}
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                )
                            })
                        )}
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
