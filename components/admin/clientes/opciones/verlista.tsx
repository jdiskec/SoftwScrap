"use client"

import { Cliente } from "@/components/funciones/funciones"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Search, Download, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface VerListaProps {
    clientes: Cliente[]
    onEditar: (cliente: Cliente) => void
    onEliminar: (id: string) => void
}

export function VerLista({ clientes, onEditar, onEliminar }: VerListaProps) {
    const [busqueda, setBusqueda] = useState("")

    const filtrados = clientes.filter(c =>
        c.razonSocial.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.identificacion.includes(busqueda) ||
        c.email.toLowerCase().includes(busqueda.toLowerCase())
    )

    const exportToExcelPlaceholder = () => {
        alert("Función de exportación a Excel (CSV) próximamente disponible.")
    }

    return (
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                    Directorio de Clientes (Modo Excel)
                </CardTitle>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar cliente..."
                            className="pl-10 w-[300px] h-9"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" onClick={exportToExcelPlaceholder}>
                        <Download className="w-4 h-4" />
                        Exportar
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-100 dark:bg-slate-800">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 w-[150px]">Identificación</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200">Razón Social / Nombres</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 min-w-[200px]">Correo Electrónico</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200">Teléfono</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200">Dirección</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtrados.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No se encontraron registros de clientes.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtrados.map((cliente) => (
                                    <TableRow key={cliente.identificacion} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800">
                                        <TableCell className="font-mono font-medium text-blue-600 dark:text-blue-400">
                                            {cliente.identificacion}
                                            <span className="block text-[10px] text-slate-400 uppercase">{cliente.tipoIdentificacion}</span>
                                        </TableCell>
                                        <TableCell className="font-semibold text-slate-900 dark:text-slate-100 uppercase">
                                            {cliente.razonSocial}
                                        </TableCell>
                                        <TableCell className="text-slate-600 dark:text-slate-300">
                                            {cliente.email}
                                        </TableCell>
                                        <TableCell className="text-slate-600 dark:text-slate-300">
                                            {cliente.telefono || "---"}
                                        </TableCell>
                                        <TableCell className="text-slate-600 dark:text-slate-300 max-w-[250px] truncate">
                                            {cliente.direccion || "---"}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => onEditar(cliente)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
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
