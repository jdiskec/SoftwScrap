"use client"

import { useState, useEffect } from "react"

/** 
 * Define los tipos de roles disponibles en el sistema 
 */
export type Rol = "admin" | "empleado"

/** 
 * Interfaz que define la estructura de un Usuario 
 */
export interface Usuario {
    id: string
    nombre: string
    usuario: string
    rol: Rol
    email?: string
    telefono?: string
    rango?: string // Etiqueta descriptiva del nivel o cargo
}

const USUARIOS_KEY = "seguridad_usuarios"
const SESSION_KEY = "seguridad_session"

/**
 * Hook personalizado para gestionar permisos, autenticación y roles de usuario.
 * Proporciona funciones para login, logout, cambiar roles y verificar permisos.
 */
export function usePermisos() {
    // Listado de usuarios registrados en el sistema (persitido en LocalStorage)
    const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
        if (typeof window === "undefined") return []

        const iniciales: Usuario[] = [
            { id: "1", nombre: "Administrador", usuario: "admin", rol: "admin", email: "admin@kipu.com", telefono: "0999999999", rango: "Gerente General" },
            { id: "2", nombre: "Empleado Test", usuario: "empleado", rol: "empleado", email: "ventas@kipu.com", telefono: "0988888888", rango: "Asesor de Ventas" },
            { id: "3", nombre: "Eqjor", usuario: "eqjor", rol: "admin", email: "eqjor@kipu.com", telefono: "0977777777", rango: "Súper Admin" },
            { id: "4", nombre: "Admin Test", usuario: "admin@test.com", rol: "admin", email: "admin@test.com", telefono: "0900000000", rango: "Administrador de Pruebas" },
        ]

        const stored = localStorage.getItem(USUARIOS_KEY)
        if (!stored) {
            localStorage.setItem(USUARIOS_KEY, JSON.stringify(iniciales))
            return iniciales
        }

        const actual: Usuario[] = JSON.parse(stored)
        // Aseguramos que los nuevos administradores semilla existan en la lista actual
        let modificado = false
        const resultado = [...actual]

        iniciales.forEach(ini => {
            if (!resultado.find(u => u.usuario === ini.usuario)) {
                resultado.push(ini)
                modificado = true
            }
        })

        if (modificado) {
            localStorage.setItem(USUARIOS_KEY, JSON.stringify(resultado))
        }
        return resultado
    })

    // Usuario actualmente autenticado en la sesión
    const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(() => {
        if (typeof window === "undefined") return null
        const session = localStorage.getItem(SESSION_KEY)
        return session ? JSON.parse(session) : null
    })

    // Sincronizar cambios en la lista de usuarios con LocalStorage
    useEffect(() => {
        localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios))
    }, [usuarios])

    /**
     * Intenta iniciar sesión con un nombre de usuario.
     * @param u Nombre de usuario.
     * @returns true si el login fue exitoso, false de lo contrario.
     */
    const login = (u: string) => {
        const user = usuarios.find(usr => usr.usuario === u)
        if (user) {
            setUsuarioActual(user)
            localStorage.setItem(SESSION_KEY, JSON.stringify(user))
            return true
        }
        return false
    }

    /**
     * Cierra la sesión activa borrando los datos de LocalStorage.
     */
    const logout = () => {
        setUsuarioActual(null)
        localStorage.removeItem(SESSION_KEY)
    }

    /**
     * Actualiza los datos de contacto y rango de un usuario. Solo Administradores.
     */
    const actualizarUsuario = (id: string, data: Partial<Usuario>) => {
        if (usuarioActual?.rol !== "admin") {
            alert("Acción no autorizada")
            return
        }
        setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...data } : u))
    }

    /**
     * Cambia el rol de un usuario. Solo permitido para Administradores.
     * @param id ID del usuario a modificar.
     * @param nuevoRol El nuevo rol a asignar ("admin" | "empleado").
     */
    const cambiarRol = (id: string, nuevoRol: Rol) => {
        if (usuarioActual?.rol !== "admin") {
            alert("Solo el administrador puede cambiar rangos")
            return
        }
        setUsuarios(prev => prev.map(u => u.id === id ? { ...u, rol: nuevoRol } : u))
    }

    /**
     * Verifica si el usuario actual tiene permiso para realizar una acción específica.
     * @param accion La acción a validar (ej: "modificar_inventario", "cambiar_iva").
     * @returns Boolean indicando si tiene permiso.
     */
    const tienePermiso = (accion: "modificar_inventario" | "cambiar_iva"): boolean => {
        if (!usuarioActual) return false
        if (usuarioActual.rol === "admin") return true

        // El empleado no puede modificar inventario ni cambiar IVA directamente
        if ((accion === "modificar_inventario" || accion === "cambiar_iva") && usuarioActual.rol === "empleado") {
            return false
        }

        return true
    }

    return {
        usuarios,
        usuarioActual,
        login,
        logout,
        cambiarRol,
        actualizarUsuario,
        tienePermiso,
        esAdmin: usuarioActual?.rol === "admin"
    }
}
