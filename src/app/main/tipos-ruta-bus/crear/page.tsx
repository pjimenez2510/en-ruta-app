import { TipoRutaBusForm } from "@/features/tipos-ruta-bus";

export default function CreateTipoRutaBusPage() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Nuevo Tipo de Ruta</h1>
          <p className="text-muted-foreground">
            Crea un nuevo tipo de ruta de bus para tu cooperativa
          </p>
        </div>
        <TipoRutaBusForm />
      </div>
    </div>
  );
} 