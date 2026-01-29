import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Store } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxesStacked } from "@fortawesome/free-solid-svg-icons";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { faAddressBook } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import kipu01 from "@/assets/kipu01.png";
import { usePermisos } from "@/components/admin/permisos/permisos";
import { faUsersGear } from "@fortawesome/free-solid-svg-icons";

/**
 * Union type que define todas las secciones navegables de la aplicación.
 */
type View = "inicio" | "facturas" | "clientes" | "inventario" | "compras" | "proveedores" | "reportes" | "configuracion" | "configurar-cuenta" | "permisos";

/**
 * Componente de navegación lateral (Sidebar).
 * Permite al usuario desplazarse por los diferentes módulos del sistema.
 * 
 * @param active - La sección que está actualmente activa en pantalla.
 * @param onNavigate - Función callback para cambiar de sección.
 * @param onLogout - Función callback para cerrar la sesión actual.
 * @param imagenPerfil - URL o base64 de la imagen del usuario logueado.
 */
export function Navbar({
  active,
  onNavigate,
  onLogout,
  imagenPerfil,
}: {
  active: View
  onNavigate: (v: View) => void
  onLogout: () => void
  imagenPerfil: string
}) {
  const { esAdmin } = usePermisos();

  return (
    <aside className="w-[260px] h-screen fixed left-0 top-0 border-r-4 border-[#358dff] dark:border-[#358dff] shadow-xl bg-slate-50/90 dark:bg-slate-900/90 flex flex-col p-6 z-50">
      {/* Logotipo de la Empresa */}
      <div className="mb-4 grid place-items-center cursor-pointer" onClick={() => onNavigate("inicio")}>
        <Image src={kipu01} alt="Kipu" width={100} height={100} className="rounded-xl shadow-md" priority />
      </div>
      <div className="text-xl font-bold mb-8 text-slate-900 dark:text-slate-100">Facturación</div>

      {/* Menú de Navegación Principal */}
      <nav className="flex flex-col gap-2">
        <Button variant="outline" className="w-full justify-start text-base" onClick={() => onNavigate("inicio")} data-active={active === "inicio"}>
          <Store className="h-4 w-4" />
          Inicio
        </Button>
        <Button variant="outline" className="w-full justify-start text-base" onClick={() => onNavigate("inventario")} data-active={active === "inventario"}>
          <FontAwesomeIcon icon={faBoxesStacked} />
          Inventario
        </Button>
        <Button variant="outline" className="w-full justify-start text-base" onClick={() => onNavigate("facturas")} data-active={active === "facturas"}>
          <FontAwesomeIcon icon={faFileInvoiceDollar} />
          Facturas
        </Button>
        <Button variant="outline" className="w-full justify-start text-base" onClick={() => onNavigate("clientes")} data-active={active === "clientes"}>
          <FontAwesomeIcon icon={faAddressBook} />
          Clientes
        </Button>
        <Button variant="outline" className="w-full justify-start text-base" onClick={() => onNavigate("compras")} data-active={active === "compras"}>
          <FontAwesomeIcon icon={faCartShopping} />
          Compras
        </Button>
        <Button variant="outline" className="w-full justify-start text-base" onClick={() => onNavigate("proveedores")} data-active={active === "proveedores"}>
          <FontAwesomeIcon icon={faTruck} />
          Proveedores
        </Button>
        <Button variant="outline" className="w-full justify-start text-base" onClick={() => onNavigate("reportes")} data-active={active === "reportes"}>
          <FontAwesomeIcon icon={faChartLine} />
          Reportes
        </Button>
        {esAdmin && (
          <Button
            variant="outline"
            className="w-full justify-start text-base text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-900/50 dark:hover:bg-indigo-900/20"
            onClick={() => onNavigate("permisos")}
            data-active={active === "permisos"}
          >
            <FontAwesomeIcon icon={faUsersGear} />
            Administrar Empleados
          </Button>
        )}
      </nav>

      {/* Sección Inferior: Usuario y Cerrar Sesión */}
      <div className="mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 cursor-pointer" onClick={() => onNavigate("configurar-cuenta")}>
            <AvatarImage src={imagenPerfil} alt="Perfil" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Usuario</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Session Activa</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout} className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
