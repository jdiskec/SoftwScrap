"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import bancopichincha from "@/assets/bancopichincha.png"
import bancopacifico from "@/assets/bancopacifico.png"
import bancoguayaquil from "@/assets/bancoguaya.png"
import bancoaustro from "@/assets/bancoaustro.png"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useInventario } from "../admin/inventario/funcioninventario"
import { TablaInventario } from "../admin/inventario/tablainventario"
import BarraBusquedaInventario from "../admin/compbarraini/combarraini"
import IconImpt from "../iconimpt/iconimpt"
import { CopyFac, type FacturaData } from "@/components/admin/copyfac/copyfact"
import { getFacturas, getClientes } from "@/components/funciones/funciones"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPrint } from "@fortawesome/free-solid-svg-icons"
import { faCartPlus } from "@fortawesome/free-solid-svg-icons"
import { CrearFactura } from "@/components/admin/facturas/crearfactura/crearfactura"
import { CuadreCaja } from "./cuadrecaja"
import { usePermisos } from "../admin/permisos/permisos"

/** 
 * Configuración visual del gráfico (colores y etiquetas) 
 */
const chartConfig = {
  ventas: {
    label: "Ventas ($)",
    color: "hsl(var(--chart-1))",
  },
  items: {
    label: "Productos Vendidos",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

/**
 * Componente que renderiza un gráfico de líneas interactivo.
 * Permite alternar entre visualización de Ventas e Items.
 */
export function ChartLineInteractive({ data }: { data: any[] }) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("ventas")

  // Cálculo de totales históricos para el encabezado
  const total = React.useMemo(
    () => ({
      ventas: data.reduce((acc, curr) => acc + curr.ventas, 0),
      items: data.reduce((acc, curr) => acc + curr.items, 0),
    }),
    [data]
  )

  return (
    <Card className="py-4 sm:py-0 ">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Rendimiento del Sistema</CardTitle>
          <CardDescription>
            Actividad económica de los últimos 30 días
          </CardDescription>
        </div>
        <div className="flex">
          {["ventas", "items"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-purple-200 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-black even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl font-numeric">
                  {chart === "ventas" ? `$${total[chart].toFixed(2)}` : total[chart].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("es-EC", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-EC", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={chartConfig[activeChart].color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

/**
 * Componente Principal de Inicio (Dashboard).
 * Centraliza la vista general de la empresa, incluyendo métricas bancarias,
 * herramientas de facturación rápida y el inventario contable.
 */
export function Inicio() {
  const { esAdmin } = usePermisos()
  const [printOpen, setPrintOpen] = React.useState(false)
  const [facturaPrint, setFacturaPrint] = React.useState<FacturaData | null>(null)

  // Iconos de FontAwesome para botones de acción 
  const byPrefixAndName = { fajdr: { print: faPrint }, fadr: { "cart-plus": faCartPlus } }

  const [crearOpen, setCrearOpen] = React.useState(false)

  /**
   * Dispara un evento personalizado para cambiar la vista en el componente principal.
   */
  const handleNavigate = (view: string) => {
    window.dispatchEvent(new CustomEvent("app:navigate", { detail: view }))
  }

  // Hook de inventario para acceder a los datos globales
  const { productos, eliminarProducto, actualizarProducto } = useInventario()

  // --- Datos Reales del Sistema ---
  const facturas = React.useMemo(() => getFacturas(), [crearOpen]) // Refresca si se cierra el creador de factura

  // 1. Facturas este mes
  const facturasEsteMes = React.useMemo(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    return facturas.filter(f => {
      const d = new Date(f.fecha)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    }).length
  }, [facturas])

  // 2. Ingresos Totales
  const ingresosTotales = React.useMemo(() => {
    return facturas.reduce((acc, f) => acc + f.total, 0)
  }, [facturas])

  // 3. Clientes Registrados
  const clientesTotales = React.useMemo(() => getClientes().length, [])

  // 4. Métricas de Inventario Real
  const valorTotalInventario = React.useMemo(() => {
    return productos.reduce((acc, p) => acc + (Number(p.precio || 0) * Number(p.cantidad || 0)), 0)
  }, [productos])

  const stockTotal = React.useMemo(() => {
    return productos.reduce((acc, p) => acc + Number(p.cantidad || 0), 0)
  }, [productos])

  // 5. Datos del Gráfico (Últimos 30 días)
  const realChartData = React.useMemo(() => {
    const data = []
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]

      const dayFacturas = facturas.filter(f => f.fecha === dateStr)
      const totalVentas = dayFacturas.reduce((acc, f) => acc + f.total, 0)
      const totalItems = dayFacturas.reduce((acc, f) => acc + f.detalles.reduce((a, it) => a + Number(it.cantidad || 0), 0), 0)

      data.push({
        date: dateStr,
        ventas: totalVentas,
        items: totalItems
      })
    }
    return data
  }, [facturas])

  /**
   * Maneja el evento de edición de un producto.
   */
  const handleEditar = (producto: any) => {
    console.log("Editar producto:", producto)
  }

  /**
   * Abre el formulario de creación rápida de factura.
   */
  const handleQuickCreateFactura = () => {
    setCrearOpen(true)
  }

  /**
   * Obtiene la última factura registrada y abre el modal de impresión.
   */
  const handlePrintLatest = () => {
    const facturasList = getFacturas()
    if (!facturasList.length) {
      window.alert("No hay facturas registradas para imprimir")
      return
    }
    const f = facturasList[facturasList.length - 1]
    const data: FacturaData = {
      secuencial: f.secuencial,
      fecha: f.fecha,
      cliente: f.cliente,
      detalles: f.detalles,
      subtotal: f.subtotal,
      totalDescuento: f.totalDescuento,
      baseImponible: f.baseImponible,
      valorIVA: f.valorIVA,
      total: f.total,
    }
    setFacturaPrint(data)
    setPrintOpen(true)
  }

  return (
    <>
      <main className="ml-[260px] min-h-screen p-8 bg-slate-100 dark:bg-slate-900">
        {/* Encabezado General */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Panel de Inicio</h1>
          <h6 className="text-sm font-bold text-slate-900 dark:text-slate-100">facture made by MedusaWareAccountants@</h6>
        </div>

        {/* Módulo de Cuadre de Caja (Solo Admin) */}
        {esAdmin && <CuadreCaja />}

        {/* Sección de Tarjetas Bancarias (Información para cobros) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { img: bancopichincha, name: "Banco Pichincha" },
            { img: bancopacifico, name: "Banco Pacífico" },
            { img: bancoguayaquil, name: "Banco Guayaquil" },
            { img: bancoaustro, name: "Banco del Austro" }
          ].map((banco, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
              <Image src={banco.img} alt={banco.name} width={50} height={50} className="rounded-md" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{banco.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Info transferencias</p>
              </div>
            </div>
          ))}
        </div>

        {/* Barra de Búsqueda y Utilidades Rápidas */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div>
            <BarraBusquedaInventario />
          </div>
          <div>
            <IconImpt />
          </div>
        </div>
        {/* Sección Dinámica: Formulario de Creación de Factura */}
        {crearOpen && (
          <section className="mt-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-emerald-500/20">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold dark:text-slate-100">Crear factura rápida</h2>
              <Button variant="ghost" onClick={() => setCrearOpen(false)}>Cerrar</Button>
            </div>
            <CrearFactura />
          </section>
        )}
        {/* Sección de Acciones Rápidas */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-slate-100">Acciones Rápidas</h2>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => handleNavigate("reportes")}>Ver Reportes</Button>
            {esAdmin && (
              <Button variant="secondary" onClick={() => handleNavigate("permisos")}>Gestionar Usuarios</Button>
            )}
            <Button variant="outline" className="text-slate-900 dark:text-slate-100 gap-2" onClick={handlePrintLatest}>
              <FontAwesomeIcon icon={byPrefixAndName.fajdr["print"]} />
              Imprimir última factura
            </Button>
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleQuickCreateFactura}>
              <FontAwesomeIcon icon={byPrefixAndName.fadr["cart-plus"]} />
              Crear factura
            </Button>
          </div>
        </div>

        {/* Tabla del Inventario Principal */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 dark:text-slate-100">Inventario Detallado</h2>
          <TablaInventario
            productos={productos}
            onEditar={handleEditar}
            onEliminar={eliminarProducto}
          />
        </div>



        {/* Widgets de Métricas Rápidas (Solo Admin) */}
        {esAdmin && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8 mt-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="font-medium text-slate-500 dark:text-slate-400">Facturas este mes</h3>
              <p className="text-2xl font-bold mt-2 dark:text-slate-100 font-numeric">{facturasEsteMes}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="font-medium text-slate-500 dark:text-slate-400">Ingresos Totales</h3>
              <p className="text-2xl font-bold mt-2 dark:text-slate-100 font-numeric">${ingresosTotales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="font-medium text-slate-500 dark:text-slate-400">Valor Inventario</h3>
              <p className="text-2xl font-bold mt-2 text-emerald-600 dark:text-emerald-400 font-numeric">${valorTotalInventario.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="font-medium text-slate-500 dark:text-slate-400">Stock Total</h3>
              <p className="text-2xl font-bold mt-2 text-blue-600 dark:text-blue-400 font-numeric">{stockTotal}</p>
            </div>
          </div>
        )}

        {/* Gráfico de Tendencias (Solo Admin) */}
        {esAdmin && (
          <div className="mb-8">
            <ChartLineInteractive data={realChartData} />
          </div>
        )}
      </main>

      {/* Modal de Impresión (Copia de Factura) */}
      <CopyFac open={printOpen} onClose={() => setPrintOpen(false)} factura={facturaPrint} />
    </>
  )
}

