'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ParadaForm } from "./ParadaForm";
import { useCiudades } from "@/features/auth/hooks/use-ciudades";
import { useParadas } from "@/features/auth/hooks/use-paradas";
import { Toaster } from "@/components/ui/sonner";
import { toast } from 'sonner';
import { Parada, Ciudad } from "@/features/auth/services/paradas.service";

interface Ruta {
  id: number;
  nombre: string;
  resolucionId: number;
  descripcion?: string;
  activo: boolean;
  paradas?: Parada[];
}

export default function ParadasTab({ ruta }: { ruta: Ruta }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [editingParada, setEditingParada] = useState<Parada | null>(null);
    const { ciudadesOptions } = useCiudades();
    const {
        paradas,
        isLoading,
        createParada,
        updateParada,
        deleteParada,
    } = useParadas(ruta.id);

    const handleSubmit = async (data: Omit<Parada, 'rutaId'>) => {
        try {
            if (editingParada) {
                await updateParada({
                    id: editingParada.id!,
                    data: {
                        ...data,
                        rutaId: ruta.id
                    }
                });
            } else {
                await createParada(data);
            }
            setOpenDialog(false);
            setEditingParada(null);
            toast.success("Parada guardada exitosamente", {
                description: "La parada se ha guardado correctamente",
            });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al guardar la parada", {
                description: "Intente nuevamente",
            });
        }
    };

    const handleEdit = (parada: Parada) => {
        setEditingParada(parada);
        setOpenDialog(true);
    };

    const handleDelete = async (parada: Parada) => {
        try {
            await deleteParada(parada.id!);
            toast.success("Parada eliminada", {
                description: "La parada se ha eliminado correctamente",
            });
        } catch (error) {
            toast.error("Error al eliminar la parada", {
                description: "Intente nuevamente" + (error instanceof Error ? `: ${error.message}` : ""),
            });
        }
    };

    return (
        <>
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
                            </DialogHeader>                            <ParadaForm
                                rutaId={ruta.id}
                                onSubmit={handleSubmit}
                                defaultValues={editingParada ? {
                                    ...editingParada,
                                    distanciaAcumulada: typeof editingParada.distanciaAcumulada === 'string' 
                                        ? parseFloat(editingParada.distanciaAcumulada) 
                                        : editingParada.distanciaAcumulada,
                                    precioAcumulado: typeof editingParada.precioAcumulado === 'string' 
                                        ? parseFloat(editingParada.precioAcumulado) 
                                        : editingParada.precioAcumulado
                                } : undefined}
                                isEditing={!!editingParada}
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
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        Cargando paradas...
                                    </TableCell>
                                </TableRow>
                            ) : paradas && paradas.length > 0 ? (
                                paradas.map((parada) => (
                                    <TableRow key={`${parada.rutaId}-${parada.orden}`}>
                                        <TableCell>{parada.orden === 0 ? 'Origen' : parada.orden}</TableCell>                                        <TableCell>
                                            {parada.ciudad?.nombre || ciudadesOptions.find(opt => Number(opt.value) === parada.ciudadId)?.label || `Ciudad ${parada.ciudadId}`}
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
            <Toaster />
        </>
    );
}