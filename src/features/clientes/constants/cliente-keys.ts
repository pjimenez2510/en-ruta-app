import type { ClienteFilter } from "../interfaces/cliente.interface";

const BASE_KEY = "clientes";

export const CLIENTE_QUERY_KEYS = {
  key: [BASE_KEY],
  all: (filter?: ClienteFilter) => [BASE_KEY, filter],
  lists: () => [BASE_KEY, "list"],
  list: (filter?: ClienteFilter) => [BASE_KEY, "list", filter],
  details: () => [BASE_KEY, "detail"],
  detail: (id: number) => [BASE_KEY, "detail", id],
  one: (id: number) => [BASE_KEY, id],
}; 