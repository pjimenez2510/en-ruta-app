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
};
