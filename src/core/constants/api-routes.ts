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
  USER: {
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
    GET_BY_RUTA: "/horarios-ruta/ruta/:rutaId",
  },
  PARADAS: {
    GET_ALL: "/paradas",
    CREATE: "/paradas",
    GET_BY_ID: "/paradas/:id",
    UPDATE: "/paradas/:id",
    DELETE: "/paradas/:id",
    GET_BY_RUTA: "/paradas/ruta/:rutaId",
  },
};
