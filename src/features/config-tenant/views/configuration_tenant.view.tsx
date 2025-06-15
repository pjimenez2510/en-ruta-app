"use client"
import { ConfiguracionForm } from "../components/configuartion-form";


export default function ConfiguracionView() {
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
