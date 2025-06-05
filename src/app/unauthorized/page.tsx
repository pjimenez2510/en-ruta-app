"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Acceso No Autorizado
        </h1>
        <p className="text-gray-600 mb-6">
          Lo sentimos, no tienes permiso para acceder a esta página. Por favor,
          contacta al administrador si crees que esto es un error.
        </p>
        <div className="space-y-4">
          <Button
            onClick={() => router.push("/login")}
            className="w-full"
            variant="default"
          >
            Volver al inicio de sesión
          </Button>
          <Button
            onClick={() => router.back()}
            className="w-full"
            variant="outline"
          >
            Volver atrás
          </Button>
        </div>
      </div>
    </div>
  );
}
