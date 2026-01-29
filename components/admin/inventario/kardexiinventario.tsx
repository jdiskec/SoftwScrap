"use client"

export type TipoDocumento = "compra" | "venta"

export type ItemFactura = {
  codigo: string
  cantidad: number
  precio?: number
  descripcion?: string
  nombre?: string
}

export type FacturaElectronica = {
  tipo: TipoDocumento
  numero: string
  fecha: string
  items: ItemFactura[]
}

export type MovimientoKardex = {
  id: string
  codigo: string
  tipo: TipoDocumento
  cantidad: number
  fecha: string
  referencia: string
  stockAnterior: number
  stockNuevo: number
}

type ProductoLocal = {
  id: string
  nombre: string
  codigo: string
  cantidad: number
  precio: number
  precioConIVA: number
  foto?: string
  descripcion?: string
}

const IVA = 0.15

function leerProductos(): ProductoLocal[] {
  const raw = typeof window !== "undefined" ? window.localStorage.getItem("productos_inventario") : null
  if (!raw) return []
  try {
    return JSON.parse(raw) as ProductoLocal[]
  } catch {
    return []
  }
}

function escribirProductos(productos: ProductoLocal[]) {
  window.localStorage.setItem("productos_inventario", JSON.stringify(productos))
}

function leerKardex(): MovimientoKardex[] {
  const raw = typeof window !== "undefined" ? window.localStorage.getItem("kardex_inventario") : null
  if (!raw) return []
  try {
    return JSON.parse(raw) as MovimientoKardex[]
  } catch {
    return []
  }
}

function escribirKardex(movs: MovimientoKardex[]) {
  window.localStorage.setItem("kardex_inventario", JSON.stringify(movs))
}

function calcPrecioConIVA(precio: number): number {
  return Number((precio * (1 + IVA)).toFixed(2))
}

export class KardexInventario {
  static registrarFacturaElectronica(factura: FacturaElectronica): { movimientos: MovimientoKardex[]; errores: string[] } {
    const productos = leerProductos()
    const kardex = leerKardex()
    const errores: string[] = []
    const movimientos: MovimientoKardex[] = []

    for (const item of factura.items) {
      const idx = productos.findIndex((p) => p.codigo === item.codigo)
      const existente = idx >= 0 ? productos[idx] : undefined
      const anterior = existente?.cantidad ?? 0
      const delta = factura.tipo === "compra" ? item.cantidad : -item.cantidad
      const nuevo = Math.max(0, anterior + delta)

      if (!existente && factura.tipo === "venta") {
        errores.push(`Venta con producto inexistente: ${item.codigo}`)
        continue
      }

      if (!existente && factura.tipo === "compra") {
        const basePrecio = item.precio ?? 0
        const nuevoProd: ProductoLocal = {
          id: Date.now().toString() + item.codigo,
          nombre: item.nombre || item.codigo,
          codigo: item.codigo,
          cantidad: nuevo,
          precio: basePrecio,
          precioConIVA: calcPrecioConIVA(basePrecio),
          descripcion: item.descripcion || "",
        }
        productos.push(nuevoProd)
      } else {
        const basePrecio = item.precio ?? existente!.precio
        productos[idx] = {
          ...existente!,
          cantidad: nuevo,
          precio: basePrecio,
          precioConIVA: calcPrecioConIVA(basePrecio),
        }
      }

      const mov: MovimientoKardex = {
        id: `${factura.numero}-${item.codigo}-${Date.now()}`,
        codigo: item.codigo,
        tipo: factura.tipo,
        cantidad: item.cantidad,
        fecha: factura.fecha,
        referencia: factura.numero,
        stockAnterior: anterior,
        stockNuevo: nuevo,
      }
      movimientos.push(mov)
      kardex.push(mov)
    }

    escribirProductos(productos)
    escribirKardex(kardex)

    return { movimientos, errores }
  }

  static obtenerKardex(): MovimientoKardex[] {
    return leerKardex()
  }
}
