"use client";

import { TipoRutaBusForm } from "@/features/tipos-ruta-bus";
import { useFindTipoRutaBusByIdQuery } from "@/features/tipos-ruta-bus";
import { Loader2 } from "lucide-react";
import { use } from "react";

interface EditTipoRutaBusPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTipoRutaBusPage({ params }: EditTipoRutaBusPageProps) {
  const { id } = use(params);
  const { data: tipoRutaBus, isLoading, error } = useFindTipoRutaBusByIdQuery(Number(id));

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="ml-2 text-muted-foreground">Cargando tipo de ruta...</p>
        </div>
      </div>
    );
  }

  if (error || !tipoRutaBus) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-destructive">Error al cargar el tipo de ruta</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Editar Tipo de Ruta</h1>
          <p className="text-muted-foreground">
            Modifica el tipo de ruta {tipoRutaBus.nombre}
          </p>
        </div>
        <TipoRutaBusForm tipoRutaBus={tipoRutaBus} />
      </div>
    </div>
  );
}
 