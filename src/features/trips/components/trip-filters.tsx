"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FC, useState, useEffect } from "react";
import { Trip } from "../interfaces/trips.interface";
import type { TripFilters as TripFiltersType } from "../interfaces/trips.interface";

interface TripFiltersProps {
  filters: TripFiltersType;
  setFilters: (filters: TripFiltersType) => void;
  allTrips: Trip[];
}

export const TripFilters: FC<TripFiltersProps> = ({
  filters,
  setFilters,
  allTrips,
}) => {
  const [date, setDate] = useState(filters.fecha || "");
  const [selectedEstado, setSelectedEstado] = useState<string>(
    filters.estado || "ALL"
  );
  const [selectedRuta, setSelectedRuta] = useState<string>(
    filters.rutaId?.toString() || "ALL"
  );
  const [selectedBus, setSelectedBus] = useState<string>(
    filters.busId?.toString() || "ALL"
  );
  const [selectedHorario, setSelectedHorario] = useState<string>(
    filters.horarioRutaId?.toString() || "ALL"
  );
  const [selectedGeneracion, setSelectedGeneracion] = useState<string>(
    filters.generacion || "ALL"
  );

  useEffect(() => {
    setDate(filters.fecha || "");
    setSelectedEstado(filters.estado || "ALL");
    setSelectedRuta(filters.rutaId?.toString() || "ALL");
    setSelectedBus(filters.busId?.toString() || "ALL");
    setSelectedHorario(filters.horarioRutaId?.toString() || "ALL");
    setSelectedGeneracion(filters.generacion || "ALL");
  }, [filters]);

  useEffect(() => {
    const newFilters = {
      fecha: date || undefined,
      estado:
        selectedEstado === "ALL"
          ? undefined
          : (selectedEstado as Trip["estado"]),
      rutaId: selectedRuta === "ALL" ? undefined : Number(selectedRuta),
      busId: selectedBus === "ALL" ? undefined : Number(selectedBus),
      horarioRutaId:
        selectedHorario === "ALL" ? undefined : Number(selectedHorario),
      generacion:
        selectedGeneracion === "ALL"
          ? undefined
          : (selectedGeneracion as "AUTOMATICA" | "MANUAL"),
    };
    setFilters(newFilters);
  }, [
    date,
    selectedEstado,
    selectedRuta,
    selectedBus,
    selectedHorario,
    selectedGeneracion,
    setFilters,
  ]);

  const routes = Array.from(
    new Set(allTrips.map((trip: Trip) => trip.horarioRuta.ruta.id))
  )
    .map(
      (id: number) =>
        allTrips.find((trip: Trip) => trip.horarioRuta.ruta.id === id)
          ?.horarioRuta.ruta
    )
    .filter(Boolean);

  const buses = Array.from(new Set(allTrips.map((trip: Trip) => trip.bus.id)))
    .map((id: number) => allTrips.find((trip: Trip) => trip.bus.id === id)?.bus)
    .filter(Boolean);

  const schedules = Array.from(
    new Set(allTrips.map((trip) => trip.horarioRuta.id))
  )
    .map(
      (id) => allTrips.find((trip) => trip.horarioRuta.id === id)?.horarioRuta
    )
    .filter(Boolean);

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Selecciona una fecha"
            className="rounded-lg shadow-sm text-sm px-3 py-2 placeholder:text-gray-400"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Estado</label>
          <Select value={selectedEstado} onValueChange={setSelectedEstado}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="PROGRAMADO">Programado</SelectItem>
              <SelectItem value="EN_RUTA">En Ruta</SelectItem>
              <SelectItem value="COMPLETADO">Completado</SelectItem>
              <SelectItem value="CANCELADO">Cancelado</SelectItem>
              <SelectItem value="RETRASADO">Retrasado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Ruta</label>
          <Select value={selectedRuta} onValueChange={setSelectedRuta}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar ruta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas</SelectItem>
              {routes.map(
                (route) =>
                  route && (
                    <SelectItem key={route.id} value={route.id.toString()}>
                      {route.nombre}
                    </SelectItem>
                  )
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Bus</label>
          <Select value={selectedBus} onValueChange={setSelectedBus}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar bus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              {buses.map(
                (bus) =>
                  bus && (
                    <SelectItem key={bus.id} value={bus.id.toString()}>
                      {`${bus.numero} (${bus.placa})`}
                    </SelectItem>
                  )
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Horario</label>
          <Select value={selectedHorario} onValueChange={setSelectedHorario}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar horario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              {schedules.map(
                (schedule) =>
                  schedule && (
                    <SelectItem
                      key={schedule.id}
                      value={schedule.id.toString()}
                    >
                      {`${schedule.horaSalida} - ${schedule.ruta.nombre}`}
                    </SelectItem>
                  )
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Generación</label>
          <Select
            value={selectedGeneracion}
            onValueChange={setSelectedGeneracion}
          >
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
