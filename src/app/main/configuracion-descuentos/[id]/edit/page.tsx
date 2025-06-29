"use client";

import { DescuentoForm } from "@/features/configuracion-descuentos";
import { useFindDescuentoByIdQuery } from "@/features/configuracion-descuentos";
import { Loader2 } from "lucide-react";
import { use } from "react";

interface EditarDescuentoPageProps {
  params: Promise<{ id: string }>;
}

export default function EditarDescuentoPage({ params }: EditarDescuentoPageProps) {
  const { id } = use(params);
  const descuentoId = Number(id);
  const { data: descuento, isLoading, error } = useFindDescuentoByIdQuery(descuentoId);

  if (isNaN(descuentoId)) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">ID de descuento inválido</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando información del descuento...</span>
      </div>
    );
  }

  if (error || !descuento) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Error al cargar la información del descuento</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full px-2 md:px-8 lg:px-16 xl:px-32 mx-auto">
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold tracking-tight">Editar Descuento</h1>
        <p className="text-muted-foreground">
          Modifica la configuración del descuento {descuento.tipo}.
        </p>
      </div>
      <DescuentoForm descuento={descuento} />
    </div>
  );
} 