"use client";
import React, { useState, useEffect } from "react";
import { useLogin } from "../../hooks/use-login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { APP_ASSETS } from "@/core/constants/app-assets";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFieldValidation } from "@/shared/hooks/use-field-validation";
import { ValidatedInput, ValidatedPasswordInput } from "@/shared/components";

const LoginView = () => {
  const { login, isLoading, error } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  // Configurar validación de campos requeridos
  const requiredFields = ["username", "password"];
  const { validateField, getFieldState, canEnableActionButton } = useFieldValidation(requiredFields);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "PERSONAL_COOPERATIVA") {
        router.push("/main/dashboard");
      } else if (session.user.role === "ADMIN_SISTEMA") {
        router.push("/main/admin/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [session, status, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Validar campos cuando cambian
  useEffect(() => {
    validateField("username", username);
  }, [username, validateField]);

  useEffect(() => {
    validateField("password", password);
  }, [password, validateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      return;
    }
    console.log("Iniciando proceso de login...");
    await login({ username, password });
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  const usernameState = getFieldState("username");
  const passwordState = getFieldState("password");
  const canSubmit = canEnableActionButton();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4 mt-20">
            <Image
              src={APP_ASSETS.IMAGES.LOGO}
              alt="EnRuta Logo"
              width={200}
              height={100}
              priority
            />
          </div>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mt-20 h-12">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-10"
              >
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-10"
                onClick={() => router.push("/register-cooperativa")}
              >
                Registrarse
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <ValidatedInput
                id="username"
                label="Nombre de usuario"
                type="text"
                placeholder="username-example"
                value={username}
                onChange={setUsername}
                required={true}
                showAsterisk={usernameState.showAsterisk}
                disabled={isLoading}
                error={!!error}
              />
              <ValidatedPasswordInput
                id="password"
                label="Contraseña"
                placeholder="**********"
                value={password}
                onChange={setPassword}
                required={true}
                showAsterisk={passwordState.showAsterisk}
                disabled={isLoading}
                error={!!error}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12"
              variant="default"
              disabled={isLoading || !canSubmit}
            >
              {isLoading ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
            
            {!canSubmit && (
              <p className="text-sm text-red-500 text-center">
                Completa todos los campos requeridos para continuar
              </p>
            )}
            
            <div className="text-center text-sm mt-8">
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginView;
