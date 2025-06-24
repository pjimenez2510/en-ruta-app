// app/main/routes/[id]/page.tsx
"use client";

import { RutaDetail } from "@/features/rutas/components/ruta-detail";
import { use } from "react";

interface RutaDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RutaDetailPage({ params }: RutaDetailPageProps) {
  const { id } = use(params);
  
  return (
    <div className="container mx-auto py-6">
      <RutaDetail rutaId={Number(id)} />
    </div>
  );
}