"use client";

import { TipoRutaBusDetail } from "@/features/tipos-ruta-bus";
import { use } from "react";

interface TipoRutaBusDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TipoRutaBusDetailPage({ params }: TipoRutaBusDetailPageProps) {
  const { id } = use(params);
  
  return (
    <div className="container mx-auto py-6">
      <TipoRutaBusDetail tipoRutaBusId={Number(id)} />
    </div>
  );
} 