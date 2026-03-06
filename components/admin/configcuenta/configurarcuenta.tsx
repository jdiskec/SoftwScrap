"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const codigosCelular = [
  { codigo: "+593", pais: "Ecuador" },
  { codigo: "+1", pais: "Estados Unidos" },
  { codigo: "+34", pais: "España" },
  { codigo: "+51", pais: "Perú" },
  { codigo: "+57", pais: "Colombia" },
  { codigo: "+56", pais: "Chile" },
  { codigo: "+54", pais: "Argentina" },
  { codigo: "+55", pais: "Brasil" }
]

export function ConfigurarCuenta({
  imagenPerfil,
  setImagenPerfil,
}: {
  imagenPerfil: string
  setImagenPerfil: (imagen: string) => void
}) {
  const [previsualizacion, setPrevisualizacion] = useState(imagenPerfil)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setPrevisualizacion(event.target.result)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const handleGuardarCambios = () => {
    setImagenPerfil(previsualizacion)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-24 w-24">
            <AvatarImage src={previsualizacion} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Button variant="ghost" onClick={handleButtonClick}>
            Cambiar foto
          </Button>
          <input type="file" ref={inputRef} onChange={handleImageChange} className="hidden" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Configuración de la cuenta</h2>
          <p className="text-sm text-gray-500">Actualiza la información de tu perfil.</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" placeholder="Tu nombre" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido</Label>
            <Input id="apellido" placeholder="Tu apellido" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cedula">Cédula</Label>
            <Input id="cedula" placeholder="Tu cédula" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ciudad">Ciudad</Label>
            <Input id="ciudad" placeholder="Tu ciudad" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input id="direccion" placeholder="Tu dirección" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="empresa">Empresa</Label>
          <Input id="empresa" placeholder="Nombre de tu empresa" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" type="email" placeholder="Tu correo electrónico" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="celular">Número de celular</Label>
          <div className="flex gap-2">
            <Select defaultValue="+593">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {codigosCelular.map((codigo) => (
                  <SelectItem key={codigo.codigo} value={codigo.codigo}>
                    {codigo.codigo} ({codigo.pais})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input id="celular" placeholder="Tu número de celular" className="flex-1" />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleGuardarCambios}>Guardar cambios</Button>
      </div>
    </div>
  )
}
