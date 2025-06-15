import { FrecuenciasTable } from "./tables.frecencies";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function FrecuenciasPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestión de Frecuencias
          </h1>
          <p className="text-muted-foreground">
            Administre las frecuencias asignadas a su cooperativa.
          </p>
        </div>
        <Link href="/main/frequencies/new">
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Frecuencia
          </Button>
        </Link>
      </div>

      <FrecuenciasTable />
    </div>
  );
}
