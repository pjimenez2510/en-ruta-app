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
import { Pencil, Trash2, Search } from "lucide-react";
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
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="space-y-2">
          <h2 className="text-2xl font-semibold text-center">
            Gestión de Usuarios
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, documento o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="CONDUCTOR">Conductores</SelectItem>
                  <SelectItem value="AYUDANTE">Ayudantes</SelectItem>
                  <SelectItem value="OFICINISTA">Oficinistas</SelectItem>
                  <SelectItem value="ADMIN_COOPERATIVA">
                    Administradores
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Usuario</TableHead>
                  <TableHead className="min-w-[200px]">
                    Nombre Completo
                  </TableHead>
                  <TableHead className="min-w-[120px]">Documento</TableHead>
                  <TableHead className="min-w-[120px]">Rol</TableHead>
                  <TableHead className="min-w-[120px]">
                    Fecha Registro
                  </TableHead>
                  <TableHead className="min-w-[100px]">Estado</TableHead>
                  <TableHead className="min-w-[100px] text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.usuario.username}
                      </TableCell>
                      <TableCell>
                        {user.infoPersonal
                          ? `${user.infoPersonal.nombres} ${user.infoPersonal.apellidos}`
                          : "No registrado"}
                      </TableCell>
                      <TableCell>
                        {user.infoPersonal?.numeroDocumento || "No registrado"}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {getRoleLabel(user.rol)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatDate(user.usuario.fechaRegistro)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.activo
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.activo ? "Activo" : "Inactivo"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                          className="mr-2"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagementUsersView;
