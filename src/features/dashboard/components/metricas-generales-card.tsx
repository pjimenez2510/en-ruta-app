"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bus, 
  Route, 
  Car, 
  Ticket, 
  ShoppingCart, 
  Users,
  TrendingUp,
  Wrench,
  CheckCircle
} from "lucide-react";
import { useMetricasGeneralesQuery } from "../hooks/use-dashboard-queries";
import { Loader2 } from "lucide-react";

export function MetricasGeneralesCard() {
  const { data: metricas, isLoading, error } = useMetricasGeneralesQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Métricas Generales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Cargando métricas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !metricas) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Métricas Generales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Error al cargar las métricas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Buses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Buses</CardTitle>
          <Bus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metricas.buses.total}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
              {metricas.buses.activos} activos
            </div>
            <div className="flex items-center">
              <Wrench className="mr-1 h-3 w-3 text-orange-500" />
              {metricas.buses.mantenimiento} en mantenimiento
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${metricas.buses.porcentajeActivos}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {metricas.buses.porcentajeActivos}% activos
          </p>
        </CardContent>
      </Card>

      {/* Rutas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rutas</CardTitle>
          <Route className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metricas.rutas.total}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
            {metricas.rutas.activas} activas
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${metricas.rutas.porcentajeActivas}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {metricas.rutas.porcentajeActivas}% activas
          </p>
        </CardContent>
      </Card>

      {/* Viajes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Viajes</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metricas.viajes.total}</div>
          <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Programados:</span>
              <Badge variant="secondary" className="text-xs">
                {metricas.viajes.programados}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>En ruta:</span>
              <Badge variant="outline" className="text-xs">
                {metricas.viajes.enRuta}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Completados:</span>
              <Badge variant="default" className="text-xs">
                {metricas.viajes.completados}
              </Badge>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-purple-600 h-2 rounded-full" 
              style={{ width: `${metricas.viajes.porcentajeCompletados}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {metricas.viajes.porcentajeCompletados}% completados
          </p>
        </CardContent>
      </Card>

      {/* Boletos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Boletos</CardTitle>
          <Ticket className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metricas.boletos.total}</div>
          <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Confirmados:</span>
              <Badge variant="default" className="text-xs">
                {metricas.boletos.confirmados}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Pendientes:</span>
              <Badge variant="outline" className="text-xs">
                {metricas.boletos.pendientes}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Abordados:</span>
              <Badge variant="secondary" className="text-xs">
                {metricas.boletos.abordados}
              </Badge>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-yellow-600 h-2 rounded-full" 
              style={{ width: `${metricas.boletos.porcentajeConfirmados}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {metricas.boletos.porcentajeConfirmados}% confirmados
          </p>
        </CardContent>
      </Card>

      {/* Ventas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventas</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metricas.ventas.total}</div>
          <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Aprobadas:</span>
              <Badge variant="default" className="text-xs">
                {metricas.ventas.aprobadas}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Pendientes:</span>
              <Badge variant="outline" className="text-xs">
                {metricas.ventas.pendientes}
              </Badge>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${metricas.ventas.porcentajeAprobadas}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {metricas.ventas.porcentajeAprobadas}% aprobadas
          </p>
        </CardContent>
      </Card>

      {/* Personal */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Personal</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>Conductores</span>
                <span className="font-medium">{metricas.personal.conductores.total}</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                {metricas.personal.conductores.activos} activos
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${metricas.personal.conductores.porcentajeActivos}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>Ayudantes</span>
                <span className="font-medium">{metricas.personal.ayudantes.total}</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                {metricas.personal.ayudantes.activos} activos
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${metricas.personal.ayudantes.porcentajeActivos}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 