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
import type { ResolucionAntFilter } from "../interfaces/resolucion-ant.interface";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function ResolucionesAntTable() {
  const router = useRouter();
  const [filter] = useState<ResolucionAntFilter>({});
  const [searchTerm, setSearchTerm] = useState("");

  const { data: resoluciones = [], isLoading } = useFindAllResolucionesAntQuery(filter);
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
    <div className="space-y-4 max-w-full px-2 md:px-8 lg:px-16 xl:px-32 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 text-center md:text-left">
        <div>
          <h1 className="text-2xl font-bold">Resoluciones ANT</h1>
          <p className="text-muted-foreground text-base md:text-sm">
            Gestiona las resoluciones de la Agencia Nacional de Tránsito
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full md:w-auto mt-2 md:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Resolución
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2 w-full justify-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 rounded-lg shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-x-auto w-full">
        <Table className="min-w-[700px] md:min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Número</TableHead>
              <TableHead className="text-center">Descripción</TableHead>
              <TableHead className="text-center">Fecha Emisión</TableHead>
              <TableHead className="text-center">Fecha Vigencia</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">Documento</TableHead>
              <TableHead className="w-[70px] text-center">Acciones</TableHead>
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
                <TableRow key={resolucion.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-medium text-center align-middle">
                    {resolucion.numeroResolucion}
                  </TableCell>
                  <TableCell className="max-w-[300px] text-center align-middle">
                    <p className="truncate mx-auto" title={resolucion.descripcion}>
                      {resolucion.descripcion}
                    </p>
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    {format(new Date(resolucion.fechaEmision), "dd/MM/yyyy", { locale: es })}
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    {format(new Date(resolucion.fechaVigencia), "dd/MM/yyyy", { locale: es })}
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <div className="flex justify-center">
                      <Badge variant={resolucion.activo ? "default" : "secondary"} className="px-3 py-1 text-xs rounded-full min-w-[80px] flex justify-center">
                        {resolucion.activo ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mx-auto flex items-center justify-center rounded-full border-gray-300"
                      onClick={() => openDocument(resolucion.documentoUrl)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <div className="flex items-center justify-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 flex items-center justify-center">
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
                    </div>
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