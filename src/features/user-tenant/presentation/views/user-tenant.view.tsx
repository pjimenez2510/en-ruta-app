"use client";
import React from "react";
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
import { Pencil, Trash2 } from "lucide-react";
import { useManagementUsers } from "@/features/user-tenant/hooks/use-management-users";
import { UserFormModal } from "../components/user-form-modal";

const ManagementUsersView = () => {
  const {
    users,
    formData,
    confirmPassword,
    showPassword,
    isEditing,
    dialogOpen,
    error,
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-2">
          <h2 className="text-2xl font-semibold text-center">
            Gestión de Usuarios
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cédula</TableHead>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.cedula}>
                  <TableCell>{user.cedula}</TableCell>
                  <TableCell>{user.nombreCompleto}</TableCell>
                  <TableCell>
                    {user.rol === "chofer" ? "Chofer" : "Vendedor de Boletos"}
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
                      onClick={() => handleDelete(user.cedula)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagementUsersView;
