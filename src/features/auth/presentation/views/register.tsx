"use client";
import React, { useState } from "react";
import { useRegister } from "../../hooks/use-register";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import Link from "next/link";
import { RegisterForm } from "../components/register-form";

const RegisterView = () => {
  const { register, isLoading, error } = useRegister();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    documentType: "cedula",
    documentNumber: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      // Manejar error de contraseñas diferentes
      return;
    }
    await register({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      documentType: formData.documentType,
      documentNumber: formData.documentNumber,
      phone: formData.phone,
    });
  };

  const handleFormChange =
    (field: keyof typeof formData) => (value: string) => {
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
          {" "}
          <RegisterForm
            onSubmit={handleSubmit}
            form={formData}
            setForm={{
              setFirstName: (value) => handleFormChange("firstName")(value),
              setLastName: (value) => handleFormChange("lastName")(value),
              setDocumentType: (value) =>
                handleFormChange("documentType")(value),
              setDocumentNumber: (value) =>
                handleFormChange("documentNumber")(value),
              setEmail: (value) => handleFormChange("email")(value),
              setPhone: (value) => handleFormChange("phone")(value),
              setPassword: (value) => handleFormChange("password")(value),
              setConfirmPassword: (value) =>
                handleFormChange("confirmPassword")(value),
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
