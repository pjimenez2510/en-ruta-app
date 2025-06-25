"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { registerCooperativa } from "../../services/auth.service";
import { useLogin } from "../../hooks/use-login";
import type { RegisterCooperativaInput } from "../../interfaces/auth.interface";
import { PasswordInput } from "./password-input";
import { configTenantService } from "@/features/config-tenant/services/config-tenant.service";
import { toast } from "sonner";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

interface RegisterCooperativaFormInput extends RegisterCooperativaInput {
  ruc: string;
}

// Validación de RUC de Ecuador
function isValidEcuadorianRUC(ruc: string): boolean {
  if (!/^[0-9]{13}$/.test(ruc)) return false;
  if (!ruc.endsWith("001")) return false;
  const province = parseInt(ruc.substring(0, 2), 10);
  if (province < 1 || province > 24) return false;
  const thirdDigit = parseInt(ruc[2], 10);
  if (![6, 9].includes(thirdDigit) && thirdDigit > 5) return false;
  // Validar que los últimos 3 dígitos sean 001
  if (ruc.slice(10) !== "001") return false;
  return true;
}

// Validación de password fuerte
function getPasswordChecks(password: string) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}
function isStrongPassword(password: string) {
  const checks = getPasswordChecks(password);
  return Object.values(checks).every(Boolean);
}

export default function RegisterCooperativaForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterCooperativaFormInput>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const router = useRouter();
  const { login, isLoading: isLoginLoading } = useLogin();
  const { update } = useSession();

  const passwordValue = watch("password") || "";
  const rucValue = watch("ruc") || "";
  const telefonoValue = watch("tenant.telefono") || "";

  const passwordChecks = getPasswordChecks(passwordValue);

  const onSubmit = async (data: RegisterCooperativaFormInput) => {
    const { ruc, ...registerData } = data;
    registerData.tenant.identificador = ruc;

    if (!registerData.tenant.sitioWeb) {
      delete registerData.tenant.sitioWeb;
    }

    try {
      await registerCooperativa(registerData);
      toast.success("Cooperativa registrada con éxito!");

      // Auto login después de registrar
      await login({ username: data.username, password: data.password });

      await update();
      const session = await getSession();

      if (session?.user?.tenantId) {
        await configTenantService.createConfigTenant({
          clave: "RUC",
          valor: ruc,
          tipo: "TEXTO",
          descripcion: "RUC de la cooperativa",
        });
      } else {
        throw new Error("No se pudo obtener el tenantId de la sesión.");
      }
      router.push("/login");
    } catch (error) {
      console.error(error);
      let errorMessage =
        "Hubo un error en el registro. Por favor, intente nuevamente.";
      if (isAxiosError(error)) {
        errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Ocurrió un error en el servidor.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto mt-8">
      <CardHeader>
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
          <h2 className="text-2xl font-semibold">Registro de Cooperativa</h2>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario administrador <span className="text-red-500">*</span></Label>
            <Input
              id="username"
              {...register("username", { required: "Este campo es requerido" })}
              placeholder="admincooperativa1"
              autoComplete="username"
            />
            {errors.username && (
              <span className="text-red-500 text-xs">{errors.username.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña <span className="text-red-500">*</span></Label>
            <PasswordInput
              id="password"
              {...register("password", {
                required: "Este campo es requerido",
                validate: (value) =>
                  isStrongPassword(value) ||
                  "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
              })}
            />
            <div className="flex flex-col sm:flex-row sm:space-x-4 mt-2 text-xs">
              <span className={passwordChecks.length ? "text-green-600" : "text-red-500"}>
                {passwordChecks.length ? "✔" : "✗"} Mínimo 8 caracteres
              </span>
              <span className={passwordChecks.upper ? "text-green-600" : "text-red-500"}>
                {passwordChecks.upper ? "✔" : "✗"} Una mayúscula
              </span>
              <span className={passwordChecks.lower ? "text-green-600" : "text-red-500"}>
                {passwordChecks.lower ? "✔" : "✗"} Una minúscula
              </span>
              <span className={passwordChecks.number ? "text-green-600" : "text-red-500"}>
                {passwordChecks.number ? "✔" : "✗"} Un número
              </span>
              <span className={passwordChecks.special ? "text-green-600" : "text-red-500"}>
                {passwordChecks.special ? "✔" : "✗"} Un carácter especial
              </span>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs block mt-1">{errors.password.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la cooperativa <span className="text-red-500">*</span></Label>
            <Input
              id="nombre"
              {...register("tenant.nombre", { required: "Este campo es requerido" })}
              placeholder="Cooperativa Esmeraldas"
            />
            {errors.tenant?.nombre && (
              <span className="text-red-500 text-xs">{errors.tenant.nombre.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ruc">RUC de la cooperativa <span className="text-red-500">*</span></Label>
            <Input
              id="ruc"
              {...register("ruc", {
                required: "El RUC es requerido.",
                validate: (value) =>
                  isValidEcuadorianRUC(value) ||
                  "El RUC debe tener 13 dígitos, terminar en 001 y ser válido para Ecuador.",
              })}
              placeholder="1234567890001"
              maxLength={13}
              onChange={(e) => {
                const { value } = e.target;
                setValue("ruc", value.replace(/\D/g, ""), {
                  shouldValidate: true,
                });
              }}
              value={rucValue}
            />
            {errors.ruc && (
              <span className="text-red-500 text-xs">{errors.ruc.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sitioWeb">Sitio web (Opcional)</Label>
            <Input
              id="sitioWeb"
              {...register("tenant.sitioWeb")}
              placeholder="https://www.cooperativa-esmeraldas.com"
            />
            {errors.tenant?.sitioWeb && (
              <span className="text-red-500 text-xs">{errors.tenant.sitioWeb.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailContacto">Email de contacto <span className="text-red-500">*</span></Label>
            <Input
              id="emailContacto"
              type="email"
              {...register("tenant.emailContacto", {
                required: "Este campo es requerido",
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message: "Ingrese un correo electrónico válido.",
                },
              })}
              placeholder="info@cooperativa-esmeraldas.com"
            />
            {errors.tenant?.emailContacto && (
              <span className="text-red-500 text-xs">{errors.tenant.emailContacto.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono <span className="text-red-500">*</span></Label>
            <Input
              id="telefono"
              {...register("tenant.telefono", {
                required: "Este campo es requerido",
                pattern: {
                  value: /^0\d{9}$/,
                  message: "Ingrese un número de celular válido (0999999999)",
                },
                maxLength: { value: 10, message: "El número debe tener 10 dígitos" },
                minLength: { value: 10, message: "El número debe tener 10 dígitos" },
                validate: (value) =>
                  /^0\d{9}$/.test(value) || "Ingrese un número de celular válido (0999999999)",
              })}
              placeholder="0999999999"
              maxLength={10}
              onChange={(e) => {
                const { value } = e.target;
                setValue("tenant.telefono", value.replace(/\D/g, ""), {
                  shouldValidate: true,
                });
              }}
              value={telefonoValue}
            />
            {errors.tenant?.telefono && (
              <span className="text-red-500 text-xs">{errors.tenant.telefono.message}</span>
            )}
          </div>
          <Button
            type="submit"
            className="w-full mt-6"
            disabled={isSubmitting || isLoginLoading}
          >
            {isSubmitting || isLoginLoading
              ? "Registrando..."
              : "Registrar cooperativa"}
          </Button>
        </form>
        <div className="text-center text-sm mt-4">
          <p className="text-muted-foreground">
            ¿Ya tienes una cuenta?
            <Link href="/login" className="text-primary hover:underline ml-1">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
