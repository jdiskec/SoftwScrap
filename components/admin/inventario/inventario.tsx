"use client"

import { useRef, useState } from "react"
import { useInventario, Producto } from "./funcioninventario"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Plus, Edit, Trash2, Package, DollarSign, Hash,
  Image as ImageIcon, FileText, Printer, CheckCircle, Clock, X
} from "lucide-react"
import { KardexInventario, type FacturaElectronica, type MovimientoKardex } from "./kardexiinventario"
import { TablaInventario } from "./tablainventario"
import { usePermisos } from "../permisos/permisos"

export function Inventario() {
  const { esAdmin } = usePermisos()
  const {
    busqueda,
    setBusqueda,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    buscarProductos,
    reloadProductos,
    productos // Agregamos productos al hook para referencia
  } = useInventario()

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null)
  const [fotoError, setFotoError] = useState<string | null>(null)
  const [arrastrandoImagen, setArrastrandoImagen] = useState(false)
  const inputFotoRef = useRef<HTMLInputElement | null>(null)
  const [importOpen, setImportOpen] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  // Estado para el reporte de ingresos (Admin)
  const [reporteIngresosOpen, setReporteIngresosOpen] = useState(false)

  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    cantidad: "" as string | number,
    precio: "" as string | number,
    descripcion: "",
    foto: "",
    subtotal: "" as string | number,
    descuento: "" as string | number,
    subIva0: "" as string | number,
    subIva5: "" as string | number,
    subIva15: "" as string | number,
    totalIva: "" as string | number,
    otrosIrbp: "" as string | number,
    total: "" as string | number,
    metodoPago: "efectivo" as "efectivo" | "transferencia" | "cheque",
    pvp: "" as string | number
  })

  const productosFiltrados = buscarProductos(busqueda)

  const abrirSelectorDeImagen = () => {
    inputFotoRef.current?.click()
  }

  const leerArchivoComoDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result ?? ""))
      reader.onerror = () => reject(new Error("No se pudo leer la imagen"))
      reader.readAsDataURL(file)
    })

  const cargarImagenDesdeArchivo = async (file: File | null | undefined) => {
    setFotoError(null)
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setFotoError("Selecciona un archivo de imagen válido.")
      return
    }

    const maxBytes = 3 * 1024 * 1024
    if (file.size > maxBytes) {
      setFotoError("La imagen es muy pesada (máximo 3MB).")
      return
    }

    try {
      const dataUrl = await leerArchivoComoDataUrl(file)
      setFormData((prev) => ({ ...prev, foto: dataUrl }))
    } catch {
      setFotoError("No se pudo cargar la imagen. Intenta con otra.")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSubmit = {
      ...formData,
      cantidad: Number(formData.cantidad) || 0,
      precio: Number(formData.precio) || 0,
      subtotal: Number(formData.subtotal) || 0,
      descuento: Number(formData.descuento) || 0,
      subIva0: Number(formData.subIva0) || 0,
      subIva5: Number(formData.subIva5) || 0,
      subIva15: Number(formData.subIva15) || 0,
      totalIva: Number(formData.totalIva) || 0,
      otrosIrbp: Number(formData.otrosIrbp) || 0,
      total: Number(formData.total) || 0,
      pvp: Number(formData.pvp) || 0
    }
    if (productoEditando) {
      actualizarProducto(productoEditando.id, dataToSubmit)
      setProductoEditando(null)
    } else {
      agregarProducto(dataToSubmit)
    }
    setFotoError(null)
    setFormData({
      nombre: "",
      codigo: "",
      cantidad: "",
      precio: "",
      descripcion: "",
      foto: "",
      subtotal: "",
      descuento: "",
      subIva0: "",
      subIva5: "",
      subIva15: "",
      totalIva: "",
      otrosIrbp: "",
      total: "",
      metodoPago: "efectivo",
      pvp: ""
    })
    setMostrarFormulario(false)
  }

  const handleEditar = (producto: Producto) => {
    setFotoError(null)
    setProductoEditando(producto)
    setFormData({
      nombre: producto.nombre,
      codigo: producto.codigo,
      cantidad: producto.cantidad,
      precio: producto.precio,
      descripcion: producto.descripcion || "",
      foto: producto.foto || "",
      subtotal: producto.subtotal || "",
      descuento: producto.descuento || "",
      subIva0: producto.subIva0 || "",
      subIva5: producto.subIva5 || "",
      subIva15: producto.subIva15 || "",
      totalIva: producto.totalIva || "",
      otrosIrbp: producto.otrosIrbp || "",
      total: producto.total || "",
      metodoPago: (producto.metodoPago as "efectivo" | "transferencia" | "cheque") || "efectivo",
      pvp: producto.pvp || ""
    })
    setMostrarFormulario(true)
  }

  const handleCancelar = () => {
    setMostrarFormulario(false)
    setProductoEditando(null)
    setFotoError(null)
    setFormData({
      nombre: "",
      codigo: "",
      cantidad: "",
      precio: "",
      descripcion: "",
      foto: "",
      subtotal: "",
      descuento: "",
      subIva0: "",
      subIva5: "",
      subIva15: "",
      totalIva: "",
      otrosIrbp: "",
      total: "",
      metodoPago: "efectivo",
      pvp: ""
    })
  }

  const integrarFacturaElectronica = (factura: FacturaElectronica) => {
    const res = KardexInventario.registrarFacturaElectronica(factura)
    if (res.errores.length) {
      console.warn(res.errores.join("; "))
    }
    setImportOpen(false)
    setImportError(null)
    reloadProductos()
  }
  const parseXmlFactura = (text: string): FacturaElectronica | null => {
    try {
      const doc = new DOMParser().parseFromString(text, "text/xml")
      const numero = doc.querySelector("infoFactura > secuencial")?.textContent || `XML-${Date.now()}`
      const fecha = doc.querySelector("infoFactura > fechaEmision")?.textContent || new Date().toISOString().split("T")[0]
      const items: { codigo: string; cantidad: number; precio?: number; descripcion?: string; nombre?: string }[] = []
      doc.querySelectorAll("detalles > detalle").forEach((d) => {
        const codigo = d.querySelector("codigoPrincipal")?.textContent || d.querySelector("codigoAuxiliar")?.textContent || ""
        const cantidad = Number(d.querySelector("cantidad")?.textContent || "0")
        const precio = Number(d.querySelector("precioUnitario")?.textContent || "0")
        const descripcion = d.querySelector("descripcion")?.textContent || ""
        items.push({ codigo, cantidad, precio, descripcion, nombre: descripcion })
      })
      return { tipo: "compra", numero, fecha, items }
    } catch {
      return null
    }
  }
  const parseJsonFactura = (text: string): FacturaElectronica | null => {
    try {
      const data = JSON.parse(text)
      const numero = String(data.numero || `JSON-${Date.now()}`)
      const fecha = String(data.fecha || new Date().toISOString().split("T")[0])
      const src = Array.isArray(data.items) ? data.items : []
      const items = src.map((it: unknown) => {
        const o = it as { codigo?: unknown; cantidad?: unknown; precio?: unknown; descripcion?: unknown; nombre?: unknown }
        const codigo = typeof o.codigo === "string" ? o.codigo : String(o.codigo ?? "")
        const cantidad = typeof o.cantidad === "number" ? o.cantidad : Number(o.cantidad ?? 0)
        const precio = typeof o.precio === "number" ? o.precio : Number(o.precio ?? 0)
        const descripcion = typeof o.descripcion === "string" ? o.descripcion : String(o.descripcion ?? "")
        const nombre = typeof o.nombre === "string" ? o.nombre : descripcion
        return { codigo, cantidad, precio, descripcion, nombre }
      })
      return { tipo: "compra", numero, fecha, items }
    } catch {
      return null
    }
  }
  const parseCsvFactura = (text: string): FacturaElectronica | null => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    if (lines.length < 2) return null
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const idxCodigo = header.indexOf("codigo")
    const idxCantidad = header.indexOf("cantidad")
    const idxPrecio = header.indexOf("precio")
    const idxNombre = header.indexOf("nombre")
    const idxDescripcion = header.indexOf("descripcion")
    if (idxCodigo < 0 || idxCantidad < 0) return null
    const items = lines.slice(1).map((l) => {
      const cols = l.split(",")
      const codigo = String(cols[idxCodigo] ?? "")
      const cantidad = Number(cols[idxCantidad] ?? "0")
      const precio = idxPrecio >= 0 ? Number(cols[idxPrecio] ?? "0") : undefined
      const nombre = idxNombre >= 0 ? String(cols[idxNombre] ?? "") : undefined
      const descripcion = idxDescripcion >= 0 ? String(cols[idxDescripcion] ?? "") : undefined
      return { codigo, cantidad, precio, nombre, descripcion }
    })
    const numero = `CSV-${Date.now()}`
    const fecha = new Date().toISOString().split("T")[0]
    return { tipo: "compra", numero, fecha, items }
  }
  const onImportFile = async (file: File) => {
    setImportError(null)
    const text = await file.text()
    let fac: FacturaElectronica | null = null
    const ext = file.name.toLowerCase()
    if (ext.endsWith(".xml")) fac = parseXmlFactura(text)
    else if (ext.endsWith(".json")) fac = parseJsonFactura(text)
    else if (ext.endsWith(".csv")) fac = parseCsvFactura(text)
    else fac = parseJsonFactura(text) || parseXmlFactura(text) || parseCsvFactura(text)
    if (!fac) {
      setImportError("No se pudo interpretar el archivo. Use XML SRI, JSON o CSV con columnas: codigo,cantidad,precio,nombre,descripcion.")
      return
    }
    integrarFacturaElectronica(fac)
  }

  const handleImprimirReporteIngresos = () => {
    const movs = KardexInventario.obtenerKardex().filter(m => m.tipo === "compra")
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const content = `
      <html>
        <head>
          <title>Reporte de Mercadería Recibida</title>
          <style>
            body { font-family: sans-serif; padding: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f4f4f4; }
            .header { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>KipuSoftware - Control de Inventario</h2>
            <h3>Reporte de Mercadería Recibida (Compras)</h3>
            <p>Generado el: ${new Date().toLocaleString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Código</th>
                <th>Referencia/Factura</th>
                <th>Cant. Recibida</th>
                <th>Stock Nuevo</th>
              </tr>
            </thead>
            <tbody>
              ${movs.map(m => `
                <tr>
                  <td>${m.fecha}</td>
                  <td>${m.codigo}</td>
                  <td>${m.referencia}</td>
                  <td>${m.cantidad}</td>
                  <td>${m.stockNuevo}</td>
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
    <main className="ml-[260px] min-h-screen p-0 bg-slate-100 dark:bg-slate-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">Inventario</h1>

        {/* Barra de búsqueda y botón agregar */}
        <div className="flex gap-4 mb-6">
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="max-w-md"
          />
          <Button onClick={() => setMostrarFormulario(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Agregar Producto
          </Button>
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            Ingresar por archivo (XML/JSON/CSV)
          </Button>
          {esAdmin && (
            <Button variant="secondary" className="gap-2 bg-slate-800 text-white hover:bg-slate-700" onClick={() => setReporteIngresosOpen(true)}>
              <FileText className="w-4 h-4" />
              Reporte de Ingresos
            </Button>
          )}
        </div>

        {/* Formulario de producto */}
        {mostrarFormulario && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{productoEditando ? "Editar Producto" : "Nuevo Producto"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre</label>
                    <Input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Código</label>
                    <Input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cantidad</label>
                    <Input
                      type="number"
                      value={formData.cantidad}
                      onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                      min="0"
                      required
                      className="font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Precio Costo</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      min="0"
                      required
                      className="font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">PVP (Normal)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.pvp}
                      onChange={(e) => setFormData({ ...formData, pvp: e.target.value })}
                      min="0"
                      className="font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtotal</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.subtotal}
                      onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                      className="font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Descuento</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.descuento}
                      onChange={(e) => setFormData({ ...formData, descuento: e.target.value })}
                      className="font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sub IVA 0%</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.subIva0}
                      onChange={(e) => setFormData({ ...formData, subIva0: e.target.value })}
                      className="font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sub IVA 5%</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.subIva5}
                      onChange={(e) => setFormData({ ...formData, subIva5: e.target.value })}
                      className="font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sub IVA 15%</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.subIva15}
                      onChange={(e) => setFormData({ ...formData, subIva15: e.target.value })}
                      className="font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Total IVAs</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.totalIva}
                      onChange={(e) => setFormData({ ...formData, totalIva: e.target.value })}
                      className="font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Otros/IRBP</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.otrosIrbp}
                      onChange={(e) => setFormData({ ...formData, otrosIrbp: e.target.value })}
                      className="font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Total</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.total}
                      onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                      className="font-numeric font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Método de Pago</label>
                    <select
                      value={formData.metodoPago}
                      onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value as any })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Descripción</label>
                  <Input
                    type="text"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Imagen del producto</label>
                  <input
                    ref={inputFotoRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      cargarImagenDesdeArchivo(file)
                      e.currentTarget.value = ""
                    }}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={abrirSelectorDeImagen}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        abrirSelectorDeImagen()
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setArrastrandoImagen(true)
                    }}
                    onDragLeave={() => setArrastrandoImagen(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setArrastrandoImagen(false)
                      const file = e.dataTransfer.files?.[0]
                      cargarImagenDesdeArchivo(file)
                    }}
                    className={[
                      "w-full rounded-md border border-dashed p-4 transition-colors",
                      "bg-background",
                      arrastrandoImagen ? "border-primary" : "border-input",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-md border border-input bg-muted">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Arrastra y suelta una imagen aquí o presiona para elegir
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Compatible en móvil y PC (JPG, PNG, WEBP)
                        </p>
                      </div>
                      <Button type="button" variant="outline" className="gap-2" onClick={abrirSelectorDeImagen}>
                        <ImageIcon className="h-4 w-4" />
                        Cargar imagen
                      </Button>
                    </div>
                  </div>

                  {fotoError && <p className="text-sm text-red-600">{fotoError}</p>}

                  {formData.foto && (
                    <div className="flex items-start gap-3 rounded-md border border-input p-3">
                      <img
                        src={formData.foto}
                        alt="Vista previa"
                        className="h-20 w-20 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Vista previa</p>
                        <p className="text-xs text-muted-foreground">La imagen se guardará con el producto</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData((prev) => ({ ...prev, foto: "" }))}
                      >
                        Quitar
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    {productoEditando ? "Actualizar" : "Guardar"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancelar}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de productos */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {productosFiltrados.map((producto) => (
            <Card key={producto.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{producto.nombre}</CardTitle>
                    <p className="text-sm text-muted-foreground">{producto.codigo}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditar(producto)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {producto.foto && (
                  <div className="mb-3">
                    <img
                      src={producto.foto}
                      alt={producto.nombre}
                      className="w-full h-32 object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Cantidad: <span className="font-numeric">{producto.cantidad}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Precio: <span className="font-numeric">${producto.precio.toFixed(2)}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-green-600">
                      Precio con IVA: <span className="font-numeric">${producto.precioConIVA.toFixed(2)}</span>
                    </span>
                  </div>
                </div>

                {producto.descripcion && (
                  <p className="text-sm text-muted-foreground mt-3">
                    {producto.descripcion}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {productosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {busqueda ? "No se encontraron productos" : "No hay productos en el inventario"}
            </p>
            {!busqueda && (
              <Button onClick={() => setMostrarFormulario(true)} className="mt-4">
                Agregar tu primer producto
              </Button>
            )}
          </div>
        )}

        <TablaInventario
          productos={productosFiltrados}
          onEditar={handleEditar}
          onEliminar={eliminarProducto}
        />
      </div>
      {importOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
          <div className="w-full max-w-xl rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-700 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Ingresar al Kardex desde archivo</h3>
            <div className="grid gap-3">
              <Input type="file" accept=".xml,.json,.csv" onChange={(e) => e.target.files?.[0] && onImportFile(e.target.files[0])} />
              {importError && <div className="text-sm text-red-600">{importError}</div>}
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setImportOpen(false)}>Cerrar</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REPORTE DE INGRESOS (SOLO ADMIN) */}
      {reporteIngresosOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b dark:border-slate-700">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Confirmación de Mercadería Recibida
                </CardTitle>
                <p className="text-sm text-slate-500">Historial de productos ingresados al sistema vía compras</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleImprimirReporteIngresos} className="gap-2">
                  <Printer className="w-4 h-4" /> Imprimir
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setReporteIngresosOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-auto">
              <div className="min-w-full inline-block align-middle">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Código</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Referencia</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Cant. Recibida</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                    {KardexInventario.obtenerKardex()
                      .filter(m => m.tipo === "compra")
                      .reverse()
                      .map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Clock className="w-3 h-3 text-slate-400" /> {m.fecha}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-slate-100">{m.codigo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{m.referencia}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-numeric text-blue-600 font-bold">+{m.cantidad}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="px-2 py-1 text-[10px] font-bold bg-green-100 text-green-700 rounded-full dark:bg-green-900/30 dark:text-green-400">
                              CONFIRMADO
                            </span>
                          </td>
                        </tr>
                      ))}
                    {KardexInventario.obtenerKardex().filter(m => m.tipo === "compra").length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                          No hay registros de mercadería recibida aún.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
