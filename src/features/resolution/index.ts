// features/resoluciones-ant/index.ts

// Components
export { ResolucionAntForm } from "./components/resolucion-ant-form";
export { ResolucionesAntTable } from "./components/resoluciones-ant-table";
export { ResolucionAntDetail } from "./components/resolucion-ant-detail";

// Hooks
export { useFindAllResolucionesAntQuery, useFindResolucionAntByIdQuery } from "./hooks/use-resolucion-ant-queries";
export { useCreateResolucionAntMutation, useUpdateResolucionAntMutation, useDeleteResolucionAntMutation } from "./hooks/use-resolucion-ant-mutations";
export { useResolucionAntForm } from "./hooks/use-resolucion-ant-form";

// Interfaces
export type {
  ResolucionAnt,
  ResolucionAntCreate,
  ResolucionAntUpdate,
  ResolucionAntFilter,
  ResolucionAntResponse,
  ResolucionesAntResponse,
} from "./interfaces/resolucion-ant.interface";

// Schemas
export { resolucionAntSchema, resolucionAntFilterSchema } from "./schemas/resolucion-ant.schema";
export type { ResolucionAntSchema, ResolucionAntFilterSchema } from "./schemas/resolucion-ant.schema";

// Services
export { ResolucionAntService } from "./services/resolucion-ant.service";

// Constants
export { RESOLUCION_ANT_QUERY_KEYS } from "./constants/resolucion-ant-keys";