"use client";
import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/shared/components/ui/select";
import Link from "next/link";

interface RegisterFormProps
{
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
}: RegisterFormProps) =>
{
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Nombres</Label>
        <Input
          id="firstName"
          value={form.firstName}
          placeholder="nombre 1 y nombre 2"
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
          placeholder="apellido 1 y apellido 2"
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
          onValueChange={(value) => {
            setForm.setDocumentType(value);
            setForm.setDocumentNumber('');
          }}
        >
          <SelectTrigger id="documentType">
            <SelectValue placeholder="Selecciona el tipo de documento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cedula">Cédula de identidad</SelectItem>
            <SelectItem value="ruc">RUC</SelectItem>
            <SelectItem value="passport">Pasaporte</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="documentNumber">Número de documento</Label>
        <Input
          id="documentNumber"
          value={form.documentNumber}
          placeholder={
            form.documentType === 'cedula' ? '1234567890' :
              form.documentType === 'ruc' ? '1234567890001' :
                form.documentType === 'passport' ? 'AB123456' :
                  'Selecciona tipo de documento'
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          {
            let value = e.target.value;

            if (form.documentType === 'cedula')
            {
              value = value.replace(/\D/g, '');
              if (value.length <= 10)
              {
                setForm.setDocumentNumber(value);
              }
            }
            else if (form.documentType === 'ruc')
            {
              value = value.replace(/\D/g, '');
              if (value.length <= 13)
              {
                if (value.length < 10)
                {
                  setForm.setDocumentNumber(value);
                }
                else if (value.length === 10)
                {
                  setForm.setDocumentNumber(value + '001');
                }
                else if (value.length <= 13 && value.endsWith('001'))
                {
                  setForm.setDocumentNumber(value);
                }
              }
            }
            else if (form.documentType === 'passport')
            {
              value = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
              if (value.length <= 12)
              {
                setForm.setDocumentNumber(value);
              }
            }
            else
            {
              return;
            }
          }}
          maxLength={
            form.documentType === 'cedula' ? 10 :
              form.documentType === 'ruc' ? 13 :
                form.documentType === 'passport' ? 12 :
                  undefined
          }
          disabled={!form.documentType}
          required
        />

        {form.documentType === 'cedula' && (
          <p className="text-xs text-gray-500">Ingresa 10 dígitos de tu cédula</p>
        )}
        {form.documentType === 'ruc' && (
          <p className="text-xs text-gray-500">Ingresa 10 dígitos, se agregará automáticamente 001</p>
        )}
        {form.documentType === 'passport' && (
          <p className="text-xs text-gray-500">Letras y números, máximo 12 caracteres</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="correo_electronico@ejemplo.com"
          value={form.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm.setEmail(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Celular</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="099 223 3344"
          value={form.phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length <= 10)
            {
              setForm.setPhone(value);
            }
          }}
          maxLength={10}
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
        {form.confirmPassword && form.password !== form.confirmPassword && (
          <p className="text-sm text-red-500">Las contraseñas no coinciden</p>
        )}
      </div>

      {error && <div className="text-sm text-red-500 mt-2">{error}</div>}

      <Button 
        type="submit" 
        className="w-full mt-6" 
        disabled={isLoading || (Boolean(form.confirmPassword) && form.password !== form.confirmPassword)}
      >
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
