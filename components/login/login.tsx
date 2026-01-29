"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { JellyfishBackground } from "@/components/background/background"

/** 
 * Propiedades del componente de inicio de sesión. 
 */
interface LoginProps {
  onLoginSuccess: () => void; // Callback ejecutado tras autenticación exitosa.
  onGoRegister: () => void;   // Callback para navegar a la pantalla de registro.
  onGoRecover: () => void;    // Callback para navegar a recuperación de cuenta.
}

/**
 * Componente que gestiona el acceso de usuarios al sistema.
 * Actualmente implementa una validación estática para fines de demostración.
 */
export function Login({ onLoginSuccess, onGoRegister, onGoRecover }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showGoogleSelector, setShowGoogleSelector] = useState(false)

  const mockAccounts = [
    { name: "Juan Pérez", email: "juan.perez@gmail.com", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan" },
    { name: "Maria Garcia", email: "m.garcia@gmail.com", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" }
  ]

  const selectAccount = (account: typeof mockAccounts[0]) => {
    setShowGoogleSelector(false)
    alert(`Iniciando sesión con ${account.email}...`)
    setTimeout(onLoginSuccess, 1000)
  }

  /**
   * Ejecuta la lógica de validación de credenciales.
   */
  const handleLogin = () => {
    // Simulación de autenticación (Credenciales de prueba)
    if (email === "admin@test.com" && password === "password") {
      setError("")
      onLoginSuccess()
    } else {
      setError("Correo o contraseña incorrectos")
    }
  }

  return (
    <JellyfishBackground>
      {/* Selector de Cuentas de Google (Simulado) */}
      {showGoogleSelector && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white dark:bg-slate-950 sm:bg-black/40 sm:backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full h-full sm:h-auto sm:max-w-[400px] sm:rounded-lg shadow-2xl flex flex-col p-8 sm:p-10 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-center mb-6">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-center text-slate-900 dark:text-white mb-2">Elegir una cuenta</h2>
            <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-8">para continuar en <span className="text-blue-600 font-semibold">KipuSoftware</span></p>

            <div className="space-y-1">
              {mockAccounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => selectAccount(acc)}
                  className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors border-t border-slate-100 dark:border-slate-800 first:border-0"
                >
                  <img src={acc.image} alt={acc.name} className="w-8 h-8 rounded-full bg-slate-100" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{acc.name}</p>
                    <p className="text-xs text-slate-500">{acc.email}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={() => setShowGoogleSelector(false)}
                className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors border-t border-slate-100 dark:border-slate-800"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="text-slate-400">👤</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Usar otra cuenta</p>
                </div>
              </button>
            </div>

            <div className="mt-auto sm:mt-10 flex flex-col gap-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Para continuar, Google compartirá tu nombre, dirección de correo electrónico, preferencia de idioma y foto de perfil con KipuSoftware. Consulta la <span className="text-blue-600 cursor-pointer">Política de Privacidad</span> y las <span className="text-blue-600 cursor-pointer">Condiciones del Servicio</span>.
              </p>
              <Button variant="ghost" className="text-slate-400 self-center" onClick={() => setShowGoogleSelector(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-slate-700/50 bg-[#0f172a]/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 p-0.5 shadow-lg shadow-purple-500/20">
                <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                  <img src="/medusa-neon.png" alt="Logo" className="w-12 h-12 object-contain" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 text-center">
              Bienvenido de nuevo
            </CardTitle>
            <p className="text-slate-400 text-center text-sm">Ingresa tus credenciales para continuar</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-300">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="admin@test.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" text-slate-300>Contraseña</Label>
                  <button
                    type="button"
                    onClick={onGoRecover}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}
              <div className="space-y-3">
                <Button
                  onClick={handleLogin}
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Entrar al Sistema
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-700"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0f172a] px-2 text-slate-500">O también puedes</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={onGoRegister}
                  className="w-full h-11 border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                >
                  Crear una nueva cuenta
                </Button>
              </div>

              {/* Separador y Opciones de Inicio Social */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-700/50"></div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">O entrar con</span>
                <div className="flex-1 h-px bg-slate-700/50"></div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className="w-full h-11 border-slate-700 bg-slate-900/30 text-slate-300 hover:bg-slate-800 hover:text-white transition-all gap-3"
                  onClick={() => setShowGoogleSelector(true)}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continuar con Google
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </JellyfishBackground>
  )
}
