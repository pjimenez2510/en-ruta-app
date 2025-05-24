"use client";
import React, { useState } from "react";
import { useLogin } from "../../hooks/use-login";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { APP_ASSETS } from "@/core/constants/app-assets";
import { Label } from "@/shared/components/ui/label";

const LoginView = () => {
  const { login, isLoading, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src={APP_ASSETS.IMAGES.LOGO}
              alt="EnRuta Logo"
              width={200}
              height={100}
              priority
            />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Inicia Sesión
          </h2>
          <p className="text-sm text-muted-foreground">
            o Crea una Cuenta para explorar nuestra App
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {" "}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>
            </div>
            {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
            <div className="text-center text-sm mt-4">
              <Link href="/register" className="text-blue-600 hover:underline">
                ¿No tienes cuenta? Regístrate
              </Link>
            </div>
            <div className="text-center text-sm mt-2">
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:underline"
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
