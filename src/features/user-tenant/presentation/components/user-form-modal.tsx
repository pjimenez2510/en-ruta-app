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

interface UserFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  formData: {
    cedula: string;
    nombreCompleto: string;
    rol: "chofer" | "vendedor";
    password: string;
  };
  confirmPassword: string;
  showPassword: boolean;
  error: string | null;
  onFormDataChange: (data: any) => void;
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
            <Label htmlFor="cedula">Cédula</Label>
            <div className="flex gap-2">
              <Input
                id="cedula"
                value={formData.cedula}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 13) {
                    onFormDataChange({ ...formData, cedula: value });
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
                  formData.cedula.length !== 10 && formData.cedula.length !== 13
                }
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombreCompleto">Nombre Completo</Label>
            <Input
              id="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  nombreCompleto: e.target.value,
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
              onValueChange={(value: "chofer" | "vendedor") =>
                onFormDataChange({ ...formData, rol: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chofer">Chofer</SelectItem>
                <SelectItem value="vendedor">Vendedor de Boletos</SelectItem>
              </SelectContent>
            </Select>
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
