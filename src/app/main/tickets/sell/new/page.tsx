import { NuevaVentaForm } from "@/features/sell-tickets/presentation/components/new-sell.form";


export default function NuevaVentaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nueva Venta</h1>
          <p className="text-muted-foreground">Genere una nueva venta de boletos paso a paso.</p>
        </div>
      </div>

      <NuevaVentaForm />
    </div>
  )
}
