"use client"

import { Cliente, getAnticipos } from "@/components/funciones/funciones"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Search, Download, FileSpreadsheet, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"

interface VerListaProps {
    clientes: Cliente[]
    onEditar: (cliente: Cliente) => void
    onEliminar: (id: string) => void
    onVerEstado?: (id: string) => void
}

export function VerLista({ clientes, onEditar, onEliminar, onVerEstado }: VerListaProps) {
    const [busqueda, setBusqueda] = useState("")

    const anticipos = useMemo(() => getAnticipos(), [])

    const dataConsolidada = useMemo(() => {
        return clientes.map(c => {
            const anticiposCliente = anticipos.filter(a => a.clienteId === c.identificacion)
            const totalAnticipos = anticiposCliente.reduce((sum, a) => sum + a.montoTotal, 0)
            const saldoPendiente = anticiposCliente.reduce((sum, a) => sum + a.saldoPendiente, 0)
            const totalPagado = totalAnticipos - saldoPendiente

            return {
                ...c,
                totalAnticipos,
                saldoPendiente,
                totalPagado
            }
        })
    }, [clientes, anticipos])

    const filtrados = dataConsolidada.filter(c =>
        c.razonSocial.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.identificacion.includes(busqueda) ||
        c.email.toLowerCase().includes(busqueda.toLowerCase())
    )

    const exportToExcel = () => {
        if (filtrados.length === 0) return

        // Crear encabezados
        const headers = ["Identificacion", "Tipo", "Razon Social", "Email", "Telefono", "Direccion", "Total Anticipos", "Total Pagado", "Saldo Pendiente"]

        // Crear filas
        const rows = filtrados.map(c => [
            c.identificacion,
            c.tipoIdentificacion,
            c.razonSocial,
            c.email,
            c.telefono || "",
            c.direccion || "",
            c.totalAnticipos.toFixed(2),
            c.totalPagado.toFixed(2),
            c.saldoPendiente.toFixed(2)
        ])

        // Convertir a CSV
        const csvContent = [
            headers.join(","),
            ...rows.map(e => e.join(","))
        ].join("\n")

        // Descargar el archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `reporte_clientes_anticipos_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                    Directorio Financiero de Clientes
                </CardTitle>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar por nombre, ID o email..."
                            className="pl-10 w-[300px] h-9"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30" onClick={exportToExcel}>
                        <Download className="w-4 h-4" />
                        Exportar Excel
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-100 dark:bg-slate-800">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 w-[140px]">Identificación</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200">Razón Social</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 text-right">Total Ant.</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 text-right">Pagado</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 text-right text-red-600">Saldo Pend.</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtrados.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No se encontraron registros.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtrados.map((cliente) => (
                                    <TableRow key={cliente.identificacion} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800">
                                        <TableCell className="font-mono font-medium text-blue-600 dark:text-blue-400 text-xs">
                                            {cliente.identificacion}
                                            <span className="block text-[8px] text-slate-400 uppercase">{cliente.tipoIdentificacion}</span>
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            <p className="font-bold text-slate-900 dark:text-slate-100 uppercase">{cliente.razonSocial}</p>
                                            <p className="text-[10px] text-slate-400">{cliente.email}</p>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-slate-600 dark:text-slate-400 font-numeric">
                                            ${cliente.totalAnticipos.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-green-600 font-numeric">
                                            ${cliente.totalPagado.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right font-black text-red-600 font-numeric">
                                            ${cliente.saldoPendiente.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Ver Estado de Cuenta"
                                                    className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                    onClick={() => onVerEstado?.(cliente.identificacion)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Editar Cliente"
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => onEditar(cliente)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Eliminar Cliente"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => onEliminar(cliente.identificacion)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
