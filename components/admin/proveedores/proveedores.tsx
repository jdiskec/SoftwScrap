"use client"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search, Plus, Phone, Mail, FileText, Trash2 } from "lucide-react"

type Proveedor = {
    ruc: string
    nombre: string
    telefono: string
    correo: string
}

const PROVEEDORES_KEY = "facturacion_proveedores"

export default function Proveedores() {
    const [proveedores, setProveedores] = useState<Proveedor[]>([])
    const [query, setQuery] = useState("")

    useEffect(() => {
        const raw = localStorage.getItem(PROVEEDORES_KEY)
        if (raw) setProveedores(JSON.parse(raw))
    }, [])

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim()
        if (!q) return proveedores
        return proveedores.filter(p =>
            p.nombre.toLowerCase().includes(q) ||
            p.ruc.includes(q)
        )
    }, [query, proveedores])

    const handleDelete = (ruc: string) => {
        if (confirm("¿Está seguro de eliminar este proveedor?")) {
            const updated = proveedores.filter(p => p.ruc !== ruc)
            setProveedores(updated)
            localStorage.setItem(PROVEEDORES_KEY, JSON.stringify(updated))
        }
    }

    return (
        <main className="ml-[260px] min-h-screen p-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Proveedores
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Gestiona tu lista de contactos y proveedores de confianza.
                        </p>
                    </div>
                </div>

                <Card className="mb-8 border-none shadow-sm bg-white dark:bg-slate-800">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Search className="h-5 w-5 text-blue-500" />
                            Búsqueda Rápida
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Buscar por nombre o RUC..."
                                className="pl-10 h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 transition-all"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                                <Search className="h-8 w-8 text-slate-400" />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">No se encontraron proveedores</p>
                            <p className="text-sm text-slate-400">Prueba ajustando tu búsqueda o registra uno nuevo desde Compras.</p>
                        </div>
                    ) : (
                        filtered.map((p) => (
                            <Card key={p.ruc} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800">
                                <div className="h-2 bg-blue-500" />
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-xl">
                                                {p.nombre.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{p.nombre}</h3>
                                                <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
                                                    <FileText className="h-3 w-3" />
                                                    <span>RUC: {p.ruc}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                            onClick={() => handleDelete(p.ruc)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-3 mt-6">
                                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center">
                                                <Phone className="h-4 w-4 text-blue-500" />
                                            </div>
                                            <span className="font-medium">{p.telefono || "No registrado"}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center">
                                                <Mail className="h-4 w-4 text-blue-500" />
                                            </div>
                                            <span className="font-medium truncate">{p.correo || "Sin correo"}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </main>
    )
}
