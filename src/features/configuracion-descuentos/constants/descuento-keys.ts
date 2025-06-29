import type { DescuentoFilter } from "../interfaces/descuento.interface";

const BASE_KEY = "configuracion-descuentos";

export const DESCUENTO_QUERY_KEYS = {
  key: [BASE_KEY],
  all: (filter?: DescuentoFilter) => [BASE_KEY, filter],
  lists: () => [BASE_KEY, "list"],
  list: (filter?: DescuentoFilter) => [BASE_KEY, "list", filter],
  details: () => [BASE_KEY, "detail"],
  detail: (id: number) => [BASE_KEY, "detail", id],
  one: (id: number) => [BASE_KEY, id],
}; 