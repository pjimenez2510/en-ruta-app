import { DescuentoDetail } from "@/features/configuracion-descuentos";

interface DescuentoDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DescuentoDetailPage({ params }: DescuentoDetailPageProps) {
  const { id } = await params;
  return (
    <div className="container mx-auto py-6">
      <DescuentoDetail descuentoId={Number(id)} />
    </div>
  );
} 