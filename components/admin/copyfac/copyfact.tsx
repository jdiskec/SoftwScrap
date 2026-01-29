"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type Cliente = {
  identificacion: string
  tipoIdentificacion: string
  razonSocial: string
  direccion: string
  telefono: string
  email: string
}

type Detalle = {
  id: string
  descripcion: string
  cantidad: number | string
  precioUnitario: number | string
  descuento: number | string
}

export type FacturaData = {
  secuencial: string
  fecha: string
  cliente: Cliente
  detalles: Detalle[]
  subtotal: number
  totalDescuento: number
  baseImponible: number
  valorIVA: number
  ivaRate?: number // Tasa opcional para retrocompatibilidad
  total: number
}

type Driver = {
  id: string
  nombre: string
  tipo: "termica" | "laser"
  papel: "80mm" | "A4" | "Carta"
}

const DRIVERS_KEY = "printer_drivers"

function loadDrivers(): Driver[] {
  const raw = typeof window !== "undefined" ? window.localStorage.getItem(DRIVERS_KEY) : null
  if (!raw) return []
  try {
    return JSON.parse(raw) as Driver[]
  } catch {
    return []
  }
}

function saveDrivers(list: Driver[]) {
  window.localStorage.setItem(DRIVERS_KEY, JSON.stringify(list))
}

function printInPopup(factura: FacturaData) {
  const w = window.open("", "_blank", "width=800,height=900")
  if (!w) return
  const items = factura.detalles
    .map(
      (d) =>
        `<tr><td class="num">${d.cantidad}</td><td>${d.descripcion}</td><td class="right num">$${Number(d.precioUnitario).toFixed(
          2
        )}</td><td class="right num">$${(Number(d.cantidad) * Number(d.precioUnitario) - Number(d.descuento)).toFixed(2)}</td></tr>`
    )
    .join("")
  const html = `
  <html>
    <head>
      <title>Factura ${factura.secuencial}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
        h1 { font-size: 18px; margin: 0 0 8px; }
        h2 { font-size: 14px; margin: 16px 0 8px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #cbd5e1; padding: 6px; }
        th { background: #f1f5f9; text-align: left; }
        .totales { margin-top: 12px; width: 100%; font-size: 12px; }
        .totales tr td { padding: 4px; }
        .right { text-align: right; }
        .num { font-family: 'Courier New', Courier, monospace; font-variant-numeric: tabular-nums; }
      </style>
    </head>
    <body>
      <h1>Factura ${factura.secuencial}</h1>
      <div>Fecha: ${factura.fecha}</div>
      <h2>Cliente</h2>
      <div>${factura.cliente.razonSocial} - ${factura.cliente.identificacion}</div>
      <div>${factura.cliente.direccion}</div>
      <h2>Detalle</h2>
      <table>
        <thead><tr><th>Cant.</th><th>Descripción</th><th class="right">Precio Unit.</th><th class="right">Total</th></tr></thead>
        <table>
          <tbody>${items}</tbody>
        </table>
      </table>
      <table class="totales">
        <tr><td>Subtotal</td><td class="right num">$${factura.subtotal.toFixed(2)}</td></tr>
        <tr><td>Descuento</td><td class="right num">-$${factura.totalDescuento.toFixed(2)}</td></tr>
        <tr><td>Base Imponible</td><td class="right num">$${factura.baseImponible.toFixed(2)}</td></tr>
        <tr><td>IVA (${((factura.ivaRate ?? 0.15) * 100).toFixed(0)}%)</td><td class="right num">$${factura.valorIVA.toFixed(2)}</td></tr>
        <tr><td><strong>Total</strong></td><td class="right num"><strong>$${factura.total.toFixed(2)}</strong></td></tr>
      </table>
      <script>
        window.onload = () => { window.print(); setTimeout(() => window.close(), 300); }
      </script>
    </body>
  </html>`
  w.document.write(html)
  w.document.close()
}

function facturaToXml(factura: FacturaData) {
  const detalles = factura.detalles
    .map(
      (d) =>
        `<detalle><descripcion>${d.descripcion}</descripcion><cantidad>${d.cantidad}</cantidad><precioUnitario>${Number(d.precioUnitario).toFixed(
          2
        )}</precioUnitario><descuento>${Number(d.descuento).toFixed(2)}</descuento></detalle>`
    )
    .join("")
  const xml = `<factura><infoTributaria><ruc>${factura.cliente.identificacion}</ruc><razonSocial>${factura.cliente.razonSocial}</razonSocial></infoTributaria><infoFactura><secuencial>${factura.secuencial}</secuencial><fechaEmision>${factura.fecha}</fechaEmision><direccionComprador>${factura.cliente.direccion}</direccionComprador><telefonoComprador>${factura.cliente.telefono}</telefonoComprador><emailComprador>${factura.cliente.email}</emailComprador><subtotal>${factura.subtotal.toFixed(
    2
  )}</subtotal><totalDescuento>${factura.totalDescuento.toFixed(2)}</totalDescuento><baseImponible>${factura.baseImponible.toFixed(
    2
  )}</baseImponible><valorIVA>${factura.valorIVA.toFixed(2)}</valorIVA><total>${factura.total.toFixed(
    2
  )}</total></infoFactura><detalles>${detalles}</detalles></factura>`
  return xml
}

export function CopyFac({
  open,
  onClose,
  factura
}: {
  open: boolean
  onClose: () => void
  factura: FacturaData | null
}) {
  const initialDrivers = typeof window !== "undefined" ? loadDrivers() : []
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers)
  const [selected, setSelected] = useState<string>(initialDrivers[0]?.id || "")
  const [manageMode, setManageMode] = useState(false)
  const [nuevo, setNuevo] = useState<Driver>({
    id: "",
    nombre: "",
    tipo: "termica",
    papel: "80mm"
  })

  const selectedDriver = useMemo(() => drivers.find((d) => d.id === selected) || null, [selected, drivers])

  const agregarDriver = () => {
    if (!nuevo.nombre) return
    const d: Driver = { ...nuevo, id: Date.now().toString() }
    const list = [...drivers, d]
    setDrivers(list)
    saveDrivers(list)
    setSelected(d.id)
    setNuevo({ id: "", nombre: "", tipo: "termica", papel: "80mm" })
  }

  const imprimir = () => {
    if (!factura) return
    printInPopup(factura)
    onClose()
  }
  const guardarXmlCliente = () => {
    if (!factura) return
    const key = `cliente_xml_${factura.cliente.identificacion}`
    const listRaw = window.localStorage.getItem(key)
    const list = listRaw ? (JSON.parse(listRaw) as string[]) : []
    const xml = facturaToXml(factura)
    const next = [...list, xml]
    window.localStorage.setItem(key, JSON.stringify(next))
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
      <div className="w-full max-w-xl rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-700 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Imprimir factura</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label className="text-slate-700 dark:text-slate-300">Impresora</Label>
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona impresora" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.nombre} · {d.tipo} · {d.papel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button className="gap-2" onClick={imprimir} disabled={!factura}>
              Imprimir ahora
            </Button>
            <Button variant="outline" onClick={guardarXmlCliente} disabled={!factura}>
              Guardar XML en cliente
            </Button>
            <Button variant="outline" onClick={() => setManageMode((v) => !v)}>
              Administrar impresoras
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cerrar
            </Button>
          </div>

          {manageMode && (
            <div className="grid gap-3 border-t pt-4 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Nombre</Label>
                  <Input value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
                </div>
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Tipo</Label>
                  <Select value={nuevo.tipo} onValueChange={(v) => setNuevo({ ...nuevo, tipo: v as Driver["tipo"] })}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="termica">Térmica</SelectItem>
                      <SelectItem value="laser">Láser</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Papel</Label>
                  <Select value={nuevo.papel} onValueChange={(v) => setNuevo({ ...nuevo, papel: v as Driver["papel"] })}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="80mm">80mm</SelectItem>
                      <SelectItem value="A4">A4</SelectItem>
                      <SelectItem value="Carta">Carta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={agregarDriver}>
                  Registrar impresora
                </Button>
              </div>

              <div className="grid gap-2">
                <Label className="text-slate-700 dark:text-slate-300">Impresoras registradas</Label>
                <div className="grid gap-2">
                  {drivers.length === 0 ? (
                    <div className="text-sm text-slate-500 dark:text-slate-400">No hay impresoras registradas</div>
                  ) : (
                    drivers.map((d) => (
                      <div key={d.id} className="flex items-center justify-between rounded-md border p-2 dark:border-slate-700">
                        <div className="text-sm">
                          {d.nombre} · {d.tipo} · {d.papel}
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            const list = drivers.filter((x) => x.id !== d.id)
                            setDrivers(list)
                            saveDrivers(list)
                            if (selected === d.id) setSelected(list[0]?.id || "")
                          }}
                        >
                          Eliminar
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
