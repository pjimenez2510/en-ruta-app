"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useBuses } from "../hooks/use-buses";
import { BusTable } from "../components/bus-table";
import { BusDetailsModal } from "../components/bus-details-modal";
import { toast } from "sonner";
import { Bus } from "../interfaces/bus.interface";
import { useRouter } from "next/navigation";

export const BusesView = () => {
  const {
    buses,
    loading,
    error,
    setBusMantenimiento,
    setBusActivo,
    setBusRetirado,
    getBusById
  } = useBuses();

  const router = useRouter();
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleSetMantenimiento = async (id: string) => {
    try {
      await setBusMantenimiento(id);
      toast.success("Estado del bus cambiado a Mantenimiento");
    } catch {
      toast.error("No se pudo cambiar el estado del bus a Mantenimiento");
    }
  };

  const handleSetActivo = async (id: string) => {
    try {
      await setBusActivo(id);
      toast.success("Estado del bus cambiado a Activo");
    } catch {
      toast.error("No se pudo cambiar el estado del bus a Activo");
    }
  };

  const handleSetRetirado = async (id: string) => {
    try {
      await setBusRetirado(id);
      toast.success("Estado del bus cambiado a Retirado");
    } catch {
      toast.error("No se pudo cambiar el estado del bus a Retirado");
    }
  };

  const openCreateDialog = () => {
    router.push('/main/buses/add');
  };

  const handleEdit = (bus: Bus) => {
    router.push(`/main/buses/edit/${bus.id}`);
  };

  const handleViewDetails = async (bus: Bus) => {
    try {
      setIsLoadingDetails(true);
      const busDetails = await getBusById(bus.id);
      if (busDetails) {
        setSelectedBus(busDetails);
        setIsDetailsModalOpen(true);
      } else {
        toast.error("No se pudieron cargar los detalles del bus");
      }
    } catch (error) {
      console.error("Error al cargar los detalles del bus:", error);
      toast.error("Error al cargar los detalles del bus");
    } finally {
      setIsLoadingDetails(false);
    }
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
        <h1 className="text-2xl font-bold">Gestión de Buses</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Bus
        </Button>
      </div>

      <BusTable
        buses={buses}
        onEdit={handleEdit}
        onSetMantenimiento={handleSetMantenimiento}
        onSetActivo={handleSetActivo}
        onSetRetirado={handleSetRetirado}
        onViewDetails={handleViewDetails}
        isLoadingDetails={isLoadingDetails}
      />

      <BusDetailsModal
        bus={selectedBus}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBus(null);
        }}
      />
    </div>
  );
}; 