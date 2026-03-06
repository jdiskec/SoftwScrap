 "use client"
 
 import { useMemo } from "react"
 import { useInventario } from "@/components/admin/inventario/funcioninventario"
 import { Package } from "lucide-react"
 import "./iconimpt.css"
 
 export default function IconImpt() {
   const { busqueda, buscarProductos } = useInventario()
 
   const resultados = useMemo(() => {
     return buscarProductos(busqueda).slice(0, 12)
   }, [busqueda, buscarProductos])
 
   const handleDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
     const p = resultados[idx]
     const payload = {
       codigo: p.codigo,
       nombre: p.nombre,
       cantidad: 1,
       precio: p.precio,
       descripcion: p.descripcion || "",
       foto: p.foto || "",
     }
     e.dataTransfer.setData("application/json", JSON.stringify(payload))
     e.dataTransfer.effectAllowed = "copyMove"
   }
 
   return (
     <section className="icon-panel">
       <div className="icon-panel-header">Resultados</div>
       <div className="icon-grid">
         {busqueda && resultados.length === 0 ? (
           <div className="icon-empty">Sin coincidencias</div>
         ) : (
           resultados.map((p, i) => (
             <div
               key={p.id}
               className="icon-item"
               draggable
               onDragStart={(e) => handleDragStart(e, i)}
             >
               <div className="icon-thumb">
                 {p.foto ? (
                   <img src={p.foto} alt={p.nombre} />
                 ) : (
                   <Package className="thumb-icon" />
                 )}
               </div>
               <div className="icon-info">
                 <span className="icon-name">{p.nombre}</span>
                 <span className="icon-code">{p.codigo}</span>
               </div>
             </div>
           ))
         )}
       </div>
     </section>
   )
 }
