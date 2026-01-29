"use client";
import { useState } from "react";
import { Cliente, getClientes } from "@/components/funciones/funciones";
import { List, UserPlus, CreditCard, X, Plus } from "lucide-react";
import { VerLista } from "./opciones/verlista";
import { RegistrarCliente } from "./opciones/registrarcliente";
import { VerAnticipo } from "./Anticipo/veranticipo";
import { RegistrarAnticipo } from "./Anticipo/registraranticipo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Componente Principal para la Gestión de Clientes.
 * Permite navegar entre el panel de control, la lista filtrable y el formulario de registro/edición.
 */
export function Clientes() {
    /** Estado que mantiene la lista de clientes sincronizada con el almacenamiento local */
    const [clientes, setClientes] = useState<Cliente[]>(() => getClientes())

    /** Controla la vista actual: panel principal, lista tabular o formulario */
    const [vistaActual, setVistaActual] = useState<"dashboard" | "lista" | "registro" | "anticipos" | "nuevo_anticipo">("dashboard")

    /** Almacena un objeto de cliente cuando se entra en modo edición */
    const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null)

    /**
     * Refresca la lista de clientes desde LocalStorage.
     */
    const actualizarData = () => {
        setClientes(getClientes())
    }

    /**
     * Elimina un cliente previa confirmación del usuario.
     * @param id - Identificación única del cliente a eliminar.
     */
    const handleEliminar = (id: string) => {
        if (confirm("¿Está seguro de eliminar este cliente?")) {
            const current = getClientes().filter(c => c.identificacion !== id)
            localStorage.setItem("facturacion_clientes", JSON.stringify(current))
            actualizarData()
        }
    }

    /**
     * Prepara el estado para editar un cliente y cambia la vista al formulario.
     * @param cliente - Objeto de datos del cliente a editar.
     */
    const handleEditar = (cliente: Cliente) => {
        setClienteEditando(cliente)
        setVistaActual("registro")
    }

    /**
     * Renderiza las tarjetas de acceso rápido del módulo de clientes.
     */
    const renderDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {/* Tarjeta: DIRECTORIO DE CLIENTES */}
            <Card
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-none bg-white dark:bg-slate-800 overflow-hidden"
                onClick={() => setVistaActual("lista")}
            >
                <div className="h-2 bg-green-500" />
                <CardContent className="p-10 flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                        <List className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 italic">Ver Lista</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Visualiza y gestiona tu base de datos de clientes registrados.</p>
                    </div>
                    <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">Abrir Directorio</Button>
                </CardContent>
            </Card>

            {/* Tarjeta: REGISTRO DE NUEVO CLIENTE */}
            <Card
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-none bg-white dark:bg-slate-800 overflow-hidden"
                onClick={() => {
                    setClienteEditando(null)
                    setVistaActual("registro")
                }}
            >
                <div className="h-2 bg-blue-500" />
                <CardContent className="p-10 flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <UserPlus className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 italic">Registrar Cliente</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Añade nuevos clientes con todos sus datos fiscales y de contacto.</p>
                    </div>
                    <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">Nuevo Registro</Button>
                </CardContent>
            </Card>

            {/* Tarjeta: GESTIÓN DE ANTICIPOS (Funcionalidad modular) */}
            <Card
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-none bg-white dark:bg-slate-800 overflow-hidden"
                onClick={() => setVistaActual("anticipos")}
            >
                <div className="h-2 bg-purple-500" />
                <CardContent className="p-10 flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                        <CreditCard className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 italic">Anticipos</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Gestiona pagos anticipados y estados de cuenta de clientes.</p>
                    </div>
                    <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50">Ver Anticipos</Button>
                </CardContent>
            </Card>
        </div>
    )

    return (
        <main className="ml-[260px] min-h-screen p-0 bg-slate-50 dark:bg-slate-950">
            <div className="p-8">
                {/* Cabecera del Módulo */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Gestión de <span className="text-blue-600 uppercase">Clientes</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Directorio, registros y estados de cuenta profesionales.</p>
                    </div>
                    {/* Botón de Retorno al Dashboard */}
                    {vistaActual !== "dashboard" && (
                        <Button
                            variant="ghost"
                            onClick={() => setVistaActual("dashboard")}
                            className="gap-2 hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                            <X className="w-4 h-4" />
                            Volver al Panel
                        </Button>
                    )}
                </div>

                {/* Renderizado Condicional de Vistas */}
                {vistaActual === "dashboard" && renderDashboard()}

                {vistaActual === "lista" && (
                    <div className="animate-in fade-in duration-500">
                        <VerLista
                            clientes={clientes}
                            onEditar={handleEditar}
                            onEliminar={handleEliminar}
                        />
                    </div>
                )}

                {vistaActual === "registro" && (
                    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
                        <RegistrarCliente
                            onClose={() => setVistaActual("dashboard")}
                            onSuccess={() => {
                                actualizarData()
                                setVistaActual("lista")
                            }}
                            clienteEdit={clienteEditando}
                        />
                    </div>
                )}

                {vistaActual === "anticipos" && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex justify-end mb-6">
                            <Button
                                className="bg-purple-600 hover:bg-purple-700 gap-2 font-bold"
                                onClick={() => setVistaActual("nuevo_anticipo")}
                            >
                                <Plus className="w-5 h-5" /> Nuevo Anticipo
                            </Button>
                        </div>
                        <VerAnticipo />
                    </div>
                )}

                {vistaActual === "nuevo_anticipo" && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <RegistrarAnticipo
                            onSuccess={() => setVistaActual("anticipos")}
                        />
                    </div>
                )}
            </div>
        </main>
    )
}
