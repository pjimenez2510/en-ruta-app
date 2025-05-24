"use client";
import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import Link from "next/link";

interface RegisterFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  form: {
    firstName: string;
    lastName: string;
    documentType: string;
    documentNumber: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
  setForm: {
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setDocumentType: (value: string) => void;
    setDocumentNumber: (value: string) => void;
    setEmail: (value: string) => void;
    setPhone: (value: string) => void;
    setPassword: (value: string) => void;
    setConfirmPassword: (value: string) => void;
  };
  isLoading: boolean;
  error: string | null;
}

export const RegisterForm = ({
  onSubmit,
  form,
  setForm,
  isLoading,
  error,
}: RegisterFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Nombres</Label>
        <Input
          id="firstName"
          value={form.firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm.setFirstName(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Apellidos</Label>
        <Input
          id="lastName"
          value={form.lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm.setLastName(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="documentType">Tipo de documento</Label>
        <Select
          value={form.documentType}
          onValueChange={setForm.setDocumentType}
        >
          <SelectTrigger id="documentType">
            <SelectValue placeholder="Selecciona el tipo de documento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cedula">Cédula de identidad</SelectItem>
            <SelectItem value="passport">Pasaporte</SelectItem>
            <SelectItem value="dni">DNI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="documentNumber">Número de documento</Label>
        <Input
          id="documentNumber"
          value={form.documentNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm.setDocumentNumber(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm.setEmail(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm.setPhone(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm.setPassword(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm.setConfirmPassword(e.target.value)
          }
          required
        />
      </div>

      {error && <div className="text-sm text-red-500 mt-2">{error}</div>}

      <Button type="submit" className="w-full mt-6" disabled={isLoading}>
        {isLoading ? "Registrando..." : "Registrarse"}
      </Button>

      <div className="text-center text-sm mt-4">
        <p className="text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </form>
  );
};
