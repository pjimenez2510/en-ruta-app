"use client";
import { useAuthStore } from "@/features/auth/presentation/context/auth.store";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">¡Bienvenido!</h1>
          <p className="mt-2 text-gray-600">Has iniciado sesión correctamente</p>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="mt-4"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
