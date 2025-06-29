"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Ticket, 
  User, 
  MapPin, 
  Calendar,
  DollarSign,
  Hash
} from "lucide-react";
import { useBoletosRecientesQuery } from "../hooks/use-dashboard-queries";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface BoletosRecientesCardProps {
  limite?: number;
}

export function BoletosRecientesCard({ limite = 10 }: BoletosRecientesCardProps) {
  const { data: boletos, isLoading, error } = useBoletosRecientesQuery({ limite });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ticket className="mr-2 h-5 w-5" />
            Boletos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Cargando boletos recientes...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !boletos) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ticket className="mr-2 h-5 w-5" />
            Boletos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Error al cargar los boletos recientes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "CONFIRMADO":
        return <Badge variant="default">Confirmado</Badge>;
      case "PENDIENTE":
        return <Badge variant="secondary">Pendiente</Badge>;
      case "ABORDADO":
        return <Badge variant="outline">Abordado</Badge>;
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
          <Ticket className="mr-2 h-5 w-5" />
          Boletos Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {boletos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay boletos recientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {boletos.map((boleto) => (
              <div key={boleto.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/30 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center space-y-1">
                    <Ticket className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">#{boleto.id}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">
                        {boleto.cliente.nombres} {boleto.cliente.apellidos}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {boleto.viaje.horarioRuta.ruta.nombre}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {format(new Date(boleto.fechaViaje), "dd/MM/yyyy", { locale: es })}
                      </div>
                      <div className="flex items-center">
                        <Hash className="mr-1 h-3 w-3" />
                        {boleto.codigoAcceso}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getEstadoBadge(boleto.estado)}
                  <div className="flex items-center text-sm font-medium">
                    <DollarSign className="mr-1 h-4 w-4" />
                    ${boleto.precioFinal}
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