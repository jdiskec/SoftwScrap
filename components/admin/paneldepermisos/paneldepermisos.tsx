"use client"

import { useState, useEffect } from "react"

/** 
 * Interfaz que define la estructura de una solicitud de permiso 
 * para modificar el inventario.
 */
export interface PermisoSolicitud {
    id: string
    usuarioId: string
    nombreUsuario: string
    motivo: string
    causa: string // Detalle específico de la modificación (justificación técnica)
    estado: "pendiente" | "aprobado" | "rechazado"
    fecha: string
}

const PERMISOS_KEY = "gestion_permisos_solicitudes"

/**
 * Hook personalizado para gestionar las solicitudes de permisos de inventario.
 */
export function usePanelPermisos() {
    // Lista de solicitudes (persistido en LocalStorage)
    const [solicitudes, setSolicitudes] = useState<PermisoSolicitud[]>(() => {
        if (typeof window === "undefined") return []
        const stored = localStorage.getItem(PERMISOS_KEY)
        return stored ? JSON.parse(stored) : []
    })

    // Sincronización con LocalStorage
    useEffect(() => {
        localStorage.setItem(PERMISOS_KEY, JSON.stringify(solicitudes))
    }, [solicitudes])

    /**
     * Crea una nueva solicitud de permiso.
     * @param usuario Datos del usuario que solicita.
     * @param motivo Título o razón general.
     * @param causa Explicación detallada técnica.
     */
    const solicitarPermiso = (usuario: { id: string, nombre: string }, motivo: string, causa: string) => {
        const nueva: PermisoSolicitud = {
            id: Date.now().toString(),
            usuarioId: usuario.id,
            nombreUsuario: usuario.nombre,
            motivo,
            causa,
            estado: "pendiente",
            fecha: new Date().toLocaleString()
        }
        setSolicitudes(prev => [nueva, ...prev])
        alert("Solicitud enviada al administrador")
    }

    /**
     * Cambia el estado de una solicitud (Aprobar o Rechazar).
     * @param id ID de la solicitud.
     * @param nuevoEstado El estado a asignar.
     */
    const procesarSolicitud = (id: string, nuevoEstado: "aprobado" | "rechazado") => {
        setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s))
    }

    return {
        solicitudes,
        solicitarPermiso,
        procesarSolicitud
    }
}

import * as React from "react"
import { usePermisos, Rol } from "../permisos/permisos"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CheckCircle2, XCircle, Clock, ShieldCheck, UserCog, Mail, Phone, Award, Edit3, Check } from "lucide-react"

/**
 * Componente de interfaz de usuario para el Centro de Control de Seguridad.
 * Permite gestionar roles de usuario y procesar solicitudes de modificación.
 */
export function PanelDePermisosUI() {
    const { usuarios, usuarioActual, cambiarRol, actualizarUsuario, esAdmin } = usePermisos()
    const { solicitudes, procesarSolicitud } = usePanelPermisos()

    // Si no hay sesión, no muestra el panel
    if (!usuarioActual) return <div className="p-8 text-center text-slate-500">Inicie sesión para ver este panel</div>

    return (
        <div className="space-y-8 p-6 animate-in fade-in duration-500">
            {/* Encabezado del Panel */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Centro de Control de Seguridad</h1>
                <p className="text-slate-500 dark:text-slate-400">Gestione rangos de usuarios y apruebe modificaciones críticas de inventario.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* SECCIÓN 1: Gestión de Usuarios y Roles - VISIBLE PARA TODOS, RESTRINGIDO CAMBIO A ADMIN */}
                <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <UserCog className="h-5 w-5 text-indigo-600" />
                            <CardTitle>Gestión de Rangos</CardTitle>
                        </div>
                        <CardDescription>Solo el administrador puede asignar roles en el sistema.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {usuarios.map((u) => (
                                <UserListItem
                                    key={u.id}
                                    user={u}
                                    isCurrent={u.usuario === usuarioActual.usuario}
                                    esAdmin={esAdmin}
                                    onUpdate={(id: string, data: any) => actualizarUsuario(id, data)}
                                    onChangeRol={(id: string, rol: Rol) => cambiarRol(id, rol)}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* SECCIÓN 2: Panel de Solicitudes de Inventario - PARA ADMIN */}
                <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                            <CardTitle>Solicitudes de Modificación</CardTitle>
                        </div>
                        <CardDescription>Revisiones pendientes de cambios en inventario (Empleado → Admin).</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {solicitudes.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    <Clock className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                    <p>No hay solicitudes pendientes</p>
                                </div>
                            ) : (
                                solicitudes.map((s) => (
                                    <div key={s.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{s.nombreUsuario}</span>
                                                <p className="text-xs text-slate-500">{s.fecha}</p>
                                            </div>
                                            <Badge variant={s.estado === "pendiente" ? "outline" : s.estado === "aprobado" ? "default" : "destructive"}>
                                                {s.estado}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold uppercase text-slate-400">Motivo:</h4>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{s.motivo}</p>
                                        </div>
                                        {/* Justificación técnica detallada */}
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border-l-4 border-indigo-500">
                                            <h4 className="text-[10px] font-bold uppercase text-indigo-500">Detalle/Causa Técnica:</h4>
                                            <p className="text-xs italic text-slate-600 dark:text-slate-400">{s.causa}</p>
                                        </div>
                                        {/* Acciones de gestión de la solicitud (Solo Admin) */}
                                        {esAdmin && s.estado === "pendiente" && (
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-9"
                                                    onClick={() => procesarSolicitud(s.id, "aprobado")}
                                                >
                                                    <CheckCircle2 className="h-4 w-4" /> Aprobar
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="flex-1 gap-2 h-9"
                                                    onClick={() => procesarSolicitud(s.id, "rechazado")}
                                                >
                                                    <XCircle className="h-4 w-4" /> Rechazar
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

/**
 * Sub-componente para renderizar cada usuario en la lista con opción de edición.
 * Permite gestionar email, teléfono y rango/cargo.
 */
function UserListItem({ user, isCurrent, esAdmin, onUpdate, onChangeRol }: {
    user: any,
    isCurrent: boolean,
    esAdmin: boolean,
    onUpdate: (id: string, data: any) => void,
    onChangeRol: (id: string, rol: Rol) => void
}) {
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        email: user.email || "",
        telefono: user.telefono || "",
        rango: user.rango || ""
    })

    const handleSave = () => {
        onUpdate(user.id, editForm)
        setIsEditing(false)
    }

    return (
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{user.nombre}</span>
                        {isCurrent && <Badge variant="outline" className="text-[9px] h-4">Tú</Badge>}
                    </div>
                    <span className="text-xs text-slate-500 italic">@{user.usuario}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={user.rol === "admin" ? "default" : "secondary"} className="capitalize h-6">
                        {user.rol}
                    </Badge>
                    {esAdmin && !isCurrent && (
                        <div className="flex gap-1">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-[10px] px-2"
                                onClick={() => onChangeRol(user.id, user.rol === "admin" ? "empleado" : "admin")}
                            >
                                Switch a {user.rol === "admin" ? "Empleado" : "Admin"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Información Detallada / Formulario de Edición */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Mail className="h-3 w-3 text-slate-400" />
                    {isEditing ? (
                        <Input
                            value={editForm.email}
                            onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                            className="h-7 text-xs py-0"
                            placeholder="Email"
                        />
                    ) : (
                        <span>{user.email || "Sin correo"}</span>
                    )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Phone className="h-3 w-3 text-slate-400" />
                    {isEditing ? (
                        <Input
                            value={editForm.telefono}
                            onChange={e => setEditForm({ ...editForm, telefono: e.target.value })}
                            className="h-7 text-xs py-0"
                            placeholder="Teléfono"
                        />
                    ) : (
                        <span>{user.telefono || "Sin teléfono"}</span>
                    )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Award className="h-3 w-3 text-indigo-400" />
                    {isEditing ? (
                        <div className="flex gap-1 w-full">
                            <Input
                                value={editForm.rango}
                                onChange={e => setEditForm({ ...editForm, rango: e.target.value })}
                                className="h-7 text-xs py-0 flex-1"
                                placeholder="Rango/Cargo"
                            />
                            <Button size="icon" className="h-7 w-7 bg-indigo-600" onClick={handleSave}>
                                <Check className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <span className="font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">
                            {user.rango || "Vendedor"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
