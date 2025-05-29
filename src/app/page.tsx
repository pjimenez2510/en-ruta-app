"use client";
import { useAuthStore } from "@/features/auth/presentation/context/auth.store";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const logout = useAuthStore((state) => state.logout);
  const userRole = useAuthStore((state) => state.userRole);
  const router = useRouter();

  // Redirigir a dashboard cooperativa si corresponde
  useEffect(() => {

    if (userRole === undefined) {
      router.replace("/main/dashboard");
    }
  }, [userRole, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (userRole === undefined) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">¡Bienvenido!</h1>
          <p className="mt-2 text-gray-600">
            Has iniciado sesión correctamente
          </p>
          <p className="mt-2 text-blue-600 font-mono">
            userRole: {String(userRole)}
          </p>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleLogout} variant="destructive" className="mt-4">
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
