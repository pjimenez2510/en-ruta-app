// features/rutas/index.ts

// Components
export { RutaForm } from "./components/ruta-form";
export { RutasTable } from "./components/rutas-tables";
export { RutaDetail } from "./components/ruta-detail";

// Hooks
export { useFindAllRutasQuery, useFindRutaByIdQuery } from "./hooks/use-ruta-queries";
export { useCreateRutaMutation, useUpdateRutaMutation, useDeleteRutaMutation } from "./hooks/use-ruta-mutations";
export { useRutaForm } from "./hooks/use-ruta-form";

// Interfaces
export type {
  Ruta,
  RutaCreate,
  RutaUpdate,
  RutaFilter,
  RutaResponse,
  RutasResponse,
  Tenant,
  Resolucion,
} from "./interfaces/ruta.interface";

// Schemas
export { rutaSchema, rutaFilterSchema } from "./schemas/ruta.schema";
export type { RutaSchema, RutaFilterSchema } from "./schemas/ruta.schema";

// Services
export { RutaService } from "./services/ruta.service";

// Constants
export { RUTA_QUERY_KEYS } from "./constants/ruta-keys";