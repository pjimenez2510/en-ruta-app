"use client";


import { ResolucionAntDetail } from "@/features/resolution/components/resolucion-ant-detail";
import { use } from "react";

interface ResolucionAntDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ResolucionAntDetailPage({ params }: ResolucionAntDetailPageProps) {
  const { id } = use(params);
  
  return (
    <div className="container mx-auto py-6">
      <ResolucionAntDetail id={Number(id)} />
    </div>
  );
}