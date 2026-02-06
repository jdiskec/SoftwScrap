"use client"

import React, { useMemo } from "react"
import { Anticipo, getAnticipos, getClientes } from "@/components/funciones/funciones"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { DollarSign, FileText } from "lucide-react"

export interface DataAnticiposProps {
    clienteId?: string;
}

/**
 * Componente que muestra los datos crudos y consolidados de anticipos.
 * Actúa como la fuente de verdad visual para reportes y exportaciones.
 */
export function DataAnticipos({ clienteId }: DataAnticiposProps) {
    const anticipos = useMemo(() => {
        const all = getAnticipos()
        if (clienteId) {
            return all.filter(a => a.clienteId === clienteId)
        }
        return all
    }, [clienteId])

    const clientes = useMemo(() => getClientes(), [])

    const consolidado = useMemo(() => {
        return anticipos.map(a => {
            const cliente = clientes.find(c => c.identificacion === a.clienteId)
            return {
                ...a,
                clienteNombre: cliente?.razonSocial || "Desconocido",
                totalPagado: a.pagos.reduce((sum, p) => sum + p.monto, 0)
            }
        })
    }, [anticipos, clientes])

    if (consolidado.length === 0) {
        return (
            <div className="p-8 text-center text-slate-500 italic">
                No hay datos de anticipos registrados para este criterio.
            </div>
        )
    }

    return (
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="py-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-500" />
                    Detalle Consolidado de Anticipos
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800">
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead className="text-right">Monto</TableHead>
                            <TableHead className="text-right">Pagado</TableHead>
                            <TableHead className="text-right">Saldo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {consolidado.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="text-xs">{item.fecha}</TableCell>
                                <TableCell className="font-medium text-xs">{item.clienteNombre}</TableCell>
                                <TableCell className="text-xs truncate max-w-[150px]">{item.descripcion}</TableCell>
                                <TableCell className="text-right font-bold text-xs">${item.montoTotal.toFixed(2)}</TableCell>
                                <TableCell className="text-right text-green-600 font-bold text-xs">${item.totalPagado.toFixed(2)}</TableCell>
                                <TableCell className="text-right text-red-600 font-bold text-xs">${item.saldoPendiente.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
