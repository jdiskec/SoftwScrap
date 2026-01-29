"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { JellyfishBackground } from "../background/background"
import { Mail, MessageSquare, Phone, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react"

interface RecuperarAccProps {
    onGoLogin: () => void
}

export function RecuperarAcc({ onGoLogin }: RecuperarAccProps) {
    const [step, setStep] = useState<1 | 2>(1)
    const [identifier, setIdentifier] = useState("")
    const [method, setMethod] = useState<"email" | "sms" | "whatsapp" | null>(null)
    const [isSending, setIsSending] = useState(false)

    const handleSendReset = (selectedMethod: "email" | "sms" | "whatsapp") => {
        if (!identifier) {
            alert("Por favor ingresa tu correo o número de teléfono")
            return
        }
        setMethod(selectedMethod)
        setIsSending(true)

        // Simulación de envío
        setTimeout(() => {
            setIsSending(false)
            setStep(2)
        }, 2000)
    }

    return (
        <JellyfishBackground>
            <div className="w-full flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-slate-700/50 bg-[#0f172a]/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <CardHeader className="space-y-1">
                        <button
                            onClick={onGoLogin}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-4 w-fit group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Volver al inicio
                        </button>
                        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 text-center">
                            Recuperar Acceso
                        </CardTitle>
                        <p className="text-slate-400 text-center text-sm">
                            {step === 1
                                ? "Elige cómo deseas restablecer tu cuenta"
                                : "¡Código enviado con éxito!"}
                        </p>
                    </CardHeader>

                    <CardContent>
                        {step === 1 ? (
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="identifier" className="text-slate-300">Correo o Teléfono</Label>
                                    <Input
                                        id="identifier"
                                        placeholder="ejemplo@correo.com o +593..."
                                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:ring-purple-500"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Métodos de verificación</p>

                                    <Button
                                        variant="outline"
                                        disabled={isSending}
                                        className="h-14 justify-start border-slate-700 bg-slate-900/40 hover:bg-purple-600/20 hover:border-purple-500 group transition-all"
                                        onClick={() => handleSendReset("email")}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                            <Mail className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-slate-200">Vía Correo Electrónico</p>
                                            <p className="text-xs text-slate-500">Recibir link de restauración</p>
                                        </div>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        disabled={isSending}
                                        className="h-14 justify-start border-slate-700 bg-slate-900/40 hover:bg-green-600/20 hover:border-green-500 group transition-all"
                                        onClick={() => handleSendReset("whatsapp")}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                            <MessageSquare className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-slate-200">Vía WhatsApp</p>
                                            <p className="text-xs text-slate-500">Enviar código por mensaje</p>
                                        </div>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        disabled={isSending}
                                        className="h-14 justify-start border-slate-700 bg-slate-900/40 hover:bg-blue-600/20 hover:border-blue-500 group transition-all"
                                        onClick={() => handleSendReset("sms")}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                            <Phone className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-slate-200">Vía SMS Tradicional</p>
                                            <p className="text-xs text-slate-500">Código de seguridad directo</p>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="py-6 flex flex-col items-center text-center animate-in zoom-in duration-500">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                                    <ShieldCheck className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Instrucciones Enviadas</h3>
                                <p className="text-slate-400 text-sm mb-8 px-4">
                                    Hemos enviado los pasos para recuperar tu cuenta a <br />
                                    <span className="text-purple-400 font-mono font-bold mt-2 inline-block bg-purple-400/10 px-3 py-1 rounded-full border border-purple-400/20">
                                        {identifier}
                                    </span>
                                    <br /><br />
                                    Revisa tu bandeja de entrada o mensajes de {method?.toUpperCase()}.
                                </p>
                                <Button
                                    onClick={onGoLogin}
                                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold"
                                >
                                    Regresar al Login
                                </Button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors underline"
                                >
                                    ¿No recibiste nada? Intentar otro método
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </JellyfishBackground>
    )
}
