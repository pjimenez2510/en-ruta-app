"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bus } from "../interfaces/bus.interface";
import { useSeatGridRenderer } from "../hooks/use-seat-grid-renderer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusColor } from "../utils/status-utils";
import { SeatTypeLegend } from "./seat-type-legend";
import { useSeatTypes } from "../hooks/use-seat-types";
import { useBuses } from "../hooks/use-buses";
import { useEffect, useState } from "react";

interface BusDetailsModalProps {
  bus: Bus | null;
  isOpen: boolean;
  onClose: () => void;
  onBusUpdate?: (updatedBus: Bus) => void;
  onLoadComplete?: () => void;
}

export const BusDetailsModal = ({ bus, isOpen, onClose, onBusUpdate, onLoadComplete }: BusDetailsModalProps) => {
  const { seatTypes, loading: loadingSeatTypes } = useSeatTypes();
  const { renderSeatGrid } = useSeatGridRenderer();
  const { getBusById } = useBuses();
  const [currentBus, setCurrentBus] = useState<Bus | null>(bus);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  // Cargar datos completos del bus cuando se abre el modal o cambia el bus
  useEffect(() => {
    const loadBusDetails = async () => {
      if (bus && isOpen) {
        try {
          setRefreshing(true);
          const updatedBus = await getBusById(bus.id);
          setCurrentBus(updatedBus);
          if (onBusUpdate) {
            onBusUpdate(updatedBus);
          }
        } catch (error) {
          console.error('Error loading bus details:', error);
        } finally {
          setRefreshing(false);
          if (onLoadComplete) {
            onLoadComplete();
          }
        }
      } else if (!isOpen) {
        setCurrentBus(null);
        setActiveTab("info");
      }
    };

    loadBusDetails();
  }, [bus, isOpen, getBusById, onBusUpdate, onLoadComplete]);

  if (!currentBus) return null;

  const renderFloorContent = (piso: NonNullable<Bus['pisos']>[number]) => {
    if (!piso || !Array.isArray(piso.asientos)) {
      return (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">No hay asientos configurados para este piso</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {renderSeatGrid(
          {
            numeroPiso: piso.numeroPiso,
            asientos: piso.asientos
          },
          seatTypes,
          {
            seatSize: "h-12 w-12",
            interactive: false,
            showSeatNumbers: true
          }
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detalles del Bus</DialogTitle>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="info">Información General</TabsTrigger>
            <TabsTrigger value="seats">Distribución de Asientos</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Bus #{currentBus.numero}</h3>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          getStatusColor(currentBus.estado)
                        )}
                      >
                        {currentBus.estado.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Placa</p>
                        <p className="font-medium">{currentBus.placa}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Año</p>
                        <p className="font-medium">{currentBus.anioFabricacion}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Asientos</p>
                        <p className="font-medium">{currentBus.totalAsientos}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Combustible</p>
                        <p className="font-medium">{currentBus.tipoCombustible}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="col-span-2 md:col-span-1">
                <Card className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Modelo</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Marca</p>
                        <p className="font-medium">{currentBus.modeloBus.marca}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Modelo</p>
                        <p className="font-medium">{currentBus.modeloBus.modelo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tipo Chasis</p>
                        <p className="font-medium">{currentBus.modeloBus.tipoChasis}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tipo Carrocería</p>
                        <p className="font-medium">{currentBus.modeloBus.tipoCarroceria}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seats">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-8">
                {loadingSeatTypes || refreshing ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                  </div>
                ) : (
                  <>
                    {currentBus.pisos && currentBus.pisos.length > 0 ? (
                      currentBus.pisos.map((piso) => (
                        <Card key={piso.id} className="p-6">
                          <h3 className="font-medium mb-6">Piso {piso.numeroPiso}</h3>
                          <div className="flex justify-center">
                            {renderFloorContent(piso)}
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-48">
                        <p className="text-gray-500">No hay pisos configurados para este bus</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="lg:col-span-2">
                <div className="sticky top-24">
                  {!loadingSeatTypes && !refreshing && (
                    <SeatTypeLegend seatTypes={seatTypes} />
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
