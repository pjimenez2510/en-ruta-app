import { ClienteDetail } from "@/features/clientes";
interface ClienteDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClienteDetailPage({
  params,
}: ClienteDetailPageProps) {
  const param = await params;
  const clienteId = parseInt(param.id, 10);

  if (isNaN(clienteId)) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">ID de cliente inválido</p>
      </div>
    );
  }

  return <ClienteDetail clienteId={clienteId} />;
}
