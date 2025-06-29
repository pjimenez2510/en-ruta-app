import { DescuentoForm } from "@/features/configuracion-descuentos";

export default function CrearDescuentoPage() {
  return (
    <div className="space-y-6 max-w-full px-2 md:px-8 lg:px-16 xl:px-32 mx-auto">
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold tracking-tight">Crear Nuevo Descuento</h1>
        <p className="text-muted-foreground">
          Completa la información para registrar una nueva configuración de descuento.
        </p>
      </div>
      <DescuentoForm />
    </div>
  );
} 