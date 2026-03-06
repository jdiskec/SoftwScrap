"use client";
import { useState } from "react";
import { Factura, getFacturas } from "@/components/funciones/funciones";
import { FileText, Calendar, Download } from "lucide-react";
import { descargarFactura } from "../facturafuncdescar";

/**
 * Componente que muestra el historial de facturas emitidas.
 * Recupera los datos desde LocalStorage y los presenta en una lista descendente (más reciente primero).
 */
export function RegistroDeFacturas() {
  // Estado local que carga el historial de facturas al montar el componente
  const [facturas] = useState<Factura[]>(() => {
    const data = getFacturas();
    return data.slice().reverse(); // Invertimos para mostrar las más recientes arriba
  });

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Historial de Facturas</h3>

      {facturas.length === 0 ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          No hay facturas registradas aún en el sistema.
        </div>
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {facturas.map((factura, index) => (
            <div key={index} className="py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 -mx-6 px-6 transition-colors">
              <div className="flex items-center gap-4">
                {/* Icono decorativo de documento */}
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-900 dark:text-slate-100 font-medium">Factura #{factura.secuencial}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{factura.cliente.razonSocial}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                    <Calendar className="w-3 h-3" />
                    {factura.fecha}
                  </div>
                </div>
              </div>
              {/* Resumen monetario y acción de descarga */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-slate-900 dark:text-slate-100 font-bold text-lg font-numeric">${factura.total.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{factura.detalles.length} items registrados</p>
                </div>
                <button
                  onClick={() => descargarFactura(factura)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-colors tooltip"
                  title="Descargar Factura"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
