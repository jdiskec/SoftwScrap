"use client"

import React, { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getFacturas, Factura } from "@/components/funciones/funciones"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Printer, Wallet, CalendarDays, ChartBar } from "lucide-react"

export function CuadreCaja() {
    const [periodo, setPeriodo] = useState<"dia" | "semana" | "mes">("dia")
    const facturas = useMemo(() => getFacturas(), [])

    // Obtener fechas clave
    const now = new Date()
    const todayStr = now.toISOString().split("T")[0]
    const todayFormatted = now.toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })

    // Inicio de semana (lunes)
    const startOfWeek = new Date(now)
    const day = startOfWeek.getDay() || 7
    if (day !== 1) startOfWeek.setDate(startOfWeek.getDate() - (day - 1))
    const startOfWeekStr = startOfWeek.toISOString().split("T")[0]

    // Inicio de mes
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Cálculos Dinámicos
    const data = useMemo(() => {
        if (periodo === "dia") {
            const filtered = facturas.filter(f => f.fecha === todayStr)
            return {
                label: `Caja de Hoy (${todayFormatted})`,
                monto: filtered.reduce((acc, f) => acc + f.total, 0),
                count: filtered.length,
                icon: <Wallet className="w-5 h-5 text-blue-500" />,
                color: "blue"
            }
        } else if (periodo === "semana") {
            const filtered = facturas.filter(f => f.fecha >= startOfWeekStr && f.fecha <= todayStr)
            return {
                label: "Ventas de la Semana",
                monto: filtered.reduce((acc, f) => acc + f.total, 0),
                count: filtered.length,
                icon: <ChartBar className="w-5 h-5 text-purple-500" />,
                color: "purple"
            }
        } else {
            const filtered = facturas.filter(f => {
                const d = new Date(f.fecha)
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear
            })
            return {
                label: "Ventas Caja del Mes",
                monto: filtered.reduce((acc, f) => acc + f.total, 0),
                count: filtered.length,
                icon: <CalendarDays className="w-5 h-5 text-emerald-500" />,
                color: "emerald"
            }
        }
    }, [periodo, facturas, todayStr, todayFormatted, startOfWeekStr, currentMonth, currentYear])

    const handlePrint = () => {
        let titulo = ""
        let listado: Factura[] = []

        if (periodo === "dia") {
            titulo = "Cuadre de Caja - Diario"
            listado = facturas.filter(f => f.fecha === todayStr)
        } else if (periodo === "semana") {
            titulo = "Cuadre de Caja - Semanal"
            listado = facturas.filter(f => f.fecha >= startOfWeekStr && f.fecha <= todayStr)
        } else {
            titulo = "Cuadre de Caja - Mensual"
            listado = facturas.filter(f => {
                const d = new Date(f.fecha)
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear
            })
        }

        const printWindow = window.open("", "_blank")
        if (!printWindow) return

        const content = `
      <html>
        <head>
          <title>${titulo}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
            .total-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
            .total-val { font-size: 32px; font-weight: bold; color: #16a34a; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; background: #f1f5f9; padding: 12px; border: 1px solid #e2e8f0; }
            td { padding: 12px; border: 1px solid #e2e8f0; }
            .footer { margin-top: 50px; font-size: 12px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>KipuSoftware</h1>
            <h2>${titulo}</h2>
            <p>Rango: ${data.label}</p>
            <p>Fecha de Impresión: ${new Date().toLocaleString()}</p>
          </div>
          <div class="total-box">
            <p>TOTAL RECAUDADO EN VENTAS</p>
            <div class="total-val">$${data.monto.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <p>${listado.length} facturas emitidas</p>
          </div>
          <table>
            <thead>
              <tr><th>Secuencial</th><th>Fecha</th><th>Cliente</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${listado.map(f => `
                <tr>
                  <td>${f.secuencial}</td>
                  <td>${f.fecha}</td>
                  <td>${f.cliente.razonSocial}</td>
                  <td>$${f.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `
        printWindow.document.write(content)
        printWindow.document.close()
    }

    return (
        <Card className={`border-l-4 ${periodo === 'dia' ? 'border-l-blue-500' :
            periodo === 'semana' ? 'border-l-purple-500' : 'border-l-emerald-500'
            } bg-white dark:bg-slate-900/50 shadow-xl mb-8 overflow-hidden transition-all duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${periodo === 'dia' ? 'bg-blue-500/10' :
                        periodo === 'semana' ? 'bg-purple-500/10' : 'bg-emerald-500/10'
                        }`}>
                        {data.icon}
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                            Cuadre de Caja
                        </CardTitle>
                        <p className="text-xs text-slate-500">{data.label}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={periodo} onValueChange={(v: any) => setPeriodo(v)}>
                        <SelectTrigger className="w-[180px] bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                            <SelectValue placeholder="Seleccionar periodo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dia">Caja Hoy</SelectItem>
                            <SelectItem value="semana">Ventas Semana</SelectItem>
                            <SelectItem value="mes">Caja del Mes</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrint}
                        className="hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700"
                    >
                        <Printer className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white font-numeric">
                        ${data.monto.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className={`text-sm font-medium ${periodo === 'dia' ? 'text-blue-600' :
                        periodo === 'semana' ? 'text-purple-600' : 'text-emerald-600'
                        }`}>
                        ({data.count} facturas)
                    </span>
                </div>

                {periodo === "mes" && (
                    <div className="mt-4 p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Sincronizado con calendario real. Reinicio automático el próximo 1ro de mes.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
