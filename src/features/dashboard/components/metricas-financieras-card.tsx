"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";
import { useMetricasFinancierasQuery } from "../hooks/use-dashboard-queries";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { DashboardFilters } from "../interfaces/dashboard.interface";

interface MetricasFinancierasCardProps {
  filters?: DashboardFilters;
}

export function MetricasFinancierasCard({ filters }: MetricasFinancierasCardProps) {
  const { data: metricas, isLoading, error } = useMetricasFinancierasQuery(filters);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Métricas Financieras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Cargando métricas financieras...</span>
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
            <DollarSign className="mr-2 h-5 w-5" />
            Métricas Financieras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Error al cargar las métricas financieras</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen Principal */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metricas.totalIngresos.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total de ingresos generados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Venta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metricas.promedioVenta.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Promedio por transacción
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.totalVentas}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                {metricas.ventasAprobadas} aprobadas
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3 text-orange-500" />
                {metricas.totalVentas - metricas.ventasAprobadas} pendientes
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Descuentos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metricas.totalDescuentos.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total de descuentos aplicados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ventas por Día */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Ventas por Día
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metricas.ventasPorDia.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay datos de ventas por día</p>
            </div>
          ) : (
            <div className="space-y-4">
              {metricas.ventasPorDia.map((venta, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">
                        {format(new Date(venta.fecha), "EEEE, d 'de' MMMM", { locale: es })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {venta.ventas} ventas realizadas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${venta.ingresos.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {venta.ventas} transacciones
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 