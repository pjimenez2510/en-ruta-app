import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Search } from "lucide-react";

interface FormData {
  id?: number;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  password: string;
  rol: "CONDUCTOR" | "AYUDANTE" | "OFICINISTA" | "ADMIN_COOPERATIVA";
  email?: string;
  telefono?: string;
}

interface UserFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  formData: FormData;
  confirmPassword: string;
  showPassword: boolean;
  error: string | null;
  onFormDataChange: (data: FormData) => void;
  onConfirmPasswordChange: (value: string) => void;
  onShowPasswordChange: (value: boolean) => void;
  onCedulaSearch: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onOpenChange,
  isEditing,
  formData,
  confirmPassword,
  showPassword,
  error,
  onFormDataChange,
  onConfirmPasswordChange,
  onShowPasswordChange,
  onCedulaSearch,
  onSubmit,
  onReset,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={onReset}>Nuevo Usuario</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuario" : "Crear Usuario"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numeroDocumento">Número de Documento</Label>
            <div className="flex gap-2">
              <Input
                id="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 13) {
                    onFormDataChange({ ...formData, numeroDocumento: value });
                  }
                }}
                disabled={isEditing}
                required
              />
              <Button
                type="button"
                size="icon"
                onClick={onCedulaSearch}
                disabled={
                  formData.numeroDocumento.length !== 10 &&
                  formData.numeroDocumento.length !== 13
                }
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombres">Nombres</Label>
            <Input
              id="nombres"
              value={formData.nombres}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  nombres: e.target.value,
                })
              }
              disabled
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellidos">Apellidos</Label>
            <Input
              id="apellidos"
              value={formData.apellidos}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  apellidos: e.target.value,
                })
              }
              disabled
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rol">Rol</Label>
            <Select
              value={formData.rol}
              onValueChange={(value: FormData["rol"]) =>
                onFormDataChange({ ...formData, rol: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONDUCTOR">Conductor</SelectItem>
                <SelectItem value="AYUDANTE">Ayudante</SelectItem>
                <SelectItem value="OFICINISTA">Oficinista</SelectItem>
                <SelectItem value="ADMIN_COOPERATIVA">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={formData.telefono || ""}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  telefono: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  onFormDataChange({ ...formData, password: e.target.value })
                }
                required
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => onShowPasswordChange(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <Button type="submit" className="w-full">
            {isEditing ? "Guardar Cambios" : "Crear Usuario"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
