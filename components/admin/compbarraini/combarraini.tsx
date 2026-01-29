 "use client"
 
 import { useState, useMemo } from "react"
 import { useInventario } from "@/components/admin/inventario/funcioninventario"
 import { Input } from "@/components/ui/input"
 import { Search, Package } from "lucide-react"
 import "./combarraini.css"
 
 export default function BarraBusquedaInventario() {
   const { busqueda, setBusqueda, buscarProductos } = useInventario()
   const [focused, setFocused] = useState(false)
 
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
     </section>
   )
 }
