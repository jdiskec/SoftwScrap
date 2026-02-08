"use client"
import { useState } from "react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

/**
 * Componente principal de fondo que envuelve la aplicación.
 * Permite cambiar entre modo claro y oscuro.
 */
export function Background({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="relative min-h-screen w-full bg-[#f8fafc] dark:bg-slate-900 text-slate-900 dark:text-white z-0 overflow-x-hidden">
        <div className="fixed top-4 right-4 z-[100]">
          <Button
            variant="outline"
            className="backdrop-blur-md bg-white/20 dark:bg-slate-800/20 border-slate-200 dark:border-slate-700 shadow-lg transition-all hover:scale-105"
            onClick={() => setIsDark((v) => !v)}
            aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {isDark ? "🌙 Modo oscuro" : "☀️ Modo claro"}
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}

/**
 * Fondo especializado con temática de Medusa Neón para Login y Register.
 * Ahora simplificado sin animaciones, manteniendo solo el logo.
 */
export function JellyfishBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617]">
      {/* Contenedor de fondo estático */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Logo de fondo (estático) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10 mix-blend-screen">
          <img
            src="/medusa-neon.png"
            alt="Logo Background"
            className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(168,85,247,0.3)]"
          />
        </div>

        {/* Gradientes sutiles estáticos */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Contenido (Formularios) */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}
