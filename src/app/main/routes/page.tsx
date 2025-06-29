// app/main/routes/page.tsx

import { RutasTable } from "@/features/rutas/components/rutas-tables";

export default function RoutesPage() {
  return (
    <div className="container mx-auto py-6">
      <RutasTable />
    </div>
  );
}