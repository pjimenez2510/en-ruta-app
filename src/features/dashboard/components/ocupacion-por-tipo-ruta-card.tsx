"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  Car,
  TrendingUp
} from "lucide-react";
import { useOcupacionPorTipoRutaQuery } from "../hooks/use-dashboard-queries";
import { Loader2 } from "lucide-react";

export function OcupacionPorTipoRutaCard() {
  const { data: ocupacion, isLoading, error } = useOcupacionPorTipoRutaQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Ocupación por Tipo de Ruta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Cargando ocupación...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !ocupacion) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Ocupación por Tipo de Ruta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Error al cargar la ocupación</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          Ocupación por Tipo de Ruta
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ocupacion.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay datos de ocupación</p>
          </div>
        ) : (
          <div className="space-y-6">
            {ocupacion.map((tipo, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{tipo.nombre}</h4>
                  <Badge variant="outline">
                    {tipo.porcentajeOcupacion.toFixed(1)}% ocupación
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{tipo.asientosOcupados}</p>
                      <p className="text-xs text-muted-foreground">Ocupados</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{tipo.capacidadTotal}</p>
                      <p className="text-xs text-muted-foreground">Capacidad</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{tipo.viajes}</p>
                      <p className="text-xs text-muted-foreground">Viajes</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(tipo.porcentajeOcupacion, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 