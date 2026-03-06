'use client'

import React from 'react'
import './cuadricula.css'
import { useInventario } from '../inventario/funcioninventario'
import { Image as ImageIcon } from 'lucide-react'

export default function CuadriculaInventario() {
  const { productos, agregarProducto, actualizarProducto } = useInventario()

  const onDragOver = (e) => {
    e.preventDefault()
  }

  const onDrop = (e) => {
    e.preventDefault()
    const raw = e.dataTransfer.getData('application/json')
    if (!raw) return
    try {
      const data = JSON.parse(raw)
      const existente = productos.find((p) => p.codigo === data.codigo)
      if (!existente) {
        agregarProducto({
          nombre: data.nombre || data.codigo,
          codigo: data.codigo,
          cantidad: Number(data.cantidad || 1),
          precio: Number(data.precio || 0),
          descripcion: data.descripcion || '',
          foto: data.foto || ''
        })
      } else {
        actualizarProducto(existente.id, {
          cantidad: Math.max(0, Number(existente.cantidad) + Number(data.cantidad || 1)),
          precio: Number(data.precio ?? existente.precio),
          descripcion: data.descripcion ?? existente.descripcion,
          foto: data.foto ?? existente.foto
        })
      }
    } catch {
    }
  }

  return (
    <section className="tabla-inventario">
      <h2 className="titulo">Tabla de Inventario</h2>
      <div className="tabla-wrapper" onDragOver={onDragOver} onDrop={onDrop}>
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Código</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Precio con IVA</th>
              <th>Descripción</th>
              <th className="col-imagen">Imagen</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td className="vacio" colSpan={7}>No hay productos en el inventario</td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td className="font-numeric">{p.codigo}</td>
                  <td>
                    <span className="cantidad-badge font-numeric">{p.cantidad}</span>
                  </td>
                  <td className="font-numeric text-right">${Number(p.precio).toFixed(2)}</td>
                  <td className="font-numeric text-right">${Number(p.precioConIVA).toFixed(2)}</td>
                  <td className="descripcion">{p.descripcion || '-'}</td>
                  <td className="imagen-cell">
                    {p.foto ? (
                      <img
                        src={p.foto}
                        alt={p.nombre}
                        className="miniatura"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <span className="icono">
                        <ImageIcon className="icono-img" />
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
