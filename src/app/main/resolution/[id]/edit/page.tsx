// app/admin/resoluciones-ant/[id]/edit/page.tsx
"use client";


import { ResolucionAntForm } from "@/features/resolution/components/resolucion-ant-form";
import { useFindResolucionAntByIdQuery } from "@/features/resolution/hooks/use-resolucion-ant-queries";
import { Loader2 } from "lucide-react";
import { use } from "react";

interface EditResolucionAntPageProps {
  params: Promise<{ id: string }>;
}

export default function EditResolucionAntPage({ params }: EditResolucionAntPageProps) {
  const { id } = use(params);
  const { data: resolucion, isLoading, error } = useFindResolucionAntByIdQuery(Number(id));

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="ml-2 text-muted-foreground">Cargando resolución...</p>
        </div>
      </div>
    );
  }

  if (error || !resolucion) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-destructive">Error al cargar la resolución</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Editar Resolución ANT</h1>
          <p className="text-muted-foreground">
            Modifica la resolución {resolucion.numeroResolucion}
          </p>
        </div>
        <ResolucionAntForm resolucion={resolucion} />
      </div>
    </div>
  );
}