'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ParadaForm } from "./ParadaForm";

interface Ciudad {
  id: number;
  nombre: string;
}

interface Parada {
  rutaId: number;
  ciudadId: number;
  orden: number;
  distanciaAcumulada: number;
  tiempoAcumulado: number;
  precioAcumulado: number;
}

interface Ruta {
  id: number;
  nombre: string;
  resolucionId: number;
  descripcion?: string;
  activo: boolean;
  paradas?: Parada[];
}

// Temporary mock data for cities - Replace with API call
const mockCiudades: Ciudad[] = [
  { id: 1, nombre: "Quito" },
  { id: 2, nombre: "Guayaquil" },
  { id: 3, nombre: "Cuenca" },
];

export default function ParadasTab({ ruta }: { ruta: Ruta }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [editingParada, setEditingParada] = useState<Parada | null>(null);

    const handleSubmit = async (data: Omit<Parada, 'rutaId'>) => {
        const paradaData: Parada = {
            ...data,
            rutaId: ruta.id,
        };

        try {
            if (editingParada) {
                // TODO: Call API to update parada
                console.log('Updating parada:', paradaData);
            } else {
                // TODO: Call API to create parada
                console.log('Creating parada:', paradaData);
            }
            setOpenDialog(false);
            setEditingParada(null);
        } catch (error) {
            console.error('Error saving parada:', error);
        }
    };

    const handleEdit = (parada: Parada) => {
        setEditingParada(parada);
        setOpenDialog(true);
    };

    const handleDelete = async (parada: Parada) => {
        try {
            // TODO: Call API to delete parada
            console.log('Deleting parada:', parada);
        } catch (error) {
            console.error('Error deleting parada:', error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Paradas de la Ruta</h3>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingParada(null)}>
                            Agregar Parada
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingParada ? "Editar" : "Nueva"} Parada
                            </DialogTitle>
                            <DialogDescription>
                                {editingParada ? "Modifique" : "Agregue"} una parada a la ruta {ruta.nombre}
                            </DialogDescription>
                        </DialogHeader>
                        <ParadaForm
                            rutaId={ruta.id}
                            onSubmit={handleSubmit}
                            defaultValues={editingParada || undefined}
                            isEditing={!!editingParada}
                            ciudades={mockCiudades}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Orden</TableHead>
                            <TableHead>Ciudad</TableHead>
                            <TableHead>Distancia Acumulada (km)</TableHead>
                            <TableHead>Tiempo Acumulado (min)</TableHead>
                            <TableHead>Precio Acumulado ($)</TableHead>
                            <TableHead className="w-[100px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ruta.paradas && ruta.paradas.length > 0 ? (
                            ruta.paradas.map((parada) => (
                                <TableRow key={`${parada.rutaId}-${parada.orden}`}>
                                    <TableCell>{parada.orden === 0 ? 'Origen' : parada.orden}</TableCell>
                                    <TableCell>
                                        {mockCiudades.find(c => c.id === parada.ciudadId)?.nombre || `Ciudad ${parada.ciudadId}`}
                                    </TableCell>
                                    <TableCell>{parada.distanciaAcumulada} km</TableCell>
                                    <TableCell>{parada.tiempoAcumulado} min</TableCell>
                                    <TableCell>${parada.precioAcumulado}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleEdit(parada)}
                                            >
                                                Editar
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="text-destructive"
                                                onClick={() => handleDelete(parada)}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No hay paradas registradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
