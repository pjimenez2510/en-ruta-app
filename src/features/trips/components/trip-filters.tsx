"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FC, useState } from "react";
import { useTrips } from "../hooks/use-trips";
import { Trip } from "../interfaces/trips.interface";
import { JSX } from "react";

interface TripFiltersProps {}

export const TripFilters: FC<TripFiltersProps> = () => {
  const { trips, setFilters } = useTrips();
  const [date, setDate] = useState("");

    // Get unique routes and buses for filters
  const routes = Array.from(new Set(trips.map((trip: Trip) => trip.horarioRuta.ruta.id))).map(
    (id: number) => trips.find((trip: Trip) => trip.horarioRuta.ruta.id === id)?.horarioRuta.ruta
  ).filter(Boolean);
  const buses = Array.from(new Set(trips.map((trip: Trip) => trip.bus.id))).map(
    (id: number) => trips.find((trip: Trip) => trip.bus.id === id)?.bus
  ).filter(Boolean);

  const schedules = Array.from(new Set(trips.map(trip => trip.horarioRuta.id))).map(
    id => trips.find(trip => trip.horarioRuta.id === id)?.horarioRuta
  ).filter(Boolean);
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    setFilters(prev => ({ ...prev, fecha: e.target.value }));
  };  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, estado: value === "ALL" ? undefined : value as Trip["estado"] }));
  };

  const handleRouteChange = (value: string) => {
    setFilters(prev => ({ ...prev, rutaId: value === "ALL" ? undefined : Number(value) }));
  };

  const handleBusChange = (value: string) => {
    setFilters(prev => ({ ...prev, busId: value === "ALL" ? undefined : Number(value) }));
  };

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha</label>          <div className="grid grid-cols-3 gap-2">
            <Input
              type="date"
              value={date}
              onChange={handleDateChange}
              placeholder="Fecha específica"
            />
            <Input
              type="date"
              onChange={(e) => setFilters(prev => ({ ...prev, fechaDesde: e.target.value }))}
              placeholder="Fecha desde"
            />
            <Input
              type="date"
              onChange={(e) => setFilters(prev => ({ ...prev, fechaHasta: e.target.value }))}
              placeholder="Fecha hasta"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Estado</label>
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="PROGRAMADO">Programado</SelectItem>
              <SelectItem value="EN_CURSO">En Curso</SelectItem>
              <SelectItem value="FINALIZADO">Finalizado</SelectItem>
              <SelectItem value="CANCELADO">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ruta</label>
          <Select onValueChange={handleRouteChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar ruta" />
            </SelectTrigger>            <SelectContent>
              <SelectItem value="ALL">Todas</SelectItem>
              {routes.map(route => route && (
                <SelectItem key={route.id} value={route.id.toString()}>
                  {route.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bus</label>
          <Select onValueChange={handleBusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar bus" />
            </SelectTrigger>            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              {buses.map(bus => bus && (
                <SelectItem key={bus.id} value={bus.id.toString()}>
                  {`${bus.numero} (${bus.placa})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>        <div className="space-y-2">
          <label className="text-sm font-medium">Horario</label>
          <Select onValueChange={(value) => setFilters(prev => ({ ...prev, horarioRutaId: value === "ALL" ? undefined : Number(value) }))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar horario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              {schedules.map(schedule => schedule && (
                <SelectItem key={schedule.id} value={schedule.id.toString()}>
                  {`${schedule.horaSalida} - ${schedule.ruta.nombre}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Generación</label>
          <Select onValueChange={(value) => setFilters(prev => ({ ...prev, generacion: value === "ALL" ? undefined : value as "AUTOMATICA" | "MANUAL" }))}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de generación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="AUTOMATICA">Automática</SelectItem>
              <SelectItem value="MANUAL">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
