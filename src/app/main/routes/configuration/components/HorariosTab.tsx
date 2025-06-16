'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
     AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { HorarioForm } from "./HorarioForm";
import { horarioService } from "@/features/auth/services/horarios.service";
import type { HorarioResponse } from "@/features/auth/services/horarios.service";

interface Ruta {
  id: number;
  nombre: string;
  resolucionId: number;
  descripcion?: string;
  activo: boolean;
}

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export function HorariosTab({ ruta }: { ruta: Ruta }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingHorario, setEditingHorario] = useState<HorarioResponse | null>(null);
  const [deletingHorario, setDeletingHorario] = useState<HorarioResponse | null>(null);
  const [horarios, setHorarios] = useState<HorarioResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchHorarios = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await horarioService.getHorarios(ruta.id);
      setHorarios(data);
    } catch (error) {
      console.error("Error fetching horarios:", error);
      toast.error("Error al cargar los horarios");
    } finally {
      setIsLoading(false);
    }
  }, [ruta.id]);

  useEffect(() => {
    if (ruta.id) {
      fetchHorarios();
    }
  }, [ruta.id, fetchHorarios]);

  const formatDiasSemana = (diasBinario: string) => {
    return DIAS.filter((_, index) => diasBinario[index] === "1")
      .map(dia => dia.slice(0, 3))
      .join(", ");
  };

  const binaryToBooleanArray = (binary: string): boolean[] => {
    return binary.split("").map(bit => bit === "1");
  };

  const booleanArrayToBinary = (boolArray: boolean[]): string => {
    return boolArray.map(bool => bool ? "1" : "0").join("");
  };

  interface HorarioFormData {
    horaSalida: string;
    diasSemana: boolean[];
    activo: boolean;
  }

  const handleSubmit = async (data: HorarioFormData) => {
    const horarioData = {
      rutaId: ruta.id,
      horaSalida: data.horaSalida,
      diasSemana: booleanArrayToBinary(data.diasSemana),
      activo: data.activo,
    };

    try {
      setIsSubmitting(true);
      if (editingHorario?.id) {
        await horarioService.updateHorario(editingHorario.id, horarioData);
        toast.success("Horario actualizado exitosamente");
      } else {
        await horarioService.createHorario(horarioData);
        toast.success("Horario creado exitosamente");
      }
      setOpenDialog(false);
      setEditingHorario(null);
      fetchHorarios();
    } catch (error) {
      console.error("Error saving horario:", error);
      toast.error("Error al guardar el horario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (horario: HorarioResponse) => {
    setEditingHorario(horario);
    setOpenDialog(true);
  };

  const handleDeleteClick = (horario: HorarioResponse) => {
    setDeletingHorario(horario);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!deletingHorario) return;

    try {
      setIsSubmitting(true);
      await horarioService.deleteHorario(deletingHorario.id);
      toast.success("Horario eliminado exitosamente");
      fetchHorarios();
    } catch (error) {
      console.error("Error deleting horario:", error);
      toast.error("Error al eliminar el horario");
    } finally {
      setIsSubmitting(false);
      setOpenDeleteDialog(false);
      setDeletingHorario(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Horarios de la Ruta</h3>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingHorario(null)}>
                Agregar Horario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingHorario ? "Editar" : "Nuevo"} Horario
                </DialogTitle>
                <DialogDescription>
                  {editingHorario ? "Modifique" : "Agregue"} un horario a la ruta {ruta.nombre}
                </DialogDescription>
              </DialogHeader>
              <HorarioForm
                rutaId={ruta.id}
                onSubmit={handleSubmit}
                defaultValues={editingHorario ? {
                  horaSalida: editingHorario.horaSalida,
                  diasSemana: binaryToBooleanArray(editingHorario.diasSemana),
                  activo: editingHorario.activo,
                } : undefined}
                isEditing={!!editingHorario}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hora de Salida</TableHead>
                <TableHead>Días</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Cargando horarios...
                    </div>
                  </TableCell>
                </TableRow>
              ) : horarios.length > 0 ? (
                horarios.map((horario) => (
                  <TableRow key={horario.id}>
                    <TableCell>{horario.horaSalida}</TableCell>
                    <TableCell>{formatDiasSemana(horario.diasSemana)}</TableCell>
                    <TableCell>
                      <Badge variant={horario.activo ? "default" : "secondary"}>
                        {horario.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(horario)}
                          disabled={isSubmitting}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive"
                          onClick={() => handleDeleteClick(horario)}
                          disabled={isSubmitting}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No hay horarios registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el horario
              de {deletingHorario?.horaSalida} {deletingHorario ? `(${formatDiasSemana(deletingHorario.diasSemana)})` : ''}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
