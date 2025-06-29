"use client";

import { MetricasGeneralesCard } from "./metricas-generales-card";
import { MetricasFinancierasCard } from "./metricas-financieras-card";
import { ViajesRecientesCard } from "./viajes-recientes-card";
import { BoletosRecientesCard } from "./boletos-recientes-card";
import { OcupacionPorTipoRutaCard } from "./ocupacion-por-tipo-ruta-card";
import { EstadisticasPorDiaCard } from "./estadisticas-por-dia-card";

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Métricas Generales */}
      <section>
        <MetricasGeneralesCard />
      </section>

      {/* Métricas Financieras */}
      <section>
        <MetricasFinancierasCard />
      </section>

      {/* Grid de 2 columnas para el resto de componentes */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Viajes Recientes */}
        <section>
          <ViajesRecientesCard limite={5} />
        </section>

        {/* Boletos Recientes */}
        <section>
          <BoletosRecientesCard limite={5} />
        </section>
      </div>

      {/* Ocupación por Tipo de Ruta */}
      <section>
        <OcupacionPorTipoRutaCard />
      </section>

      {/* Estadísticas por Día */}
      <section>
        <EstadisticasPorDiaCard dias={7} />
      </section>
    </div>
  );
} 