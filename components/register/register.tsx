"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { JellyfishBackground } from "../background/background"

export function Register({ onGoLogin, onLoginSuccess }: { onGoLogin: () => void, onLoginSuccess?: () => void }) {
  const [activeTab, setActiveTab] = useState<"usuario" | "empresa">("usuario")
  const [showGoogleSelector, setShowGoogleSelector] = useState(false)
  const [usuarioForm, setUsuarioForm] = useState({ nombre: "", email: "", password: "", confirm: "" })
  const [empresaForm, setEmpresaForm] = useState({ razon: "", ruc: "", email: "" })
  const [errorLocal, setErrorLocal] = useState("")

  const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleRegistroUsuario = () => {
    setErrorLocal("")
    if (!usuarioForm.nombre || !usuarioForm.email || !usuarioForm.password) {
      setErrorLocal("Todos los campos son obligatorios")
      return
    }
    if (!validarEmail(usuarioForm.email)) {
      setErrorLocal("Formato de correo electrónico inválido")
      return
    }
    if (usuarioForm.password.length < 8) {
      setErrorLocal("La contraseña debe tener al menos 8 caracteres")
      return
    }
    if (usuarioForm.password !== usuarioForm.confirm) {
      setErrorLocal("Las contraseñas no coinciden")
      return
    }
    alert("Usuario registrado con éxito (Simulado)")
    if (onLoginSuccess) onLoginSuccess()
  }

  const handleRegistroEmpresa = () => {
    setErrorLocal("")
    if (!empresaForm.razon || !empresaForm.ruc || !empresaForm.email) {
      setErrorLocal("Todos los campos son obligatorios")
      return
    }
    if (!validarEmail(empresaForm.email)) {
      setErrorLocal("Formato de correo electrónico inválido")
      return
    }
    if (empresaForm.ruc.length !== 13) {
      setErrorLocal("El RUC debe tener 13 dígitos")
      return
    }
    alert("Empresa registrada con éxito (Simulado)")
    if (onLoginSuccess) onLoginSuccess()
  }

  const mockAccounts = [
    { name: "Juan Pérez", email: "juan.perez@gmail.com", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan" },
    { name: "Maria Garcia", email: "m.garcia@gmail.com", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" }
  ]

  const selectAccount = (account: typeof mockAccounts[0]) => {
    setShowGoogleSelector(false)
    if (onLoginSuccess) {
      alert(`Registrando con ${account.email}...`)
      setTimeout(onLoginSuccess, 1000)
    } else {
      alert(`Cuenta ${account.email} seleccionada para el registro.`)
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
        <Card className="w-full max-w-lg border-slate-700/50 bg-[#0f172a]/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Crear Cuenta
            </CardTitle>
            <p className="text-slate-400 text-sm">Únete a KipuSoftware y gestiona tu negocio</p>
          </CardHeader>
          <CardContent>
            {errorLocal && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-medium animate-in fade-in zoom-in duration-200">
                ⚠️ {errorLocal}
              </div>
            )}

            <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl mb-6 border border-slate-700/50">
              <button
                type="button"
                onClick={() => { setActiveTab("usuario"); setErrorLocal(""); }}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "usuario"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
              >
                Cuenta Personal
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("empresa"); setErrorLocal(""); }}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "empresa"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
              >
                Cuenta Empresa
              </button>
            </div>

            {activeTab === "usuario" && (
              <div className="grid gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nombre" className="text-slate-300">Nombre</Label>
                    <Input
                      id="nombre"
                      className="bg-slate-900/50 border-slate-700 text-white"
                      placeholder="Ej: Juan Pérez"
                      value={usuarioForm.nombre}
                      onChange={(e) => setUsuarioForm({ ...usuarioForm, nombre: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-slate-300">Correo</Label>
                    <Input
                      id="email"
                      type="email"
                      className="bg-slate-900/50 border-slate-700 text-white"
                      placeholder="juan@ejemplo.com"
                      value={usuarioForm.email}
                      onChange={(e) => setUsuarioForm({ ...usuarioForm, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    className="bg-slate-900/50 border-slate-700 text-white"
                    placeholder="••••••••"
                    value={usuarioForm.password}
                    onChange={(e) => setUsuarioForm({ ...usuarioForm, password: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm" className="text-slate-300">Confirmar Contraseña</Label>
                  <Input
                    id="confirm"
                    type="password"
                    className="bg-slate-900/50 border-slate-700 text-white"
                    placeholder="••••••••"
                    value={usuarioForm.confirm}
                    onChange={(e) => setUsuarioForm({ ...usuarioForm, confirm: e.target.value })}
                  />
                </div>
                <Button
                  onClick={handleRegistroUsuario}
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold"
                >
                  Completar Registro
                </Button>
                <div className="flex justify-center border-t border-slate-700/50 pt-4">
                  <Button variant="link" onClick={onGoLogin} className="text-purple-400 hover:text-purple-300 transition-colors">
                    ¿Ya tienes una cuenta? Inicia sesión
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "empresa" && (
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="razon" className="text-slate-300">Razón Social</Label>
                  <Input
                    id="razon"
                    className="bg-slate-900/50 border-slate-700 text-white"
                    placeholder="Nombre legal de la empresa"
                    value={empresaForm.razon}
                    onChange={(e) => setEmpresaForm({ ...empresaForm, razon: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ruc" className="text-slate-300">RUC</Label>
                    <Input
                      id="ruc"
                      className="bg-slate-900/50 border-slate-700 text-white"
                      placeholder="1790000000001"
                      value={empresaForm.ruc}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, ruc: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email-emp" className="text-slate-300">Correo Corporativo</Label>
                    <Input
                      id="email-emp"
                      type="email"
                      className="bg-slate-900/50 border-slate-700 text-white"
                      placeholder="contacto@empresa.com"
                      value={empresaForm.email}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, email: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleRegistroEmpresa}
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold"
                >
                  Registrar Entidad
                </Button>
                <Button variant="ghost" onClick={onGoLogin} className="w-full text-slate-400 hover:text-white">
                  Regresar al inicio de sesión
                </Button>
              </div>
            )}
            {/* Separador y Opciones de Registro Social */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-700/50"></div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">O continúa con</span>
              <div className="flex-1 h-px bg-slate-700/50"></div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
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
                Registrarse con Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </JellyfishBackground>
  )
}
