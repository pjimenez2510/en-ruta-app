"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Armchair, Check, BedDouble } from "lucide-react";
import { useBusDisponibilidad } from "@/features/sell-tickets/hooks/use-bus-disponibilidad";

interface SeleccionarAsientosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viaje: any;
  onAsientosSeleccionados: (asientos: any[]) => void;
  asientosActuales: any[];
}

const iconMap: Record<string, any> = {
  Armchair,
  BedDouble,
};

// Función para determinar el color de icono según el fondo
function getIconColor(bgColor: string) {
  // Extrae el color hexadecimal
  let color = bgColor.replace("#", "");
  if (color.length === 3) {
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  }
  if (color.length !== 6) return "#222";
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#222" : "#fff";
}

export function SeleccionarAsientosModal({
  open,
  onOpenChange,
  viaje,
  onAsientosSeleccionados,
  asientosActuales,
}: SeleccionarAsientosModalProps) {
  // Obtener ids necesarios del viaje
  const busId = viaje?.bus?.id;
  const viajeId = viaje?.id;
  const ciudadOrigenId = viaje?.horarioRuta?.ruta?.paradas?.[0]?.ciudad?.id;
  const ciudadDestinoId =
    viaje?.horarioRuta?.ruta?.paradas?.[
      viaje?.horarioRuta?.ruta?.paradas?.length - 1
    ]?.ciudad?.id;

  const { data, isLoading } = useBusDisponibilidad({
    id: busId,
    viajeId,
    ciudadOrigenId,
    ciudadDestinoId,
  });

  // Estado de piso activo y asientos seleccionados
  const [pisoActivo, setPisoActivo] = useState(1);
  const [asientosSeleccionados, setAsientosSeleccionados] =
    useState<any[]>(asientosActuales);

  useEffect(() => {
    setAsientosSeleccionados(asientosActuales);
  }, [asientosActuales]);

  if (!viaje) {
    return null;
  }

  // Obtener asientos del piso activo
  const pisos = data?.data?.pisos || [];
  const piso = pisos.find((p) => p.numeroPiso === pisoActivo);
  const asientosPorPiso = piso ? piso.asientos : [];
  const filas = [...new Set(asientosPorPiso.map((a) => a.fila))].sort(
    (a, b) => a - b
  );

  const toggleAsiento = (asiento: any) => {
    if (!asiento.disponible) return;
    const yaSeleccionado = asientosSeleccionados.find(
      (a) => a.id === asiento.id
    );
    if (yaSeleccionado) {
      setAsientosSeleccionados(
        asientosSeleccionados.filter((a) => a.id !== asiento.id)
      );
    } else {
      setAsientosSeleccionados([
        ...asientosSeleccionados,
        {
          id: asiento.id,
          numero: asiento.numero,
          tipo: asiento.tipo.nombre,
          precio: Number(asiento.precio),
        },
      ]);
    }
  };

  const confirmarSeleccion = () => {
    onAsientosSeleccionados(asientosSeleccionados);
    onOpenChange(false);
  };

  const calcularTotal = () => {
    return asientosSeleccionados.reduce(
      (total, asiento) => total + asiento.precio,
      0
    );
  };

  const getEstadoAsiento = (asiento: any) => {
    if (!asiento.disponible) return "ocupado";
    if (asientosSeleccionados.find((a) => a.id === asiento.id))
      return "seleccionado";
    return "disponible";
  };

  const getColorAsiento = (asiento: any) => {
    const estado = getEstadoAsiento(asiento);
    switch (estado) {
      case "ocupado":
        return "bg-gray-300 border-gray-400 cursor-not-allowed";
      case "seleccionado":
        return "bg-[#006D8B] border-[#006D8B] text-white";
      default:
        return `border-2 cursor-pointer hover:opacity-80`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Armchair className="h-5 w-5" />
            Seleccionar Asientos
          </DialogTitle>
          <DialogDescription>
            {viaje
              ? `${viaje.horarioRuta?.ruta?.nombre} - ${
                  viaje.fecha?.split("T")[0]
                } ${viaje.horarioRuta?.horaSalida}`
              : "Seleccione los asientos deseados"}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-12">Cargando asientos...</div>
        ) : (
          <div className="space-y-6">
            {/* Selector de Piso */}
            <div className="flex gap-2">
              {pisos.map((p) => (
                <Button
                  key={p.id}
                  variant={p.numeroPiso === pisoActivo ? "default" : "outline"}
                  onClick={() => setPisoActivo(p.numeroPiso)}
                >
                  Piso {p.numeroPiso}
                </Button>
              ))}
            </div>

            {/* Leyenda de Tipos de Asiento */}
            {piso && (
              <div className="flex flex-wrap gap-4 text-sm items-center mb-2">
                {Array.from(new Set(asientosPorPiso.map((a) => a.tipo.id))).map(
                  (tipoId) => {
                    const tipo = asientosPorPiso.find(
                      (a) => a.tipo.id === tipoId
                    )?.tipo;
                    if (!tipo) return null;
                    return (
                      <div key={tipo.id} className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border-2"
                          style={{
                            backgroundColor: tipo.color,
                            borderColor: tipo.color,
                          }}
                        ></div>
                        <span>{tipo.nombre}</span>
                        <span className="text-xs text-muted-foreground">
                          ${tipo.descripcion}
                        </span>
                        <span className="text-xs font-bold">
                          ${tipo.factorPrecio ? `x${tipo.factorPrecio}` : ""}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            )}

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
            </div>

            {/* Mapa de Asientos */}
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="text-center mb-4 text-sm text-muted-foreground">
                Frente del Bus
              </div>
              <div className="space-y-3">
                {filas.map((fila) => (
                  <div
                    key={fila}
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="w-6 text-center text-sm font-medium">
                      {fila}
                    </span>
                    {/* Lado izquierdo */}
                    <div className="flex gap-1">
                      {asientosPorPiso
                        .filter((a) => a.fila === fila && a.columna <= 2)
                        .sort((a, b) => a.columna - b.columna)
                        .map((asiento) => (
                          <div
                            key={asiento.id}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${getColorAsiento(
                              asiento
                            )}`}
                            style={
                              getEstadoAsiento(asiento) === "disponible"
                                ? {
                                    backgroundColor: asiento.tipo.color,
                                    borderColor: asiento.tipo.color,
                                  }
                                : {}
                            }
                            onClick={() => toggleAsiento(asiento)}
                            title={`Asiento ${asiento.numero} - ${asiento.tipo.nombre} - $${asiento.precio}`}
                          >
                            {getEstadoAsiento(asiento) === "seleccionado" ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <>
                                {typeof iconMap[asiento.tipo.icono] ===
                                "function" ? (
                                  iconMap[asiento.tipo.icono]({
                                    className: "h-5 w-5 mb-1",
                                    color: getIconColor(asiento.tipo.color),
                                  })
                                ) : (
                                  <Armchair
                                    className="h-5 w-5 mb-1"
                                    color={getIconColor(asiento.tipo.color)}
                                  />
                                )}
                                <span
                                  style={{
                                    color: getIconColor(asiento.tipo.color),
                                    fontWeight: 600,
                                  }}
                                >
                                  {asiento.numero}
                                </span>
                              </>
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
                            className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${getColorAsiento(
                              asiento
                            )}`}
                            style={
                              getEstadoAsiento(asiento) === "disponible"
                                ? {
                                    backgroundColor: asiento.tipo.color,
                                    borderColor: asiento.tipo.color,
                                  }
                                : {}
                            }
                            onClick={() => toggleAsiento(asiento)}
                            title={`Asiento ${asiento.numero} - ${asiento.tipo.nombre} - $${asiento.precio}`}
                          >
                            {getEstadoAsiento(asiento) === "seleccionado" ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <>
                                {typeof iconMap[asiento.tipo.icono] ===
                                "function" ? (
                                  iconMap[asiento.tipo.icono]({
                                    className: "h-5 w-5 mb-1",
                                    color: getIconColor(asiento.tipo.color),
                                  })
                                ) : (
                                  <Armchair
                                    className="h-5 w-5 mb-1"
                                    color={getIconColor(asiento.tipo.color)}
                                  />
                                )}
                                <span
                                  style={{
                                    color: getIconColor(asiento.tipo.color),
                                    fontWeight: 600,
                                  }}
                                >
                                  {asiento.numero}
                                </span>
                              </>
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
                <h4 className="font-medium mb-3">
                  Asientos Seleccionados ({asientosSeleccionados.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {asientosSeleccionados.map((asiento) => (
                    <div
                      key={asiento.id}
                      className="flex items-center justify-between text-sm"
                    >
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
                  <span className="text-lg font-bold">
                    ${calcularTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                onClick={confirmarSeleccion}
                disabled={asientosSeleccionados.length === 0}
              >
                Confirmar Selección ({asientosSeleccionados.length})
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
