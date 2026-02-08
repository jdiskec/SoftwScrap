"use client"

import { useState, useMemo } from "react"
import { useInventario } from "@/components/admin/inventario/funcioninventario"
import { Input } from "@/components/ui/input"
import { Search, Package, Image as ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import "./combarraini.css"

export default function BarraBusquedaInventario() {
  const { busqueda, setBusqueda, buscarProductos } = useInventario()
  const [focused, setFocused] = useState(false)
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState<string | null>(null)

  const resultados = useMemo(() => {
    return buscarProductos(busqueda).slice(0, 6)
  }, [busqueda, buscarProductos])

  return (
    <section className="barra-inventario">
      <div className="contenedor-busqueda">
        <Search className="icono-busqueda" />
        <Input
          type="text"
          placeholder="Buscar en inventario por nombre, código o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          className="entrada-busqueda"
        />
      </div>
      <div className="contenedor-busqueda mt-2">
        <Search className="icono-busqueda" />
        <Input
          type="text"
          inputMode="numeric"
          placeholder="Código referencial numeral..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          className="entrada-busqueda"
        />
      </div>

      {(focused || busqueda) && (
        <div className="panel-resultados">
          {busqueda && resultados.length > 0 ? (
            <>
              <div className="encabezado-resultados">
                Resultados: {resultados.length}
              </div>
              <ul className="lista-resultados">
                {resultados.map((p) => (
                  <li key={p.id} className="item-resultado">
                    <div className="info-principal">
                      <span className="nombre">{p.nombre}</span>
                      <span className="codigo">{p.codigo}</span>
                    </div>
                    <div className="info-secundaria">
                      <span className="cantidad">
                        <Package className="icono-cantidad" />
                        {p.cantidad}
                      </span>
                      <span className="precio">${p.precio.toFixed(2)}</span>
                      {p.foto && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-blue-600 ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFotoPreviewUrl(p.foto || null);
                          }}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="estado-sin-resultados">
              {busqueda ? "Sin coincidencias" : "Escribe para buscar en tu inventario"}
            </div>
          )}
        </div>
      )}

      {/* Modal de Previsualización para el buscador */}
      {fotoPreviewUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-2xl max-w-sm w-full">
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-3 -right-3 rounded-full shadow-lg z-10"
              onClick={() => setFotoPreviewUrl(null)}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-950">
              <img
                src={fotoPreviewUrl}
                alt="Vista previa"
                className="w-full h-auto max-h-[50vh] object-contain mx-auto"
              />
            </div>
            <div className="p-3 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-blue-600"
                onClick={() => setFotoPreviewUrl(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
