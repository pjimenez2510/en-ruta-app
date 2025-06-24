// features/rutas/constants/ruta-keys.ts
import type { RutaFilter } from "../interfaces/ruta.interface";

const BASE_KEY = "rutas";

export const RUTA_QUERY_KEYS = {
  key: [BASE_KEY],
  all: (filter?: RutaFilter) => [BASE_KEY, filter],
  lists: () => [BASE_KEY, "list"],
  list: (filter?: RutaFilter) => [BASE_KEY, "list", filter],
  details: () => [BASE_KEY, "detail"],
  detail: (id: number) => [BASE_KEY, "detail", id],
  one: (id: number) => [BASE_KEY, id],
};