// features/resoluciones-ant/components/resoluciones-ant-table.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import {
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useFindAllResolucionesAntQuery } from "../hooks/use-resolucion-ant-queries";
import { useDeleteResolucionAntMutation } from "../hooks/use-resolucion-ant-mutations";
import type { ResolucionAnt, ResolucionAntFilter } from "../interfaces/resolucion-ant.interface";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function ResolucionesAntTable() {
  const router = useRouter();
  const [filter, setFilter] = useState<ResolucionAntFilter>({});
  const [searchTerm, setSearchTerm] = useState("");

  const { data: resoluciones = [], isLoading, error } = useFindAllResolucionesAntQuery(filter);
  const deleteMutation = useDeleteResolucionAntMutation();

  // Filter resoluciones based on search term
  const filteredResoluciones = resoluciones.filter((resolucion) =>
    resolucion.numeroResolucion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resolucion.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number, numeroResolucion: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Resolución ${numeroResolucion} eliminada exitosamente`);
    } catch (error) {
      console.error("Error al eliminar resolución:", error);
      toast.error("Error al eliminar la resolución");
    }
  };

  const handleView = (id: number) => {
    router.push(`/main/resolution/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/main/resolution/${id}/edit`);
  };

  const handleCreate = () => {
    router.push("/main/resolution/crear");
  };

  const openDocument = (url: string) => {
    window.open(url, "_blank");
  };


  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resoluciones ANT</h1>
          <p className="text-muted-foreground">
            Gestiona las resoluciones de la Agencia Nacional de Tránsito
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Resolución
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Fecha Emisión</TableHead>
              <TableHead>Fecha Vigencia</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead className="w-[70px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="mt-2 text-muted-foreground">Cargando resoluciones...</p>
                </TableCell>
              </TableRow>
            ) : filteredResoluciones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm ? "No se encontraron resoluciones" : "No hay resoluciones registradas"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredResoluciones.map((resolucion) => (
                <TableRow key={resolucion.id}>
                  <TableCell className="font-medium">
                    {resolucion.numeroResolucion}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="truncate" title={resolucion.descripcion}>
                      {resolucion.descripcion}
                    </p>
                  </TableCell>
                  <TableCell>
                    {format(new Date(resolucion.fechaEmision), "dd/MM/yyyy", { locale: es })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(resolucion.fechaVigencia), "dd/MM/yyyy", { locale: es })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={resolucion.activo ? "default" : "secondary"}>
                      {resolucion.activo ? "Activa" : "Inactiva"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDocument(resolucion.documentoUrl)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleView(resolucion.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(resolucion.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-destructive"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente
                                la resolución <strong>{resolucion.numeroResolucion}</strong>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDelete(resolucion.id, resolucion.numeroResolucion)}
                                disabled={deleteMutation.isPending}
                              >
                                {deleteMutation.isPending && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}