// app/main/resolution/crear/page.tsx

import { ResolucionAntForm } from "@/features/resolution/components/resolucion-ant-form";


export default function CreateResolucionAntPage() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Nueva Resolución ANT</h1>
          <p className="text-muted-foreground">
            Crea una nueva resolución de la Agencia Nacional de Tránsito
          </p>
        </div>
        <ResolucionAntForm />
      </div>
    </div>
  );
}