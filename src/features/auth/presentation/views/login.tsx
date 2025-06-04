"use client";
import React, { useState, useEffect } from "react";
import { useLogin } from "../../hooks/use-login";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { APP_ASSETS } from "@/core/constants/app-assets";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginView = () => {
  const { login, isLoading, error } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "PERSONAL_COOPERATIVA") {
        router.push("/main/dashboard");
      } else if (session.user.role === "ADMIN_SISTEMA") {
        router.push("/main/admin");
      } else {
        router.push("/");
      }
    }
  }, [session, status, router]);

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
                onClick={() => router.push("/register")}
              >
                Registrarse
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username-example"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className={error ? "border-red-500" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="**********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className={error ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            {error && (
              <div className="text-sm text-red-500 mt-2 text-center p-2 bg-red-50 rounded">
                <p className="font-medium">Error de autenticación:</p>
                <p>{error}</p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-12"
              variant="default"
              disabled={isLoading}
            >
              {isLoading ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
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
