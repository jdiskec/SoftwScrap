"use client"

import { useState, useEffect } from "react"

/**
 * Interfaz que define la estructura de un Producto en el inventario.
 */
export interface Producto {
  id: string
  nombre: string
  codigo: string
  cantidad: number
  precio: number // Precio de costo sin IVA
  precioConIVA: number
  foto?: string
  descripcion?: string
  // Campos adicionales para registro contable detallado
  subtotal?: number
  descuento?: number
  subIva0?: number
  subIva5?: number
  subIva15?: number
  totalIva?: number
  otrosIrbp?: number
  total?: number // Total acumulado (precio con IVA * cantidad)
  metodoPago?: "efectivo" | "transferencia" | "cheque"
  pvp?: number // Precio de Venta al Público sugerido
}

/**
 * Hook personalizado para gestionar el estado y la persistencia del inventario.
 * Proporciona funciones CRUD para productos y gestión de stock.
 */
export function useInventario() {
  /**
   * Calcula el precio final incluyendo el IVA (15% en Ecuador).
   * @param precio Precio base.
   * @returns Precio con IVA redondeado a 2 decimales.
   */
  const calcularPrecioConIVA = (precio: number): number => {
    const IVA = 0.15
    return Number((precio * (1 + IVA)).toFixed(2))
  }

  // Estado principal de productos, inicializado desde LocalStorage
  const [productos, setProductos] = useState<Producto[]>(() => {
    if (typeof window === "undefined") return []
    const productosGuardados = window.localStorage.getItem("productos_inventario")
    if (productosGuardados) {
      try {
        const parsed = JSON.parse(productosGuardados) as Producto[]
        // Aseguramos la consistencia de tipos al cargar
        return parsed.map(p => ({
          ...p,
          precio: Number(Number(p.precio).toFixed(2)),
          precioConIVA: Number(Number(p.precioConIVA).toFixed(2))
        }))
      } catch {
        return []
      }
    }
    return []
  })

  // Estado para el término de búsqueda global
  const [busqueda, setBusqueda] = useState("")

  // Guardado automático en cada cambio del inventario
  useEffect(() => {
    localStorage.setItem("productos_inventario", JSON.stringify(productos))
  }, [productos])

  /**
   * Agrega un nuevo producto calculando automáticamente su ID y precio con IVA.
   */
  const agregarProducto = (producto: Omit<Producto, "id" | "precioConIVA">) => {
    const nuevoProducto: Producto = {
      ...producto,
      id: Date.now().toString(),
      precioConIVA: calcularPrecioConIVA(producto.precio)
    }
    setProductos(prev => [...prev, nuevoProducto])
  }

  /**
   * Actualiza los datos de un producto existente.
   */
  const actualizarProducto = (id: string, productoActualizado: Partial<Producto>) => {
    setProductos(prev => prev.map(p =>
      p.id === id
        ? {
          ...p,
          ...productoActualizado,
          precioConIVA: productoActualizado.precio ? calcularPrecioConIVA(productoActualizado.precio) : p.precioConIVA
        }
        : p
    ))
  }

  /**
   * Elimina un producto por su ID.
   */
  const eliminarProducto = (id: string) => {
    setProductos(prev => prev.filter(p => p.id !== id))
  }

  /**
   * Filtra productos por nombre, código o descripción.
   */
  const buscarProductos = (termino: string): Producto[] => {
    if (!termino) return productos
    const terminoLower = termino.toLowerCase()
    return productos.filter(p =>
      p.nombre.toLowerCase().includes(terminoLower) ||
      p.codigo.toLowerCase().includes(terminoLower) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(terminoLower))
    )
  }

  /**
   * Obtiene un producto buscando por su código de barras/artículo.
   */
  const obtenerProductoPorCodigo = (codigo: string): Producto | undefined => {
    return productos.find(p => p.codigo === codigo)
  }

  /**
   * Incrementa o decrementa el stock de un producto.
   */
  const actualizarStock = (codigo: string, cantidad: number) => {
    setProductos(prev => prev.map(p =>
      p.codigo === codigo
        ? { ...p, cantidad: Math.max(0, p.cantidad + cantidad) }
        : p
    ))
  }

  /**
   * Fuerza la recarga de productos desde el almacenamiento local.
   */
  const reloadProductos = () => {
    if (typeof window === "undefined") return
    const raw = window.localStorage.getItem("productos_inventario")
    if (!raw) return
    try {
      const list = JSON.parse(raw) as Producto[]
      setProductos(list)
    } catch {
      return
    }
  }

  return {
    productos,
    busqueda,
    setBusqueda,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    buscarProductos,
    obtenerProductoPorCodigo,
    actualizarStock,
    reloadProductos
  }
}
