"use client";
import React, { useState } from "react";
import { useRegister } from "../../hooks/use-register";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import Link from "next/link";
import { RegisterForm } from "../components/register-form";

const RegisterView = () => {
  const { register, isLoading, error } = useRegister();
  
  // Estado actualizado con todos los campos requeridos
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    documentType: "CEDULA",
    documentNumber: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    isDisabled: false,
    disabilityPercentage: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      // Manejar error de contraseñas diferentes
      return;
    }

    // Validar edad mínima de 6 años
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
    
    if (actualAge < 6) {
      // Manejar error de edad mínima
      alert("Debes tener al menos 6 años para registrarte");
      return;
    }

    // Formatear los datos según lo que espera el backend
    await register({
      email: formData.email,
      password: formData.password,
      cliente: {
        nombres: formData.firstName,
        apellidos: formData.lastName,
        tipoDocumento: formData.documentType,
        numeroDocumento: formData.documentNumber,
        telefono: formData.phone || undefined,
        email: formData.email,
        fechaNacimiento: formData.birthDate ? new Date(formData.birthDate).toISOString() : undefined,
        esDiscapacitado: formData.isDisabled,
        porcentajeDiscapacidad: formData.isDisabled ? formData.disabilityPercentage : undefined
      }
    });
  };

  const handleFormChange = (field: keyof typeof formData) => (value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex items-center space-x-2">
            <Link href="/login" className="text-primary hover:opacity-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Link>
            <h2 className="text-2xl font-semibold">Crear una cuenta</h2>
          </div>
        </CardHeader>
        <CardContent>
          <RegisterForm
            onSubmit={handleSubmit}
            form={formData}
            setForm={{
              setFirstName: (value: string) => handleFormChange("firstName")(value),
              setLastName: (value: string) => handleFormChange("lastName")(value),
              setDocumentType: (value: string) => handleFormChange("documentType")(value),
              setDocumentNumber: (value: string) => handleFormChange("documentNumber")(value),
              setEmail: (value: string) => handleFormChange("email")(value),
              setPhone: (value: string) => handleFormChange("phone")(value),
              setPassword: (value: string) => handleFormChange("password")(value),
              setConfirmPassword: (value: string) => handleFormChange("confirmPassword")(value),
              setBirthDate: (value: string) => handleFormChange("birthDate")(value),
              setIsDisabled: (value: boolean) => handleFormChange("isDisabled")(value),
              setDisabilityPercentage: (value: number) => handleFormChange("disabilityPercentage")(value),
            }}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterView;