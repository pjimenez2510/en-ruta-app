"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useBusModels } from "../hooks/use-bus-models";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface BusFilters {
  numero?: string;
  placa?: string;
  estado?: string;
  modeloBusId?: number;
  anioFabricacion?: number;
}

interface BusFiltersProps {
  onFiltersChange: (filters: BusFilters) => void;
}

export const BusFilters = ({ onFiltersChange }: BusFiltersProps) => {
  const { busModels } = useBusModels();
  const [filters, setFilters] = useState<BusFilters>({});
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const handleFilterChange = (key: keyof BusFilters, value: string | number | null) => {
    const newFilters = { ...filters };
    
    if (value === null || value === "") {
      delete newFilters[key];
    } else {
      if (key === "modeloBusId" || key === "anioFabricacion") {
        newFilters[key] = typeof value === "string" ? parseInt(value) : value;
      } else {
        newFilters[key] = value as string;
      }
    }
    
    setFilters(newFilters);
    setActiveFiltersCount(Object.keys(newFilters).length);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setActiveFiltersCount(0);
    onFiltersChange({});
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filtros de Búsqueda</h2>
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              {activeFiltersCount} filtros activos
            </Badge>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label>Número de Bus</Label>
          <Input
            placeholder="Buscar por número"
            value={filters.numero || ""}
            onChange={(e) => handleFilterChange("numero", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Placa</Label>
          <Input
            placeholder="Buscar por placa"
            value={filters.placa || ""}
            onChange={(e) => handleFilterChange("placa", e.target.value.toUpperCase())}
          />
        </div>

        <div className="space-y-2">
          <Label>Estado</Label>
          <Select
            value={filters.estado || "all"}
            onValueChange={(value) => handleFilterChange("estado", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ACTIVO">Activo</SelectItem>
              <SelectItem value="MANTENIMIENTO">En Mantenimiento</SelectItem>
              <SelectItem value="RETIRADO">Retirado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Modelo</Label>
          <Select
            value={filters.modeloBusId?.toString() || "all"}
            onValueChange={(value) => handleFilterChange("modeloBusId", value === "all" ? null : parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {busModels.map((model) => (
                <SelectItem key={model.id} value={model.id.toString()}>
                  {model.marca} - {model.modelo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Año de Fabricación</Label>
          <Input
            type="number"
            placeholder="Buscar por año"
            value={filters.anioFabricacion || ""}
            onChange={(e) => handleFilterChange("anioFabricacion", e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>
      </div>
    </Card>
  );
};