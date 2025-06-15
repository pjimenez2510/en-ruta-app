"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerCooperativa } from "../../services/auth.service";
import { useLogin } from "../../hooks/use-login";
import type { RegisterCooperativaInput } from "../../interfaces/auth.interface";

export default function RegisterCooperativaForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCooperativaInput>();

  const { login, isLoading: isLoginLoading } = useLogin();

  const onSubmit = async (data: RegisterCooperativaInput) => {
    await registerCooperativa(data);
    // Auto login después de registrar
    await login({ username: data.username, password: data.password });
  };

  return (
    <Card className="w-full max-w-lg mx-auto mt-8">
      <CardHeader>
        <h2 className="text-2xl font-semibold">Registro de Cooperativa</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
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
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                Este campo es requerido
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="nombre">Nombre de la cooperativa</Label>
            <Input
              id="nombre"
              {...register("tenant.nombre", { required: true })}
              placeholder="Cooperativa Esmeraldas2"
            />
            {errors.tenant?.nombre && (
              <span className="text-red-500 text-xs">
                Este campo es requerido
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="identificador">Identificador único</Label>
            <Input
              id="identificador"
              {...register("tenant.identificador", { required: true })}
              placeholder="esmeraldas-coop1"
            />
            {errors.tenant?.identificador && (
              <span className="text-red-500 text-xs">
                Este campo es requerido
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="logoUrl">Logo (URL)</Label>
            <Input
              id="logoUrl"
              {...register("tenant.logoUrl", { required: true })}
              placeholder="https://example.com/logo.png"
            />
            {errors.tenant?.logoUrl && (
              <span className="text-red-500 text-xs">
                Este campo es requerido
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="colorPrimario">Color primario</Label>
            <Input
              id="colorPrimario"
              type="color"
              {...register("tenant.colorPrimario", { required: true })}
            />
            {errors.tenant?.colorPrimario && (
              <span className="text-red-500 text-xs">
                Este campo es requerido
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="colorSecundario">Color secundario</Label>
            <Input
              id="colorSecundario"
              type="color"
              {...register("tenant.colorSecundario", { required: true })}
            />
            {errors.tenant?.colorSecundario && (
              <span className="text-red-500 text-xs">
                Este campo es requerido
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="sitioWeb">Sitio web</Label>
            <Input
              id="sitioWeb"
              {...register("tenant.sitioWeb", { required: true })}
              placeholder="https://www.cooperativa-esmeraldas.com"
            />
            {errors.tenant?.sitioWeb && (
              <span className="text-red-500 text-xs">
                Este campo es requerido
              </span>
            )}
          </div>
          <div>
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
          <div>
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
            className="w-full mt-4"
            disabled={isSubmitting || isLoginLoading}
          >
            {isSubmitting || isLoginLoading
              ? "Registrando..."
              : "Registrar cooperativa"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
