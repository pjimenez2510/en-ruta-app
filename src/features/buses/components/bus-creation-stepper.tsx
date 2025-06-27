"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { BusForm } from "./bus-form";
import { SeatGrid } from "./seat-grid";
import { BusFormValues } from "../interfaces/form-schema";
import { BusCreationData, BusSeat } from "../interfaces/seat-config";
import { useBusModels } from "../hooks/use-bus-models";
import { useSeatTypes } from "../hooks/use-seat-types";
import { useFloorConfiguration } from "../hooks/use-floor-configuration";
import { useSeatDragDrop } from "../hooks/use-seat-drag-drop";
import { Armchair, Loader2 } from "lucide-react";
import { DndContext, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { SeatType } from "@/features/seating/interfaces/seat-type.interface";
import { AVAILABLE_ICONS } from "@/features/seating/constants/available-icons";

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
  const { seatTypes: availableSeatTypes } = useSeatTypes();
  
  const { 
    floorConfigs, 
    setFloorConfigs, 
    floorDimensions, 
    updateFloorDimensions, 
    reorderSeatNumbers 
  } = useFloorConfiguration({ busInfo, busModels, initialData });

  const { onDragEnd } = useSeatDragDrop({ floorConfigs, setFloorConfigs, reorderSeatNumbers });

  // Agregar sensores para el drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
    <div className="space-y-6">
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
        <DndContext
          sensors={sensors}
          onDragEnd={onDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Configuración de Asientos</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>
                      Anterior
                    </Button>
                    <Button onClick={handleSeatLayoutSubmit} disabled={isSubmitting} className="min-w-[120px]">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        'Finalizar'
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {floorConfigs.map((floor) => (
                    <div key={floor.numeroPiso} className="space-y-6 bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Piso {floor.numeroPiso}</h3>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Label className="min-w-[60px]">Filas</Label>
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
                          
                          <div className="flex items-center gap-2">
                            <Label className="min-w-[60px]">Col. Izq.</Label>
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
                          
                          <div className="flex items-center gap-2">
                            <Label className="min-w-[60px]">Col. Der.</Label>
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
                      </div>

                      <div className="flex justify-center bg-white rounded-lg p-6 shadow-sm">
                        <SeatGrid
                          floorConfig={floor}
                          seatTypes={availableSeatTypes}
                          disabled={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="p-4">
                  <h3 className="font-medium mb-4 text-lg">Tipos de Asiento</h3>
                  <div className="space-y-4">
                    {availableSeatTypes.map((type) => (
                      <div key={`template-${type.id}`} className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-700 mb-2 text-center">{type.nombre}</div>
                        <div className="flex items-center justify-center p-2 hover:bg-gray-100 transition-colors rounded-md cursor-move">
                          <SeatTemplate type={type} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </DndContext>
      )}
    </div>
  );
};

// Nuevo componente para las plantillas de asientos
const SeatTemplate = ({ type }: { type: SeatType }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `template-${type.id}`,
    data: type,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex flex-col items-center",
        isDragging && "opacity-50"
      )}
    >
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
      <span className="text-xs mt-1">Arrastrar</span>
    </div>
  );
};