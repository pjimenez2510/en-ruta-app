"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bus } from "../interfaces/bus.interface";
import { SeatType } from "@/features/seating/interfaces/seat-type.interface";
import { getAll as getAllSeatTypes } from "@/features/seating/services/seat-type.service";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useSeatGridRenderer } from "../hooks/use-seat-grid-renderer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BusFront } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusColor, getStatusIcon } from "../utils/status-utils";
import { SeatTypeLegend } from "./seat-type-legend";

interface BusDetailsModalProps {
  bus: Bus | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BusDetailsModal = ({ bus, isOpen, onClose }: BusDetailsModalProps) => {
  const { data: session } = useSession();
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const { renderSeatGrid } = useSeatGridRenderer();

  useEffect(() => {
    const loadSeatTypes = async () => {
      try {
        const types = await getAllSeatTypes(session?.user?.accessToken || "");
        setSeatTypes(types);
      } catch {
        toast.error('Error al cargar los tipos de asiento');
      }
    };
    loadSeatTypes();
  }, [session?.user?.accessToken]);

  if (!bus) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Bus</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info">
          <TabsList className="mb-4">
            <TabsTrigger value="info">Información General</TabsTrigger>
            <TabsTrigger value="seats">Distribución de Asientos</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-gray-100">
                  {bus.fotoUrl ? (
                    <Image
                      src={bus.fotoUrl}
                      alt={`Bus ${bus.numero}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BusFront className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary"
                    className={cn(
                      "font-medium flex items-center gap-1 px-3 py-1",
                      getStatusColor(bus.estado)
                    )}
                  >
                    {getStatusIcon(bus.estado)}
                    <span>{bus.estado}</span>
                  </Badge>
                </div>
              </div>

              <Card className="p-6">
                <h3 className="font-medium mb-4">Información Básica</h3>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2">
                    <dt className="text-gray-500">Número</dt>
                    <dd className="font-medium">{bus.numero}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-gray-500">Placa</dt>
                    <dd className="font-medium">{bus.placa}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-gray-500">Marca</dt>
                    <dd className="font-medium">{bus.modeloBus.marca}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-gray-500">Modelo</dt>
                    <dd className="font-medium">{bus.modeloBus.modelo}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-gray-500">Año</dt>
                    <dd className="font-medium">{bus.anioFabricacion}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-gray-500">Total Asientos</dt>
                    <dd className="font-medium">{bus.totalAsientos}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-gray-500">Combustible</dt>
                    <dd className="font-medium">{bus.tipoCombustible}</dd>
                  </div>
                </dl>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="seats">
            <div className="space-y-8">
              <div className="flex justify-end">
                <div className="w-64">
                  <SeatTypeLegend seatTypes={seatTypes} />
                </div>
              </div>
              {bus.pisos?.map((piso) => (
                <Card key={piso.id} className="p-6">
                  <h3 className="font-medium mb-6">Piso {piso.numeroPiso}</h3>
                  <div className="flex justify-center">
                    <div className="space-y-2">
                      {renderSeatGrid(
                        {
                          numeroPiso: piso.numeroPiso,
                          asientos: piso.asientos || []
                        },
                        seatTypes,
                        {
                          seatSize: "h-12 w-12",
                          interactive: false,
                          showSeatNumbers: true
                        }
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
