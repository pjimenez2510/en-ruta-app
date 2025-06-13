'use client';

import { useEffect, useState } from "react";
import { BusForm } from "../components/bus-form";
import { useBuses } from "../hooks/use-buses";
import { Bus } from "../interfaces/bus.interface";
import { BusFormValues } from "../interfaces/form-schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BusSeatTypeEditor } from "../components/bus-seat-type-editor";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditBusViewProps {
  busId: string;
}

export const EditBusView = ({ busId }: EditBusViewProps) => {
  const [bus, setBus] = useState<Bus | null>(null);
  const { updateBus, getBusById, updateBusSeats } = useBuses();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic-info");

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const busData = await getBusById(busId);
        if (busData) {
          setBus(busData);
        } else {
          toast.error("No se encontró el bus");
          router.push('/main/buses');
        }
      } catch (error) {
        console.error("Error al cargar el bus:", error);
        toast.error("Error al cargar el bus");
        router.push('/main/buses');
      } finally {
        setLoading(false);
      }
    };

    fetchBus();
  }, [busId, getBusById, router]);

  const handleBasicInfoSubmit = async (data: BusFormValues) => {
    try {
      if (!bus) return;

      const updateData: Partial<Bus> = {
        modeloBusId: data.modeloBusId,
        numero: data.numero,
        placa: data.placa,
        anioFabricacion: data.anioFabricacion,
        totalAsientos: bus.totalAsientos,
        fotoUrl: data.fotoUrl,
        tipoCombustible: data.tipoCombustible,
        fechaIngreso: bus.fechaIngreso,
        estado: bus.estado
      };

      const updatedBus = await updateBus(busId, updateData);
      if (updatedBus) {
        // Actualizar el estado local
        setBus(prevBus => ({
          ...prevBus!,
          ...updateData
        }));
        toast.success("Información del bus actualizada correctamente");
        router.push('/main/buses');
      }
    } catch (error) {
      console.error("Error al actualizar el bus:", error);
      toast.error("No se pudo actualizar la información del bus");
    }
  };

  const handleSeatsUpdate = async (updatedSeats: Array<{
    numeroPiso: number;
    asientos: Array<{
      numero: string;
      fila: number;
      columna: number;
      tipoId: number;
      estado: "DISPONIBLE" | "OCUPADO" | "MANTENIMIENTO";
    }>;
  }>) => {
    try {
      await updateBusSeats(busId, updatedSeats);
      // Actualizar el estado local
      setBus(prevBus => {
        if (!prevBus) return null;
        return {
          ...prevBus,
          pisos: updatedSeats.map((piso, index) => ({
            id: prevBus.pisos?.[index]?.id || 0,
            busId: parseInt(busId),
            numeroPiso: piso.numeroPiso,
            asientos: piso.asientos
          }))
        };
      });
      toast.success("Asientos actualizados correctamente");
      router.push('/main/buses');
    } catch (error) {
      console.error("Error al actualizar los asientos:", error);
      toast.error("No se pudieron actualizar los asientos");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!bus) {
    return null;
  }

  const basicInfoData = {
    modeloBusId: bus.modeloBus.id,
    numero: bus.numero,
    placa: bus.placa,
    anioFabricacion: bus.anioFabricacion,
    tipoCombustible: bus.tipoCombustible,
    fotoUrl: bus.fotoUrl || "",
    totalAsientos: bus.totalAsientos
  };

  return (
    <div className="container mx-auto py-6 p-16">
      <h1 className="text-2xl font-bold mb-6">Editar Bus</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic-info">Información Básica</TabsTrigger>
          <TabsTrigger value="seats">Tipos de Asientos</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <Card className="p-6">
            <BusForm
              initialData={basicInfoData}
              onSubmit={handleBasicInfoSubmit}
              onCancel={() => router.push('/main/buses')}
              isEdit={true}
            />
          </Card>
        </TabsContent>

        <TabsContent value="seats">
          <BusSeatTypeEditor
            initialSeats={bus.pisos || []}
            onSave={handleSeatsUpdate}
            onCancel={() => router.push('/main/buses')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 