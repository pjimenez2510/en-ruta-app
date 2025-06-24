"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, User, Plus, UserPlus } from "lucide-react"

const clientesDisponibles = [
  {
    id: 1,
    nombre: "María González",
    documento: "1712345678",
    email: "maria.gonzalez@email.com",
    telefono: "+593987654321",
    esDiscapacitado: false,
  },
  {
    id: 2,
    nombre: "Carlos Mendoza",
    documento: "1798765432",
    email: "carlos.mendoza@email.com",
    telefono: "+593912345678",
    esDiscapacitado: true,
  },
  {
    id: 3,
    nombre: "Ana Rodríguez",
    documento: "1756789012",
    email: "ana.rodriguez@email.com",
    telefono: "+593923456789",
    esDiscapacitado: false,
  },
]

interface BuscarClienteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClienteSeleccionado: (cliente: any) => void
  onCrearCliente: () => void
}

export function BuscarClienteModal({
  open,
  onOpenChange,
  onClienteSeleccionado,
  onCrearCliente,
}: BuscarClienteModalProps) {
  const [cedula, setCedula] = useState("")
  const [clientesFiltrados, setClientesFiltrados] = useState(clientesDisponibles)
  const [buscando, setBuscando] = useState(false)

  const buscarPorCedula = () => {
    setBuscando(true)

    // Simular búsqueda
    setTimeout(() => {
      const clientesEncontrados = clientesDisponibles.filter(
        (cliente) => cliente.documento.includes(cedula) || cliente.nombre.toLowerCase().includes(cedula.toLowerCase()),
      )
      setClientesFiltrados(clientesEncontrados)
      setBuscando(false)
    }, 500)
  }

  const seleccionarCliente = (cliente: any) => {
    onClienteSeleccionado(cliente)
    onOpenChange(false)
    setCedula("")
    setClientesFiltrados(clientesDisponibles)
  }

  const handleCrearCliente = () => {
    onCrearCliente()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Cliente
          </DialogTitle>
          <DialogDescription>Busque por cédula o nombre del cliente</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Búsqueda */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cédula o Nombre</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ingrese cédula o nombre del cliente..."
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && buscarPorCedula()}
                />
                <Button onClick={buscarPorCedula} disabled={!cedula || buscando}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {clientesFiltrados.length === 0 && cedula && !buscando && (
              <div className="text-center py-6 border rounded-lg bg-gray-50">
                <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No se encontró ningún cliente con "{cedula}"</p>
                <Button onClick={handleCrearCliente}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Nuevo Cliente
                </Button>
              </div>
            )}
          </div>

          {/* Resultados */}
          {clientesFiltrados.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Clientes Encontrados</h3>
                <Badge variant="secondary">{clientesFiltrados.length} resultados</Badge>
              </div>

              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {clientesFiltrados.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="p-4 border rounded-lg hover:border-[#006D8B] cursor-pointer transition-colors"
                    onClick={() => seleccionarCliente(cliente)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{cliente.nombre}</span>
                          {cliente.esDiscapacitado && <Badge variant="secondary">Discapacidad</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Cédula: {cliente.documento}</p>
                          <p>Email: {cliente.email}</p>
                          <p>Teléfono: {cliente.telefono}</p>
                        </div>
                      </div>
                      <Button size="sm">Seleccionar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Acción para crear cliente */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleCrearCliente}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Nuevo Cliente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
