'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/shared/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { HorarioForm } from "./HorarioForm";

interface Horario {
  id?: number;
  rutaId: number;
  horaSalida: string;
  diasSemana: string;
  activo: boolean;
}

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
  const [editingHorario, setEditingHorario] = useState<Horario | null>(null);
  const [horarios, setHorarios] = useState<Horario[]>([]);

  useEffect(() => {
    if (ruta.id) {
      fetchHorarios();
    }
  }, [ruta.id]);

  const fetchHorarios = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/horarios-ruta?rutaId=${ruta.id}`);
      const data = await response.json();
      setHorarios(data);
    } catch (error) {
      console.error("Error fetching horarios:", error);
    }
  };

  const formatDiasSemana = (diasBinario: string) => {
    return DIAS.filter((_, index) => diasBinario[index] === "1")
      .map(dia => dia.slice(0, 3))
      .join(", ");
  };

  const binaryToBooleanArray = (binary: string): boolean[] => {
    return binary.split("").map(bit => bit === "1");
  };

  const handleSubmit = async (data: any) => {
    const horarioData: Horario = {
      ...editingHorario,
      rutaId: ruta.id,
      horaSalida: data.horaSalida,
      diasSemana: data.diasSemana.map((active: boolean) => active ? "1" : "0").join(""),
      activo: data.activo,
    };

    try {
      if (editingHorario?.id) {
        // TODO: Replace with actual API call
        await fetch(`/api/horarios-ruta/${editingHorario.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(horarioData),
        });
      } else {
        // TODO: Replace with actual API call
        await fetch("/api/horarios-ruta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(horarioData),
        });
      }
      setOpenDialog(false);
      setEditingHorario(null);
      fetchHorarios();
    } catch (error) {
      console.error("Error saving horario:", error);
    }
  };

  const handleEdit = (horario: Horario) => {
    setEditingHorario({
      ...horario,
      diasSemana: horario.diasSemana,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (horario: Horario) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/horarios-ruta/${horario.id}`, {
        method: "DELETE",
      });
      fetchHorarios();
    } catch (error) {
      console.error("Error deleting horario:", error);
    }
  };

  return (
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
            {horarios.length > 0 ? (
              horarios.map((horario) => (
                <TableRow key={`${horario.rutaId}-${horario.horaSalida}`}>
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
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive"
                        onClick={() => handleDelete(horario)}
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
  );
}
