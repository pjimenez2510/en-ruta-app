import { z } from "zod";

export const dashboardFiltersSchema = z.object({
  limite: z.number().min(1).max(100).optional(),
  dias: z.number().min(1).max(30).optional(),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
});

export type DashboardFiltersSchema = z.infer<typeof dashboardFiltersSchema>;

// Esquemas para validación de respuestas (opcional, para validación de datos)
export const metricasGeneralesSchema = z.object({
  buses: z.object({
    total: z.number(),
    activos: z.number(),
    mantenimiento: z.number(),
    porcentajeActivos: z.number(),
  }),
  rutas: z.object({
    total: z.number(),
    activas: z.number(),
    porcentajeActivas: z.number(),
  }),
  viajes: z.object({
    total: z.number(),
    programados: z.number(),
    enRuta: z.number(),
    completados: z.number(),
    cancelados: z.number(),
    porcentajeCompletados: z.number(),
  }),
  boletos: z.object({
    total: z.number(),
    confirmados: z.number(),
    abordados: z.number(),
    pendientes: z.number(),
    porcentajeConfirmados: z.number(),
  }),
  ventas: z.object({
    total: z.number(),
    aprobadas: z.number(),
    pendientes: z.number(),
    porcentajeAprobadas: z.number(),
  }),
  personal: z.object({
    conductores: z.object({
      total: z.number(),
      activos: z.number(),
      porcentajeActivos: z.number(),
    }),
    ayudantes: z.object({
      total: z.number(),
      activos: z.number(),
      porcentajeActivos: z.number(),
    }),
  }),
});

export const metricasFinancierasSchema = z.object({
  totalIngresos: z.number(),
  totalDescuentos: z.number(),
  promedioVenta: z.number(),
  totalVentas: z.number(),
  ventasAprobadas: z.number(),
  ventasPorDia: z.array(z.object({
    fecha: z.string(),
    ingresos: z.number(),
    ventas: z.number(),
  })),
});

export const viajeRecienteSchema = z.object({
  id: z.number(),
  fecha: z.string(),
  estado: z.string(),
  capacidadTotal: z.number(),
  asientosOcupados: z.number(),
  horarioRuta: z.object({
    horaSalida: z.string(),
    ruta: z.object({
      nombre: z.string(),
      tipoRutaBus: z.object({
        nombre: z.string(),
      }),
    }),
  }),
  bus: z.object({
    numero: z.number(),
    placa: z.string(),
  }),
  conductor: z.string().nullable(),
});

export const boletoRecienteSchema = z.object({
  id: z.number(),
  codigoAcceso: z.string(),
  estado: z.string(),
  precioFinal: z.string(),
  fechaViaje: z.string(),
  cliente: z.object({
    nombres: z.string(),
    apellidos: z.string(),
  }),
  viaje: z.object({
    horarioRuta: z.object({
      ruta: z.object({
        nombre: z.string(),
      }),
    }),
  }),
});

export const ocupacionPorTipoRutaSchema = z.object({
  nombre: z.string(),
  capacidadTotal: z.number(),
  asientosOcupados: z.number(),
  viajes: z.number(),
  porcentajeOcupacion: z.number(),
});

export const estadisticaPorDiaSchema = z.object({
  fecha: z.string(),
  viajes: z.number(),
  viajesCompletados: z.number(),
  boletos: z.number(),
  ingresos: z.number(),
  ocupacionPromedio: z.number(),
}); 