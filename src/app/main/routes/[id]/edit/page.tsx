// app/main/routes/[id]/edit/page.tsx
"use client";

import { RutaForm } from "@/features/rutas/components/ruta-form";
import { useFindRutaByIdQuery } from "@/features/rutas/hooks/use-ruta-queries";
import { Loader2 } from "lucide-react";
import { use } from "react";

interface EditRutaPageProps {
  params: Promise<{ id: string }>;
}

export default function EditRutaPage({ params }: EditRutaPageProps) {
  const { id } = use(params);
  const { data: ruta, isLoading, error } = useFindRutaByIdQuery(Number(id));

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="ml-2 text-muted-foreground">Cargando ruta...</p>
        </div>
      </div>
    );
  }

  if (error || !ruta) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-destructive">Error al cargar la ruta</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Editar Ruta</h1>
          <p className="text-muted-foreground">
            Modifica la ruta {ruta.nombre}
          </p>
        </div>
        <RutaForm ruta={ruta} />
      </div>
    </div>
  );
}