"use client";

import { ClienteForm } from "@/features/clientes";
import { useFindClienteByIdQuery } from "@/features/clientes";
import { Loader2 } from "lucide-react";

interface EditarClientePageProps {
  params: {
    id: string;
  };
}

export default function EditarClientePage({ params }: EditarClientePageProps) {
  const clienteId = parseInt(params.id, 10);
  const { data: cliente, isLoading, error } = useFindClienteByIdQuery(clienteId);

  if (isNaN(clienteId)) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">ID de cliente inválido</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando información del cliente...</span>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Error al cargar la información del cliente</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full px-2 md:px-8 lg:px-16 xl:px-32 mx-auto">
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold tracking-tight">Editar Cliente</h1>
        <p className="text-muted-foreground">
          Modifica la información del cliente {cliente.nombres} {cliente.apellidos}.
        </p>
      </div>
      <ClienteForm cliente={cliente} />
    </div>
  );
} 