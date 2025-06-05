import { FrecuenciaForm } from "./frequencie.form"

export default function NewFrecuenciaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registrar Nueva Frecuencia</h1>
        <p className="text-muted-foreground">
          Complete la información para registrar una nueva frecuencia en el sistema.
        </p>
      </div>

      <FrecuenciaForm />
    </div>
  )
}
