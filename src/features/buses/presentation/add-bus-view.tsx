'use client';

import { BusCreationStepper } from '@/features/buses/components/bus-creation-stepper';
import { useBuses } from '@/features/buses/hooks/use-buses';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { BusCreationData } from '@/features/buses/interfaces/seat-config';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export const AddBusView = () => {
  const { createBus } = useBuses();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

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
      toast.success('Bus creado correctamente');
      router.push('/main/buses'); 
    } catch (error) {
      if (error instanceof Error && error.message === 'No hay una sesión activa') {
        toast.error('No hay una sesión activa. Por favor, inicia sesión.');
        router.push('/auth/login');
        return;
      }
      console.error('Error al crear el bus:', error);
      toast.error('No se pudo crear el bus');
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