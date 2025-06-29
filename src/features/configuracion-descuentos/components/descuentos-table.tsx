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
  Percent,
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  Power,
  PowerOff,
} from "lucide-react";
import { toast } from "sonner";
import { useFindAllDescuentosQuery } from "../hooks/use-descuento-queries";
import { 
  useDeleteDescuentoMutation, 
  useActivarDescuentoMutation, 
  useDesactivarDescuentoMutation 
} from "../hooks/use-descuento-mutations";
import type { DescuentoFilter } from "../interfaces/descuento.interface";

export function DescuentosTable() {
  const router = useRouter();
  const [filter] = useState<DescuentoFilter>({});
  const [searchTerm, setSearchTerm] = useState("");

  const { data: descuentos = [], isLoading } = useFindAllDescuentosQuery(filter);
  const deleteMutation = useDeleteDescuentoMutation();
  const activarMutation = useActivarDescuentoMutation();
  const desactivarMutation = useDesactivarDescuentoMutation();

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "MENOR_EDAD":
        return "Menor de Edad";
      case "TERCERA_EDAD":
        return "Tercera Edad";
      case "DISCAPACIDAD":
        return "Discapacidad";
      default:
        return tipo;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "MENOR_EDAD":
        return "👶";
      case "TERCERA_EDAD":
        return "👴";
      case "DISCAPACIDAD":
        return "♿";
      default:
        return "💰";
    }
  };

  // Filter descuentos based on search term
  const filteredDescuentos = descuentos.filter((descuento) =>
    getTipoLabel(descuento.tipo).toLowerCase().includes(searchTerm.toLowerCase()) ||
    descuento.porcentaje.includes(searchTerm)
  );

  const handleDelete = async (id: number, tipo: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Descuento ${getTipoLabel(tipo)} eliminado exitosamente`);
    } catch (error) {
      console.error("Error al eliminar descuento:", error);
      toast.error("Error al eliminar el descuento");
    }
  };

  const handleActivar = async (id: number, tipo: string) => {
    try {
      await activarMutation.mutateAsync(id);
      toast.success(`Descuento ${getTipoLabel(tipo)} activado exitosamente`);
    } catch (error) {
      console.error("Error al activar descuento:", error);
      toast.error("Error al activar el descuento");
    }
  };

  const handleDesactivar = async (id: number, tipo: string) => {
    try {
      await desactivarMutation.mutateAsync(id);
      toast.success(`Descuento ${getTipoLabel(tipo)} desactivado exitosamente`);
    } catch (error) {
      console.error("Error al desactivar descuento:", error);
      toast.error("Error al desactivar el descuento");
    }
  };

  const handleView = (id: number) => {
    router.push(`/main/configuracion-descuentos/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/main/configuracion-descuentos/${id}/edit`);
  };

  const handleCreate = () => {
    router.push("/main/configuracion-descuentos/crear");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando descuentos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-full px-2 md:px-8 lg:px-16 xl:px-32 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 text-center md:text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configuración de Descuentos</h1>
          <p className="text-muted-foreground text-base md:text-sm">
            Administra los descuentos disponibles en tu cooperativa.
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full md:w-auto mt-2 md:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Descuento
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center w-full justify-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por tipo de descuento o porcentaje..."
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
              <TableHead className="text-center">Tipo de Descuento</TableHead>
              <TableHead className="text-center">Porcentaje</TableHead>
              <TableHead className="text-center">Validación</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDescuentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No se encontraron descuentos
                </TableCell>
              </TableRow>
            ) : (
              filteredDescuentos.map((descuento) => (
                <TableRow 
                  key={descuento.id}
                  className="hover:bg-accent/30 transition-colors align-top"
                >
                  <TableCell className="text-center align-middle">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl">{getTipoIcon(descuento.tipo)}</span>
                      <div>
                        <div className="font-medium">{getTipoLabel(descuento.tipo)}</div>
                        <div className="text-sm text-muted-foreground">ID: {descuento.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <div className="flex items-center justify-center">
                      <Percent className="mr-2 h-4 w-4" />
                      <span className="font-medium">{descuento.porcentaje}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <div className="flex justify-center">
                      <Badge
                        variant={descuento.requiereValidacion ? "default" : "secondary"}
                        className="px-3 py-1 text-xs rounded-full min-w-[120px] flex justify-center"
                      >
                        {descuento.requiereValidacion ? (
                          <>
                            <Shield className="mr-1 h-3 w-3" />
                            Requiere Validación
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Automático
                          </>
                        )}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <div className="flex justify-center">
                      <Badge
                        variant={descuento.activo ? "default" : "secondary"}
                        className="px-3 py-1 text-xs rounded-full min-w-[80px] flex justify-center"
                      >
                        {descuento.activo ? (
                          <>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Activo
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-1 h-3 w-3" />
                            Inactivo
                          </>
                        )}
                      </Badge>
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
                          <DropdownMenuItem onClick={() => handleView(descuento.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Descuento
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(descuento.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar Descuento
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {descuento.activo ? (
                            <DropdownMenuItem onClick={() => handleDesactivar(descuento.id, descuento.tipo)}>
                              <PowerOff className="mr-2 h-4 w-4" />
                              Desactivar
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleActivar(descuento.id, descuento.tipo)}>
                              <Power className="mr-2 h-4 w-4" />
                              Activar
                            </DropdownMenuItem>
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
                                  ¿Estás seguro de eliminar este descuento?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. El descuento &quot;{getTipoLabel(descuento.tipo)}&quot; será eliminado permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(descuento.id, descuento.tipo)}
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