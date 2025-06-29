// features/tipos-ruta-bus/index.ts

// Components
export { TipoRutaBusDetail } from "./components/tipo-ruta-bus-detail";
export { TipoRutaBusForm } from "./components/tipo-ruta-bus-form";
export { TiposRutaBusTable } from "./components/tipos-ruta-bus-table";

// Hooks
export { useFindAllTiposRutaBusQuery, useFindTipoRutaBusByIdQuery } from "./hooks/use-tipo-ruta-bus-queries";
export { useCreateTipoRutaBusMutation, useUpdateTipoRutaBusMutation, useDeleteTipoRutaBusMutation } from "./hooks/use-tipo-ruta-bus-mutations";
export { useTipoRutaBusForm } from "./hooks/use-tipo-ruta-bus-form";

// Types
export type {
  TipoRutaBus,
  TipoRutaBusCreate,
  TipoRutaBusUpdate,
  TipoRutaBusFilter,
} from "./interfaces/tipo-ruta-bus.interface";

// Schemas
export { tipoRutaBusSchema, tipoRutaBusFilterSchema } from "./schemas/tipo-ruta-bus.schema";
export type { TipoRutaBusSchema, TipoRutaBusFilterSchema } from "./schemas/tipo-ruta-bus.schema"; 