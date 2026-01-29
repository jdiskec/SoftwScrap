"use client"

import { Producto } from "./funcioninventario"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePermisos } from "../permisos/permisos"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * Propiedades del componente TablaInventario
 */
interface TablaInventarioProps {
    productos: Producto[] // Lista de productos a mostrar
    onEditar: (producto: Producto) => void // Función para manejar la edición
    onEliminar: (id: string) => void // Función para manejar la eliminación
}

/**
 * Componente que renderiza una tabla detallada del inventario para contabilidad.
 * Implementa verificaciones de permisos para restringir acciones a no-administradores.
 */
export function TablaInventario({ productos, onEditar, onEliminar }: TablaInventarioProps) {
    const IVA_VALOR = 0.15
    const { tienePermiso } = usePermisos()

    // Verificación de seguridad: solo permitimos modificar si tiene el permiso adecuado
    const puedeModificar = tienePermiso("modificar_inventario")

    return (
        <Card className="mt-8 border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
            {/* Encabezado de la Tabla */}
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    Lista de Inventario Detallada (Contabilidad)
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-100 dark:bg-slate-800">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 w-[100px]">Código</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 min-w-[200px]">Descripción / Item</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 text-right">Cant. Actual</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 text-right">P. Costo</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 text-right">PVP Normal</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 text-right">IVA</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 text-right">P. con IVA</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 text-right">Total Reg.</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 text-center">M. Pago</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-200 text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {productos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                        No hay registros contables disponibles.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                productos.map((producto) => {
                                    // Cálculos contables básicos
                                    const valorIva = producto.precio * IVA_VALOR
                                    const subtotalStock = producto.precioConIVA * producto.cantidad

                                    return (
                                        <TableRow key={producto.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800">
                                            <TableCell className="font-numeric text-blue-600 dark:text-blue-400">{producto.codigo}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{producto.nombre}</span>
                                                    <span className="text-xs text-muted-foreground line-clamp-1">{producto.descripcion || "Sin descripción"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {/* Indicador visual de stock bajo (<= 5 unidades) */}
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold font-numeric ${producto.cantidad <= 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    {producto.cantidad}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-numeric">${producto.precio.toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-numeric text-blue-600 font-bold">${(producto.pvp || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-numeric text-slate-500">${valorIva.toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-numeric font-bold text-slate-900 dark:text-slate-100">
                                                ${producto.precioConIVA.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right font-numeric font-bold text-green-600 dark:text-green-400">
                                                ${(producto.total || subtotalStock).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="text-xs uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                                                    {producto.metodoPago || "N/A"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center gap-1">
                                                    <TooltipProvider>
                                                        {/* Botón de Editar con validación de permiso */}
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                        onClick={() => onEditar(producto)}
                                                                        disabled={!puedeModificar}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </span>
                                                            </TooltipTrigger>
                                                            {!puedeModificar && (
                                                                <TooltipContent className="bg-slate-900 text-white border-none">
                                                                    <p className="flex items-center gap-2 text-xs">
                                                                        <ShieldAlert className="h-3 w-3 text-amber-400" />
                                                                        Requiere permiso de Admin para editar
                                                                    </p>
                                                                </TooltipContent>
                                                            )}
                                                        </Tooltip>

                                                        {/* Botón de Eliminar con validación de permiso */}
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                        onClick={() => onEliminar(producto.id)}
                                                                        disabled={!puedeModificar}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </span>
                                                            </TooltipTrigger>
                                                            {!puedeModificar && (
                                                                <TooltipContent className="bg-slate-900 text-white border-none">
                                                                    <p className="flex items-center gap-2 text-xs">
                                                                        <ShieldAlert className="h-3 w-3 text-amber-400" />
                                                                        Requiere permiso de Admin para eliminar
                                                                    </p>
                                                                </TooltipContent>
                                                            )}
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
