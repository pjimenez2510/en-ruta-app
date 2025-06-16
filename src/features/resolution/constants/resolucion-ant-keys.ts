// features/resoluciones-ant/constants/resolucion-ant-keys.ts
import type { ResolucionAntFilter } from "../interfaces/resolucion-ant.interface";

const BASE_KEY = "resoluciones-ant";

export const RESOLUCION_ANT_QUERY_KEYS = {
  all: (filter?: ResolucionAntFilter) => [BASE_KEY, filter],
  lists: () => [BASE_KEY, "list"],
  list: (filter?: ResolucionAntFilter) => [BASE_KEY, "list", filter],
  details: () => [BASE_KEY, "detail"],
  detail: (id: number) => [BASE_KEY, "detail", id],
  one: (id: number) => [BASE_KEY, id],
};