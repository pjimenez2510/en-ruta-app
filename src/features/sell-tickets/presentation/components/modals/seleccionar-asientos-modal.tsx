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
import { Armchair, User, X } from "lucide-react";
import { useBusDisponibilidad } from "@/features/sell-tickets/hooks/use-bus-disponibilidad";
import { AVAILABLE_ICONS } from "@/features/seating/constants/available-icons";
import React from "react";
import {
  PisoDisponibilidad,
  AsientoDisponibilidad,
} from "@/features/sell-tickets/interfaces/bus-disponibilidad.interface";
import { ClienteAsiento } from "@/features/sell-tickets/interfaces/venta.interface";

interface Viaje {
  id: number;
  fecha: string;
  bus: {
    id: number;
    placa: string;
  };
  horarioRuta: {
    horaSalida: string;
    ruta: {
      nombre: string;
      paradas: Array<{
        ciudad: {
          id: number;
          nombre: string;
        };
      }>;
    };
  };
}

interface AsientoSeleccionado {
  id: number;
  numero: string;
  tipo: string;
  precio: number;
}

interface ClienteAdaptado {
  id: number;
  nombre: string;
  documento: string;
  email: string;
  telefono: string;
}

interface SeleccionarAsientosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viaje: Viaje;
  onAsientosSeleccionados: (clienteAsientos: ClienteAsiento[]) => void;
  clienteAsientosActuales: ClienteAsiento[];
  onBuscarCliente: (asiento: AsientoSeleccionado) => void;
  onClienteAsignado?: (cliente: ClienteAdaptado, asientoId: number) => void;
}

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
  clienteAsientosActuales,
  onBuscarCliente,
  onClienteAsignado,
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

  // Estado de piso activo y cliente-asientos seleccionados
  const [pisoActivo, setPisoActivo] = useState(1);
  const [clienteAsientos, setClienteAsientos] = useState<ClienteAsiento[]>(
    clienteAsientosActuales || []
  );

  useEffect(() => {
    setClienteAsientos(clienteAsientosActuales || []);
  }, [clienteAsientosActuales]);

  if (!viaje) {
    return null;
  }

  // Obtener asientos del piso activo
  const pisos: PisoDisponibilidad[] = data?.pisos || [];
  const piso: PisoDisponibilidad | undefined = pisos.find(
    (p: PisoDisponibilidad) => p.numeroPiso === pisoActivo
  );
  const asientosPorPiso: AsientoDisponibilidad[] = piso ? piso.asientos : [];
  const filas: number[] = [
    ...new Set(asientosPorPiso.map((a: AsientoDisponibilidad) => a.fila)),
  ].sort((a, b) => a - b);

  const toggleAsiento = (asiento: AsientoDisponibilidad) => {
    if (!asiento.disponible) return;

    const asientoSeleccionado = clienteAsientos.find(
      (ca) => ca.asiento?.id === asiento.id
    );

    if (asientoSeleccionado) {
      // Si ya está seleccionado, lo removemos
      setClienteAsientos(
        clienteAsientos.filter((ca) => ca.asiento?.id !== asiento.id)
      );
    } else {
      // Si no está seleccionado, abrimos el modal de buscar cliente
      onBuscarCliente({
        id: asiento.id,
        numero: asiento.numero,
        tipo: asiento.tipo.nombre,
        precio: Number(asiento.precio),
      });
    }
  };

  const removerClienteAsiento = (asientoId: number) => {
    if (!clienteAsientos) return;
    setClienteAsientos(
      clienteAsientos.filter((ca) => ca.asiento?.id !== asientoId)
    );
  };

  const confirmarSeleccion = () => {
    onAsientosSeleccionados(clienteAsientos || []);
    onOpenChange(false);
  };

  const calcularTotal = () => {
    if (!clienteAsientos) return 0;
    return clienteAsientos.reduce(
      (total, ca) => total + (ca.asiento?.precio || 0),
      0
    );
  };

  const getEstadoAsiento = (asiento: AsientoDisponibilidad) => {
    if (!asiento.disponible) return "ocupado";
    if (
      clienteAsientos &&
      clienteAsientos.find((ca) => ca.asiento?.id === asiento.id)
    )
      return "seleccionado";
    return "disponible";
  };

  const getColorAsiento = (asiento: AsientoDisponibilidad) => {
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
            Seleccionar Asientos y Clientes
          </DialogTitle>
          <DialogDescription>
            {viaje
              ? `${viaje.horarioRuta?.ruta?.nombre} - ${
                  viaje.fecha?.split("T")[0]
                } ${viaje.horarioRuta?.horaSalida}`
              : "Seleccione los asientos y asigne clientes"}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-12">Cargando asientos...</div>
        ) : (
          <div className="space-y-6">
            {/* Selector de Piso */}
            <div className="flex gap-2">
              {pisos.map((p: PisoDisponibilidad) => (
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
                {Array.from(
                  new Set(
                    asientosPorPiso.map((a: AsientoDisponibilidad) => a.tipo.id)
                  )
                ).map((tipoId) => {
                  const tipo = asientosPorPiso.find(
                    (a: AsientoDisponibilidad) => a.tipo.id === tipoId
                  )?.tipo;
                  if (!tipo) return null;
                  return (
                    <div key={tipo.id} className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border-2 flex items-center justify-center"
                        style={{
                          backgroundColor: tipo.color,
                          borderColor: tipo.color,
                        }}
                      >
                        {tipo.icono &&
                        AVAILABLE_ICONS[
                          tipo.icono as keyof typeof AVAILABLE_ICONS
                        ] ? (
                          React.createElement(
                            AVAILABLE_ICONS[
                              tipo.icono as keyof typeof AVAILABLE_ICONS
                            ],
                            {
                              className: "h-5 w-5",
                              color: getIconColor(tipo.color),
                            }
                          )
                        ) : (
                          <Armchair
                            className="h-5 w-5"
                            color={getIconColor(tipo.color)}
                          />
                        )}
                      </div>
                      <span>{tipo.nombre}</span>
                    </div>
                  );
                })}
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
                {filas.map((fila: number) => (
                  <div
                    key={fila}
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="w-6 text-center text-sm font-medium">
                      {fila}
                    </span>
                    {/* Lado izquierdo y derecho juntos, con espacios vacíos si no hay asiento */}
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((columna: number) => {
                        const asiento = asientosPorPiso.find(
                          (a: AsientoDisponibilidad) =>
                            a.fila === fila && a.columna === columna
                        );
                        if (!asiento) {
                          // Espacio vacío para mantener la estructura
                          return (
                            <div
                              key={`empty-${fila}-${columna}`}
                              className="w-12 h-12"
                            />
                          );
                        }
                        return (
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
                            {asiento.tipo.icono &&
                            AVAILABLE_ICONS[
                              asiento.tipo.icono as keyof typeof AVAILABLE_ICONS
                            ] ? (
                              React.createElement(
                                AVAILABLE_ICONS[
                                  asiento.tipo
                                    .icono as keyof typeof AVAILABLE_ICONS
                                ],
                                {
                                  className: "h-5 w-5 mb-1",
                                  color: getIconColor(asiento.tipo.color),
                                }
                              )
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
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen de Selección */}
            {clienteAsientos && clienteAsientos.length > 0 && (
              <div className="border rounded-lg p-4 bg-[#006D8B]/5">
                <h4 className="font-medium mb-3">
                  Asientos y Clientes Seleccionados ({clienteAsientos.length})
                </h4>
                <div className="space-y-3 mb-4">
                  {clienteAsientos.map((clienteAsiento) => (
                    <div
                      key={clienteAsiento.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Armchair className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {clienteAsiento.asiento?.numero} -{" "}
                            {clienteAsiento.asiento?.tipo}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ${clienteAsiento.asiento?.precio}
                          </span>
                        </div>
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {clienteAsiento.cliente?.nombre}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {clienteAsiento.cliente?.documento}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removerClienteAsiento(clienteAsiento.asiento?.id || 0)
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
                disabled={!clienteAsientos || clienteAsientos.length === 0}
              >
                Confirmar Selección ({clienteAsientos?.length || 0})
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
