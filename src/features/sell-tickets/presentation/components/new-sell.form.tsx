"use client";

import { useState, useEffect } from "react";
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
import { useMetodosPago } from "@/features/sell-tickets/hooks/use-metodos-pago";
import { useCrearVenta } from "@/features/sell-tickets/hooks/use-crear-venta";
import { ClienteAsiento } from "@/features/sell-tickets/interfaces/venta.interface";
import { toast } from "sonner";

function getCssVariableValue(variableName: string) {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
}

function getContrastYIQ(hexcolor: string) {
  let color = hexcolor.replace("#", "");
  if (color.length === 4)
    color = color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  if (color.length !== 6) return "black";
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

export function NuevaVentaForm() {
  const [paso, setPaso] = useState(1);
  const [viajeSeleccionado, setViajeSeleccionado] = useState<any>(null);
  const [clienteAsientos, setClienteAsientos] = useState<ClienteAsiento[]>([]);
  const [metodoPago, setMetodoPago] = useState("");

  // Estados de IDs para el POST final
  const [viajeId, setViajeId] = useState<number | null>(null);
  const [ciudadOrigenId, setCiudadOrigenId] = useState<number | null>(null);
  const [ciudadDestinoId, setCiudadDestinoId] = useState<number | null>(null);
  const [metodoPagoId, setMetodoPagoId] = useState<number | null>(null);

  // Estados de modales
  const [modalViaje, setModalViaje] = useState(false);
  const [modalCliente, setModalCliente] = useState(false);
  const [modalAsientos, setModalAsientos] = useState(false);
  const [modalCrearCliente, setModalCrearCliente] = useState(false);
  const [asientoParaCliente, setAsientoParaCliente] = useState<any>(null);

  const [secondaryColor, setSecondaryColor] = useState<string>("");
  const [secondaryContrast, setSecondaryContrast] = useState<"white" | "black">(
    "white"
  );

  const { metodosPago, isLoading: isLoadingMetodosPago } = useMetodosPago();
  const crearVentaMutation = useCrearVenta();

  useEffect(() => {
    const cssColor = getCssVariableValue("--secondary");
    // Convert oklch or rgb to hex if needed (simple fallback for now)
    let hex = cssColor;
    if (cssColor.startsWith("rgb")) {
      const rgb = cssColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        hex =
          "#" +
          rgb
            .slice(0, 3)
            .map((x) => (+x).toString(16).padStart(2, "0"))
            .join("");
      }
    }
    if (cssColor.startsWith("#")) hex = cssColor;
    setSecondaryColor(hex);
    setSecondaryContrast(getContrastYIQ(hex));
  }, []);

  const calcularTotal = () => {
    if (!viajeSeleccionado || !clienteAsientos.length) return 0;
    return clienteAsientos.reduce(
      (total, ca) => total + (ca.asiento?.precio || 0),
      0
    );
  };

  const handleViajeSeleccionado = (viaje: any) => {
    setViajeSeleccionado(viaje);
    setViajeId(viaje.id);
    // Guardar ciudad origen y destino desde las paradas de la ruta
    const paradas = viaje.horarioRuta?.ruta?.paradas || [];
    if (paradas.length > 0) {
      setCiudadOrigenId(paradas[0].ciudad.id);
      setCiudadDestinoId(paradas[paradas.length - 1].ciudad.id);
    } else {
      setCiudadOrigenId(null);
      setCiudadDestinoId(null);
    }
  };

  const handleClienteSeleccionado = (cliente: any, asientoId: number) => {
    // Buscar el asiento correspondiente
    const asiento = clienteAsientos.find(
      (ca) => ca.asiento?.id === asientoId
    )?.asiento;
    if (!asiento) return;

    // Actualizar el cliente para ese asiento
    setClienteAsientos((prev) =>
      prev.map((ca) => (ca.asiento?.id === asientoId ? { ...ca, cliente } : ca))
    );
  };

  const handleAsientosSeleccionados = (
    nuevosClienteAsientos: ClienteAsiento[]
  ) => {
    setClienteAsientos(nuevosClienteAsientos);
  };

  const handleBuscarCliente = (asiento: any) => {
    setAsientoParaCliente(asiento);
    setModalCliente(true);
  };

  const handleCrearCliente = (asientoId: number) => {
    setModalCliente(false);
    setModalCrearCliente(true);
  };

  const handleClienteCreado = (cliente: any) => {
    if (asientoParaCliente) {
      // Agregar el nuevo cliente-asiento
      const nuevoClienteAsiento: ClienteAsiento = {
        id: `${asientoParaCliente.id}-${Date.now()}`,
        cliente,
        asiento: asientoParaCliente,
      };
      setClienteAsientos((prev) => [...prev, nuevoClienteAsiento]);
    }
    setModalCrearCliente(false);
    setAsientoParaCliente(null);
  };

  // Función para manejar cuando se asigna un cliente desde el modal de asientos
  const handleClienteAsignado = (cliente: any, asientoId: number) => {
    // Buscar si ya existe un cliente-asiento para ese asiento
    const existeClienteAsiento = clienteAsientos.find(
      (ca) => ca.asiento?.id === asientoId
    );

    if (existeClienteAsiento) {
      // Actualizar el cliente existente
      setClienteAsientos((prev) =>
        prev.map((ca) =>
          ca.asiento?.id === asientoId ? { ...ca, cliente } : ca
        )
      );
    } else {
      // Crear nuevo cliente-asiento
      const nuevoClienteAsiento: ClienteAsiento = {
        id: `${asientoId}-${Date.now()}`,
        cliente,
        asiento: asientoParaCliente, // Usar el asiento que está en el estado
      };
      setClienteAsientos((prev) => [...prev, nuevoClienteAsiento]);
    }
  };

  useEffect(() => {
    if (metodoPago) {
      setMetodoPagoId(Number(metodoPago));
    } else {
      setMetodoPagoId(null);
    }
  }, [metodoPago]);

  const procesarVenta = async () => {
    // Validar que todos los campos requeridos estén presentes
    if (!viajeId || !ciudadOrigenId || !ciudadDestinoId || !metodoPagoId) {
      toast.error("Faltan datos requeridos para procesar la venta");
      return;
    }

    if (!clienteAsientos || clienteAsientos.length === 0) {
      toast.error("Debe seleccionar al menos un asiento con cliente");
      return;
    }

    // Validar que todos los asientos tengan cliente asignado
    const asientosSinCliente = clienteAsientos.filter((ca) => !ca.cliente);
    if (asientosSinCliente.length > 0) {
      toast.error("Todos los asientos deben tener un cliente asignado");
      return;
    }

    const boletos = clienteAsientos.map((ca) => ({
      clienteId: ca.cliente?.id || 0,
      asientoId: ca.asiento?.id || 0,
    }));

    const ventaData = {
      viajeId,
      ciudadOrigenId,
      ciudadDestinoId,
      metodoPagoId,
      boletos,
    };

    try {
      await crearVentaMutation.mutateAsync(ventaData);

      // Limpiar el formulario después de una venta exitosa
      setViajeSeleccionado(null);
      setClienteAsientos([]);
      setMetodoPago("");
      setViajeId(null);
      setCiudadOrigenId(null);
      setCiudadDestinoId(null);
      setMetodoPagoId(null);
      setPaso(1);
    } catch (error) {
      console.error("Error al procesar venta:", error);
      // El error ya se maneja en el hook
    }
  };

  const puedeAvanzar = (pasoActual: number) => {
    switch (pasoActual) {
      case 1:
        return viajeSeleccionado !== null;
      case 2:
        return clienteAsientos.length > 0;
      case 3:
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
            <div className="relative grid grid-cols-3 items-center">
              {/* Línea de fondo */}
              <div
                className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 z-0"
                style={{ transform: "translateY(-50%)" }}
              />
              {[1, 2, 3].map((numeroStep) => {
                const isActive = numeroStep === paso;
                const isCompleted = numeroStep < paso;
                let bgColor = "bg-white border-gray-300";
                let iconColor = "text-gray-400";
                if (isActive) {
                  bgColor = "bg-secondary border-secondary shadow-lg";
                  iconColor =
                    secondaryContrast === "white" ? "text-white" : "text-black";
                } else if (isCompleted) {
                  bgColor = "bg-secondary/80 border-secondary/80";
                  iconColor =
                    secondaryContrast === "white" ? "text-white" : "text-black";
                }
                const iconProps = {
                  className: `w-7 h-7 ${iconColor}`,
                };
                let IconComponent = null;
                if (numeroStep === 1) IconComponent = Bus;
                if (numeroStep === 2) IconComponent = Armchair;
                if (numeroStep === 3) IconComponent = Banknote;
                return (
                  <div
                    key={numeroStep}
                    className="flex flex-col items-center relative z-10 bg-transparent"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${bgColor}`}
                    >
                      {IconComponent && <IconComponent {...iconProps} />}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-3 mt-2 text-xs text-muted-foreground text-center">
              <span>Viaje</span>
              <span>Asientos y Clientes</span>
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
                          {viajeSeleccionado.horarioRuta?.ruta?.nombre}
                        </span>
                        <Badge variant="outline">
                          {viajeSeleccionado.bus?.placa}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {viajeSeleccionado.fecha?.split("T")[0]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {viajeSeleccionado.horarioRuta?.horaSalida}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${viajeSeleccionado.precio}</p>
                      <p className="text-sm text-muted-foreground">
                        {viajeSeleccionado.capacidadTotal -
                          viajeSeleccionado.asientosOcupados}{" "}
                        disponibles
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

        {/* Paso 2: Selección de Asientos y Clientes */}
        {paso === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Paso 2: Seleccionar Asientos y Clientes
              </CardTitle>
              <CardDescription>
                Elija los asientos y asigne clientes a cada uno
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {clienteAsientos.length === 0 ? (
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
                  <div className="grid gap-3">
                    {clienteAsientos.map((clienteAsiento, index) => (
                      <div
                        key={clienteAsiento.id}
                        className="p-4 border rounded-lg bg-white"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                Asiento {clienteAsiento.asiento?.numero}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {clienteAsiento.asiento?.tipo}
                              </span>
                              <span className="font-medium">
                                ${clienteAsiento.asiento?.precio}
                              </span>
                            </div>
                            <Separator orientation="vertical" className="h-6" />
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {clienteAsiento.cliente?.nombre ||
                                  "Sin cliente"}
                              </span>
                              {clienteAsiento.cliente?.documento && (
                                <span className="text-sm text-muted-foreground">
                                  {clienteAsiento.cliente.documento}
                                </span>
                              )}
                            </div>
                          </div>
                          {!clienteAsiento.cliente && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setAsientoParaCliente(clienteAsiento.asiento);
                                setModalCliente(true);
                              }}
                            >
                              Asignar Cliente
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setPaso(1)}>
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setModalAsientos(true)}
                    >
                      Agregar Más Asientos
                    </Button>
                    <Button onClick={() => setPaso(3)}>Continuar</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Paso 3: Método de Pago */}
        {paso === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Paso 3: Método de Pago
              </CardTitle>
              <CardDescription>Seleccione el método de pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={metodoPago}
                onValueChange={setMetodoPago}
                disabled={isLoadingMetodosPago}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingMetodosPago
                        ? "Cargando métodos de pago..."
                        : "Seleccionar método de pago"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingMetodosPago ? (
                    <SelectItem value="loading" disabled>
                      Cargando métodos de pago...
                    </SelectItem>
                  ) : metodosPago.length === 0 ? (
                    <SelectItem value="no-data" disabled>
                      No hay métodos de pago disponibles
                    </SelectItem>
                  ) : (
                    metodosPago.map((metodo) => (
                      <SelectItem key={metodo.id} value={metodo.id.toString()}>
                        <div>
                          <p className="font-medium">{metodo.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {metodo.descripcion}
                          </p>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPaso(2)}>
                  Anterior
                </Button>
                <Button
                  onClick={procesarVenta}
                  disabled={!metodoPago || crearVentaMutation.isPending}
                  className="flex-1"
                >
                  {crearVentaMutation.isPending
                    ? "Procesando..."
                    : "Procesar Venta"}
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
                  <p>{viajeSeleccionado.horarioRuta?.ruta?.nombre}</p>
                  <p>
                    {viajeSeleccionado.fecha?.split("T")[0]} -{" "}
                    {viajeSeleccionado.horarioRuta?.horaSalida}
                  </p>
                  <p>{viajeSeleccionado.bus?.placa}</p>
                </div>
              </div>
            )}

            {clienteAsientos.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">
                  Asientos y Clientes ({clienteAsientos.length})
                </h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  {clienteAsientos.map((clienteAsiento, index) => (
                    <div key={clienteAsiento.id} className="space-y-1">
                      <div className="flex justify-between">
                        <span>Asiento {clienteAsiento.asiento?.numero}</span>
                        <span>${clienteAsiento.asiento?.precio}</span>
                      </div>
                      {clienteAsiento.cliente && (
                        <div className="text-xs text-muted-foreground">
                          {clienteAsiento.cliente.nombre} -{" "}
                          {clienteAsiento.cliente.documento}
                        </div>
                      )}
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
        onViajeSeleccionado={handleViajeSeleccionado}
      />

      <BuscarClienteModal
        open={modalCliente}
        onOpenChange={setModalCliente}
        onClienteSeleccionado={(cliente, asientoId) => {
          // Llamar a la función del modal de asientos
          if (modalAsientos) {
            // Si estamos en el modal de asientos, usar handleClienteAsignado
            handleClienteAsignado(cliente, asientoId);
          } else {
            // Si estamos en el paso 2 del formulario, usar handleClienteSeleccionado
            handleClienteSeleccionado(cliente, asientoId);
          }
        }}
        onCrearCliente={handleCrearCliente}
        asientoSeleccionado={asientoParaCliente}
      />

      <SeleccionarAsientosModal
        open={modalAsientos}
        onOpenChange={setModalAsientos}
        viaje={viajeSeleccionado}
        onAsientosSeleccionados={handleAsientosSeleccionados}
        clienteAsientosActuales={clienteAsientos}
        onBuscarCliente={handleBuscarCliente}
        onClienteAsignado={handleClienteAsignado}
      />

      <CrearClienteModal
        open={modalCrearCliente}
        onOpenChange={setModalCrearCliente}
        onClienteCreado={handleClienteCreado}
      />
    </div>
  );
}
