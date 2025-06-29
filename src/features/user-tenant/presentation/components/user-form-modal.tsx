import React, { useState } from "react";
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
} from "@/components/ui/dialog";
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
import { Eye, EyeOff, Search } from "lucide-react";
import { CloudinaryUploader } from "@/components/ui/cloudinary-uploader";

interface FormData {
  id?: number;
  username: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  password: string;
  rol: "CONDUCTOR" | "AYUDANTE" | "OFICINISTA" | "ADMIN_COOPERATIVA";
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
  ciudadResidencia?: string;
  genero?: "M" | "F" | "O";
  fotoPerfil?: string;
  fechaContratacion?: string;
  licenciaConducir?: string;
  tipoLicencia?: string;
  fechaExpiracionLicencia?: string;
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
  onFormDataChange,
  onConfirmPasswordChange,
  onShowPasswordChange,
  onCedulaSearch,
  onSubmit,
  onReset,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Función para verificar si hay datos en el formulario
  const hasFormData = React.useCallback(() => {
    return (
      formData.username ||
      formData.numeroDocumento ||
      formData.nombres ||
      formData.apellidos ||
      formData.password ||
      formData.email ||
      formData.telefono ||
      formData.fechaNacimiento ||
      formData.direccion ||
      formData.ciudadResidencia ||
      formData.genero ||
      formData.fotoPerfil ||
      formData.fechaContratacion ||
      formData.licenciaConducir ||
      formData.tipoLicencia ||
      formData.fechaExpiracionLicencia ||
      confirmPassword
    );
  }, [formData, confirmPassword]);

  // Función para manejar el cierre del modal
  const handleOpenChange = (open: boolean) => {
    if (!open && hasFormData() && !isEditing) {
      setShowConfirmDialog(true);
    } else {
      onOpenChange(open);
    }
  };

  // Función para manejar el cierre cuando se presiona Escape o se hace clic fuera
  const handleEscapeKeyDown = React.useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen && hasFormData() && !isEditing) {
      event.preventDefault();
      setShowConfirmDialog(true);
    }
  }, [isOpen, hasFormData, isEditing]);

  // Agregar event listener para la tecla Escape
  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKeyDown);
      return () => {
        document.removeEventListener('keydown', handleEscapeKeyDown);
      };
    }
  }, [isOpen, handleEscapeKeyDown]);

  // Función para confirmar el cierre
  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onReset();
    onOpenChange(false);
  };

  // Función para cancelar el cierre
  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>


      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuario" : "Crear Usuario"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    username: e.target.value,
                  })
                }
                required
              />
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
                  onFormDataChange({
                    ...formData,
                    rol: value,
                    ...(value !== "CONDUCTOR" && {
                      licenciaConducir: undefined,
                      tipoLicencia: undefined,
                      fechaExpiracionLicencia: undefined,
                    }),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONDUCTOR">Conductor</SelectItem>
                  <SelectItem value="AYUDANTE">Ayudante</SelectItem>
                  <SelectItem value="OFICINISTA">Oficinista</SelectItem>
                  <SelectItem value="ADMIN_COOPERATIVA">
                    Administrador
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="genero">Género</Label>
              <Select
                value={formData.genero}
                onValueChange={(value: "M" | "F" | "O") =>
                  onFormDataChange({ ...formData, genero: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Femenino</SelectItem>
                  <SelectItem value="O">Otro</SelectItem>
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
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
              <Input
                id="fechaNacimiento"
                type="date"
                value={
                  formData.fechaNacimiento
                    ? new Date(formData.fechaNacimiento)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    fechaNacimiento: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : undefined,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion || ""}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    direccion: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ciudadResidencia">Ciudad de Residencia</Label>
              <Input
                id="ciudadResidencia"
                value={formData.ciudadResidencia || ""}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    ciudadResidencia: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaContratacion">Fecha de Contratación</Label>
              <Input
                id="fechaContratacion"
                type="date"
                value={
                  formData.fechaContratacion
                    ? new Date(formData.fechaContratacion)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    fechaContratacion: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : undefined,
                  })
                }
              />
            </div>

            {formData.rol === "CONDUCTOR" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="licenciaConducir">Licencia de Conducir</Label>
                  <Input
                    id="licenciaConducir"
                    value={formData.licenciaConducir || ""}
                    onChange={(e) =>
                      onFormDataChange({
                        ...formData,
                        licenciaConducir: e.target.value || undefined,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoLicencia">Tipo de Licencia</Label>
                  <Input
                    id="tipoLicencia"
                    value={formData.tipoLicencia || ""}
                    onChange={(e) =>
                      onFormDataChange({
                        ...formData,
                        tipoLicencia: e.target.value || undefined,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaExpiracionLicencia">
                    Fecha de Expiración de Licencia
                  </Label>
                  <Input
                    id="fechaExpiracionLicencia"
                    type="date"
                    value={
                      formData.fechaExpiracionLicencia
                        ? new Date(formData.fechaExpiracionLicencia)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      onFormDataChange({
                        ...formData,
                        fechaExpiracionLicencia: e.target.value
                          ? new Date(e.target.value).toISOString()
                          : undefined,
                      })
                    }
                  />
                </div>
              </>
            )}

            <div className="col-span-2">
              <CloudinaryUploader
                imageUrl={formData.fotoPerfil || null}
                onImageUpload={(url) =>
                  onFormDataChange({ ...formData, fotoPerfil: url })
                }
                folder="usuarios"
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {isEditing ? "Nueva Contraseña (opcional)" : "Contraseña"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, password: e.target.value })
                  }
                  required={!isEditing}
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
              <Label htmlFor="confirmPassword">
                {isEditing
                  ? "Confirmar Nueva Contraseña"
                  : "Confirmar Contraseña"}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => onConfirmPasswordChange(e.target.value)}
                  required={!isEditing || formData.password !== ""}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                if (hasFormData() && !isEditing) {
                  setShowConfirmDialog(true);
                } else {
                  onReset();
                  onOpenChange(false);
                }
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {isEditing ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* Diálogo de confirmación para cerrar el formulario */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Deseas salir sin guardar?</AlertDialogTitle>
            <AlertDialogDescription>
              Tienes información sin guardar en el formulario. Si sales ahora, perderás todos los datos ingresados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelClose}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose} className="bg-red-600 hover:bg-red-700">
              Salir sin guardar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};
