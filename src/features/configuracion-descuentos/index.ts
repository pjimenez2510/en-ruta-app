// features/configuracion-descuentos/index.ts

// Components
export { DescuentoDetail } from "./components/descuento-detail";
export { DescuentoForm } from "./components/descuento-form";
export { DescuentosTable } from "./components/descuentos-table";

// Hooks
export { useFindAllDescuentosQuery, useFindDescuentoByIdQuery, useFindDescuentoByTipoQuery } from "./hooks/use-descuento-queries";
export { useCreateDescuentoMutation, useUpdateDescuentoMutation, useDeleteDescuentoMutation, useActivarDescuentoMutation, useDesactivarDescuentoMutation } from "./hooks/use-descuento-mutations";
export { useDescuentoForm } from "./hooks/use-descuento-form";

// Services
export { DescuentoService } from "./services/descuento.service";

// Constants
export { DESCUENTO_QUERY_KEYS } from "./constants/descuento-keys";

// Schemas
export { descuentoSchema, type DescuentoSchema } from "./schemas/descuento.schema";

// Interfaces
export type {
  Descuento,
  DescuentoCreate,
  DescuentoUpdate,
  DescuentoFilter,
} from "./interfaces/descuento.interface"; 