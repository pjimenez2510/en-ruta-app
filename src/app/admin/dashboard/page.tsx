"use client";
import { useAuthStore } from "@/features/auth/presentation/context/auth.store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const userRole = useAuthStore((state) => state.userRole);

  useEffect(() => {
    if (userRole !== "ADMIN_SISTEMA") {
      router.push("/unauthorized");
    }
  }, [userRole, router]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Panel de Administración del Sistema
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Aquí irán las tarjetas o widgets del dashboard de administración */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Gestión de Usuarios</h2>
          <p className="text-gray-600">Administrar usuarios del sistema</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">
            Gestión de Cooperativas
          </h2>
          <p className="text-gray-600">Administrar cooperativas registradas</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">
            Configuración del Sistema
          </h2>
          <p className="text-gray-600">Configurar parámetros del sistema</p>
        </div>
      </div>
    </div>
  );
}
