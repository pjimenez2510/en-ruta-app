"use client"

import { useState } from "react"
import { Download, Edit, Eye, Filter, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ResolucionesView () {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedResolution, setSelectedResolution] = useState<any>(null)

  // Datos de ejemplo de resoluciones
  const [resoluciones, setResoluciones] = useState([
    {
      id: 1,
      numeroResolucion: "ANT-2025-001",
      fechaEmision: "2025-01-15",
      fechaVigencia: "2026-01-15",
      documentoUrl: "/documents/ant-2025-001.pdf",
      descripcion: "Resolución de frecuencias para ruta Ambato-Quito",
      activo: true,
    },
    {
      id: 2,
      numeroResolucion: "ANT-2025-002",
      fechaEmision: "2025-01-20",
      fechaVigencia: "2026-01-20",
      documentoUrl: "/documents/ant-2025-002.pdf",
      descripcion: "Autorización de frecuencias Santa María - Guayaquil",
      activo: true,
    },
    {
      id: 3,
      numeroResolucion: "ANT-2024-156",
      fechaEmision: "2024-12-10",
      fechaVigencia: "2025-12-10",
      documentoUrl: null,
      descripcion: "Resolución temporal para ruta Baños-Quito",
      activo: true,
    },
    {
      id: 4,
      numeroResolucion: "ANT-2024-089",
      fechaEmision: "2024-08-15",
      fechaVigencia: "2025-08-15",
      documentoUrl: "/documents/ant-2024-089.pdf",
      descripcion: "Resolución suspendida por incumplimiento",
      activo: false,
    },
  ])

  // Función para determinar si una resolución está próxima a vencer
  const isExpiringSoon = (fechaVigencia: string) => {
    if (!fechaVigencia) return false
    const today = new Date()
    const vigencia = new Date(fechaVigencia)
    const diffTime = vigencia.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  // Función para determinar si una resolución está vencida
  const isExpired = (fechaVigencia: string) => {
    if (!fechaVigencia) return false
    const today = new Date()
    const vigencia = new Date(fechaVigencia)
    return vigencia < today
  }

  // Función para obtener el estado de la resolución
  const getResolutionStatus = (resolucion: any) => {
    if (!resolucion.activo) return "inactive"
    if (isExpired(resolucion.fechaVigencia)) return "expired"
    if (isExpiringSoon(resolucion.fechaVigencia)) return "expiring"
    return "active"
  }

  // Función para obtener el color del badge según el estado
  const getStatusBadge = (resolucion: any) => {
    const status = getResolutionStatus(resolucion)
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Activa</Badge>
      case "expiring":
        return <Badge className="bg-amber-100 text-amber-700">Por Vencer</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-700">Vencida</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-700">Inactiva</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Desconocido</Badge>
    }
  }

  // Filtrar resoluciones
  const filteredResoluciones = resoluciones.filter((resolucion) => {
    const matchesSearch =
      resolucion.numeroResolucion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resolucion.descripcion && resolucion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))

    const status = getResolutionStatus(resolucion)
    const matchesStatus = statusFilter === "all" || status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Función para eliminar/desactivar resolución
  const handleDelete = (resolucion: any) => {
    setSelectedResolution(resolucion)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedResolution) {
      setResoluciones(resoluciones.map((r) => (r.id === selectedResolution.id ? { ...r, activo: false } : r)))
      setDeleteDialogOpen(false)
      setSelectedResolution(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resoluciones ANT</h1>
            <p className="text-gray-500">Gestión de resoluciones de la Agencia Nacional de Tránsito</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <a href="/main/resolution/crear">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Resolución
            </a>
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número de resolución o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="inactive">Inactivas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Resolutions Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número de Resolución</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Fecha Emisión</TableHead>
                  <TableHead>Fecha Vigencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResoluciones.map((resolucion) => (
                  <TableRow key={resolucion.id}>
                    <TableCell className="font-medium">{resolucion.numeroResolucion}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="truncate text-sm">{resolucion.descripcion || "Sin descripción"}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(resolucion.fechaEmision).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {resolucion.fechaVigencia ? new Date(resolucion.fechaVigencia).toLocaleDateString() : "Sin fecha"}
                    </TableCell>
                    <TableCell>{getStatusBadge(resolucion)}</TableCell>
                    <TableCell>
                      {resolucion.documentoUrl ? (
                        <Button variant="outline" size="sm" asChild>
                          <a href={resolucion.documentoUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">Sin documento</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Acciones
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <a href={`/resoluciones/${resolucion.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={`/main/resolution/${resolucion.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </a>
                          </DropdownMenuItem>
                          {resolucion.documentoUrl && (
                            <DropdownMenuItem asChild>
                              <a href={resolucion.documentoUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Descargar
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(resolucion)}
                            className="text-red-600"
                            disabled={!resolucion.activo}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {resolucion.activo ? "Desactivar" : "Inactiva"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Desactivar Resolución?</DialogTitle>
            <DialogDescription>
              Esta acción desactivará la resolución <strong>{selectedResolution?.numeroResolucion}</strong>. La
              resolución no será eliminada permanentemente, pero no estará disponible para nuevas operaciones.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Desactivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
