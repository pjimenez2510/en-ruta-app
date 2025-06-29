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
  Bus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useFindAllTiposRutaBusQuery } from "../hooks/use-tipo-ruta-bus-queries";
import { useDeleteTipoRutaBusMutation } from "../hooks/use-tipo-ruta-bus-mutations";
import type { TipoRutaBusFilter } from "../interfaces/tipo-ruta-bus.interface";

export function TiposRutaBusTable() {
  const router = useRouter();
  const [filter] = useState<TipoRutaBusFilter>({});
  const [searchTerm, setSearchTerm] = useState("");

  const { data: tiposRutaBus = [], isLoading } = useFindAllTiposRutaBusQuery(filter);
  const deleteMutation = useDeleteTipoRutaBusMutation();

  // Filter tipos de ruta based on search term
  const filteredTiposRutaBus = tiposRutaBus.filter((tipoRutaBus) =>
    tipoRutaBus.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number, nombre: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Tipo de ruta ${nombre} eliminado exitosamente`);
    } catch (error) {
      console.error("Error al eliminar tipo de ruta:", error);
      toast.error("Error al eliminar el tipo de ruta");
    }
  };

  const handleView = (id: number) => {
    router.push(`/main/tipos-ruta-bus/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/main/tipos-ruta-bus/${id}/edit`);
  };

  const handleCreate = () => {
    router.push("/main/tipos-ruta-bus/crear");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando tipos de ruta...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-full px-2 md:px-8 lg:px-16 xl:px-32 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 text-center md:text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Tipos de Ruta</h1>
          <p className="text-muted-foreground text-base md:text-sm">
            Administra los tipos de ruta de bus de tu cooperativa.
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full md:w-auto mt-2 md:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Tipo de Ruta
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center w-full justify-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm rounded-lg shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white shadow-sm w-full">
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">ID</TableHead>
              <TableHead className="text-center">Nombre</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTiposRutaBus.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  No se encontraron tipos de ruta
                </TableCell>
              </TableRow>
            ) : (
              filteredTiposRutaBus.map((tipoRutaBus) => (
                <TableRow 
                  key={tipoRutaBus.id}
                  className="hover:bg-accent/30 transition-colors align-top"
                >
                  <TableCell className="font-medium text-center align-middle">
                    {tipoRutaBus.id}
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <div className="flex items-center justify-center space-x-2">
                      <Bus className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{tipoRutaBus.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <div className="flex items-center justify-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleView(tipoRutaBus.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Tipo de Ruta
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(tipoRutaBus.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar Tipo de Ruta
                          </DropdownMenuItem>
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
                                  ¿Estás seguro de eliminar este tipo de ruta?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. El tipo de ruta &quot;{tipoRutaBus.nombre}&quot; será eliminado permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(tipoRutaBus.id, tipoRutaBus.nombre)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
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