import type { TipoRutaBusFilter } from "../interfaces/tipo-ruta-bus.interface";

const BASE_KEY = "tipos-ruta-bus";

export const TIPO_RUTA_BUS_QUERY_KEYS = {
  key: [BASE_KEY],
  all: (filter?: TipoRutaBusFilter) => [BASE_KEY, filter],
  lists: () => [BASE_KEY, "list"],
  list: (filter?: TipoRutaBusFilter) => [BASE_KEY, "list", filter],
  details: () => [BASE_KEY, "detail"],
  detail: (id: number) => [BASE_KEY, "detail", id],
  one: (id: number) => [BASE_KEY, id],
}; 