"use client";
import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Slider } from "@/shared/components/ui/slider";
import Link from "next/link";

interface RegisterFormProps
{
  onSubmit: (e: React.FormEvent) => Promise<void>;
  form: {
    firstName: string;
    lastName: string;
    username: string; // Nuevo campo para nombre de usuario
    documentType: string;
    documentNumber: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    birthDate: string;
    isDisabled: boolean;
    disabilityPercentage: number;
  };
  setForm: {
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setUsername: (value: string) => void; // Setter para username
    setDocumentType: (value: string) => void;
    setDocumentNumber: (value: string) => void;
    setEmail: (value: string) => void;
    setPhone: (value: string) => void;
    setPassword: (value: string) => void;
    setConfirmPassword: (value: string) => void;
    setBirthDate: (value: string) => void;
    setIsDisabled: (value: boolean) => void;
    setDisabilityPercentage: (value: number) => void;
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
    <form onSubmit={onSubmit} className="space-y-6">
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
        <Label htmlFor="username">Nombre de usuario</Label>
        <Input
          id="username"
          value={form.username}
          placeholder="Nombre de usuario"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm.setUsername(e.target.value)
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
            <SelectItem value="CEDULA">Cédula de identidad</SelectItem>
            <SelectItem value="RUC">RUC</SelectItem>
            <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="documentNumber">Número de documento</Label>
        <Input
          id="documentNumber"
          value={form.documentNumber}
          placeholder={
            form.documentType === 'CEDULA' ? '1234567890' :
              form.documentType === 'RUC' ? '1234567890001' :
                form.documentType === 'PASAPORTE' ? 'AB123456' :
                  'Selecciona tipo de documento'
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          {
            let value = e.target.value;

            if (form.documentType === 'CEDULA')
            {
              value = value.replace(/\D/g, '');
              if (value.length <= 10)
              {
                setForm.setDocumentNumber(value);
              }
            }
            else if (form.documentType === 'RUC')
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
            else if (form.documentType === 'PASAPORTE')
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
            form.documentType === 'CEDULA' ? 10 :
              form.documentType === 'RUC' ? 13 :
                form.documentType === 'PASAPORTE' ? 12 :
                  undefined
          }
          disabled={!form.documentType}
          required
        />

        {form.documentType === 'CEDULA' && (
          <p className="text-xs text-gray-500">Ingresa 10 dígitos de tu cédula</p>
        )}
        {form.documentType === 'RUC' && (
          <p className="text-xs text-gray-500">Ingresa 10 dígitos, se agregará automáticamente 001</p>
        )}
        {form.documentType === 'PASAPORTE' && (
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
          placeholder="0999123456"
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
        <p className="text-xs text-gray-500">Ingresa 10 dígitos (ej: 0999123456)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate">Fecha de nacimiento</Label>
        <Input
          id="birthDate"
          type="date"
          value={form.birthDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm.setBirthDate(e.target.value)
          }
          max={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
        <Checkbox
          id="isDisabled"
          checked={form.isDisabled}
          onCheckedChange={(checked) => {
            setForm.setIsDisabled(checked as boolean);
            if (!checked) {
              setForm.setDisabilityPercentage(0);
            }
          }}
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor="isDisabled" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Tengo alguna discapacidad
          </Label>
          <p className="text-sm text-muted-foreground">
            Si tienes alguna discapacidad, marca esta casilla para habilitar el campo de porcentaje.
          </p>
        </div>
      </div>

      {form.isDisabled && (
        <div className="space-y-4 rounded-md border p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <Label htmlFor="disabilityPercentage" className="text-sm font-medium">
              Porcentaje de discapacidad
            </Label>
            <span className="text-lg font-semibold text-primary">
              {form.disabilityPercentage}%
            </span>
          </div>
          
          <div className="px-2">
            <Slider
              id="disabilityPercentage"
              min={0}
              max={100}
              step={0.1}
              value={[form.disabilityPercentage]}
              onValueChange={(value) => setForm.setDisabilityPercentage(value[0])}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Desliza para ajustar el porcentaje según tu certificado de discapacidad
          </p>
        </div>
      )}

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