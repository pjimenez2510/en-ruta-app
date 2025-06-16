import { Suspense } from "react";
import { EditBusView } from "@/features/buses/presentation/edit-bus-view";

interface PageProps {
  params: Promise<{ id: string }>; // Cambiar de { id: string } a Promise<{ id: string }>
}

export default async function EditBusPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <EditBusView busId={id} />;
    </Suspense>
  );
} 