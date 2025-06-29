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
import { useBusTemplate } from "@/features/bus-templates/hooks/use-bus-template";
import { Armchair, Loader2, FileText, RotateCcw } from "lucide-react";
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay, DragStartEvent, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
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
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [templateApplied, setTemplateApplied] = useState(false);
  const [busInfo, setBusInfo] = useState<BusFormValues & { totalAsientos: number }>(() => {
    if (initialData) {
      return {
        modeloBusId: initialData.modeloBusId,
        tipoRutaBusId: initialData.tipoRutaBusId,
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
      tipoRutaBusId: 0,
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
  const { templates, loading: loadingTemplates, fetchTemplatesByBusModel } = useBusTemplate();
  
  const { 
    floorConfigs, 
    setFloorConfigs, 
    floorDimensions, 
    updateFloorDimensions, 
    reorderSeatNumbers,
    resetToDefault
  } = useFloorConfiguration({ busInfo, busModels, initialData });

  const { onDragEnd } = useSeatDragDrop({ setFloorConfigs, reorderSeatNumbers });

  // Cargar plantillas cuando cambia el modelo de bus
  React.useEffect(() => {
    if (busInfo.modeloBusId > 0) {
      console.log("Cargando plantillas para modelo:", busInfo.modeloBusId);
      fetchTemplatesByBusModel(busInfo.modeloBusId);
    }
  }, [busInfo.modeloBusId, fetchTemplatesByBusModel]);

  // Log para depuración
  React.useEffect(() => {
    console.log("Templates cargadas:", templates);
    console.log("Loading templates:", loadingTemplates);
  }, [templates, loadingTemplates]);

  // Agregar sensores para el drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    onDragEnd(event);
  };

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

  // Función para obtener el tipo de asiento activo
  const getActiveSeatType = () => {
    if (!activeId) return null;
    
    const activeIdStr = activeId.toString();
    
    if (activeIdStr.startsWith('template-')) {
      const typeId = parseInt(activeIdStr.replace('template-', ''));
      return availableSeatTypes.find(type => type.id === typeId);
    }
    
    // Si es un asiento existente, encontrar su tipo
    const seatId = activeIdStr.replace('seat-', '');
    const [floor, row, col] = seatId.split('-').map(Number);
    const floorConfig = floorConfigs.find(f => f.numeroPiso === floor);
    if (!floorConfig) return null;
    
    const seat = floorConfig.asientos.find(s => s.fila === row && s.columna === col);
    if (!seat) return null;
    
    return availableSeatTypes.find(type => type.id === seat.tipoId);
  };

  const activeSeatType = getActiveSeatType();

  const handleApplyAllTemplates = () => {
    if (!templates.length || !availableSeatTypes.length) return;
    const defaultSeatType = availableSeatTypes[0];

    // Aplica cada plantilla a su piso correspondiente
    setFloorConfigs(
      templates.map(template => ({
        pisoBusId: 0,
        numeroPiso: template.numeroPiso,
        leftColumns: Math.ceil(template.columnas / 2),
        rightColumns: Math.floor(template.columnas / 2),
        rows: template.filas,
        asientos: (template.seats || []).map(seat => ({
          numero: `${seat.fila}-${seat.columna}`,
          fila: seat.fila,
          columna: seat.columna,
          tipoId: defaultSeatType.id,
          estado: 'DISPONIBLE'
        }))
      }))
    );

    // Actualiza dimensiones de cada piso
    templates.forEach(template => {
      updateFloorDimensions(template.numeroPiso, 'rows', template.filas);
      updateFloorDimensions(template.numeroPiso, 'leftColumns', Math.ceil(template.columnas / 2));
      updateFloorDimensions(template.numeroPiso, 'rightColumns', Math.floor(template.columnas / 2));
    });

    setTemplateApplied(true);
  };

  const handleRemoveTemplate = () => {
    // Resetear a la configuración predeterminada
    resetToDefault();
    setTemplateApplied(false);
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
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
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

                {/* Selector de Plantillas */}
                {busInfo.modeloBusId > 0 && templates.length > 0 && (
                  <Card className="p-4 mb-6">
                    <div className="flex items-center gap-4">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <Label className="text-sm font-medium">Plantilla disponible para este modelo:</Label>
                      {!templateApplied ? (
                        <Button
                          onClick={handleApplyAllTemplates}
                          disabled={loadingTemplates}
                          variant="default"
                        >
                          Utilizar plantilla
                        </Button>
                      ) : (
                        <Button
                          onClick={handleRemoveTemplate}
                          variant="outline"
                          className="text-orange-600 border-orange-600 hover:bg-orange-50"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Quitar plantilla
                        </Button>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {templates.map(t => <div key={t.id}>Piso {t.numeroPiso}: {t.descripcion}</div>)}
                    </div>
                      <div className="mt-1 text-xs text-gray-500"> Toma en cuenta que puedes modificar la plantilla luego de aplicarla.</div>
                  </Card>
                )}
                
                <div className="space-y-8">
                  {floorConfigs.map((floor) => (
                    <div key={floor.numeroPiso} className="space-y-6 bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Piso {floor.numeroPiso}</h3>
                        <div className="flex items-center gap-4">
                          {templateApplied ? (
                            <>
                              <div className="flex items-center gap-2">
                                <Label className="min-w-[60px]">Filas</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={12}
                                  value={floorDimensions[floor.numeroPiso]?.rows || 3}
                                  onChange={(e) => {
                                    let value = parseInt(e.target.value) || 1;
                                    if (value > 12) value = 12;
                                    if (value < 1) value = 1;
                                    // Impedir reducir si hay asientos en la(s) fila(s) a eliminar
                                    const currentRows = floorDimensions[floor.numeroPiso]?.rows || 3;
                                    if (value < currentRows) {
                                      const minRowWithSeat = Math.max(...(floor.asientos.map(s => s.fila)));
                                      if (minRowWithSeat > value) {
                                        return;
                                      }
                                    }
                                    updateFloorDimensions(floor.numeroPiso, 'rows', value);
                                  }}
                                  className="w-20"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Label className="min-w-[60px]">Columnas</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={4}
                                  value={(floorDimensions[floor.numeroPiso]?.leftColumns || 2) + (floorDimensions[floor.numeroPiso]?.rightColumns || 2)}
                                  onChange={(e) => {
                                    let value = parseInt(e.target.value) || 1;
                                    if (value > 4) value = 4;
                                    if (value < 1) value = 1;
                                    // Impedir reducir si hay asientos en la(s) columna(s) a eliminar
                                    const currentCols = (floorDimensions[floor.numeroPiso]?.leftColumns || 2) + (floorDimensions[floor.numeroPiso]?.rightColumns || 2);
                                    if (value < currentCols) {
                                      const minColWithSeat = Math.max(...(floor.asientos.map(s => s.columna)));
                                      if (minColWithSeat > value) {
                                        return;
                                      }
                                    }
                                    // Repartir columnas equitativamente
                                    const left = Math.floor(value / 2);
                                    const right = value - left;
                                    updateFloorDimensions(floor.numeroPiso, 'leftColumns', left);
                                    updateFloorDimensions(floor.numeroPiso, 'rightColumns', right);
                                  }}
                                  className="w-20"
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <Label className="min-w-[60px]">Filas</Label>
                                <Input
                                  type="number"
                                  min={3}
                                  max={12}
                                  value={floorDimensions[floor.numeroPiso]?.rows || 3}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 3;
                                    const currentRows = floorDimensions[floor.numeroPiso]?.rows || 3;
                                    if (value < currentRows) {
                                      const minRowWithSeat = Math.max(...(floor.asientos.map(s => s.fila)));
                                      if (minRowWithSeat > value) {
                                        return;
                                      }
                                    }
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
                                    const currentLeft = floorDimensions[floor.numeroPiso]?.leftColumns || 2;
                                    const pasilloCol = value + 1;
                                    if (value < currentLeft) {
                                      // No permitir si hay asientos en la columna del pasillo
                                      const hasSeatInPasillo = floor.asientos.some(s => s.columna === pasilloCol);
                                      if (hasSeatInPasillo) {
                                        return;
                                      }
                                      const minColWithSeat = Math.min(...(floor.asientos.filter(s => s.columna <= currentLeft).map(s => s.columna)));
                                      if (minColWithSeat < value + 1) {
                                        return;
                                      }
                                    }
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
                                    const currentRight = floorDimensions[floor.numeroPiso]?.rightColumns || 2;
                                    const leftColumns = floorDimensions[floor.numeroPiso]?.leftColumns || 2;
                                    const pasilloCol = leftColumns + 1;
                                    if (value < currentRight) {
                                      // No permitir si hay asientos en la columna del pasillo
                                      const hasSeatInPasillo = floor.asientos.some(s => s.columna === pasilloCol);
                                      if (hasSeatInPasillo) {
                                        return;
                                      }
                                      const minColWithSeat = Math.max(...(floor.asientos.filter(s => s.columna > leftColumns + 1).map(s => s.columna)));
                                      if (minColWithSeat > leftColumns + value + 1) {
                                        return;
                                      }
                                    }
                                    updateFloorDimensions(floor.numeroPiso, 'rightColumns', value);
                                  }}
                                  className="w-20"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-center bg-white rounded-lg p-6 shadow-sm">
                        <SeatGrid
                          floorConfig={floor}
                          seatTypes={availableSeatTypes}
                          disabled={false}
                          templateApplied={templateApplied}
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

          {/* Overlay para mostrar el asiento mientras se arrastra */}
          <DragOverlay>
            {activeId && activeSeatType ? (
              <div className="h-16 w-16 rounded-lg border-2 border-dashed border-primary bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center shadow-lg">
                {activeSeatType.icono && AVAILABLE_ICONS[activeSeatType.icono as keyof typeof AVAILABLE_ICONS] ? (
                  <div className="h-6 w-6">
                    {React.createElement(AVAILABLE_ICONS[activeSeatType.icono as keyof typeof AVAILABLE_ICONS], {
                      className: "h-6 w-6",
                      style: { color: activeSeatType.color }
                    })}
                  </div>
                ) : (
                  <Armchair className="h-6 w-6" style={{ color: activeSeatType.color }} />
                )}
                <span className="text-xs font-medium mt-1" style={{ color: activeSeatType.color }}>
                  {activeId?.toString().startsWith('template-') ? 'Nuevo' : 'Mover'}
                </span>
              </div>
            ) : null}
          </DragOverlay>
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