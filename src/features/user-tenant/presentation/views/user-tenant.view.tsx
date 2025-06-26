"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { useManagementUsers } from "@/features/user-tenant/hooks/use-management-users";
import { UserFormModal } from "../components/user-form-modal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ManagementUsersView = () => {
  const {
    users,
    formData,
    confirmPassword,
    showPassword,
    isEditing,
    dialogOpen,
    error,
    isLoading,
    setFormData,
    setConfirmPassword,
    setShowPassword,
    setDialogOpen,
    handleCedulaSearch,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
  } = useManagementUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      handleDelete(userToDelete);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.infoPersonal?.nombres
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false) ||
      (user.infoPersonal?.apellidos
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false) ||
      (user.infoPersonal?.numeroDocumento?.includes(searchTerm) ?? false);

    const matchesRole = roleFilter === "all" || user.rol === roleFilter;

    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch {
      return "Fecha no válida";
    }
  };

  const getRoleLabel = (rol: string) => {
    const roles: { [key: string]: string } = {
      CONDUCTOR: "Conductor",
      AYUDANTE: "Ayudante",
      OFICINISTA: "Oficinista",
      ADMIN_COOPERATIVA: "Administrador",
    };
    return roles[rol] || rol;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="w-full shadow-lg rounded-2xl">
        <CardHeader className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, documento o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 rounded-lg shadow-sm"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px] rounded-lg shadow-sm">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="CONDUCTOR">Conductores</SelectItem>
                  <SelectItem value="AYUDANTE">Ayudantes</SelectItem>
                  <SelectItem value="OFICINISTA">Oficinistas</SelectItem>
                  <SelectItem value="ADMIN_COOPERATIVA">Administradores</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 rounded-lg shadow-sm px-4 py-2"
            >
              <Plus className="h-4 w-4" />
              Nuevo Usuario
            </Button>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm w-full">
            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Usuario</TableHead>
                  <TableHead className="text-center">Nombre Completo</TableHead>
                  <TableHead className="text-center">Documento</TableHead>
                  <TableHead className="text-center">Rol</TableHead>
                  <TableHead className="text-center">Fecha Registro</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-accent/30 transition-colors align-middle">
                      <TableCell className="font-medium text-center align-middle max-w-[160px] truncate" title={user.usuario.username}>
                        {user.usuario.username}
                      </TableCell>
                      <TableCell className="text-center align-middle max-w-[220px] truncate" title={user.infoPersonal ? `${user.infoPersonal.nombres} ${user.infoPersonal.apellidos}` : 'No registrado'}>
                        {user.infoPersonal ? `${user.infoPersonal.nombres} ${user.infoPersonal.apellidos}` : "No registrado"}
                      </TableCell>
                      <TableCell className="text-center align-middle max-w-[120px] truncate" title={user.infoPersonal?.numeroDocumento || 'No registrado'}>
                        {user.infoPersonal?.numeroDocumento || "No registrado"}
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {getRoleLabel(user.rol)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center align-middle max-w-[120px] truncate" title={formatDate(user.usuario.fechaRegistro)}>
                        {formatDate(user.usuario.fechaRegistro)}
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.activo
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.activo ? "Activo" : "Inactivo"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(user)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(user.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              usuario y toda su información asociada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UserFormModal
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        isEditing={isEditing}
        formData={formData}
        confirmPassword={confirmPassword}
        showPassword={showPassword}
        error={error}
        onFormDataChange={setFormData}
        onConfirmPasswordChange={setConfirmPassword}
        onShowPasswordChange={setShowPassword}
        onCedulaSearch={handleCedulaSearch}
        onSubmit={handleSubmit}
        onReset={resetForm}
      />
    </div>
  );
};

export default ManagementUsersView;
