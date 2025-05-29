"use client";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-1  flex-col items-center justify-center bg-gray-50 ">
      {/* El sidebar ya está en el layout, así que solo el contenido aquí */}
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
        <div className=" max-w-md rounded-lg bg-white p-8 shadow-lg ml-auto mr-0">
          <h1 className="text-3xl font-bold mb-4">Panel Cooperativa</h1>
          <p className="text-gray-600">
            Bienvenido al panel de administración de la cooperativa. Aquí podrás
            gestionar usuarios, frecuencias y la configuración de tu
            cooperativa.
          </p>
        </div>
      </main>
    </div>
  );
}
