"use client"

import React, { useState, useMemo } from "react"
import {
    Anticipo,
    Cliente,
    getClientes,
    saveAnticipo
} from "@/components/funciones/funciones"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "../../../ui/textarea"
import {
    Plus,
    User,
    DollarSign,
    Calendar,
    FileText,
    Search,
    CheckCircle,
    X
} from "lucide-react"

export function RegistrarAnticipo({ onSuccess }: { onSuccess: () => void }) {
    const [busqueda, setBusqueda] = useState("")
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
    const clientes = useMemo(() => getClientes(), [])

    const [form, setForm] = useState({
        fecha: new Date().toISOString().split("T")[0],
        descripcion: "",
        montoTotal: 0
    })

    const clientesFiltrados = useMemo(() => {
        const q = busqueda.toLowerCase().trim()
        if (!q) return []
        return clientes.filter(c =>
            c.identificacion.includes(q) ||
            c.razonSocial.toLowerCase().includes(q)
        ).slice(0, 5) // Limit results
    }, [busqueda, clientes])

    const handleSave = () => {
        if (!clienteSeleccionado) {
            alert("Por favor seleccione un cliente")
            return
        }
        if (!form.descripcion || form.montoTotal <= 0) {
            alert("Complete todos los campos correctamente")
            return
        }

        const nuevoAnticipo: Anticipo = {
            id: crypto.randomUUID(),
            clienteId: clienteSeleccionado.identificacion,
            fecha: form.fecha,
            descripcion: form.descripcion,
            montoTotal: form.montoTotal,
            saldoPendiente: form.montoTotal,
            pagos: [],
            estado: "pendiente"
        }

        saveAnticipo(nuevoAnticipo)
        alert("Anticipo registrado con éxito")
        onSuccess()
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card className="border-none shadow-2xl bg-white dark:bg-slate-800 overflow-hidden">
                <div className="h-2 bg-purple-600" />
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Plus className="w-6 h-6 text-purple-600" />
                        Nuevo Registro de Anticipo
                    </CardTitle>
                    <p className="text-slate-500 text-sm italic">Cree créditos o deudas para compras a futuro o pagos parciales.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Selector de Cliente */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <User className="w-4 h-4" /> Buscar Cliente
                        </label>
                        {!clienteSeleccionado ? (
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Escriba nombre o identificación..."
                                    className="pl-10"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                                {clientesFiltrados.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-lg shadow-xl overflow-hidden">
                                        {clientesFiltrados.map(c => (
                                            <div
                                                key={c.identificacion}
                                                className="p-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer border-b last:border-0 dark:border-slate-700"
                                                onClick={() => { // Removed 'e' parameter as it was unused
                                                    setClienteSeleccionado(c)
                                                    setBusqueda("")
                                                }}
                                            >
                                                <p className="font-bold text-sm text-slate-900 dark:text-white">{c.razonSocial}</p>
                                                <p className="text-xs text-slate-500">{c.identificacion}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                                        {clienteSeleccionado.razonSocial[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{clienteSeleccionado.razonSocial}</p>
                                        <p className="text-xs text-slate-500">{clienteSeleccionado.identificacion}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setClienteSeleccionado(null)}>
                                    <X className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Fecha de Registro
                            </label>
                            <Input
                                type="date"
                                value={form.fecha}
                                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> Monto del Anticipo
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="pl-7 font-numeric text-lg font-bold"
                                    value={form.montoTotal || ""}
                                    onChange={(e) => setForm({ ...form, montoTotal: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Detalle / Descripción
                        </label>
                        <Textarea
                            placeholder="Ej: Pago adelantado para repuestos de motor..."
                            className="resize-none min-h-[100px]"
                            value={form.descripcion}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, descripcion: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            className="flex-1 bg-purple-600 hover:bg-purple-700 h-12 text-lg font-bold"
                            onClick={handleSave}
                        >
                            Registrar Anticipo
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-xs text-blue-600 dark:text-blue-400 italic">
                    * Una vez registrado el anticipo, podrá realizar abonos o pagos parciales desde el buscador de estados de cuenta.
                </p>
            </div>
        </div>
    )
}
