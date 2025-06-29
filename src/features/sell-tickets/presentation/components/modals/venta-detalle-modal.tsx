import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useVentaById } from "@/features/sell-tickets/hooks/use-venta-by-id";
import { VentaDetalle } from "@/features/sell-tickets/interfaces/venta-detalle.interface";
import { Badge } from "@/components/ui/badge";

interface VentaDetalleModalProps {
  ventaDetalleId: number | null;
  onClose: () => void;
}

export function VentaDetalleModal({
  ventaDetalleId,
  onClose,
}: VentaDetalleModalProps) {
  const { data: ventaDetalle, isLoading } = useVentaById(
    ventaDetalleId ?? undefined
  );

  return (
    <Dialog open={!!ventaDetalleId} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalle de Venta</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center">Cargando detalle...</div>
        ) : ventaDetalle ? (
          <div className="space-y-6">
            {/* Resumen */}
            <section>
              <h3 className="font-bold text-lg mb-2">Resumen</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <b>ID Venta:</b> {ventaDetalle.id}
                </div>
                <div>
                  <b>Fecha Venta:</b> {ventaDetalle.fechaVenta?.split("T")[0]}
                </div>
                <div>
                  <b>Estado:</b> <Badge>{ventaDetalle.estadoPago}</Badge>
                </div>
                <div>
                  <b>Método de Pago:</b> {ventaDetalle.metodoPago?.nombre}
                </div>
                <div>
                  <b>Total:</b>{" "}
                  <span className="font-semibold text-green-700">
                    ${ventaDetalle.totalFinal}
                  </span>
                </div>
              </div>
            </section>
            {/* Viaje */}
            <section>
              <h3 className="font-bold text-lg mb-2">Viaje</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <b>Ruta:</b> {ventaDetalle.viaje?.horarioRuta?.ruta?.nombre}
                </div>
                <div>
                  <b>Placa Bus:</b> {ventaDetalle.viaje?.bus?.placa}
                </div>
                <div>
                  <b>Hora Salida:</b>{" "}
                  {ventaDetalle.viaje?.horarioRuta?.horaSalida}
                </div>
                <div>
                  <b>Paradas:</b>{" "}
                  {(ventaDetalle.viaje?.horarioRuta?.ruta as any)?.paradas
                    ?.map((p: any) => p.ciudad?.nombre)
                    .filter(Boolean)
                    .join(" → ")}
                </div>
              </div>
            </section>
            {/* Boletos */}
            <section>
              <h3 className="font-bold text-lg mb-2">Boletos</h3>
              <div className="space-y-4">
                {ventaDetalle.boletos.map((boleto) => (
                  <div
                    key={boleto.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                      <div>
                        <span className="font-semibold">Código:</span>{" "}
                        {boleto.codigoAcceso}
                      </div>
                      <Badge variant="outline" className="mt-2 md:mt-0">
                        {boleto.estado}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <b>Cliente:</b> {boleto.cliente?.nombres}{" "}
                        {boleto.cliente?.apellidos}
                        <br />
                        <b>Documento:</b> {boleto.cliente?.numeroDocumento}
                        <br />
                        <b>Email:</b> {boleto.cliente?.email}
                        <br />
                        <b>Teléfono:</b> {boleto.cliente?.telefono}
                      </div>
                      <div>
                        <b>Asiento:</b> {boleto.asiento?.numero} (
                        {boleto.asiento?.tipo?.nombre})
                        <br />
                        <b>Origen:</b> {boleto.paradaOrigen?.ciudad?.nombre}
                        <br />
                        <b>Destino:</b> {boleto.paradaDestino?.ciudad?.nombre}
                        <br />
                        <b>Precio:</b>{" "}
                        <span className="font-semibold text-green-700">
                          ${boleto.precioFinal}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="py-8 text-center text-red-500">
            No se encontró información de la venta.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
