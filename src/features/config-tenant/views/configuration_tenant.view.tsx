"use client"
import { ConfiguracionForm } from "../components/configuartion-form";
import { useTenant } from "../hooks/use_tenant";

export default function ConfiguracionView() {
  const { data, isLoading, error } = useTenant(1);
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log('Datos del tenant:', data);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Personalice la configuración de su cooperativa.
        </p>
      </div>

      <ConfiguracionForm />
    </div>
  );
}
