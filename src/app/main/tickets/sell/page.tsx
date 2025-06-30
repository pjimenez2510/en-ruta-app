import { VentasManagement } from "@/features/sell-tickets/presentation/components/sells-management";


export default function VentasPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Ventas</h1>
          <p className="text-muted-foreground">Administre todas las ventas de boletos realizadas.</p>
        </div>
      </div>

      <VentasManagement/>
    </div>
  )
}
