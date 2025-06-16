// app/main/routes/page.tsx
import { RutasTable } from "@/features/rutas";

export default function RoutesPage() {
  return (
    <div className="container mx-auto py-6">
      <RutasTable />
    </div>
  );
}