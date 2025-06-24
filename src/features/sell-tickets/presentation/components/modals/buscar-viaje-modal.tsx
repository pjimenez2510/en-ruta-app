"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Search } from "lucide-react"

const ciudades = [
  { id: 1, nombre: "Quito" },
  { id: 2, nombre: "Guayaquil" },
  { id: 3, nombre: "Cuenca" },
  { id: 4, nombre: "Ambato" },
  { id: 5, nombre: "Loja" },
  { id: 6, nombre: "Manta" },
]

const viajesDisponibles = [
  {
    id: 1,
    ruta: "Quito - Guayaquil",
    ciudadOrigen: "Quito",
    ciudadDestino: "Guayaquil",
    fecha: "2025-01-18",
    hora: "08:30",
    bus: "Bus 001",
    precio: 22.75,
    asientosDisponibles: 15,
  },
  {
    id: 2,
    ruta: "Ambato - Cuenca",
    ciudadOrigen: "Ambato",
    ciudadDestino: "Cuenca",
    fecha: "2025-01-18",
    hora: "14:15",
    bus: "Bus 002",
    precio: 18.5,
    asientosDisponibles: 8,
  },
  {
    id: 3,
    ruta: "Quito - Loja",
    ciudadOrigen: "Quito",
    ciudadDestino: "Loja",
    fecha: "2025-01-19",
    hora: "06:45",
    bus: "Bus 004",
    precio: 25.0,
    asientosDisponibles: 22,
  },
  {
    id: 4,
    ruta: "Guayaquil - Manta",
    ciudadOrigen: "Guayaquil",
    ciudadDestino: "Manta",
    fecha: "2025-01-18",
    hora: "16:00",
    bus: "Bus 003",
    precio: 15.0,
    asientosDisponibles: 12,
  },
]

interface BuscarViajeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onViajeSeleccionado: (viaje: any) => void
}

export function BuscarViajeModal({ open, onOpenChange, onViajeSeleccionado }: BuscarViajeModalProps) {
  const [ciudadOrigen, setCiudadOrigen] = useState("")
  const [ciudadDestino, setCiudadDestino] = useState("")
  const [fecha, setFecha] = useState("")
  const [viajesFiltrados, setViajesFiltrados] = useState(viajesDisponibles)

  const buscarViajes = () => {
    let viajes = viajesDisponibles

    if (ciudadOrigen) {
      viajes = viajes.filter((v) => v.ciudadOrigen === ciudadOrigen)
    }
    if (ciudadDestino) {
      viajes = viajes.filter((v) => v.ciudadDestino === ciudadDestino)
    }
    if (fecha) {
      viajes = viajes.filter((v) => v.fecha === fecha)
    }

    setViajesFiltrados(viajes)
  }

  const seleccionarViaje = (viaje: any) => {
    onViajeSeleccionado(viaje)
    onOpenChange(false)
    // Limpiar filtros
    setCiudadOrigen("")
    setCiudadDestino("")
    setFecha("")
    setViajesFiltrados(viajesDisponibles)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Viaje
          </DialogTitle>
          <DialogDescription>
            Filtre por ciudad de origen, destino y fecha para encontrar el viaje deseado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
            <div className="space-y-2">
              <Label>Ciudad de Origen</Label>
              <Select value={ciudadOrigen} onValueChange={setCiudadOrigen}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar origen" />
                </SelectTrigger>
                <SelectContent>
                  {ciudades.map((ciudad) => (
                    <SelectItem key={ciudad.id} value={ciudad.nombre}>
                      {ciudad.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ciudad de Destino</Label>
              <Select value={ciudadDestino} onValueChange={setCiudadDestino}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar destino" />
                </SelectTrigger>
                <SelectContent>
                  {ciudades.map((ciudad) => (
                    <SelectItem key={ciudad.id} value={ciudad.nombre}>
                      {ciudad.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>

            <div className="flex items-end">
              <Button onClick={buscarViajes} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </div>
          </div>

          {/* Resultados */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Viajes Disponibles</h3>
              <Badge variant="secondary">{viajesFiltrados.length} resultados</Badge>
            </div>

            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {viajesFiltrados.map((viaje) => (
                <div
                  key={viaje.id}
                  className="p-4 border rounded-lg hover:border-[#006D8B] cursor-pointer transition-colors"
                  onClick={() => seleccionarViaje(viaje)}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{viaje.ruta}</span>
                        <Badge variant="outline">{viaje.bus}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {viaje.fecha}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {viaje.hora}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-lg">${viaje.precio}</p>
                      <p className="text-sm text-muted-foreground">{viaje.asientosDisponibles} asientos disponibles</p>
                    </div>
                  </div>
                </div>
              ))}

              {viajesFiltrados.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No se encontraron viajes con los filtros seleccionados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
