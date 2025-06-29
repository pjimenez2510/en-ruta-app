"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  UserTenant,
  CreateUserTenantDto,
  UpdateUserTenantDto,
} from "@/features/user-tenant/interfaces/management-users.interface";
import { managementUsersService } from "../services/management-users.service";

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

interface UseManagementUsersReturn {
  users: UserTenant[];
  formData: FormData;
  confirmPassword: string;
  showPassword: boolean;
  isEditing: boolean;
  dialogOpen: boolean;
  error: string | null;
  isLoading: boolean;
  setFormData: (data: FormData) => void;
  setConfirmPassword: (password: string) => void;
  setShowPassword: (show: boolean) => void;
  setDialogOpen: (open: boolean) => void;
  handleCedulaSearch: () => Promise<void>;
  handleSubmit: (e: React.FormEvent) => void;
  handleEdit: (user: UserTenant) => void;
  handleDelete: (id: number) => void;
  resetForm: () => void;
}

const defaultFormData: FormData = {
  username: "",
  numeroDocumento: "",
  nombres: "",
  apellidos: "",
  password: "",
  rol: "CONDUCTOR",
};

// Helper function to parse backend errors
const parseBackendError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response: { data: { error?: string[]; message?: string } } }).response;
    if (response?.data) {
      const { error: errorArray, message } = response.data;
      
      // If there's an array of specific errors, show them
      if (Array.isArray(errorArray) && errorArray.length > 0) {
        return errorArray.join(", ");
      }
      
      // If there's a general message, show it
      if (message) {
        return message;
      }
    }
  }
  
  // Fallback to error message or default
  if (error instanceof Error) {
    return error.message;
  }
  
  return "Error desconocido";
};

export function useManagementUsers(): UseManagementUsersReturn {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Query para obtener usuarios
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: managementUsersService.getAllUsers,
  });

  // Mutación para eliminar usuario
  const deleteMutation = useMutation({
    mutationFn: managementUsersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario eliminado correctamente");
    },
    onError: (error: Error) => {
      const errorMessage = parseBackendError(error);
      toast.error(errorMessage);
      setError(errorMessage);
    },
  });

  const handleCedulaSearch = async () => {
    if (
      formData.numeroDocumento.length === 10 ||
      formData.numeroDocumento.length === 13
    ) {
      try {
        const nombreCompleto = await managementUsersService.fetchSRIData(
          formData.numeroDocumento
        );
        const partes = nombreCompleto.split(" ");
        const apellidos = partes.slice(0, 2).join(" ");
        const nombres = partes.slice(2).join(" ");
        setFormData((prev) => ({
          ...prev,
          nombres,
          apellidos,
        }));
        setError(null);
        toast.success("Información encontrada correctamente");
      } catch (error) {
        if (error instanceof Error) {
          const errorMessage = parseBackendError(error);
          toast.error(errorMessage);
          setError(errorMessage);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Solo validar contraseñas si se está creando un usuario nuevo o si se está cambiando la contraseña
    if (!isEditing || (isEditing && formData.password !== "")) {
      if (formData.password !== confirmPassword) {
        const errorMessage = "Las contraseñas no coinciden";
        toast.error(errorMessage);
        setError(errorMessage);
        return;
      }
    }

    try {
      if (isEditing && formData.id) {
        const updateDto: UpdateUserTenantDto = {
          rol: formData.rol,
          usuario: {
            username: formData.username,
            ...(formData.password && { password: formData.password }),
          },
          infoPersonal: {
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            tipoDocumento: "CEDULA",
            numeroDocumento: formData.numeroDocumento,
            telefono: formData.telefono || "",
            email: formData.email || "",
            fechaNacimiento: formData.fechaNacimiento || "",
            direccion: formData.direccion || "",
            ciudadResidencia: formData.ciudadResidencia || "",
            genero: formData.genero || "M",
            fotoPerfil: formData.fotoPerfil || "",
            fechaContratacion: formData.fechaContratacion || "",
            licenciaConducir: formData.licenciaConducir || "",
            tipoLicencia: formData.tipoLicencia || "",
            fechaExpiracionLicencia: formData.fechaExpiracionLicencia || "",
          },
        };

        await managementUsersService.updateUser(formData.id, updateDto);
        toast.success("Usuario actualizado correctamente");
      } else {
        const createDto: CreateUserTenantDto = {
          rol: formData.rol,
          usuario: {
            username: formData.username,
            password: formData.password,
          },
          infoPersonal: {
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            tipoDocumento: "CEDULA",
            numeroDocumento: formData.numeroDocumento,
            telefono: formData.telefono || "",
            email: formData.email || "",
            fechaNacimiento: formData.fechaNacimiento || "",
            direccion: formData.direccion || "",
            ciudadResidencia: formData.ciudadResidencia || "",
            genero: formData.genero || "M",
            fotoPerfil: formData.fotoPerfil || "",
            fechaContratacion: formData.fechaContratacion || "",
            licenciaConducir: formData.licenciaConducir || "",
            tipoLicencia: formData.tipoLicencia || "",
            fechaExpiracionLicencia: formData.fechaExpiracionLicencia || "",
          },
        };

        await managementUsersService.createUser(createDto);
        toast.success("Usuario creado correctamente");
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      const errorMessage = parseBackendError(error);
      toast.error(errorMessage);
      setError(errorMessage);
      console.error("Error:", error);
    }
  };

  const handleEdit = (user: UserTenant) => {
    setFormData({
      id: user.id,
      username: user.usuario?.username || "",
      numeroDocumento: user.infoPersonal?.numeroDocumento || "",
      nombres: user.infoPersonal?.nombres || "",
      apellidos: user.infoPersonal?.apellidos || "",
      password: "",
      rol: user.rol as FormData["rol"],
      email: user.infoPersonal?.email || "",
      telefono: user.infoPersonal?.telefono || "",
      fechaNacimiento: user.infoPersonal?.fechaNacimiento || "",
      direccion: user.infoPersonal?.direccion || "",
      ciudadResidencia: user.infoPersonal?.ciudadResidencia || "",
      genero: user.infoPersonal?.genero,
      fotoPerfil: user.infoPersonal?.fotoPerfil || "",
      fechaContratacion: user.infoPersonal?.fechaContratacion || "",
      licenciaConducir: user.infoPersonal?.licenciaConducir || "",
      tipoLicencia: user.infoPersonal?.tipoLicencia || "",
      fechaExpiracionLicencia: user.infoPersonal?.fechaExpiracionLicencia || "",
    });
    setConfirmPassword("");
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setConfirmPassword("");
    setIsEditing(false);
    setDialogOpen(false);
    setError(null);
  };

  return {
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
  };
}
