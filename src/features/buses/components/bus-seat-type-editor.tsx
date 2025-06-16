"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BusSeat } from "../interfaces/seat-config";
import { SeatType } from "@/features/seating/interfaces/seat-type.interface";
import { useSession } from "next-auth/react";
import { AVAILABLE_ICONS } from "@/features/seating/constants/available-icons";
import { getAll as getAllSeatTypes } from "@/features/seating/services/seat-type.service";
import { Armchair, Loader2 } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSeatGridRenderer } from "../hooks/use-seat-grid-renderer";
import { useBuses } from "../hooks/use-buses";
import { SeatTypeLegend } from "./seat-type-legend";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FloorConfig {
  pisoBusId: number;
  numeroPiso: number;
  leftColumns: number;
  rightColumns: number;
  rows: number;
  asientos: BusSeat[];
  posicionPasillo?: number;
}

interface BusSeatTypeEditorProps {
  initialSeats: Array<{
    id: number;
    busId: number;
    numeroPiso: number;
    asientos: BusSeat[];
  }>;
  onSave: (seats: Array<{
    numeroPiso: number;
    asientos: BusSeat[];
  }>) => void;
  onCancel: () => void;
}

interface Position {
  x: number;
  y: number;
}

export const BusSeatTypeEditor = ({ initialSeats, onSave, onCancel }: BusSeatTypeEditorProps) => {
  const { data: session } = useSession();
  const { updateSingleSeat } = useBuses();
  const [availableSeatTypes, setAvailableSeatTypes] = useState<SeatType[]>([]);
  const [floors, setFloors] = useState<FloorConfig[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<BusSeat | null>(null);
  const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });
  const { renderSeatGrid, calculateGridConfig } = useSeatGridRenderer();

  // Cargar tipos de asientos disponibles
  useEffect(() => {
    const loadSeatTypes = async () => {
      try {
        const token = session?.user?.accessToken || null;
        const types = await getAllSeatTypes(token!);
        setAvailableSeatTypes(types);
      } catch (error) {
        console.error("Error al cargar tipos de asientos:", error);
        toast.error("Error al cargar tipos de asientos");
      }
    };
    loadSeatTypes();
  }, [session?.user?.accessToken]);

  // Inicializar la configuración de pisos solo una vez
  useEffect(() => {
    if (!initialized && initialSeats.length > 0) {
      const configs = initialSeats.map(piso => {
        const asientos = piso.asientos || [];
        
        if (asientos.length === 0) {
          return {
            pisoBusId: piso.id,
            numeroPiso: piso.numeroPiso,
            leftColumns: 2,
            rightColumns: 2,
            rows: 3,
            asientos: []
          };
        }

        const gridConfig = calculateGridConfig(asientos);

        return {
          pisoBusId: piso.id,
          numeroPiso: piso.numeroPiso,
          leftColumns: gridConfig.leftColumns,
          rightColumns: gridConfig.rightColumns,
          rows: gridConfig.maxFila,
          asientos: [...asientos],
          posicionPasillo: gridConfig.posicionPasillo
        };
      });

      setFloors(configs);
      setInitialized(true);
    }
  }, [initialSeats, initialized, calculateGridConfig]);

  const handleSeatClick = (floorIndex: number, row: number, col: number, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const floor = floors[floorIndex];
    const seat = floor.asientos.find(s => s.fila === row && s.columna === col);
    if (seat) {
      setSelectedSeat(seat);
      const rect = event.currentTarget.getBoundingClientRect();
      setMenuPosition({
        x: rect.right,
        y: rect.top
      });
    }
  };

  const handleSeatTypeChange = async (seat: BusSeat, newTypeId: number) => {
    try {
      const seatData = {
        pisoBusId: seat.pisoBusId,
        numero: seat.numero,
        fila: seat.fila,
        columna: seat.columna,
        estado: seat.estado,
        tipoId: newTypeId
      };

      if (!seat.id) {
        toast.error("No se puede actualizar el asiento: ID no disponible");
        return;
      }

      // Asegurarnos de que el ID sea un número
      const seatId = typeof seat.id === 'string' ? parseInt(seat.id) : seat.id;
      
      await updateSingleSeat(seatId, seatData);

      // Actualizar el estado local después de la actualización exitosa
      setFloors(prev => {
        const newFloors = prev.map(floor => ({
          ...floor,
          asientos: floor.asientos.map(s => 
            s.numero === seat.numero && s.pisoBusId === seat.pisoBusId
              ? { ...s, tipoId: newTypeId }
              : s
          )
        }));
        return newFloors;
      });

      setSelectedSeat(null);
    } catch (error) {
      console.error("Error al actualizar el asiento:", error);
      toast.error("Error al actualizar el tipo de asiento");
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedSeats = floors.map(floor => ({
        numeroPiso: floor.numeroPiso,
        asientos: floor.asientos
      }));
      await onSave(updatedSeats);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-2 justify-center items-center">
      <Card className="p-4 w-4xl justify-center items-center">
        <div className="flex flex-col w-2xl">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-medium">Editar Asientos</h2>
            <div className="w-64 sticky top-0 bg-white z-20">
              <SeatTypeLegend seatTypes={availableSeatTypes} />
            </div>
          </div>
          <div className="space-y-2">
            {floors.map((floor, floorIndex) => (
              <div key={floor.numeroPiso}>
                <h3 className="font-medium mb-1">Piso {floor.numeroPiso}</h3>
                <div>
                  {renderSeatGrid(
                    {
                      numeroPiso: floor.numeroPiso,
                      asientos: floor.asientos
                    },
                    availableSeatTypes,
                    {
                      seatSize: "h-16 w-16",
                      interactive: true,
                      onSeatClick: (row, col, event) => handleSeatClick(floorIndex, row, col, event),
                      showSeatNumbers: true
                    }
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Menú contextual para edición individual */}
      {selectedSeat && (
        <div 
          style={{ 
            position: 'fixed',
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
            zIndex: 50
          }}
        >
          <DropdownMenu defaultOpen>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-0 h-0 p-0 overflow-hidden"
                onClick={(e) => e.preventDefault()}
              >
                Trigger
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="right"
              sideOffset={5}
              className="w-48"
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                setSelectedSeat(null);
              }}
              onEscapeKeyDown={() => setSelectedSeat(null)}
              onInteractOutside={() => setSelectedSeat(null)}
            >
              {availableSeatTypes.map((type) => (
                <DropdownMenuItem
                  key={type.id}
                  onClick={() => handleSeatTypeChange(selectedSeat, type.id)}
                >
                  <div className="flex items-center gap-2">
                    {type.icono && AVAILABLE_ICONS[type.icono as keyof typeof AVAILABLE_ICONS] ? (
                      <div className="h-4 w-4">
                        {React.createElement(AVAILABLE_ICONS[type.icono as keyof typeof AVAILABLE_ICONS], {
                          className: "h-4 w-4",
                          style: { color: type.color }
                        })}
                      </div>
                    ) : (
                      <Armchair className="h-4 w-4" style={{ color: type.color }} />
                    )}
                    <span>{type.nombre}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};