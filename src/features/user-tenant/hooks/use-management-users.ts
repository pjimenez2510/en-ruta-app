"use client";
import { useState, useEffect } from "react";
import { User } from "@/core/interfaces/management-users.interface";
import {
  getUsersFromStorage,
  saveUsersToStorage,
  fetchSRIData,
} from "../services/management-users.service";

interface UseManagementUsersReturn {
  users: User[];
  formData: User;
  confirmPassword: string;
  showPassword: boolean;
  isEditing: boolean;
  dialogOpen: boolean;
  error: string | null;
  setFormData: (data: User) => void;
  setConfirmPassword: (password: string) => void;
  setShowPassword: (show: boolean) => void;
  setDialogOpen: (open: boolean) => void;
  handleCedulaSearch: () => Promise<void>;
  handleSubmit: (e: React.FormEvent) => void;
  handleEdit: (user: User) => void;
  handleDelete: (cedula: string) => void;
  resetForm: () => void;
}

const defaultFormData: User = {
  cedula: "",
  nombreCompleto: "",
  password: "",
  rol: "vendedor",
};

export function useManagementUsers(): UseManagementUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<User>(defaultFormData);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedUsers = getUsersFromStorage();
    setUsers(savedUsers);
  }, []);

  useEffect(() => {
    if (isClient) {
      saveUsersToStorage(users);
    }
  }, [users, isClient]);

  const handleCedulaSearch = async () => {
    if (formData.cedula.length === 10 || formData.cedula.length === 13) {
      try {
        const nombreCompleto = await fetchSRIData(formData.cedula);
        setFormData((prev) => ({
          ...prev,
          nombreCompleto,
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

    if (isEditing) {
      setUsers(
        users.map((user) => (user.cedula === formData.cedula ? formData : user))
      );
    } else {
      if (users.some((user) => user.cedula === formData.cedula)) {
        setError("Ya existe un usuario con esta cédula");
        return;
      }
      setUsers([...users, formData]);
    }

    resetForm();
  };

  const handleEdit = (user: User) => {
    setFormData(user);
    setConfirmPassword(user.password);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = (cedula: string) => {
    setUsers(users.filter((user) => user.cedula !== cedula));
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
