import { FrecuenciasTable } from "../tables.routes"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function RoutesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Rutas</h1>
          <p className="text-muted-foreground">Ahi estan algunas rutas</p>
        </div>
        <Link href="/main/routes/configuration">
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Ruta
          </Button>
        </Link>
      </div>
      <FrecuenciasTable />
    </div>
  )
}