"use client"
import { useState, useEffect } from "react"
import { Background } from "@/components/background/background"
import { Navbar } from "@/components/navbar/navbar"
import { Inicio } from "@/components/inicio/inicio"
import { Facturas } from "@/components/admin/facturas/facturas"
import { Inventario } from "@/components/admin/inventario/inventario"
import { Login } from "@/components/login/login"
import { Clientes } from "@/components/admin/clientes/clientes"
import { ConfigurarCuenta } from "@/components/admin/configcuenta/configurarcuenta"
import { Register } from "@/components/register/register"
import { Compras } from "@/components/admin/compras/compras"
import Proveedores from "@/components/admin/proveedores/proveedores"
import Reportes from "@/components/admin/reportes/reportes"
import { RecuperarAcc } from "@/components/register/recuperaracc"
import { PanelDePermisosUI } from "@/components/admin/paneldepermisos/paneldepermisos"
import { ConfiguracionPanel } from "@/components/configuracion/configuracion"

/**
 * Componente Raíz (Root Page) de la Aplicación.
 * Gestiona el estado global de autenticación y el enrutamiento interno mediante "views".
 */
export default function Home() {
  /** Determina si el usuario ha pasado la pantalla de login */
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  /** Define qué sección del dashboard se está visualizando */
  const [view, setView] = useState<"inicio" | "facturas" | "clientes" | "inventario" | "compras" | "proveedores" | "reportes" | "configuracion" | "configurar-cuenta" | "permisos">("inicio")

  /** URL de la imagen de perfil del usuario (Mockup) */
  const [imagenPerfil, setImagenPerfil] = useState("https://github.com/shadcn.png")

  /** Controla si se muestra el formulario de Login, Registro o Recuperación */
  const [authView, setAuthView] = useState<"login" | "register" | "recuperar">("login")

  type View = "inicio" | "facturas" | "clientes" | "inventario" | "compras" | "proveedores" | "reportes" | "configuracion" | "configurar-cuenta" | "permisos"

  /** Cambia el estado a autenticado */
  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  /** Limpia la sesión y vuelve al inicio */
  const handleLogout = () => {
    setIsAuthenticated(false)
    setView("inicio")
  }

  /**
   * Listener para permitir navegación programática desde otros componentes
   * mediante eventos personalizados de JS.
   */
  useEffect(() => {
    const onNavigate = (ev: Event) => {
      const target = (ev as CustomEvent<View>).detail
      if (target) setView(target)
    }
    window.addEventListener("app:navigate", onNavigate)
    return () => {
      window.removeEventListener("app:navigate", onNavigate)
    }
  }, [])

  // -- Renderizado de Pantallas de Autenticación --
  if (!isAuthenticated) {
    if (authView === "login") {
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onGoRegister={() => setAuthView("register")}
          onGoRecover={() => setAuthView("recuperar")}
        />
      )
    }
    if (authView === "register") {
      return <Register onGoLogin={() => setAuthView("login")} onLoginSuccess={handleLoginSuccess} />
    }
    return <RecuperarAcc onGoLogin={() => setAuthView("login")} />
  }

  // -- Renderizado del Dashboard Principal --
  return (
    <Background>
      {/* Sidebar de navegación común a todas las vistas */}
      <Navbar active={view} onNavigate={setView} onLogout={handleLogout} imagenPerfil={imagenPerfil} />

      {/* Contenedores de vista condicionales */}
      {view === "inicio" && <Inicio />}
      {view === "facturas" && <Facturas />}
      {view === "inventario" && <Inventario />}
      {view === "clientes" && <Clientes />}

      {view === "compras" && (
        <Compras />
      )}

      {view === "proveedores" && (
        <Proveedores />
      )}

      {view === "reportes" && (
        <Reportes />
      )}

      {view === "permisos" && (
        <main className="ml-[260px] min-h-screen">
          <PanelDePermisosUI />
        </main>
      )}

      {view === "configuracion" && (
        <main className="ml-[260px] min-h-screen p-8 bg-slate-100 dark:bg-slate-900">
          <ConfiguracionPanel />
        </main>
      )}

      {view === "configurar-cuenta" && (
        <main className="ml-[260px] min-h-screen p-8">
          <ConfigurarCuenta imagenPerfil={imagenPerfil} setImagenPerfil={setImagenPerfil} />
        </main>
      )}
    </Background>
  )
}
