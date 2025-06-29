"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, CheckCircle, XCircle, Clock, UserCheck, UserX, QrCode } from "lucide-react"

const boletos = [
  {
    id: "BOL001",
    codigo: "QG-2025-001-15A",
    ventaId: "VNT001",
    cliente: "María González",
    documento: "1712345678",
    viaje: "Quito - Guayaquil",
    fecha: "2025-01-18",
    hora: "08:30",
    asiento: "15A",
    precio: 22.75,
    descuento: 0,
    total: 22.75,
    tipoDescuento: "NINGUNO",
    estado: "CONFIRMADO",
  },
  {
    id: "BOL002",
    codigo: "QG-2025-001-16B",
    ventaId: "VNT001",
    cliente: "María González",
    documento: "1712345678",
    viaje: "Quito - Guayaquil",
    fecha: "2025-01-18",
    hora: "08:30",
    asiento: "16B",
    precio: 22.75,
    descuento: 0,
    total: 22.75,
    tipoDescuento: "NINGUNO",
    estado: "CONFIRMADO",
  },
  {
    id: "BOL003",
    codigo: "AC-2025-002-22B",
    ventaId: "VNT002",
    cliente: "Carlos Mendoza",
    documento: "1798765432",
    viaje: "Ambato - Cuenca",
    fecha: "2025-01-18",
    hora: "14:15",
    asiento: "22B",
    precio: 22.75,
    descuento: 2.28,
    total: 20.47,
    tipoDescuento: "TERCERA_EDAD",
    estado: "PENDIENTE",
  },
  {
    id: "BOL004",
    codigo: "QL-2025-003-08C",
    ventaId: "VNT003",
    cliente: "Ana Rodríguez",
    documento: "1756789012",
    viaje: "Quito - Loja",
    fecha: "2025-01-19",
    hora: "06:45",
    asiento: "08C",
    precio: 25.0,
    descuento: 2.5,
    total: 22.5,
    tipoDescuento: "MENOR_EDAD",
    estado: "CONFIRMADO",
  },
  {
    id: "BOL005",
    codigo: "QL-2025-003-09D",
    ventaId: "VNT003",
    cliente: "Ana Rodríguez",
    documento: "1756789012",
    viaje: "Quito - Loja",
    fecha: "2025-01-19",
    hora: "06:45",
    asiento: "09D",
    precio: 25.0,
    descuento: 0,
    total: 25.0,
    tipoDescuento: "NINGUNO",
    estado: "ABORDADO",
  },
]

export function BoletosManagement() {
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")

  const boletosFiltrados = boletos.filter((boleto) => {
    const coincideBusqueda =
      boleto.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      boleto.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      boleto.documento.includes(busqueda) ||
      boleto.viaje.toLowerCase().includes(busqueda.toLowerCase()) ||
      boleto.asiento.toLowerCase().includes(busqueda.toLowerCase())

    const coincideEstado = filtroEstado === "todos" || boleto.estado === filtroEstado

    return coincideBusqueda && coincideEstado
  })

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "CONFIRMADO":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmado
          </Badge>
        )
      case "PENDIENTE":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "ABORDADO":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <UserCheck className="w-3 h-3 mr-1" />
            Abordado
          </Badge>
        )
      case "NO_SHOW":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <UserX className="w-3 h-3 mr-1" />
            No Show
          </Badge>
        )
      case "CANCELADO":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const getTipoDescuentoBadge = (tipo: string) => {
    switch (tipo) {
      case "MENOR_EDAD":
        return (
          <Badge variant="outline" className="text-xs">
            Menor Edad
          </Badge>
        )
      case "TERCERA_EDAD":
        return (
          <Badge variant="outline" className="text-xs">
            Tercera Edad
          </Badge>
        )
      case "DISCAPACIDAD":
        return (
          <Badge variant="outline" className="text-xs">
            Discapacidad
          </Badge>
        )
      default:
        return null
    }
  }

  const marcarComoAbordado = (boletoId: string) => {
    console.log("Marcar como abordado:", boletoId)
    // Aquí iría la lógica para marcar como abordado
  }

  const marcarComoNoShow = (boletoId: string) => {
    console.log("Marcar como no show:", boletoId)
    // Aquí iría la lógica para marcar como no show
  }

  return (
    <div className="space-y-6">
      {/* Filtros y Estadísticas */}
            {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
          <CardDescription>Busque y filtre boletos por diferentes criterios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código, cliente, documento, viaje o asiento..."
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
                <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="ABORDADO">Abordado</SelectItem>
                <SelectItem value="NO_SHOW">No Show</SelectItem>
                <SelectItem value="CANCELADO">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Boletos */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Viaje</TableHead>
                  <TableHead>Asiento</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boletosFiltrados.map((boleto) => (
                  <TableRow key={boleto.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{boleto.codigo}</p>
                        <p className="text-xs text-muted-foreground">ID: {boleto.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{boleto.cliente}</p>
                        <p className="text-xs text-muted-foreground">{boleto.documento}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{boleto.viaje}</p>
                        <p className="text-xs text-muted-foreground">
                          {boleto.fecha} - {boleto.hora}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {boleto.asiento}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">${boleto.total}</p>
                        {boleto.descuento > 0 && (
                          <p className="text-xs text-muted-foreground">Base: ${boleto.precio}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {boleto.descuento > 0 ? (
                          <>
                            <p className="text-sm font-medium text-green-600">-${boleto.descuento}</p>
                            {getTipoDescuentoBadge(boleto.tipoDescuento)}
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground">Sin descuento</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getEstadoBadge(boleto.estado)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <QrCode className="h-4 w-4" />
                        </Button>
                        {boleto.estado === "CONFIRMADO" && (
                          <Button variant="ghost" size="sm" onClick={() => marcarComoAbordado(boleto.id)}>
                            <UserCheck className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                        {(boleto.estado === "CONFIRMADO" || boleto.estado === "PENDIENTE") && (
                          <Button variant="ghost" size="sm" onClick={() => marcarComoNoShow(boleto.id)}>
                            <UserX className="h-4 w-4 text-orange-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
