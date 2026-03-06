"use client"

import { useState } from "react"
import { Cliente, saveCliente, validarCedula, validarRUC } from "@/components/funciones/funciones"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Save, X, Phone, Mail, MapPin, CreditCard, Building } from "lucide-react"

interface RegistrarClienteProps {
    onClose: () => void
    onSuccess: () => void
    clienteEdit?: Cliente | null
}

export function RegistrarCliente({ onClose, onSuccess, clienteEdit }: RegistrarClienteProps) {
    const [formData, setFormData] = useState<Cliente>(clienteEdit || {
        identificacion: "",
        tipoIdentificacion: "cedula",
        razonSocial: "",
        direccion: "",
        telefono: "",
        email: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.identificacion) newErrors.identificacion = "Requerido"
        else if (formData.tipoIdentificacion === "cedula" && !validarCedula(formData.identificacion)) {
            newErrors.identificacion = "Cédula inválida"
        } else if (formData.tipoIdentificacion === "ruc" && !validarRUC(formData.identificacion)) {
            newErrors.identificacion = "RUC inválido"
        }

        if (!formData.razonSocial) newErrors.razonSocial = "Requerido"
        if (!formData.email) newErrors.email = "Requerido"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validate()) {
            saveCliente(formData)
            onSuccess()
        }
    }

    return (
        <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 animate-in fade-in zoom-in duration-300">
            <CardHeader className="bg-blue-600 dark:bg-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <UserPlus className="w-6 h-6" />
                    {clienteEdit ? "Editar Cliente" : "Registrar Nuevo Cliente"}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tipo y Identificación */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-blue-500" />
                                Tipo de Identificación
                            </Label>
                            <Select
                                value={formData.tipoIdentificacion}
                                onValueChange={(val) => setFormData({ ...formData, tipoIdentificacion: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cedula">Cédula</SelectItem>
                                    <SelectItem value="ruc">RUC</SelectItem>
                                    <SelectItem value="pasaporte">Pasaporte</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-blue-500" />
                                Número de Identificación
                            </Label>
                            <Input
                                placeholder="Ej: 1722..."
                                value={formData.identificacion}
                                onChange={(e) => setFormData({ ...formData, identificacion: e.target.value })}
                                className={errors.identificacion ? "border-red-500" : ""}
                                disabled={!!clienteEdit}
                            />
                            {errors.identificacion && <p className="text-xs text-red-500 font-medium">{errors.identificacion}</p>}
                        </div>

                        {/* Razón Social */}
                        <div className="space-y-2 md:col-span-2">
                            <Label className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-blue-500" />
                                Nombres Completos / Razón Social
                            </Label>
                            <Input
                                placeholder="Ej: Juan Pérez o Empresa S.A."
                                value={formData.razonSocial}
                                onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                                className={errors.razonSocial ? "border-red-500" : ""}
                            />
                            {errors.razonSocial && <p className="text-xs text-red-500 font-medium">{errors.razonSocial}</p>}
                        </div>

                        {/* Email y Teléfono */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-500" />
                                Correo Electrónico
                            </Label>
                            <Input
                                type="email"
                                placeholder="ejemplo@correo.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-blue-500" />
                                Teléfono de Contacto
                            </Label>
                            <Input
                                placeholder="Ej: 099..."
                                value={formData.telefono}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            />
                        </div>

                        {/* Dirección */}
                        <div className="space-y-2 md:col-span-2">
                            <Label className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                Dirección Completa
                            </Label>
                            <Input
                                placeholder="Calle principal, secundaria y número de casa"
                                value={formData.direccion}
                                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="outline" onClick={onClose} className="gap-2">
                            <X className="w-4 h-4" />
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-8">
                            <Save className="w-4 h-4" />
                            {clienteEdit ? "Actualizar" : "Guardar Cliente"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

function Hash({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="4" x2="20" y1="9" y2="9" />
            <line x1="4" x2="20" y1="15" y2="15" />
            <line x1="10" x2="8" y1="3" y2="21" />
            <line x1="16" x2="14" y1="3" y2="21" />
        </svg>
    )
}
