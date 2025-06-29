"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Filter } from "lucide-react";
import { MetricasFinancierasCard } from "./metricas-financieras-card";
import type { DashboardFilters } from "../interfaces/dashboard.interface";

export function MetricasFinancierasConFiltros() {
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const handleAplicarFiltros = () => {
    const newFilters: DashboardFilters = {};
    
    if (fechaInicio) newFilters.fechaInicio = fechaInicio;
    if (fechaFin) newFilters.fechaFin = fechaFin;
    
    setFilters(newFilters);
  };

  const handleLimpiarFiltros = () => {
    setFilters({});
    setFechaInicio("");
    setFechaFin("");
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtros de Fecha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="fechaInicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  placeholder="Seleccionar fecha de inicio"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha de Fin</Label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="fechaFin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  placeholder="Seleccionar fecha de fin"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Button onClick={handleAplicarFiltros} variant="default">
              Aplicar Filtros
            </Button>
            <Button onClick={handleLimpiarFiltros} variant="outline">
              Limpiar Filtros
            </Button>
          </div>
          
          {/* Mostrar filtros activos */}
          {(filters.fechaInicio || filters.fechaFin) && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Filtros activos:</p>
              <div className="text-sm text-muted-foreground">
                {filters.fechaInicio && (
                  <p>Desde: {new Date(filters.fechaInicio).toLocaleDateString('es-ES')}</p>
                )}
                {filters.fechaFin && (
                  <p>Hasta: {new Date(filters.fechaFin).toLocaleDateString('es-ES')}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Métricas Financieras */}
      <MetricasFinancierasCard filters={filters} />
    </div>
  );
} 