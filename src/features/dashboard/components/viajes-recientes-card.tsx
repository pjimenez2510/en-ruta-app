"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Clock, 
  MapPin, 
  Bus,
  Calendar,
  Users
} from "lucide-react";
import { useViajesRecientesQuery } from "../hooks/use-dashboard-queries";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ViajesRecientesCardProps {
  limite?: number;
}

export function ViajesRecientesCard({ limite = 5 }: ViajesRecientesCardProps) {
  const { data: viajes, isLoading, error } = useViajesRecientesQuery({ limite });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Car className="mr-2 h-5 w-5" />
            Viajes Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Cargando viajes recientes...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !viajes) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Car className="mr-2 h-5 w-5" />
            Viajes Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Error al cargar los viajes recientes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "PROGRAMADO":
        return <Badge variant="secondary">Programado</Badge>;
      case "EN_RUTA":
        return <Badge variant="default">En Ruta</Badge>;
      case "COMPLETADO":
        return <Badge variant="outline">Completado</Badge>;
      case "CANCELADO":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Car className="mr-2 h-5 w-5" />
          Viajes Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {viajes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay viajes recientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {viajes.map((viaje) => (
              <div key={viaje.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/30 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center space-y-1">
                    <Bus className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Bus {viaje.bus.numero}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">{viaje.horarioRuta.ruta.nombre}</h4>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {viaje.horarioRuta.horaSalida}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {format(new Date(viaje.fecha), "dd/MM/yyyy", { locale: es })}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-3 w-3" />
                        {viaje.asientosOcupados}/{viaje.capacidadTotal}
                      </div>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-muted-foreground">
                        Tipo: {viaje.horarioRuta.ruta.tipoRutaBus.nombre}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getEstadoBadge(viaje.estado)}
                  <div className="text-xs text-muted-foreground">
                    Placa: {viaje.bus.placa}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 