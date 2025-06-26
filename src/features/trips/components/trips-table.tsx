"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useTrips } from "../hooks/use-trips";
import { Trip, CreateTripDTO } from "../interfaces/trips.interface";
import { TripFilters } from "../components/trip-filters";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TripForm } from "../components/trip-form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Eye, Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const TripsTable = () => {
  const { trips, isLoading, isFetching, createTrip, updateTrip, deleteTrip } = useTrips();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const handleCreate = async (data: CreateTripDTO) => {
    await createTrip.mutateAsync(data);
  };

  const handleUpdate = async (data: CreateTripDTO) => {
    if (selectedTrip) {
      await updateTrip.mutateAsync({ id: selectedTrip.id, trip: data });
      setSelectedTrip(null);
    }
  };

  const handleDelete = async (trip: Trip) => {
    setTripToDelete(trip);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (tripToDelete) {
      await deleteTrip.mutateAsync(tripToDelete.id);
      setIsDeleteDialogOpen(false);
      setTripToDelete(null);
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-center">Hoja de Ruta</h2>
          {isFetching && !isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 rounded-lg shadow-sm px-4 py-2">
              <Plus className="h-4 w-4" />
              Crear Viaje
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Viaje</DialogTitle>
            </DialogHeader>
            <TripForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      <TripFilters />

      <Card className="rounded-2xl shadow-lg w-full">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Fecha</TableHead>
              <TableHead className="text-center">Hora Salida</TableHead>
              <TableHead className="text-center">Ruta</TableHead>
              <TableHead className="text-center">Bus</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">Asientos</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id} className="hover:bg-accent/30 transition-colors align-middle">
                <TableCell className="text-center align-middle">
                  {format(new Date(trip.fecha), "PP", { locale: es })}
                </TableCell>
                <TableCell className="text-center align-middle">{trip.horarioRuta.horaSalida}</TableCell>
                <TableCell className="text-center align-middle max-w-[160px] truncate" title={trip.horarioRuta.ruta.nombre}>
                  {trip.horarioRuta.ruta.nombre}
                </TableCell>
                <TableCell className="text-center align-middle max-w-[160px] truncate" title={`${trip.bus.numero} (${trip.bus.placa})`}>
                  {`${trip.bus.numero} (${trip.bus.placa})`}
                </TableCell>
                <TableCell className="text-center align-middle">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    trip.estado === 'COMPLETADO' ? 'bg-green-100 text-green-700' :
                    trip.estado === 'CANCELADO' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'}`}
                  >
                    {trip.estado}
                  </span>
                </TableCell>
                <TableCell className="text-center align-middle">
                  {`${trip.asientosOcupados}/${trip.capacidadTotal}`}
                </TableCell>
                <TableCell className="text-center align-middle">
                  <div className="flex items-center justify-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedTrip(trip)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedTrip(trip)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(trip)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selectedTrip} onOpenChange={(open) => !open && setSelectedTrip(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTrip ? "Editar Viaje" : "Detalles del Viaje"}
            </DialogTitle>
          </DialogHeader>
          {selectedTrip && (
            <TripForm
              trip={selectedTrip}
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente este viaje
              y toda su información asociada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
