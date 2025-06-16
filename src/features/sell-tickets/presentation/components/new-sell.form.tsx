"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, User, CreditCard, Ticket, Plus, Minus, Search } from "lucide-react"

const viajes = [
  {
    id: 1,
    ruta: "Quito - Guayaquil",
    fecha: "2025-01-18",
    hora: "08:30",
    bus: "Bus 001",
    precio: 22.75,
    asientosDisponibles: 15,
  },
  {
    id: 2,
    ruta: "Ambato - Cuenca",
    fecha: "2025-01-18",
    hora: "14:15",
    bus: "Bus 002",
    precio: 18.5,
    asientosDisponibles: 8,
  },
  {
    id: 3,
    ruta: "Quito - Loja",
    fecha: "2025-01-19",
    hora: "06:45",
    bus: "Bus 004",
    precio: 25.0,
    asientosDisponibles: 22,
  },
]

const clientes = [
  {
    id: 1,
    nombre: "María González",
    documento: "1712345678",
    email: "maria.gonzalez@email.com",
    telefono: "+593987654321",
  },
  {
    id: 2,
    nombre: "Carlos Mendoza",
    documento: "1798765432",
    email: "carlos.mendoza@email.com",
    telefono: "+593912345678",
  },
  {
    id: 3,
    nombre: "Ana Rodríguez",
    documento: "1756789012",
    email: "ana.rodriguez@email.com",
    telefono: "+593923456789",
  },
]

const metodosPago = [
  { id: 1, nombre: "Efectivo", descripcion: "Pago en efectivo" },
  { id: 2, nombre: "Transferencia", descripcion: "Transferencia bancaria" },
  { id: 3, nombre: "PayPal", descripcion: "Pago con PayPal" },
]

export function NuevaVentaForm() {
  const [viajeSeleccionado, setViajeSeleccionado] = useState<any>(null)
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null)
  const [metodoPago, setMetodoPago] = useState("")
  const [boletos, setBoletos] = useState([{ clienteId: "", asiento: "" }])
  const [busquedaCliente, setBusquedaCliente] = useState("")

  const agregarBoleto = () => {
    setBoletos([...boletos, { clienteId: "", asiento: "" }])
  }

  const removerBoleto = (index: number) => {
    if (boletos.length > 1) {
      setBoletos(boletos.filter((_, i) => i !== index))
    }
  }

  const actualizarBoleto = (index: number, campo: string, valor: string) => {
    const nuevoBoletos = [...boletos]
    nuevoBoletos[index] = { ...nuevoBoletos[index], [campo]: valor }
    setBoletos(nuevoBoletos)
  }

  const calcularTotal = () => {
    if (!viajeSeleccionado) return 0
    return boletos.length * viajeSeleccionado.precio
  }

  const procesarVenta = () => {
    // Aquí iría la lógica para procesar la venta
    console.log("Procesando venta:", {
      viaje: viajeSeleccionado,
      cliente: clienteSeleccionado,
      metodoPago,
      boletos,
      total: calcularTotal(),
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Formulario Principal */}
      <div className="lg:col-span-2 space-y-6">
        {/* Selección de Viaje */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Seleccionar Viaje
            </CardTitle>
            <CardDescription>Elija el viaje para el cual desea vender boletos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {viajes.map((viaje) => (
                <div
                  key={viaje.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    viajeSeleccionado?.id === viaje.id ? "border-[#006D8B] bg-[#006D8B]/5" : "hover:border-gray-300"
                  }`}
                  onClick={() => setViajeSeleccionado(viaje)}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{viaje.ruta}</span>
                        <Badge variant="outline">{viaje.bus}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {viaje.fecha}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {viaje.hora}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${viaje.precio}</p>
                      <p className="text-sm text-muted-foreground">{viaje.asientosDisponibles} disponibles</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selección de Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Cliente
            </CardTitle>
            <CardDescription>Busque y seleccione el cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente por nombre o documento..."
                className="pl-8"
                value={busquedaCliente}
                onChange={(e) => setBusquedaCliente(e.target.value)}
              />
            </div>

            <div className="grid gap-2 max-h-48 overflow-y-auto">
              {clientes
                .filter(
                  (cliente) =>
                    cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
                    cliente.documento.includes(busquedaCliente),
                )
                .map((cliente) => (
                  <div
                    key={cliente.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      clienteSeleccionado?.id === cliente.id
                        ? "border-[#006D8B] bg-[#006D8B]/5"
                        : "hover:border-gray-300"
                    }`}
                    onClick={() => setClienteSeleccionado(cliente)}
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{cliente.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        {cliente.documento} • {cliente.email}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Boletos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Boletos
            </CardTitle>
            <CardDescription>Configure los boletos a vender</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {boletos.map((boleto, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cliente</Label>
                    <Select
                      value={boleto.clienteId}
                      onValueChange={(value) => actualizarBoleto(index, "clienteId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id.toString()}>
                            {cliente.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Asiento</Label>
                    <Input
                      placeholder="Ej: 15A"
                      value={boleto.asiento}
                      onChange={(e) => actualizarBoleto(index, "asiento", e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removerBoleto(index)}
                  disabled={boletos.length === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button variant="outline" onClick={agregarBoleto} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Boleto
            </Button>
          </CardContent>
        </Card>

        {/* Método de Pago */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Método de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={metodoPago} onValueChange={setMetodoPago}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar método de pago" />
              </SelectTrigger>
              <SelectContent>
                {metodosPago.map((metodo) => (
                  <SelectItem key={metodo.id} value={metodo.id.toString()}>
                    <div>
                      <p className="font-medium">{metodo.nombre}</p>
                      <p className="text-sm text-muted-foreground">{metodo.descripcion}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
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
                <h4 className="font-medium">Viaje Seleccionado</h4>
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
                  <p>{clienteSeleccionado.email}</p>
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Boletos ({boletos.length})</span>
                <span>${viajeSeleccionado ? (boletos.length * viajeSeleccionado.precio).toFixed(2) : "0.00"}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${calcularTotal().toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={procesarVenta}
              disabled={!viajeSeleccionado || !clienteSeleccionado || !metodoPago}
            >
              Procesar Venta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
