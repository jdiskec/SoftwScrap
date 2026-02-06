"use client"

import * as React from "react"
import { usePermisos, Rol } from "../admin/permisos/permisos"
import { usePanelPermisos } from "../admin/paneldepermisos/paneldepermisos"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle2,
    XCircle,
    Clock,
    ShieldCheck,
    UserCog,
    Settings,
    FileCheck,
    AlertCircle,
    Check
} from "lucide-react"

/**
 * Componente de Configuración Avanzada y Control Administrativo.
 * Este panel permite a los administradores gestionar roles y aprobar tareas críticas
 * enviadas por los trabajadores (como facturación sin IVA).
 */
export function ConfiguracionPanel() {
    const { usuarios, usuarioActual, cambiarRol, esAdmin } = usePermisos()
    const { solicitudes, procesarSolicitud } = usePanelPermisos()

    if (!usuarioActual) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <AlertCircle className="h-12 w-12 mx-auto text-slate-400" />
                    <p className="text-slate-500">Inicie sesión para acceder a la configuración</p>
                </div>
            </div>
        )
    }

    if (!esAdmin) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <ShieldCheck className="h-12 w-12 mx-auto text-red-400" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Acceso Restringido</h2>
                    <p className="text-slate-500">Solo los administradores pueden acceder a este panel de control.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Encabezado Principal */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Settings className="h-8 w-8 text-blue-600" />
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-slate-50">
                            PANEL DE CONTROL
                        </h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Gestión de permisos y aprobaciones críticas del sistema.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase">Estado del Sistema</p>
                        <p className="text-sm font-bold text-emerald-500">OPERATIVO</p>
                    </div>
                    <div className="h-10 w-1 bg-slate-100 dark:bg-slate-700 rounded-full" />
                    <ShieldCheck className="h-6 w-6 text-emerald-500" />
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Columna Izquierda: Aprobaciones de Tareas (Prioridad) */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-6">
                    <Card className="overflow-hidden border-none shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                                        <FileCheck className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold">Tareas Pendientes de Aprobación</CardTitle>
                                        <CardDescription>Valide solicitudes críticas enviadas por el personal.</CardDescription>
                                    </div>
                                </div>
                                <Badge variant="outline" className="h-6 bg-white dark:bg-slate-800">
                                    {solicitudes.filter(s => s.estado === "pendiente").length} Pendientes
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {solicitudes.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Check className="h-10 w-10 text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 font-medium font-numeric">No hay tareas que requieran su atención inmediata.</p>
                                    </div>
                                ) : (
                                    solicitudes.map((s) => (
                                        <div key={s.id} className="p-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                                                                {s.nombreUsuario.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{s.nombreUsuario}</h4>
                                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                                    <Clock className="h-3 w-3" />
                                                                    {s.fecha}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant={s.estado === "pendiente" ? "outline" : s.estado === "aprobado" ? "default" : "destructive"}
                                                            className="uppercase text-[10px] font-bold"
                                                        >
                                                            {s.estado}
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Solicitud de:</h5>
                                                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{s.motivo}</p>

                                                        <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-l-4 border-amber-500">
                                                            <h6 className="text-[10px] font-black text-amber-600 uppercase mb-1">Justificación del Trabajador:</h6>
                                                            <p className="text-sm dark:text-slate-300 leading-relaxed italic">
                                                                "{s.causa}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="md:w-48 flex flex-row md:flex-col gap-2 justify-end md:justify-center">
                                                    {s.estado === "pendiente" ? (
                                                        <>
                                                            <Button
                                                                onClick={() => procesarSolicitud(s.id, "aprobado")}
                                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 gap-2 h-12"
                                                            >
                                                                <CheckCircle2 className="h-5 w-5" />
                                                                DAR VISTO
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => procesarSolicitud(s.id, "rechazado")}
                                                                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/10 gap-2 h-12"
                                                            >
                                                                <XCircle className="h-5 w-5" />
                                                                RECHAZAR
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <div className="text-center p-4">
                                                            <p className="text-xs font-bold text-slate-400">Procesado por usted</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Columna Derecha: Gestión de Operadores */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                    <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <UserCog className="h-6 w-6" />
                                <CardTitle>ROLES DE USUARIO</CardTitle>
                            </div>
                            <CardDescription className="text-indigo-100">Controle quién tiene acceso de administrador.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {usuarios.map((u) => (
                                    <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                                        <div className="min-w-0">
                                            <p className="font-bold truncate">{u.nombre}</p>
                                            <p className="text-[10px] text-indigo-200 uppercase font-black">{u.rol}</p>
                                        </div>
                                        {u.usuario !== usuarioActual.usuario && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="h-8 text-[10px] font-bold bg-white text-indigo-600 hover:bg-indigo-50"
                                                onClick={() => cambiarRol(u.id, u.rol === "admin" ? "empleado" : "admin")}
                                            >
                                                CAMBIAR A {u.rol === "admin" ? "EMPLEADO" : "ADMIN"}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-transparent">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">AUDITORÍA RÁPIDA</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Total Solicitudes</span>
                                <span className="font-bold dark:text-white">{solicitudes.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Aprobadas</span>
                                <span className="font-bold text-emerald-500">{solicitudes.filter(s => s.estado === "aprobado").length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Rechazadas</span>
                                <span className="font-bold text-red-500">{solicitudes.filter(s => s.estado === "rechazado").length}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
