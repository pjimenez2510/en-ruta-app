// features/rutas/components/rutas-table.tsx
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  ExternalLink,
  Loader2,
  Settings,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useFindAllRutasQuery } from "../hooks/use-ruta-queries";
import { useDeleteRutaMutation } from "../hooks/use-ruta-mutations";
import type { RutaFilter } from "../interfaces/ruta.interface";

export function RutasTable() {
  const router = useRouter();
  const [filter] = useState<RutaFilter>({});
  const [searchTerm, setSearchTerm] = useState("");

  const { data: rutas = [], isLoading } = useFindAllRutasQuery(filter);
  const deleteMutation = useDeleteRutaMutation();

  // Filter rutas based on search term
  const filteredRutas = rutas.filter((ruta) =>
    ruta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ruta.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ruta.resolucion?.numeroResolucion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number, nombre: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Ruta ${nombre} eliminada exitosamente`);
    } catch (error) {
      console.error("Error al eliminar ruta:", error);
      toast.error("Error al eliminar la ruta");
    }
  };

  const handleView = (id: number) => {
    router.push(`/main/routes/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/main/routes/${id}/edit`);
  };

  const handleConfigure = (id: number) => {
    router.push(`/main/routes/configuration?rutaId=${id}&mode=edit`);
  };

  const handleCreate = () => {
    router.push("/main/routes/crear");
  };

  const openDocument = (url: string) => {
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando rutas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Rutas</h1>
          <p className="text-muted-foreground">
            Administra las rutas de transporte de tu cooperativa.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Ruta
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, descripción o número de resolución..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Resolución ANT</TableHead>
              <TableHead>Cooperativa</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRutas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No se encontraron rutas
                </TableCell>
              </TableRow>
            ) : (
              filteredRutas.map((ruta) => (
                <TableRow 
                  key={ruta.id}
                  className="hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    {ruta.nombre}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={ruta.descripcion}>
                      {ruta.descripcion}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {ruta.resolucion?.numeroResolucion}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Vigente hasta: {format(new Date(ruta.resolucion?.fechaVigencia), "dd/MM/yyyy", { locale: es })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ruta.tenant?.nombre}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={ruta.activo ? "default" : "secondary"}
                    >
                      {ruta.activo ? "Activa" : "Inactiva"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleView(ruta.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Ruta
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(ruta.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar Ruta
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleConfigure(ruta.id)}>
                          <Settings className="mr-2 h-4 w-4" />
                          Configurar Ruta
                        </DropdownMenuItem>
                        {ruta.resolucion?.documentoUrl && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openDocument(ruta.resolucion.documentoUrl)}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Ver Resolución
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Estás seguro de eliminar esta ruta?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. La ruta &quot;{ruta.nombre}&quot; será eliminada permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(ruta.id, ruta.nombre)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
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