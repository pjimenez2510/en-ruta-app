"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BusSeat } from "../interfaces/seat-config";
import { SeatType } from "@/features/seating/interfaces/seat-type.interface";
import { useSession } from "next-auth/react";
import { AVAILABLE_ICONS } from "@/features/seating/constants/available-icons";
import { getAll as getAllSeatTypes } from "@/features/seating/services/seat-type.service";
import { Armchair } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSeatGridRenderer } from "../hooks/use-seat-grid-renderer";

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

export const BusSeatTypeEditor = ({ initialSeats, onSave, onCancel }: BusSeatTypeEditorProps) => {
  const { data: session } = useSession();
  const [selectedSeatType, setSelectedSeatType] = useState<number>(1);
  const [availableSeatTypes, setAvailableSeatTypes] = useState<SeatType[]>([]);
  const [floors, setFloors] = useState<FloorConfig[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { renderSeatGrid, calculateGridConfig } = useSeatGridRenderer();

  // Cargar tipos de asientos disponibles
  useEffect(() => {
    const loadSeatTypes = async () => {
      try {
        const token = session?.user?.accessToken || null;
        const types = await getAllSeatTypes(token);
        setAvailableSeatTypes(types);
        if (types.length > 0) {
          setSelectedSeatType(types[0].id);
        }
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

  const handleSeatClick = (floorIndex: number, row: number, col: number) => {
    setFloors(prev => {
      const newFloors = prev.map((floor, idx) => {
        if (idx !== floorIndex) return floor;

        const updatedSeats = floor.asientos.map(seat => {
          if (seat.fila === row && seat.columna === col) {
            return {
              ...seat,
              tipoId: selectedSeatType
            };
          }
          return seat;
        });

        return {
          ...floor,
          asientos: updatedSeats
        };
      });

      return newFloors;
    });
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
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex gap-8">
          <div className="flex-1">
            <h2 className="text-lg font-medium mb-6">Editar Tipos de Asiento</h2>
            <div className="space-y-8">
              {floors.map((floor, floorIndex) => (
                <div key={floor.numeroPiso} className="space-y-4">
                  <h3 className="font-medium">Piso {floor.numeroPiso}</h3>
                  <div className="space-y-2">
                    {renderSeatGrid(
                      {
                        numeroPiso: floor.numeroPiso,
                        asientos: floor.asientos
                      },
                      availableSeatTypes,
                      {
                        seatSize: "h-16 w-16",
                        interactive: true,
                        onSeatClick: (row, col) => handleSeatClick(floorIndex, row, col),
                        selectedSeatType,
                        showSeatNumbers: true
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-48">
            <div className="sticky top-6">
              <h3 className="font-medium mb-4">Tipos de Asiento</h3>
              <div className="space-y-2">
                {availableSeatTypes.map((type) => (
                  <button
                    key={type.id}
                    className={cn(
                      "w-full p-2 rounded-lg border text-left",
                      selectedSeatType === type.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    )}
                    onClick={() => setSelectedSeatType(type.id)}
                    style={{ borderColor: selectedSeatType === type.id ? type.color : undefined }}
                    disabled={isSaving}
                  >
                    <div className="flex items-center gap-2">
                      {type.icono ? (
                        <div className="h-5 w-5">
                          {React.createElement(AVAILABLE_ICONS[type.icono as keyof typeof AVAILABLE_ICONS], {
                            className: "h-5 w-5",
                            style: { color: type.color }
                          })}
                        </div>
                      ) : (
                        <Armchair className="h-5 w-5" style={{ color: type.color }} />
                      )}
                      <span>{type.nombre}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
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
      </Card>
    </div>
  );
};