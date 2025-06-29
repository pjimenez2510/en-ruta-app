"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBuses } from "../hooks/use-buses";
import { BusTable } from "../components/bus-table";
import { BusFilters } from "../components/bus-filters";
import { Bus } from "../interfaces/bus.interface";
import { toast } from "sonner";
import { BusDetailsModal } from "../components/bus-details-modal";

interface Filters {
  numero?: string;
  placa?: string;
  estado?: string;
  modeloBusId?: number;
  anioFabricacion?: number;
}

export const BusesView = () => {
  const router = useRouter();
  const { buses, loading, setBusMantenimiento, setBusActivo, setBusRetirado } = useBuses();
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [filters, setFilters] = useState<Filters>({});

  const filteredBuses = useMemo(() => {
    if (!buses) return [];
    return buses.filter(bus => {
      const matchNumero = !filters.numero || bus.numero.toString().includes(filters.numero);
      const matchPlaca = !filters.placa || bus.placa.toLowerCase().includes(filters.placa.toLowerCase());
      const matchEstado = !filters.estado || filters.estado === "all" || bus.estado === filters.estado;
      const matchModelo = !filters.modeloBusId || bus.modeloBusId === filters.modeloBusId;
      const matchAnio = !filters.anioFabricacion || bus.anioFabricacion === filters.anioFabricacion;

      return matchNumero && matchPlaca && matchEstado && matchModelo && matchAnio;
    });
  }, [buses, filters]);

  const handleSetMantenimiento = async (id: string) => {
    try {
      await setBusMantenimiento(id);
      toast.success("Bus puesto en mantenimiento");
    } catch (error) {
      console.error("Error al poner en mantenimiento:", error);
      toast.error("Error al poner el bus en mantenimiento");
    }
  };

  const handleSetActivo = async (id: string) => {
    try {
      await setBusActivo(id);
      toast.success("Bus activado");
    } catch (error) {
      console.error("Error al activar:", error);
      toast.error("Error al activar el bus");
    }
  };

  const handleSetRetirado = async (id: string) => {
    try {
      await setBusRetirado(id);
      toast.success("Bus retirado");
    } catch (error) {
      console.error("Error al retirar:", error);
      toast.error("Error al retirar el bus");
    }
  };

  const handleViewDetails = async (bus: Bus) => {
    try {
      setIsViewingDetails(true);
      setSelectedBus(bus);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("Error al cargar detalles:", error);
      toast.error("Error al cargar los detalles del bus");
      setIsViewingDetails(false);
    }
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedBus(null);
    setIsViewingDetails(false);
  };

  const handleAddBus = () => {
    router.push("/main/buses/add");
  };

  return (
    <div className="container mx-auto py-6 w-8/10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Buses</h1>
        <Button onClick={handleAddBus}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Bus
        </Button>
      </div>

      <BusFilters onFiltersChange={setFilters} />

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <BusTable
            buses={filteredBuses}
            onEdit={(bus) => router.push(`/main/buses/edit/${bus.id}`)}
            onSetMantenimiento={handleSetMantenimiento}
            onSetActivo={handleSetActivo}
            onSetRetirado={handleSetRetirado}
            onViewDetails={handleViewDetails}
            isLoadingDetails={isViewingDetails}
            isFiltered={Object.keys(filters).length > 0}
            onClearFilters={() => setFilters({})}
            onAddBus={handleAddBus}
          />

          <BusDetailsModal
            bus={selectedBus}
            isOpen={isDetailsModalOpen}
            onClose={handleCloseDetailsModal}
            onLoadComplete={() => setIsViewingDetails(false)}
          />
        </>
      )}
    </div>
  );
}; 