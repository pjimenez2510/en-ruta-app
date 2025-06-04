"use client";
import { useAuthStore } from "@/features/auth/presentation/context/auth.store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClienteDashboard() {
  const router = useRouter();
  const userRole = useAuthStore((state) => state.userRole);

  useEffect(() => {
    if (userRole !== "CLIENTE") {
      router.push("/unauthorized");
    }
  }, [userRole, router]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Panel de Cliente</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Aquí irán las tarjetas o widgets del dashboard de cliente */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Mis Reservas</h2>
          <p className="text-gray-600">
            Ver y gestionar mis reservas de viajes
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Historial de Viajes</h2>
          <p className="text-gray-600">Consultar mi historial de viajes</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Mi Perfil</h2>
          <p className="text-gray-600">Gestionar mi información personal</p>
        </div>
      </div>
    </div>
  );
}
