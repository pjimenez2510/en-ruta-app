import { ClienteDetail } from "@/features/clientes";

interface ClienteDetailPageProps {
  params: {
    id: string;
  };
}

export default function ClienteDetailPage({ params }: ClienteDetailPageProps) {
  const clienteId = parseInt(params.id, 10);

  if (isNaN(clienteId)) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">ID de cliente inválido</p>
      </div>
    );
  }

  return <ClienteDetail clienteId={clienteId} />;
} 