'use client';

import { BusCreationStepper } from '@/features/buses/components/bus-creation-stepper';
import { useBuses } from '@/features/buses/hooks/use-buses';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { BusCreationData } from '@/features/buses/interfaces/seat-config';
  
export const AddBusView = () => {
  const { createBus } = useBuses();
  const router = useRouter();

  const handleSubmit = async (data: BusCreationData) => {
    try {
      const dataWithDefaults = {
        ...data,
        busInfo: {
          ...data.busInfo,
          fechaIngreso: new Date().toISOString().split('T')[0],
          estado: "ACTIVO"
        }
      };
      await createBus(dataWithDefaults);
      router.push('/main/buses'); 
    } catch (error) {
      if (error instanceof Error && error.message === 'No hay una sesión activa') {
        toast.error('No hay una sesión activa. Por favor, inicia sesión.');
        router.push('/auth/login');
        return;
      }
      console.error('Error al crear el bus:', error);
    }
  };

  return (
    <div className="container mx-auto py-6 p-16">
      <h1 className="text-2xl font-bold mb-6">Agregar Nuevo Bus</h1>
      <BusCreationStepper 
        onSubmit={handleSubmit} 
        onCancel={() => router.push('/main/buses')} 
      />
    </div>
  );
}; 