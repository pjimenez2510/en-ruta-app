"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Car, 
  Ticket, 
  DollarSign,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { useEstadisticasPorDiaQuery } from "../hooks/use-dashboard-queries";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface EstadisticasPorDiaCardProps {
  dias?: number;
}

export function EstadisticasPorDiaCard({ dias = 7 }: EstadisticasPorDiaCardProps) {
  const { data: estadisticas, isLoading, error } = useEstadisticasPorDiaQuery({ dias });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Estadísticas por Día
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Cargando estadísticas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !estadisticas) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Estadísticas por Día
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Error al cargar las estadísticas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Estadísticas por Día (Últimos {dias} días)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {estadisticas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay estadísticas disponibles</p>
          </div>
        ) : (
          <div className="space-y-4">
            {estadisticas.map((estadistica, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-accent/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">
                      {format(new Date(estadistica.fecha), "EEEE, d 'de' MMMM", { locale: es })}
                    </h4>
                  </div>
                  <Badge variant="outline">
                    {format(new Date(estadistica.fecha), "dd/MM", { locale: es })}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium">{estadistica.viajes}</p>
                      <p className="text-xs text-muted-foreground">Viajes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium">{estadistica.viajesCompletados}</p>
                      <p className="text-xs text-muted-foreground">Completados</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Ticket className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="font-medium">{estadistica.boletos}</p>
                      <p className="text-xs text-muted-foreground">Boletos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium">${estadistica.ingresos.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Ingresos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="font-medium">{estadistica.ocupacionPromedio.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Ocupación</p>
                    </div>
                  </div>
                </div>
                
                {/* Barra de progreso para ocupación */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Ocupación promedio</span>
                    <span>{estadistica.ocupacionPromedio.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(estadistica.ocupacionPromedio, 100)}%` }}
                    ></div>
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