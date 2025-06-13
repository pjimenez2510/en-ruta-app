import { EditBusView } from "@/features/buses/presentation/edit-bus-view";

export default function EditBusPage({ params }: { params: { id: string } }) {
  return <EditBusView busId={params.id} />;
} 