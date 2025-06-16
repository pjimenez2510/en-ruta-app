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
  },  USER: {
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
  RUTAS: {
    GET_ALL: "/rutas",
    CREATE: "/rutas",
    GET_BY_ID: "/rutas/:id",
    UPDATE: "/rutas/:id",
    DELETE: "/rutas/:id",
    GET_BY_TENANT: "/rutas/tenant/:tenantId",
  },  HORARIOS: {
    GET_ALL: "/horariosRuta",
    CREATE: "/horariosRuta",
    GET_BY_ID: "/horariosRuta/:id",
    UPDATE: "/horariosRuta/:id",
    DELETE: "/horariosRuta/:id",
    GET_BY_RUTA: "/horariosRuta/ruta/:rutaId",
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
};
