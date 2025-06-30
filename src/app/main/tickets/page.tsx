import { BoletosManagement } from "@/features/sell-tickets/presentation/components/tickets-management";


export default function BoletosPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Boletos</h1>
          <p className="text-muted-foreground">Administre todos los boletos emitidos.</p>
        </div>
      </div>

      <BoletosManagement />
    </div>
  )
}
