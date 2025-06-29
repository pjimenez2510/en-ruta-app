"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  MoreHorizontal,
  Pencil,
  Ban,
  BusFront,
  Loader2
} from "lucide-react";
import { Bus } from "../interfaces/bus.interface";
import { EmptyState } from "./empty-state";
import Image from "next/image";

interface BusTableProps {
  buses: Bus[];
  onEdit: (bus: Bus) => void;
  onSetMantenimiento: (id: string) => Promise<void>;
  onSetActivo: (id: string) => Promise<void>;
  onSetRetirado: (id: string) => Promise<void>;
  onViewDetails: (bus: Bus) => Promise<void>;
  isLoadingDetails: boolean;
  isFiltered?: boolean;
  onClearFilters: () => void;
  onAddBus: () => void;
}

export const BusTable = ({ 
  buses, 
  onEdit, 
  onSetMantenimiento,
  onSetActivo,
  onSetRetirado,
  onViewDetails,
  isLoadingDetails,
  isFiltered = false,
  onClearFilters,
  onAddBus
}: BusTableProps) => {
  const [loadingStates, setLoadingStates] = useState<{[key: string]: string}>({});

  if (!buses || buses.length === 0) {
    return (
      <EmptyState 
        type={isFiltered ? "no-results" : "no-buses"}
        onAction={isFiltered ? onClearFilters : onAddBus}
      />
    );
  }

  const handleAction = async (action: () => Promise<void>, busId: string, actionType: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, [busId]: actionType }));
      await action();
    } finally {
      setLoadingStates(prev => ({ ...prev, [busId]: '' }));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVO: "bg-green-100 text-green-800 hover:bg-green-200",
      MANTENIMIENTO: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      RETIRADO: "bg-red-100 text-red-800 hover:bg-red-200"
    }[status] || "bg-gray-100 text-gray-800 hover:bg-gray-200";

    return (
      <Badge className={statusConfig}>
        {status.toLowerCase()}
      </Badge>
    );
  };

  const isBusLoading = (busId: string) => loadingStates[busId] !== undefined && loadingStates[busId] !== '';

  return (
    <div className="space-y-4">
      {buses.map((bus) => (
        <Card key={bus.id} className="p-4 hover:shadow-md transition-shadow">
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
                  {getStatusBadge(bus.estado)}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(() => onViewDetails(bus), bus.id, 'details')}
                    disabled={isBusLoading(bus.id) || isLoadingDetails}
                  >
                    {loadingStates[bus.id] === 'details' || isLoadingDetails ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Ver detalles'
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={isBusLoading(bus.id)}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem 
                        onClick={() => onEdit(bus)}
                        disabled={isBusLoading(bus.id)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      {bus.estado === 'ACTIVO' && (
                        <DropdownMenuItem 
                          onClick={() => handleAction(() => onSetMantenimiento(bus.id), bus.id, 'mantenimiento')}
                          disabled={isBusLoading(bus.id)}
                        >
                          {loadingStates[bus.id] === 'mantenimiento' ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <span className="mr-2">🔧</span>
                          )}
                          Poner en mantenimiento
                        </DropdownMenuItem>
                      )}
                      {bus.estado === 'MANTENIMIENTO' && (
                        <DropdownMenuItem 
                          onClick={() => handleAction(() => onSetActivo(bus.id), bus.id, 'activo')}
                          disabled={isBusLoading(bus.id)}
                        >
                          {loadingStates[bus.id] === 'activo' ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <span className="mr-2">✅</span>
                          )}
                          Marcar como activo
                        </DropdownMenuItem>
                      )}
                      {bus.estado !== 'RETIRADO' && (
                        <DropdownMenuItem 
                          onClick={() => handleAction(() => onSetRetirado(bus.id), bus.id, 'retirado')}
                          disabled={isBusLoading(bus.id)}
                          className="text-destructive"
                        >
                          {loadingStates[bus.id] === 'retirado' ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Ban className="mr-2 h-4 w-4" />
                          )}
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
                <div>
                  <span className="text-gray-500">Combustible:</span>{" "}
                  <span className="font-medium">{bus.tipoCombustible}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}; 