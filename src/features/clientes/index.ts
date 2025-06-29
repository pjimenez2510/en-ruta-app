// features/clientes/index.ts

// Components
export { ClienteDetail } from "./components/cliente-detail";
export { ClienteForm } from "./components/cliente-form";
export { ClientesTable } from "./components/clientes-table";

// Hooks
export { useFindAllClientesQuery, useFindClienteByIdQuery } from "./hooks/use-cliente-queries";
export { useCreateClienteMutation, useUpdateClienteMutation, useDeleteClienteMutation } from "./hooks/use-cliente-mutations";
export { useClienteForm } from "./hooks/use-cliente-form";

// Services
export { ClienteService } from "./services/cliente.service";

// Constants
export { CLIENTE_QUERY_KEYS } from "./constants/cliente-keys";

// Schemas
export { clienteSchema, type ClienteSchema } from "./schemas/cliente.schema";

// Interfaces
export type {
  Cliente,
  ClienteCreate,
  ClienteUpdate,
  ClienteFilter,
} from "./interfaces/cliente.interface"; 