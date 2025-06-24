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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  User,
  CreditCard,
  Ticket,
  Calendar,
  Clock,
  CheckCircle,
  Bus,
  Briefcase,
  Armchair,
  Banknote,
} from "lucide-react";
import { BuscarViajeModal } from "./modals/buscar-viaje-modal";
import { BuscarClienteModal } from "./modals/buscar-cliente-modal";
import { SeleccionarAsientosModal } from "./modals/seleccionar-asientos-modal";
import { CrearClienteModal } from "./modals/crear-cliente-modal";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const metodosPago = [
  { id: 1, nombre: "Efectivo", descripcion: "Pago en efectivo" },
  { id: 2, nombre: "Transferencia", descripcion: "Transferencia bancaria" },
  { id: 3, nombre: "PayPal", descripcion: "Pago con PayPal" },
];

export function NuevaVentaForm() {
  const [paso, setPaso] = useState(1);
  const [viajeSeleccionado, setViajeSeleccionado] = useState<any>(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<any[]>([]);
  const [metodoPago, setMetodoPago] = useState("");

  // Estados de modales
  const [modalViaje, setModalViaje] = useState(false);
  const [modalCliente, setModalCliente] = useState(false);
  const [modalAsientos, setModalAsientos] = useState(false);
  const [modalCrearCliente, setModalCrearCliente] = useState(false);

  const calcularTotal = () => {
    if (!viajeSeleccionado || !asientosSeleccionados.length) return 0;
    return asientosSeleccionados.reduce(
      (total, asiento) => total + asiento.precio,
      0
    );
  };

  const procesarVenta = () => {
    console.log("Procesando venta:", {
      viaje: viajeSeleccionado,
      cliente: clienteSeleccionado,
      asientos: asientosSeleccionados,
      metodoPago,
      total: calcularTotal(),
    });
    // Aquí iría la lógica para procesar la venta
  };

  const puedeAvanzar = (pasoActual: number) => {
    switch (pasoActual) {
      case 1:
        return viajeSeleccionado !== null;
      case 2:
        return clienteSeleccionado !== null;
      case 3:
        return asientosSeleccionados.length > 0;
      case 4:
        return metodoPago !== "";
      default:
        return false;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Formulario Principal */}
      <div className="lg:col-span-2 space-y-6">
        {/* Indicador de Pasos */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative grid grid-cols-4 items-center">
              {/* Línea de fondo */}
              <div
                className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 z-0"
                style={{ transform: "translateY(-50%)" }}
              />
              {[1, 2, 3, 4].map((numeroStep) => {
                const isActive = numeroStep === paso;
                const isCompleted = numeroStep < paso;
                const iconProps = {
                  className: `w-6 h-6 ${
                    isActive ? "text-secondary-foreground" : "text-gray-500"
                  }`,
                };
                let IconComponent = null;
                if (numeroStep === 1) IconComponent = Bus;
                if (numeroStep === 2) IconComponent = Briefcase;
                if (numeroStep === 3) IconComponent = Armchair;
                if (numeroStep === 4) IconComponent = Banknote;
                return (
                  <div
                    key={numeroStep}
                    className="flex flex-col items-center relative z-10 bg-transparent"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 bg-white
                      ${
                        isActive
                          ? "bg-secondary border-secondary shadow-lg text-secondary-foreground"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {IconComponent && <IconComponent {...iconProps} />}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-4 mt-2 text-xs text-muted-foreground text-center">
              <span>Viaje</span>
              <span>Cliente</span>
              <span>Asientos</span>
              <span>Pago</span>
            </div>
          </CardContent>
        </Card>

        {/* Paso 1: Selección de Viaje */}
        {paso === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Paso 1: Seleccionar Viaje
              </CardTitle>
              <CardDescription>
                Busque y seleccione el viaje para la venta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!viajeSeleccionado ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No ha seleccionado ningún viaje
                  </p>
                  <Button onClick={() => setModalViaje(true)}>
                    Buscar Viaje
                  </Button>
                </div>
              ) : (
                <div className="p-4 border rounded-lg bg-[#006D8B]/5 border-[#006D8B]">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {viajeSeleccionado.ruta}
                        </span>
                        <Badge variant="outline">{viajeSeleccionado.bus}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {viajeSeleccionado.fecha}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {viajeSeleccionado.hora}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${viajeSeleccionado.precio}</p>
                      <p className="text-sm text-muted-foreground">
                        {viajeSeleccionado.asientosDisponibles} disponibles
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setModalViaje(true)}
                    >
                      Cambiar Viaje
                    </Button>
                    <Button onClick={() => setPaso(2)}>Continuar</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Paso 2: Selección de Cliente */}
        {paso === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Paso 2: Seleccionar Cliente
              </CardTitle>
              <CardDescription>
                Busque el cliente o cree uno nuevo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!clienteSeleccionado ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No ha seleccionado ningún cliente
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => setModalCliente(true)}>
                      Buscar Cliente
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setModalCrearCliente(true)}
                    >
                      Crear Cliente
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border rounded-lg bg-[#006D8B]/5 border-[#006D8B]">
                  <div className="space-y-2">
                    <h4 className="font-medium">
                      {clienteSeleccionado.nombre}
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Documento: {clienteSeleccionado.documento}</p>
                      <p>Email: {clienteSeleccionado.email}</p>
                      <p>Teléfono: {clienteSeleccionado.telefono}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" onClick={() => setPaso(1)}>
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setModalCliente(true)}
                    >
                      Cambiar Cliente
                    </Button>
                    <Button onClick={() => setPaso(3)}>Continuar</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Paso 3: Selección de Asientos */}
        {paso === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Paso 3: Seleccionar Asientos
              </CardTitle>
              <CardDescription>
                Elija los asientos para los boletos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {asientosSeleccionados.length === 0 ? (
                <div className="text-center py-8">
                  <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No ha seleccionado ningún asiento
                  </p>
                  <Button onClick={() => setModalAsientos(true)}>
                    Seleccionar Asientos
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    {asientosSeleccionados.map((asiento, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">
                            Asiento {asiento.numero}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {asiento.tipo}
                          </span>
                        </div>
                        <span className="font-medium">${asiento.precio}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setPaso(2)}>
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setModalAsientos(true)}
                    >
                      Cambiar Asientos
                    </Button>
                    <Button onClick={() => setPaso(4)}>Continuar</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Paso 4: Método de Pago */}
        {paso === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Paso 4: Método de Pago
              </CardTitle>
              <CardDescription>Seleccione el método de pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={metodoPago} onValueChange={setMetodoPago}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar método de pago" />
                </SelectTrigger>
                <SelectContent>
                  {metodosPago.map((metodo) => (
                    <SelectItem key={metodo.id} value={metodo.id.toString()}>
                      <div>
                        <p className="font-medium">{metodo.nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          {metodo.descripcion}
                        </p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPaso(3)}>
                  Anterior
                </Button>
                <Button
                  onClick={procesarVenta}
                  disabled={!metodoPago}
                  className="flex-1"
                >
                  Procesar Venta
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Resumen */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Venta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {viajeSeleccionado && (
              <div className="space-y-2">
                <h4 className="font-medium">Viaje</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{viajeSeleccionado.ruta}</p>
                  <p>
                    {viajeSeleccionado.fecha} - {viajeSeleccionado.hora}
                  </p>
                  <p>{viajeSeleccionado.bus}</p>
                </div>
              </div>
            )}

            {clienteSeleccionado && (
              <div className="space-y-2">
                <h4 className="font-medium">Cliente</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{clienteSeleccionado.nombre}</p>
                  <p>{clienteSeleccionado.documento}</p>
                </div>
              </div>
            )}

            {asientosSeleccionados.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">
                  Asientos ({asientosSeleccionados.length})
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  {asientosSeleccionados.map((asiento, index) => (
                    <div key={index} className="flex justify-between">
                      <span>Asiento {asiento.numero}</span>
                      <span>${asiento.precio}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${calcularTotal().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modales */}
      <BuscarViajeModal
        open={modalViaje}
        onOpenChange={setModalViaje}
        onViajeSeleccionado={setViajeSeleccionado}
      />

      <BuscarClienteModal
        open={modalCliente}
        onOpenChange={setModalCliente}
        onClienteSeleccionado={setClienteSeleccionado}
        onCrearCliente={() => {
          setModalCliente(false);
          setModalCrearCliente(true);
        }}
      />

      <SeleccionarAsientosModal
        open={modalAsientos}
        onOpenChange={setModalAsientos}
        viaje={viajeSeleccionado}
        onAsientosSeleccionados={setAsientosSeleccionados}
        asientosActuales={asientosSeleccionados}
      />

      <CrearClienteModal
        open={modalCrearCliente}
        onOpenChange={setModalCrearCliente}
        onClienteCreado={(cliente) => {
          setClienteSeleccionado(cliente);
          setModalCrearCliente(false);
        }}
      />
    </div>
  );
}
