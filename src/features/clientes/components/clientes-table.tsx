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
  User,
  Phone,
  Mail,
  FileText,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useFindAllClientesQuery } from "../hooks/use-cliente-queries";
import { useDeleteClienteMutation } from "../hooks/use-cliente-mutations";
import type { ClienteFilter } from "../interfaces/cliente.interface";

export function ClientesTable() {
  const router = useRouter();
  const [filter] = useState<ClienteFilter>({});
  const [searchTerm, setSearchTerm] = useState("");

  const { data: clientes = [], isLoading } = useFindAllClientesQuery(filter);
  const deleteMutation = useDeleteClienteMutation();

  // Filter clientes based on search term
  const filteredClientes = clientes.filter((cliente) =>
    cliente.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefono.includes(searchTerm) ||
    cliente.numeroDocumento.includes(searchTerm)
  );

  const handleDelete = async (id: number, nombre: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Cliente ${nombre} eliminado exitosamente`);
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      toast.error("Error al eliminar el cliente");
    }
  };

  const handleView = (id: number) => {
    router.push(`/main/clientes/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/main/clientes/${id}/edit`);
  };

  const handleCreate = () => {
    router.push("/main/clientes/crear");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando clientes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-full px-2 md:px-8 lg:px-16 xl:px-32 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 text-center md:text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Clientes</h1>
          <p className="text-muted-foreground text-base md:text-sm">
            Administra los clientes de tu cooperativa.
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full md:w-auto mt-2 md:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center w-full justify-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, email, teléfono o documento..."
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
              <TableHead className="text-center">Cliente</TableHead>
              <TableHead className="text-center">Contacto</TableHead>
              <TableHead className="text-center">Documento</TableHead>
              <TableHead className="text-center">Discapacidad</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No se encontraron clientes
                </TableCell>
              </TableRow>
            ) : (
              filteredClientes.map((cliente) => (
                <TableRow 
                  key={cliente.id}
                  className="hover:bg-accent/30 transition-colors align-top"
                >
                  <TableCell className="text-center align-middle">
                    <div className="space-y-1">
                      <div className="font-medium flex items-center justify-center">
                        <User className="mr-2 h-4 w-4" />
                        {cliente.nombres} {cliente.apellidos}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(cliente.fechaNacimiento), "dd/MM/yyyy", { locale: es })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center">
                        <Phone className="mr-2 h-4 w-4" />
                        {cliente.telefono}
                      </div>
                      <div className="flex items-center justify-center">
                        <Mail className="mr-2 h-4 w-4" />
                        {cliente.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <div className="space-y-1">
                      <div className="font-medium flex items-center justify-center">
                        <FileText className="mr-2 h-4 w-4" />
                        {cliente.tipoDocumento}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {cliente.numeroDocumento}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <div className="flex justify-center">
                      <Badge
                        variant={cliente.esDiscapacitado ? "default" : "secondary"}
                        className="px-3 py-1 text-xs rounded-full min-w-[120px] flex justify-center"
                      >
                        {cliente.esDiscapacitado ? (
                          <span>
                            Con Discapacidad
                            {cliente.porcentajeDiscapacidad && (
                              <span className="ml-1">({cliente.porcentajeDiscapacidad}%)</span>
                            )}
                          </span>
                        ) : (
                          "Sin Discapacidad"
                        )}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <div className="flex justify-center">
                      <Badge
                        variant={cliente.activo ? "default" : "secondary"}
                        className="px-3 py-1 text-xs rounded-full min-w-[80px] flex justify-center"
                      >
                        {cliente.activo ? "Activo" : "Inactivo"}
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
                          <DropdownMenuItem onClick={() => handleView(cliente.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Cliente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(cliente.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar Cliente
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
                                  ¿Estás seguro de eliminar este cliente?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. El cliente &quot;{cliente.nombres} {cliente.apellidos}&quot; será eliminado permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(cliente.id, `${cliente.nombres} ${cliente.apellidos}`)}
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