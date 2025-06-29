"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  CalendarIcon,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useVentas } from "@/features/sell-tickets/hooks/use-ventas";
import { VentaLista } from "@/features/sell-tickets/interfaces/venta-lista.interface";
import { VentaDetalleModal } from "./modals/venta-detalle-modal";

export function VentasManagement() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroFecha, setFiltroFecha] = useState<Date>();
  const [ventaDetalleId, setVentaDetalleId] = useState<number | null>(null);

  // Hook de datos reales
  const { data: ventasRaw = [], isLoading } = useVentas({
    fechaVenta: filtroFecha
      ? filtroFecha.toISOString().split("T")[0]
      : undefined,
  });

  // Transformar los datos reales a la estructura de la tabla
  const ventas = ventasRaw.map((venta: VentaLista) => ({
    id: venta.id,
    fecha: venta.fechaVenta?.split("T")[0] || "",
    hora: venta.viaje?.horarioRuta?.horaSalida || "",
    cliente: venta.boletos?.[0]?.clienteId
      ? `Cliente #${venta.boletos[0].clienteId}`
      : "N/A",
    documento: "", // Si tienes el documento del cliente, ponlo aquí
    ruta: venta.viaje?.horarioRuta?.ruta?.nombre || "",
    viaje: venta.viaje?.bus?.placa || "",
    boletos: venta.boletos?.length || 0,
    subtotal: Number(venta.totalSinDescuento),
    descuento: Number(venta.totalDescuentos),
    total: Number(venta.totalFinal),
    metodoPago: venta.metodoPago?.nombre || "",
    estado: venta.estadoPago,
    oficinista: venta.oficinista?.username || "",
  }));

  const ventasFiltradas = ventas.filter((venta) => {
    const coincideBusqueda =
      venta.id.toString().toLowerCase().includes(busqueda.toLowerCase()) ||
      venta.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      venta.documento.includes(busqueda) ||
      venta.ruta.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "todos" || venta.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "APROBADO":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprobado
          </Badge>
        );
      case "PENDIENTE":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "VERIFICANDO":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Verificando
          </Badge>
        );
      case "RECHAZADO":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rechazado
          </Badge>
        );
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const confirmarVenta = (ventaId: number) => {
    console.log("Confirmar venta:", ventaId);
    // Aquí iría la lógica para confirmar la venta
  };

  const rechazarVenta = (ventaId: number) => {
    console.log("Rechazar venta:", ventaId);
    // Aquí iría la lógica para rechazar la venta
  };

  return (
    <div className="space-y-6">
      {/* Filtros y Acciones */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Gestión de Ventas</CardTitle>
              <CardDescription>
                Administre todas las ventas realizadas
              </CardDescription>
            </div>
            <Link href="/main/tickets/sell/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Venta
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, cliente, documento o ruta..."
                className="pl-8"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="APROBADO">Aprobado</SelectItem>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="VERIFICANDO">Verificando</SelectItem>
                <SelectItem value="RECHAZADO">Rechazado</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-48">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filtroFecha
                    ? format(filtroFecha, "PPP", { locale: es })
                    : "Fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filtroFecha}
                  onSelect={setFiltroFecha}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Ventas */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Placa Bus</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Boletos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Método Pago</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Cargando ventas...
                    </TableCell>
                  </TableRow>
                ) : ventasFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No hay ventas para mostrar
                    </TableCell>
                  </TableRow>
                ) : (
                  ventasFiltradas.map((venta, idx) => (
                    <TableRow key={venta.id}>
                      <TableCell className="font-medium">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{venta.fecha}</p>
                          <p className="text-xs text-muted-foreground">
                            {venta.hora}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{venta.viaje}</p>
                        </div>
                      </TableCell>
                      <TableCell>{venta.ruta}</TableCell>
                      <TableCell>{venta.boletos}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">${venta.total}</p>
                          {venta.descuento > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Desc: ${venta.descuento}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{venta.metodoPago}</TableCell>
                      <TableCell>{getEstadoBadge(venta.estado)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setVentaDetalleId(venta.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {venta.estado === "PENDIENTE" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => confirmarVenta(venta.id)}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => rechazarVenta(venta.id)}
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Modal de Detalle de Venta */}
      <VentaDetalleModal
        ventaDetalleId={ventaDetalleId}
        onClose={() => setVentaDetalleId(null)}
      />
    </div>
  );
}
