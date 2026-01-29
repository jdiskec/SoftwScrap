"use client"
import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"

type CompraDetalle = { descripcion: string; cantidad: number; precioUnitario: number }
type Compra = {
  id: string
  fecha: string
  proveedorNombre: string
  proveedorRuc: string
  documento: string
  detalles: CompraDetalle[]
  total: number
}

type Proveedor = {
  ruc: string
  nombre: string
  telefono: string
  correo: string
}

const COMPRAS_KEY = "facturacion_compras"
const PROVEEDORES_KEY = "facturacion_proveedores"

function loadCompras(): Compra[] {
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(COMPRAS_KEY)
  return raw ? (JSON.parse(raw) as Compra[]) : []
}

function saveCompra(c: Compra) {
  const list = loadCompras()
  list.push(c)
  window.localStorage.setItem(COMPRAS_KEY, JSON.stringify(list))
}

function loadProveedores(): Proveedor[] {
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(PROVEEDORES_KEY)
  return raw ? (JSON.parse(raw) as Proveedor[]) : []
}

function saveProveedor(p: Proveedor) {
  const list = loadProveedores()
  if (list.find(x => x.ruc === p.ruc)) return
  list.push(p)
  window.localStorage.setItem(PROVEEDORES_KEY, JSON.stringify(list))
}

function parseXmlToCompra(xmlText: string): Compra | null {
  try {
    const doc = new DOMParser().parseFromString(xmlText, "text/xml")
    const ruc = doc.querySelector("infoTributaria > ruc")?.textContent || ""
    const razon = doc.querySelector("infoTributaria > razonSocial")?.textContent || ""
    const secuencial = doc.querySelector("infoFactura > secuencial")?.textContent || ""
    const fecha = doc.querySelector("infoFactura > fechaEmision")?.textContent || new Date().toISOString().split("T")[0]
    const items: CompraDetalle[] = []
    doc.querySelectorAll("detalles > detalle").forEach((d) => {
      const descripcion = d.querySelector("descripcion")?.textContent || ""
      const cantidad = Number(d.querySelector("cantidad")?.textContent || "0")
      const precio = Number(d.querySelector("precioUnitario")?.textContent || "0")
      items.push({ descripcion, cantidad, precioUnitario: precio })
    })
    const total = items.reduce((acc, it) => acc + it.cantidad * it.precioUnitario, 0)
    return {
      id: crypto.randomUUID(),
      fecha,
      proveedorNombre: razon,
      proveedorRuc: ruc,
      documento: secuencial,
      detalles: items,
      total,
    }
  } catch {
    return null
  }
}

function parseJsonToCompra(jsonText: string): Compra | null {
  try {
    const data = JSON.parse(jsonText)
    const detallesSrc = Array.isArray(data.detalles) ? data.detalles : []
    const detalles: CompraDetalle[] = detallesSrc.map((d: any) => {
      const descripcion = typeof d.descripcion === "string" ? d.descripcion : String(d.descripcion ?? "")
      const cantidad = typeof d.cantidad === "number" ? d.cantidad : Number(d.cantidad ?? 0)
      const precioUnitario = typeof d.precioUnitario === "number" ? d.precioUnitario : Number(d.precioUnitario ?? 0)
      return { descripcion, cantidad, precioUnitario }
    })
    const total = detalles.reduce((acc, it) => acc + it.cantidad * it.precioUnitario, 0)
    return {
      id: crypto.randomUUID(),
      fecha: String(data.fecha || new Date().toISOString().split("T")[0]),
      proveedorNombre: String(data.proveedorNombre || ""),
      proveedorRuc: String(data.proveedorRuc || ""),
      documento: String(data.documento || ""),
      detalles,
      total,
    }
  } catch {
    return null
  }
}

export function Compras() {
  const [compras, setCompras] = useState<Compra[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])

  useEffect(() => {
    setCompras(loadCompras())
    setProveedores(loadProveedores())
  }, [])

  const [query, setQuery] = useState("")
  const [ingestaOpen, setIngestaOpen] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)
  const [proveedorModalOpen, setProveedorModalOpen] = useState(false)

  // Manual Form State
  const [manualCompra, setManualCompra] = useState({
    fecha: new Date().toISOString().split("T")[0],
    proveedorRuc: "",
    documento: "",
    descripcion: "",
    total: 0
  })

  // New Supplier State
  const [newProv, setNewProv] = useState<Proveedor>({
    ruc: "",
    nombre: "",
    telefono: "",
    correo: ""
  })

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return compras
    return compras.filter(
      (c) =>
        c.proveedorNombre.toLowerCase().includes(q) ||
        c.proveedorRuc.toLowerCase().includes(q) ||
        c.documento.toLowerCase().includes(q) ||
        c.fecha.toLowerCase().includes(q)
    )
  }, [query, compras])

  const onFileSelected = async (file: File) => {
    const text = await file.text()
    const compraXml = parseXmlToCompra(text)
    const compraJson = compraXml ? null : parseJsonToCompra(text)
    const finalCompra = compraXml || compraJson
    if (!finalCompra) {
      alert("No se pudo interpretar el archivo. Use XML del SRI o JSON compatible.")
      return
    }
    saveCompra(finalCompra)
    setCompras(loadCompras())
    setIngestaOpen(false)
  }

  const handleSaveManual = () => {
    const prov = proveedores.find(p => p.ruc === manualCompra.proveedorRuc)
    if (!prov && manualCompra.proveedorRuc) {
      alert("El proveedor no existe. Regístrelo primero.")
      return
    }
    if (!manualCompra.proveedorRuc || !manualCompra.total) {
      alert("Complete los campos obligatorios")
      return
    }

    const nueva: Compra = {
      id: crypto.randomUUID(),
      fecha: manualCompra.fecha,
      proveedorNombre: prov?.nombre || manualCompra.proveedorRuc,
      proveedorRuc: manualCompra.proveedorRuc,
      documento: manualCompra.documento,
      detalles: [{ descripcion: manualCompra.descripcion, cantidad: 1, precioUnitario: manualCompra.total }],
      total: manualCompra.total
    }

    saveCompra(nueva)
    setCompras(loadCompras())
    setManualOpen(false)
    setManualCompra({
      fecha: new Date().toISOString().split("T")[0],
      proveedorRuc: "",
      documento: "",
      descripcion: "",
      total: 0
    })
  }

  const handleSaveProveedor = () => {
    if (!newProv.ruc || !newProv.nombre) {
      alert("RUC y Nombre son obligatorios")
      return
    }
    saveProveedor(newProv)
    setProveedores(loadProveedores())
    setManualCompra(prev => ({ ...prev, proveedorRuc: newProv.ruc }))
    setProveedorModalOpen(false)
    setNewProv({ ruc: "", nombre: "", telefono: "", correo: "" })
  }

  return (
    <>
      <main className="ml-[260px] min-h-screen p-8 bg-slate-100 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Compras</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setManualOpen(true)}>Registrar Manual</Button>
            <Button onClick={() => setIngestaOpen(true)}>Ingresar por factura electrónica</Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">Buscar compras</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label className="text-slate-700 dark:text-slate-300">Filtro</Label>
              <Input placeholder="Proveedor, RUC, documento o fecha" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700">
                <th className="text-left p-3 text-slate-700 dark:text-slate-200">Fecha</th>
                <th className="text-left p-3 text-slate-700 dark:text-slate-200">Proveedor</th>
                <th className="text-left p-3 text-slate-700 dark:text-slate-200">RUC</th>
                <th className="text-left p-3 text-slate-700 dark:text-slate-200">Documento</th>
                <th className="text-right p-3 text-slate-700 dark:text-slate-200">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td className="p-4 text-slate-500 dark:text-slate-400" colSpan={5}>Sin resultados</td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="border-t dark:border-slate-700">
                    <td className="p-3 text-slate-900 dark:text-slate-100">{c.fecha}</td>
                    <td className="p-3 text-slate-900 dark:text-slate-100">{c.proveedorNombre}</td>
                    <td className="p-3 text-slate-900 dark:text-slate-100">{c.proveedorRuc}</td>
                    <td className="p-3 text-slate-900 dark:text-slate-100">{c.documento}</td>
                    <td className="p-3 text-right text-slate-900 dark:text-slate-100">${c.total.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL INGESTA XML/JSON */}
      {ingestaOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Ingresar compra electrónica</h3>
              <Button variant="ghost" size="icon" onClick={() => setIngestaOpen(false)}><X className="h-5 w-5" /></Button>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label className="text-slate-700 dark:text-slate-300">Archivo XML (SRI) o JSON</Label>
                <Input type="file" accept=".xml,.json" onChange={(e) => e.target.files?.[0] && onFileSelected(e.target.files[0])} className="cursor-pointer" />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setIngestaOpen(false)}>Cancelar</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REGISTRO MANUAL */}
      {manualOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Registrar Compra Manual</h3>
              <Button variant="ghost" size="icon" onClick={() => setManualOpen(false)}><X className="h-5 w-5" /></Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Fecha</Label>
                <Input type="date" value={manualCompra.fecha} onChange={e => setManualCompra({ ...manualCompra, fecha: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Nro. Documento</Label>
                <Input placeholder="001-001-000000001" value={manualCompra.documento} onChange={e => setManualCompra({ ...manualCompra, documento: e.target.value })} />
              </div>
              <div className="col-span-2 grid gap-2">
                <Label className="flex justify-between items-center">
                  <span>Proveedor</span>
                  <Button variant="link" size="sm" className="h-auto p-0 text-blue-600" onClick={() => setProveedorModalOpen(true)}>
                    <Plus className="h-3 w-3 mr-1" /> Nuevo Proveedor
                  </Button>
                </Label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900"
                  value={manualCompra.proveedorRuc}
                  onChange={e => setManualCompra({ ...manualCompra, proveedorRuc: e.target.value })}
                >
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map(p => (
                    <option key={p.ruc} value={p.ruc}>{p.nombre} ({p.ruc})</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 grid gap-2">
                <Label>Descripción / Glosa</Label>
                <Input placeholder="Ej: Compra de mercadería" value={manualCompra.descripcion} onChange={e => setManualCompra({ ...manualCompra, descripcion: e.target.value })} />
              </div>
              <div className="col-span-2 grid gap-2">
                <Label>Total</Label>
                <Input type="number" step="0.01" placeholder="0.00" value={manualCompra.total || ""} onChange={e => setManualCompra({ ...manualCompra, total: Number(e.target.value) })} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="outline" onClick={() => setManualOpen(false)}>Cancelar</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSaveManual}>Guardar Compra</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUEVO PROVEEDOR (Pequeño y Eficaz) */}
      {proveedorModalOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Nuevo Proveedor</h3>
            <div className="grid gap-4">
              <div className="grid gap-1">
                <Label className="text-xs">RUC</Label>
                <Input placeholder="1712345678001" value={newProv.ruc} onChange={e => setNewProv({ ...newProv, ruc: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Nombre / Razón Social</Label>
                <Input placeholder="Nombre del proveedor" value={newProv.nombre} onChange={e => setNewProv({ ...newProv, nombre: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Teléfono</Label>
                <Input placeholder="0987654321" value={newProv.telefono} onChange={e => setNewProv({ ...newProv, telefono: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Correo</Label>
                <Input type="email" placeholder="proveedor@example.com" value={newProv.correo} onChange={e => setNewProv({ ...newProv, correo: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" onClick={() => setProveedorModalOpen(false)}>Cerrar</Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSaveProveedor}>Registrar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

