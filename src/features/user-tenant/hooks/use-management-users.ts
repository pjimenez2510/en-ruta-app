"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UserTenant,
  SRIResponse,
} from "@/core/interfaces/management-users.interface";
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
  genero?: string;
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

  // Mutación para crear usuario
  const createMutation = useMutation({
    mutationFn: (data: FormData) => {
      const userData = {
        rol: data.rol,
        password: data.password,
        usuario: {
          username: data.username,
        },
        infoPersonal: {
          nombres: data.nombres,
          apellidos: data.apellidos,
          tipoDocumento: "CEDULA",
          numeroDocumento: data.numeroDocumento,
          telefono: data.telefono || "",
          email: data.email || "",
          fechaNacimiento: data.fechaNacimiento || "",
          direccion: data.direccion || "",
          ciudadResidencia: data.ciudadResidencia || "",
          genero: data.genero || "",
          fotoPerfil: data.fotoPerfil || "",
          fechaContratacion: data.fechaContratacion || "",
          licenciaConducir: data.licenciaConducir || "",
          tipoLicencia: data.tipoLicencia || "",
          fechaExpiracionLicencia: data.fechaExpiracionLicencia || "",
        },
      };
      return managementUsersService.createUser(userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      resetForm();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Mutación para actualizar usuario
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => {
      const userData = {
        rol: data.rol,
        usuario: {
          username: data.username,
        },
        infoPersonal: {
          nombres: data.nombres,
          apellidos: data.apellidos,
          tipoDocumento: "CEDULA",
          numeroDocumento: data.numeroDocumento,
          telefono: data.telefono || "",
          email: data.email || "",
          fechaNacimiento: data.fechaNacimiento || "",
          direccion: data.direccion || "",
          ciudadResidencia: data.ciudadResidencia || "",
          genero: data.genero || "",
          fotoPerfil: data.fotoPerfil || "",
          fechaContratacion: data.fechaContratacion || "",
          licenciaConducir: data.licenciaConducir || "",
          tipoLicencia: data.tipoLicencia || "",
          fechaExpiracionLicencia: data.fechaExpiracionLicencia || "",
        },
      };
      return managementUsersService.updateUser(id, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      resetForm();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Mutación para eliminar usuario
  const deleteMutation = useMutation({
    mutationFn: managementUsersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      setError(error.message);
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
        const nombres = partes.slice(0, 2).join(" ");
        const apellidos = partes.slice(2).join(" ");
        setFormData((prev) => ({
          ...prev,
          nombres,
          apellidos,
        }));
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (isEditing && formData.id) {
      updateMutation.mutate({
        id: formData.id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
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
      genero: user.infoPersonal?.genero || "",
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
