export const AR_KEYS = {
  AUTH: "auth",
};

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/registro/cliente",
    REGISTER_COOPERATIVA: "/auth/registro/cooperativa",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  ER: {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/profile",
    CHANGE_PASSWORD: "/user/change-password",
  },
  TENANTS: {
    GET_ALL: "/tenants",
    POST: "/tenants",
    GET_BY_ID: "/tenants/:id",
    UPDATE: "/tenants/:id",
    DELETE: "/tenants/:id",
  },
  CONFIG_TENANT: {
    GET_ALL: "/configuraciones-tenant",
    POST: "/configuraciones-tenant",
    GET_BY_ID: "/configuraciones-tenant/:id",
    UPDATE: "/configuraciones-tenant/:id",
    DELETE: "/configuraciones-tenant/:id",
  },
  RESOLUCIONES_ANT: {
    GET_ALL: "/resoluciones-ant",
    POST: "/resoluciones-ant",
    GET_BY_ID: "/resoluciones-ant/:id",
    UPDATE: "/resoluciones-ant/:id",
    DELETE: "/resoluciones-ant/:id",
  },
  RUTAS: {
    GET_ALL: "/rutas",
    CREATE: "/rutas",
    GET_BY_ID: "/rutas/:id",
    UPDATE: "/rutas/:id",
    DELETE: "/rutas/:id",
    GET_BY_TENANT: "/rutas/tenant/:tenantId",
  },
  HORARIOS: {
    GET_ALL: "/horarios-ruta",
    CREATE: "/horarios-ruta",
    GET_BY_ID: "/horarios-ruta/:id",
    UPDATE: "/horarios-ruta/:id",
    DELETE: "/horarios-ruta/:id",
    GET_BY_RUTA: "/horarios-ruta?rutaId=:rutaId",
  },
  PARADAS: {
    GET_ALL: "/paradas-ruta",
    CREATE: "/paradas-ruta",
    GET_BY_ID: "/paradas-ruta/:id",
    UPDATE: "/paradas-ruta/:id",
    DELETE: "/paradas-ruta/:id",
    GET_BY_RUTA: "/paradas-ruta/ruta/:rutaId",
  },
  CIUDADES: {
    GET_ALL: "/ciudades",
    GET_BY_ID: "/ciudades/:id",
    GET_BY_NOMBRE: "/ciudades/nombre/:nombre",
    GET_BY_PROVINCIA: "/ciudades/provincia/:provincia",
  },
  USER_TENANT: {
    GET_ALL: "/usuario-tenant",
    POST: "/usuario-tenant",
    GET_BY_ID: "/usuario-tenant/:id",
    UPDATE: "/usuario-tenant/:id",
    DELETE: "/usuario-tenant/:id",
    POST_PERSONAL_INFO: "/usuario-tenant/:id/asignar-info-personal",
  },
  VIAJES: {
    GET_ALL: "/viajes",
    GET_BY_ID: "/viajes/:id",
    PUBLICO: "/viajes/publico",
  },
  CLIENTES: {
    GET_ALL: "/clientes",
    GET_BY_ID: "/clientes/:id",
    POST: "/clientes",
    UPDATE: "/clientes/:id",
    DELETE: "/clientes/:id",
  },
  BUSES: {
    DISPONIBILIDAD: "/buses/:id/disponibilidad",
  },
};
