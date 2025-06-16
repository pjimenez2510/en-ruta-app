"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bus } from "../interfaces/bus.interface";
import { MoreHorizontal, Pencil, Wrench, BusFront, Undo2, Loader2, Ban } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface BusTableProps {
  buses: Bus[];
  onEdit: (bus: Bus) => void;
  onSetMantenimiento: (id: string) => Promise<void>;
  onSetActivo: (id: string) => Promise<void>;
  onSetRetirado: (id: string) => Promise<void>;
  onViewDetails: (bus: Bus) => Promise<void>;
  isLoadingDetails: boolean;
}

export const BusTable = ({
  buses,
  onEdit,
  onSetMantenimiento,
  onSetActivo,
  onSetRetirado,
  onViewDetails,
  isLoadingDetails
}: BusTableProps) => {
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  const handleAction = async (action: () => Promise<void>, busId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, [busId]: true }));
      await action();
    } finally {
      setLoadingStates(prev => ({ ...prev, [busId]: false }));
    }
  };

  return (
    <div className="space-y-3">
      {buses.map((bus) => (
        <Card key={bus.id} className="p-3 hover:shadow-md transition-shadow">
          <div className="flex gap-4">
            <div className="relative h-[140px] w-[220px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              {bus.fotoUrl ? (
                <Image
                  src={bus.fotoUrl}
                  alt={`Bus ${bus.numero}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 220px) 100vw, 220px"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <BusFront className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium">Bus #{bus.numero}</h3>
                  <p className="text-sm text-gray-500">Placa: {bus.placa}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      bus.estado === 'ACTIVO'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : bus.estado === 'MANTENIMIENTO'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }
                  >
                    {bus.estado.toLowerCase()}
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(() => onViewDetails(bus), bus.id)}
                    disabled={loadingStates[bus.id] || isLoadingDetails}
                  >
                    {loadingStates[bus.id] || isLoadingDetails ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Ver detalles'
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(bus)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      {bus.estado === 'ACTIVO' && (
                        <DropdownMenuItem 
                          onClick={() => handleAction(() => onSetMantenimiento(bus.id), bus.id)}
                          disabled={loadingStates[bus.id]}
                        >
                          <Wrench className="mr-2 h-4 w-4" />
                          Poner en mantenimiento
                        </DropdownMenuItem>
                      )}
                      {bus.estado === 'MANTENIMIENTO' && (
                        <DropdownMenuItem 
                          onClick={() => handleAction(() => onSetActivo(bus.id), bus.id)}
                          disabled={loadingStates[bus.id]}
                        >
                          <Undo2 className="mr-2 h-4 w-4" />
                          Marcar como activo
                        </DropdownMenuItem>
                      )}
                      {bus.estado !== 'RETIRADO' && (
                        <DropdownMenuItem 
                          onClick={() => handleAction(() => onSetRetirado(bus.id), bus.id)}
                          disabled={loadingStates[bus.id]}
                          className="text-destructive"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Retirar bus
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Modelo:</span>{" "}
                  <span className="font-medium">{bus.modeloBus.marca} - {bus.modeloBus.modelo}</span>
                </div>
                <div>
                  <span className="text-gray-500">Año:</span>{" "}
                  <span className="font-medium">{bus.anioFabricacion}</span>
                </div>
                <div>
                  <span className="text-gray-500">Asientos:</span>{" "}
                  <span className="font-medium">{bus.totalAsientos}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}; 