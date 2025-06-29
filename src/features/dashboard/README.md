# Dashboard Feature

Este módulo proporciona una implementación completa del dashboard para la aplicación de transporte, siguiendo el mismo patrón arquitectónico que otros módulos como `rutas`.

## Estructura

```
src/features/dashboard/
├── components/           # Componentes de UI
├── constants/           # Constantes y claves de consulta
├── hooks/              # Hooks de React Query
├── interfaces/         # Interfaces TypeScript
├── schemas/            # Esquemas de validación
├── services/           # Servicios de API
└── index.ts           # Archivo de exportaciones
```

## APIs Soportadas

El dashboard consume las siguientes APIs:

- `/dashboard/metricas-generales` - Métricas generales del sistema
- `/dashboard/metricas-financieras` - Métricas financieras
- `/dashboard/viajes-recientes` - Viajes recientes (con límite opcional)
- `/dashboard/boletos-recientes` - Boletos recientes (con límite opcional)
- `/dashboard/ocupacion-por-tipo-ruta` - Ocupación por tipo de ruta
- `/dashboard/estadisticas-por-dia` - Estadísticas por día (con días opcional)
- `/dashboard/resumen-completo` - Resumen completo de todas las métricas

## Uso Básico

### Usar el Dashboard Completo

```tsx
import { DashboardOverview } from "@/features/dashboard";

export function MiPagina() {
  return <DashboardOverview />;
}
```

### Usar Componentes Individuales

```tsx
import { 
  MetricasGeneralesCard,
  MetricasFinancierasCard,
  ViajesRecientesCard,
  BoletosRecientesCard,
  OcupacionPorTipoRutaCard,
  EstadisticasPorDiaCard
} from "@/features/dashboard";

export function MiDashboard() {
  return (
    <div className="space-y-8">
      <MetricasGeneralesCard />
      <MetricasFinancierasCard />
      
      <div className="grid gap-8 lg:grid-cols-2">
        <ViajesRecientesCard limite={5} />
        <BoletosRecientesCard limite={10} />
      </div>
      
      <OcupacionPorTipoRutaCard />
      <EstadisticasPorDiaCard dias={7} />
    </div>
  );
}
```

### Usar Hooks Directamente

```tsx
import { 
  useMetricasGeneralesQuery,
  useViajesRecientesQuery 
} from "@/features/dashboard";

export function MiComponente() {
  const { data: metricas, isLoading } = useMetricasGeneralesQuery();
  const { data: viajes } = useViajesRecientesQuery({ limite: 3 });

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Total de Buses: {metricas?.buses.total}</h2>
      <h3>Viajes Recientes: {viajes?.length}</h3>
    </div>
  );
}
```

## Componentes Disponibles

### MetricasGeneralesCard
Muestra métricas generales del sistema:
- Buses (total, activos, en mantenimiento)
- Rutas (total, activas)
- Viajes (total, programados, en ruta, completados)
- Boletos (total, confirmados, pendientes, abordados)
- Ventas (total, aprobadas, pendientes)
- Personal (conductores y ayudantes)

### MetricasFinancierasCard
Muestra métricas financieras:
- Ingresos totales
- Promedio por venta
- Total de ventas
- Descuentos
- Ventas por día

### ViajesRecientesCard
Muestra los viajes más recientes con:
- Información del bus
- Ruta y horario
- Estado del viaje
- Ocupación
- Fecha

**Props:**
- `limite?: number` - Número máximo de viajes a mostrar (default: 5)

### BoletosRecientesCard
Muestra los boletos más recientes con:
- Información del cliente
- Ruta del viaje
- Estado del boleto
- Precio
- Código de acceso

**Props:**
- `limite?: number` - Número máximo de boletos a mostrar (default: 10)

### OcupacionPorTipoRutaCard
Muestra la ocupación por tipo de ruta:
- Nombre del tipo de ruta
- Capacidad total vs ocupada
- Número de viajes
- Porcentaje de ocupación

### EstadisticasPorDiaCard
Muestra estadísticas diarias:
- Viajes programados y completados
- Boletos vendidos
- Ingresos
- Ocupación promedio

**Props:**
- `dias?: number` - Número de días a mostrar (default: 7)

## Hooks Disponibles

- `useMetricasGeneralesQuery()` - Obtiene métricas generales
- `useMetricasFinancierasQuery()` - Obtiene métricas financieras
- `useViajesRecientesQuery(filters?)` - Obtiene viajes recientes
- `useBoletosRecientesQuery(filters?)` - Obtiene boletos recientes
- `useOcupacionPorTipoRutaQuery()` - Obtiene ocupación por tipo de ruta
- `useEstadisticasPorDiaQuery(filters?)` - Obtiene estadísticas por día
- `useResumenCompletoQuery()` - Obtiene resumen completo

## Filtros Disponibles

```typescript
interface DashboardFilters {
  limite?: number;      // Para viajes y boletos recientes
  dias?: number;        // Para estadísticas por día
  fechaInicio?: string; // Para métricas financieras (formato: YYYY-MM-DD)
  fechaFin?: string;    // Para métricas financieras (formato: YYYY-MM-DD)
}
```

### Ejemplo de Uso con Filtros de Fecha

```tsx
import { MetricasFinancierasCard } from "@/features/dashboard";

export function MiComponente() {
  const filters = {
    fechaInicio: "2025-02-20",
    fechaFin: "2025-12-20"
  };

  return <MetricasFinancierasCard filters={filters} />;
}
```

### Componente con Filtros Interactivos

```tsx
import { MetricasFinancierasConFiltros } from "@/features/dashboard";

export function MiPagina() {
  return <MetricasFinancierasConFiltros />;
}
```

## Estados de Carga

Todos los componentes manejan automáticamente:
- Estado de carga (loading)
- Estado de error
- Estado vacío (sin datos)

## Personalización

Los componentes usan Tailwind CSS y pueden ser personalizados fácilmente. También puedes crear tus propios componentes usando los hooks directamente.

## Ejemplo de Página

Ver `src/app/main/dashboard/ejemplo/page.tsx` para un ejemplo completo de cómo usar todos los componentes. 