"use client";

import React from "react";
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
export default function RegisterCooperativaForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterCooperativaFormInput>();

  const router = useRouter();
  const { login, isLoading: isLoginLoading } = useLogin();
  const { update } = useSession();

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
            <Label htmlFor="username">Usuario administrador</Label>
            <Input
              id="username"
              {...register("username", { required: true })}
              placeholder="admincooperativa1"
            />
            {errors.username && (
              <span className="text-red-500 text-xs">
                Este campo es requerido
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <PasswordInput
              id="password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                Este campo es requerido
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la cooperativa</Label>
            <Input
              id="nombre"
              {...register("tenant.nombre", { required: true })}
              placeholder="Cooperativa Esmeraldas"
            />
            {errors.tenant?.nombre && (
              <span className="text-red-500 text-xs">
                Este campo es requerido
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ruc">RUC de la cooperativa</Label>
            <Input
              id="ruc"
              {...register("ruc", {
                required: "El RUC es requerido.",
                validate: (value) =>
                  value.length === 13 || "El RUC debe tener 13 dígitos.",
              })}
              placeholder="1234567890001"
              maxLength={13}
              onChange={(e) => {
                const { value } = e.target;
                setValue("ruc", value.replace(/\\D/g, ""), {
                  shouldValidate: true,
                });
              }}
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
              <span className="text-red-500 text-xs">
                Este campo es requerido
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailContacto">Email de contacto</Label>
            <Input
              id="emailContacto"
              type="email"
              {...register("tenant.emailContacto", { required: true })}
              placeholder="info@cooperativa-esmeraldas.com"
            />
            {errors.tenant?.emailContacto && (
              <span className="text-red-500 text-xs">
                Este campo es requerido
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              {...register("tenant.telefono", { required: true })}
              placeholder="+593987654321"
            />
            {errors.tenant?.telefono && (
              <span className="text-red-500 text-xs">
                Este campo es requerido
              </span>
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
