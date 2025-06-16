"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { BusForm } from "./bus-form";
import { SeatGrid } from "./seat-grid-simple"; // Usando versión simplificada temporalmente
import { BusFormValues } from "../interfaces/form-schema";
import { BusCreationData, BusSeat } from "../interfaces/seat-config";
import { useBusModels } from "../hooks/use-bus-models";
import { useSeatTypes } from "../hooks/use-seat-types";
import { useFloorConfiguration } from "../hooks/use-floor-configuration";
// import { useSeatDragDrop } from "../hooks/use-seat-drag-drop"; // Comentado temporalmente
import { Armchair, Loader2 } from "lucide-react";

import { AVAILABLE_ICONS } from "@/features/seating/constants/available-icons";
import React from "react";

export interface BusCreationStepperProps {
  onSubmit: (data: BusCreationData) => Promise<void>;
  onCancel: () => void;
  initialData?: BusFormValues & { 
    totalAsientos?: number;
    pisos?: Array<{
      id: number;
      busId: number;
      numeroPiso: number;
      asientos: BusSeat[];
    }>;
  };
}

export const BusCreationStepper = ({ onSubmit, onCancel, initialData }: BusCreationStepperProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busInfo, setBusInfo] = useState<BusFormValues & { totalAsientos: number }>(() => {
    if (initialData) {
      return {
        modeloBusId: initialData.modeloBusId,
        numero: initialData.numero,
        placa: initialData.placa,
        anioFabricacion: initialData.anioFabricacion,
        tipoCombustible: initialData.tipoCombustible || "Diésel",
        fotoUrl: initialData.fotoUrl || "",
        totalAsientos: initialData.totalAsientos || 0
      };
    }
    return {
      modeloBusId: 0,
      numero: 0,
      placa: "",
      anioFabricacion: new Date().getFullYear(),
      tipoCombustible: "Diésel",
      fotoUrl: "",
      totalAsientos: 0
    };
  });

  const { busModels } = useBusModels();
  const { seatTypes: availableSeatTypes, selectedSeatType, setSelectedSeatType } = useSeatTypes();
  
  const { 
    floorConfigs, 
    floorDimensions, 
    updateFloorDimensions, 
  } = useFloorConfiguration({ busInfo, busModels, initialData });

  // const { onDragEnd } = useSeatDragDrop({ floorConfigs, setFloorConfigs, reorderSeatNumbers }); // Comentado temporalmente

  const handleSeatLayoutSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Calcular el total de asientos sumando los asientos de cada piso
      const totalAsientos = floorConfigs.reduce((total, floor) => total + floor.asientos.length, 0);

      const busConfiguration: BusCreationData = {
        busInfo: {
          ...busInfo,
          totalAsientos,
          fechaIngreso: new Date().toISOString().split('T')[0],
          estado: "ACTIVO"
        },
        pisos: floorConfigs.map(floor => ({
          pisoBusId: floor.pisoBusId,
          numeroPiso: floor.numeroPiso,
          asientos: floor.asientos
        }))
      };
      await onSubmit(busConfiguration);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    // <DragDropContext onDragEnd={onDragEnd}> {/* Comentado temporalmente */}
      <div className="space-y-8">
        {step === 1 && (
          <div className="space-y-6">
            <BusForm
              onSubmit={async (data) => {
                console.log("Form submitted:", data);
                setBusInfo(prev => ({ ...prev, ...data }));
                setStep(2);
              }}
              initialData={busInfo}
              onCancel={onCancel}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Card className="p-6 max-w-3xl mx-auto">
              <h2 className="text-lg font-medium mb-4">Configuración de Asientos</h2>
              
              <div className="flex gap-8">
                <div className="flex-1">
                  <div className="space-y-8">
                    {floorConfigs.map((floor) => (
                      <div key={floor.numeroPiso} className="space-y-4">
                        <h3 className="font-medium">Piso {floor.numeroPiso}</h3>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Filas</Label>
                            <Input
                              type="number"
                              min={3}
                              max={12}
                              value={floorDimensions[floor.numeroPiso]?.rows || 3}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 3;
                                updateFloorDimensions(floor.numeroPiso, 'rows', value);
                              }}
                              className="w-20"
                            />
                          </div>
                          
                          <div>
                            <Label>Columnas Izquierda</Label>
                            <Input
                              type="number"
                              min={1}
                              max={2}
                              value={floorDimensions[floor.numeroPiso]?.leftColumns || 2}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 2;
                                updateFloorDimensions(floor.numeroPiso, 'leftColumns', value);
                              }}
                              className="w-20"
                            />
                          </div>
                          
                          <div>
                            <Label>Columnas Derecha</Label>
                            <Input
                              type="number"
                              min={1}
                              max={2}
                              value={floorDimensions[floor.numeroPiso]?.rightColumns || 2}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 2;
                                updateFloorDimensions(floor.numeroPiso, 'rightColumns', value);
                              }}
                              className="w-20"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 flex justify-center">
                          <div>
                            <SeatGrid 
                              floor={floor} 
                              floorDimensions={floorDimensions} 
                              availableSeatTypes={availableSeatTypes} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-48">
                  <div className="sticky top-6">
                    <h3 className="font-medium mb-2">Tipos de Asiento</h3>
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
                        >
                          <div className="flex items-center gap-2">
                            {type.icono && AVAILABLE_ICONS[type.icono as keyof typeof AVAILABLE_ICONS] ? (
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
                    </div>                    <h3 className="font-medium mb-2 mt-6">Asientos Disponibles</h3>
                    <div className="space-y-4">
                      {availableSeatTypes.map((type) => (
                        <div key={`template-${type.id}`}>
                          <h4 className="text-sm text-gray-500 mb-2">
                            {type.nombre}
                          </h4>
                          {/* Droppable comentado temporalmente */}
                          <div
                            className="p-4 bg-gray-50 rounded-lg"
                            style={{ borderColor: type.color }}
                          >
                            {/* Draggable comentado temporalmente */}
                            <div className="flex flex-col items-center">
                              {type.icono && AVAILABLE_ICONS[type.icono as keyof typeof AVAILABLE_ICONS] ? (
                                <div className="h-6 w-6">
                                  {React.createElement(AVAILABLE_ICONS[type.icono as keyof typeof AVAILABLE_ICONS], {
                                    className: "h-6 w-6",
                                    style: { color: type.color }
                                  })}
                                </div>
                              ) : (
                                <Armchair className="h-6 w-6" style={{ color: type.color }} />
                              )}
                              <span className="text-xs mt-1">Tipo: {type.nombre}</span>
                            </div>
                            {/* </Draggable> comentado temporalmente */}
                          </div>
                          {/* </Droppable> comentado temporalmente */}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>
                  Anterior
                </Button>
                <Button onClick={handleSeatLayoutSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    'Finalizar'
                  )}                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    // </DragDropContext> {/* Comentado temporalmente */}
  );
};