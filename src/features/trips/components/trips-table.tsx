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
import { Trip } from "../interfaces/trips.interface";
import { TripFilters } from "../components/trip-filters";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TripForm } from "../components/trip-form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const TripsTable = () => {
  const { trips, isLoading, createTrip, updateTrip, deleteTrip } = useTrips();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  const handleCreate = async (data: Partial<Trip>) => {
    await createTrip.mutateAsync(data);
  };

  const handleUpdate = async (data: Partial<Trip>) => {
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
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hoja de Ruta</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Crear Viaje</Button>
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

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora Salida</TableHead>
              <TableHead>Ruta</TableHead>
              <TableHead>Bus</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Asientos</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell>
                  {format(new Date(trip.fecha), "PP", { locale: es })}
                </TableCell>
                <TableCell>{trip.horarioRuta.horaSalida}</TableCell>
                <TableCell>{trip.horarioRuta.ruta.nombre}</TableCell>
                <TableCell>{`${trip.bus.numero} (${trip.bus.placa})`}</TableCell>
                <TableCell>{trip.estado}</TableCell>
                <TableCell>{`${trip.asientosOcupados}/${trip.capacidadTotal}`}</TableCell>
                <TableCell>
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
