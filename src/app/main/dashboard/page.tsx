"use client";

import { 
  MetricasGeneralesCard,
  MetricasFinancierasConFiltros,
  ViajesRecientesCard,
  BoletosRecientesCard,
  OcupacionPorTipoRutaCard,
  EstadisticasPorDiaCard
} from "@/features/dashboard";

export default function DashboardEjemploPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
      </div>

      {/* Métricas Generales */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Métricas Generales</h2>
        <MetricasGeneralesCard />
      </section>

      {/* Métricas Financieras con Filtros */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Métricas Financieras con Filtros de Fecha</h2>
        <MetricasFinancierasConFiltros />
      </section>

      {/* Grid de 2 columnas */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Viajes Recientes */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Viajes Recientes (Límite: 3)</h2>
          <ViajesRecientesCard limite={3} />
        </section>

        {/* Boletos Recientes */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Boletos Recientes (Límite: 5)</h2>
          <BoletosRecientesCard limite={5} />
        </section>
      </div>

      {/* Ocupación por Tipo de Ruta */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Ocupación por Tipo de Ruta</h2>
        <OcupacionPorTipoRutaCard />
      </section>

      {/* Estadísticas por Día */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Estadísticas por Día (Últimos 7 días)</h2>
        <EstadisticasPorDiaCard dias={7} />
      </section>
    </div>
  );
} 