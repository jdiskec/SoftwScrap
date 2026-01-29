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
 * Crea una atmósfera inmersiva con medusas animadas y luces de neón.
 */
export function JellyfishBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617]">
      {/* Contenedor de medusas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Medusa Principal Animada */}
        <div className="absolute top-1/4 left-[-200px] w-96 h-96 opacity-60 mix-blend-screen animate-float-main">
          <img src="/medusa-neon.png" alt="Jellyfish Main" className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
        </div>

        {/* Medusas Secundarias */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute opacity-20 mix-blend-screen animate-float-delayed`}
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${10 + Math.random() * 80}%`,
              width: `${100 + Math.random() * 150}px`,
              height: `${100 + Math.random() * 150}px`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            <img src="/medusa-neon.png" alt="Jellyfish bg" className="w-full h-full object-contain filter hue-rotate-[30deg] brightness-125" />
          </div>
        ))}

        {/* Luces Neón y Gradientes */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow delay-700" />
      </div>

      {/* Contenido (Formularios) */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>

      <style jsx global>{`
        @keyframes float-main {
          0% { transform: translate(0, 0) rotate(0deg); left: -200px; }
          40% { transform: translate(100px, 50px) rotate(15deg); }
          100% { transform: translate(120vw, 100px) rotate(30deg); left: 100%; }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) rotate(5deg); }
          50% { transform: translate(30px, -30px) rotate(-5deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-float-main {
          animation: float-main 25s linear infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 15s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
