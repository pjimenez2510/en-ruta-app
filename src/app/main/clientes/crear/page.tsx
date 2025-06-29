import { ClienteForm } from "@/features/clientes";

export default function CrearClientePage() {
  return (
    <div className="space-y-6 max-w-full px-2 md:px-8 lg:px-16 xl:px-32 mx-auto">
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold tracking-tight">Crear Nuevo Cliente</h1>
        <p className="text-muted-foreground">
          Completa la información para registrar un nuevo cliente en el sistema.
        </p>
      </div>
      <ClienteForm />
    </div>
  );
} 