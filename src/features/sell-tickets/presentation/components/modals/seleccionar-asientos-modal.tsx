"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Armchair, Check } from "lucide-react"

// Simulación de asientos del bus
const generarAsientos = () => {
  const asientos = []
  const tipos = [
    { id: 1, nombre: "Económico", precio: 22.75, color: "bg-blue-100 border-blue-300" },
    { id: 2, nombre: "VIP", precio: 35.0, color: "bg-purple-100 border-purple-300" },
    { id: 3, nombre: "Premium", precio: 28.5, color: "bg-green-100 border-green-300" },
  ]

  // Generar asientos para 2 pisos
  for (let piso = 1; piso <= 2; piso++) {
    for (let fila = 1; fila <= 6; fila++) {
      for (let columna = 1; columna <= 4; columna++) {
        // Saltar algunas posiciones para simular pasillos
        if (columna === 3) continue

        const numero = `${piso}${fila}${String.fromCharCode(64 + columna)}`
        const tipo = tipos[Math.floor(Math.random() * tipos.length)]
        const ocupado = Math.random() < 0.3 // 30% de asientos ocupados

        asientos.push({
          id: `${piso}-${fila}-${columna}`,
          numero,
          fila,
          columna,
          piso,
          tipo: tipo.nombre,
          precio: tipo.precio,
          color: tipo.color,
          ocupado,
          mantenimiento: Math.random() < 0.05, // 5% en mantenimiento
        })
      }
    }
  }

  return asientos
}

interface SeleccionarAsientosModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  viaje: any
  onAsientosSeleccionados: (asientos: any[]) => void
  asientosActuales: any[]
}

export function SeleccionarAsientosModal({
  open,
  onOpenChange,
  viaje,
  onAsientosSeleccionados,
  asientosActuales,
}: SeleccionarAsientosModalProps) {
  const [asientos] = useState(generarAsientos())
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<any[]>(asientosActuales)
  const [pisoActivo, setPisoActivo] = useState(1)

  useEffect(() => {
    setAsientosSeleccionados(asientosActuales)
  }, [asientosActuales])

  const toggleAsiento = (asiento: any) => {
    if (asiento.ocupado || asiento.mantenimiento) return

    const yaSeleccionado = asientosSeleccionados.find((a) => a.id === asiento.id)

    if (yaSeleccionado) {
      setAsientosSeleccionados(asientosSeleccionados.filter((a) => a.id !== asiento.id))
    } else {
      setAsientosSeleccionados([...asientosSeleccionados, asiento])
    }
  }

  const confirmarSeleccion = () => {
    onAsientosSeleccionados(asientosSeleccionados)
    onOpenChange(false)
  }

  const calcularTotal = () => {
    return asientosSeleccionados.reduce((total, asiento) => total + asiento.precio, 0)
  }

  const asientosPorPiso = asientos.filter((a) => a.piso === pisoActivo)
  const filas = [...new Set(asientosPorPiso.map((a) => a.fila))].sort()

  const getEstadoAsiento = (asiento: any) => {
    if (asiento.mantenimiento) return "mantenimiento"
    if (asiento.ocupado) return "ocupado"
    if (asientosSeleccionados.find((a) => a.id === asiento.id)) return "seleccionado"
    return "disponible"
  }

  const getColorAsiento = (asiento: any) => {
    const estado = getEstadoAsiento(asiento)
    switch (estado) {
      case "mantenimiento":
        return "bg-red-100 border-red-300 cursor-not-allowed"
      case "ocupado":
        return "bg-gray-300 border-gray-400 cursor-not-allowed"
      case "seleccionado":
        return "bg-[#006D8B] border-[#006D8B] text-white"
      default:
        return asiento.color + " cursor-pointer hover:opacity-80"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Armchair className="h-5 w-5" />
            Seleccionar Asientos
          </DialogTitle>
          <DialogDescription>
            {viaje ? `${viaje.ruta} - ${viaje.fecha} ${viaje.hora}` : "Seleccione los asientos deseados"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selector de Piso */}
          <div className="flex gap-2">
            <Button variant={pisoActivo === 1 ? "default" : "outline"} onClick={() => setPisoActivo(1)}>
              Piso 1
            </Button>
            <Button variant={pisoActivo === 2 ? "default" : "outline"} onClick={() => setPisoActivo(2)}>
              Piso 2
            </Button>
          </div>

          {/* Leyenda */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#006D8B] border border-[#006D8B] rounded"></div>
              <span>Seleccionado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 border border-gray-400 rounded"></div>
              <span>Ocupado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>Mantenimiento</span>
            </div>
          </div>

          {/* Mapa de Asientos */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="text-center mb-4 text-sm text-muted-foreground">Frente del Bus</div>

            <div className="space-y-3">
              {filas.map((fila) => (
                <div key={fila} className="flex items-center justify-center gap-2">
                  <span className="w-6 text-center text-sm font-medium">{fila}</span>

                  {/* Lado izquierdo */}
                  <div className="flex gap-1">
                    {asientosPorPiso
                      .filter((a) => a.fila === fila && a.columna <= 2)
                      .sort((a, b) => a.columna - b.columna)
                      .map((asiento) => (
                        <div
                          key={asiento.id}
                          className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${getColorAsiento(asiento)}`}
                          onClick={() => toggleAsiento(asiento)}
                          title={`Asiento ${asiento.numero} - ${asiento.tipo} - $${asiento.precio}`}
                        >
                          {getEstadoAsiento(asiento) === "seleccionado" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            asiento.numero
                          )}
                        </div>
                      ))}
                  </div>

                  {/* Pasillo */}
                  <div className="w-8"></div>

                  {/* Lado derecho */}
                  <div className="flex gap-1">
                    {asientosPorPiso
                      .filter((a) => a.fila === fila && a.columna > 2)
                      .sort((a, b) => a.columna - b.columna)
                      .map((asiento) => (
                        <div
                          key={asiento.id}
                          className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${getColorAsiento(asiento)}`}
                          onClick={() => toggleAsiento(asiento)}
                          title={`Asiento ${asiento.numero} - ${asiento.tipo} - $${asiento.precio}`}
                        >
                          {getEstadoAsiento(asiento) === "seleccionado" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            asiento.numero
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de Selección */}
          {asientosSeleccionados.length > 0 && (
            <div className="border rounded-lg p-4 bg-[#006D8B]/5">
              <h4 className="font-medium mb-3">Asientos Seleccionados ({asientosSeleccionados.length})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {asientosSeleccionados.map((asiento) => (
                  <div key={asiento.id} className="flex items-center justify-between text-sm">
                    <span>
                      {asiento.numero} - {asiento.tipo}
                    </span>
                    <span className="font-medium">${asiento.precio}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-lg font-bold">${calcularTotal().toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarSeleccion} disabled={asientosSeleccionados.length === 0}>
              Confirmar Selección ({asientosSeleccionados.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
