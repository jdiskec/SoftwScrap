"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CrearFactura } from "@/components/admin/facturas/crearfactura/crearfactura"
import { RegistroDeFacturas } from "@/components/admin/facturas/registrodefacturas/registrodefacturas"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faReceipt, faChevronLeft, faFileInvoice, faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons"

/** 
 * Configuración de iconos para la interfaz de facturas.
 */
const byPrefixAndName = {
  fal: {
    receipt: faReceipt
  },
  fat: {
    "file-invoice": faFileInvoice,
    "file-invoice-dollar": faFileInvoiceDollar
  },
  fas: {
    receipt: faReceipt
  }
}

/**
 * Componente Principal del Módulo de Facturación.
 * Actúa como un orquestador de vistas para permitir al usuario cambiar entre:
 * - Panel General (Estadísticas rápidas)
 * - Crear Factura (Formulario de emisión)
 * - Registro de Facturas (Historial de documentos)
 */
export function Facturas() {
  /** Estado que controla qué sub-módulo se muestra en pantalla */
  const [view, setView] = useState<"panel" | "crear" | "registro">("panel")

  /**
   * Efecto para escuchar eventos globales y forzar la apertura del formulario de creación.
   */
  useEffect(() => {
    const openCrear = () => setView("crear")
    window.addEventListener("facturas:open_crear", openCrear)
    return () => {
      window.removeEventListener("facturas:open_crear", openCrear)
    }
  }, [])

  return (
    <main className="ml-[260px] min-h-screen p-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado del Módulo */}
        <header className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-purple-600 rounded-xl shadow-lg shadow-purple-200 dark:shadow-none">
            <FontAwesomeIcon
              icon={byPrefixAndName.fat['file-invoice']}
              className="text-white text-2xl h-6 w-6"
            />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Gestión de Facturas
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Administra, crea y consulta todos tus registros de facturación
            </p>
          </div>
        </header>

        {/* Barra de Acciones y Navegación interna */}
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          {view !== "panel" && (
            <button
              onClick={() => setView("panel")}
              className="flex items-center gap-2 text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 transition-colors text-sm font-medium"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
              Volver al Panel
            </button>
          )}
          <div className="flex gap-3 ml-auto">
            <Button
              variant={view === "crear" ? "default" : "outline"}
              onClick={() => setView("crear")}
              className={`gap-2 ${view === "crear" ? "bg-purple-600 hover:bg-purple-700" : ""}`}
            >
              <FontAwesomeIcon icon={byPrefixAndName.fas['receipt']} />
              Crear factura
            </Button>
            <Button
              variant={view === "registro" ? "default" : "outline"}
              onClick={() => setView("registro")}
              className={`gap-2 ${view === "registro" ? "bg-purple-600 hover:bg-purple-700" : ""}`}
            >
              <FontAwesomeIcon icon={byPrefixAndName.fat['file-invoice-dollar']} />
              Registro de facturas
            </Button>
          </div>
        </div>

        {/* Marco Principal del Contenido (Renderizado condicional) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden min-h-[600px]">
          <div className="p-1">
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8">

              {/* VISTA 1: Panel de Estadísticas (Default) */}
              {view === "panel" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl border border-purple-100 dark:border-slate-600 shadow-sm">
                      <h3 className="font-semibold text-slate-600 dark:text-slate-300">Facturas pendientes</h3>
                      <p className="text-3xl font-black mt-2 text-purple-600 dark:text-purple-400">0</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl border border-blue-100 dark:border-slate-600 shadow-sm">
                      <h3 className="font-semibold text-slate-600 dark:text-slate-300">Última factura</h3>
                      <p className="text-3xl font-black mt-2 text-blue-600 dark:text-blue-400">#F-2025-0000</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl border border-emerald-100 dark:border-slate-600 shadow-sm">
                      <h3 className="font-semibold text-slate-600 dark:text-slate-300">Total del mes</h3>
                      <p className="text-3xl font-black mt-2 text-emerald-600 dark:text-emerald-400">$0.00</p>
                    </div>
                  </div>

                  <div className="mt-12 text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                    <div className="mx-auto w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                      <FontAwesomeIcon icon={faReceipt} className="text-slate-300 dark:text-slate-500 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Bienvenido al Módulo de Facturación</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                      Selecciona una de las opciones superiores para comenzar a gestionar tus facturas comerciales.
                    </p>
                  </div>
                </div>
              )}

              {/* VISTA 2: Formulario de Creación */}
              {view === "crear" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <h2 className="text-2xl font-bold dark:text-white">Emitir Nueva Factura</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Completa los campos para generar un nuevo comprobante electrónico</p>
                  </div>
                  <CrearFactura />
                </div>
              )}

              {/* VISTA 3: Registro Histórico */}
              {view === "registro" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <h2 className="text-2xl font-bold dark:text-white">Registro de Facturas</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Historial completo y búsqueda de comprobantes emitidos</p>
                  </div>
                  <RegistroDeFacturas />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

