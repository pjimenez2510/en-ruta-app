"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSeatTypes } from "../hooks/use-seat-types";
import { SeatTypeTable } from "../components/seat-type-table";
import { SeatTypeForm } from "../components/seat-type-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SeatType } from "../interfaces/seat-type.interface";

export const SeatTypesView = () => {
  const {
    seatTypes,
    loading,
    error,
    createSeatType,
    updateSeatType,
    deleteSeatType,
  } = useSeatTypes();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSeatType, setSelectedSeatType] = useState<SeatType | undefined>();

  const handleCreate = async (data: any) => {
    try {
      await createSeatType(data);
      setIsDialogOpen(false);
      toast.success("Tipo de asiento creado correctamente");
    } catch {
      toast.error("No se pudo crear el tipo de asiento");
    }
  };

  const handleEdit = async (data: any, id: number) => {
    if (!selectedSeatType) return;
    try {
      await updateSeatType(data, id);
      setIsDialogOpen(false);
      setSelectedSeatType(undefined);
      toast.success("Tipo de asiento actualizado correctamente");
    } catch {
      toast.error("No se pudo actualizar el tipo de asiento");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSeatType(id);
      toast.success("Tipo de asiento eliminado correctamente");
    } catch {
      toast.error("No se pudo eliminar el tipo de asiento");
    }
  };

  const openCreateDialog = () => {
    setSelectedSeatType(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (seatType: SeatType) => {
    setSelectedSeatType(seatType);
    setIsDialogOpen(true);
  };

if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-6 p-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tipos de Asientos</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Tipo de Asiento
        </Button>
      </div>

      <SeatTypeTable
        seatTypes={seatTypes}
        onEdit={openEditDialog}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSeatType ? "Editar Tipo de Asiento" : "Nuevo Tipo de Asiento"}
            </DialogTitle>
          </DialogHeader>
          <SeatTypeForm
            initialData={selectedSeatType}
            onSubmit={(data) => {
              if (selectedSeatType) {
                handleEdit(data, selectedSeatType.id);
              } else {
                handleCreate(data);
              }
            }}
            onCancel={() => {
              setIsDialogOpen(false);
              setSelectedSeatType(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}; 