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
    GET_TENANTS: "/tenants",
    POST_TENANT: "/tenants",
    GET_TENANT: "/tenants/:id",
    UPDATE_TENANT: "/tenants/:id",
    DELETE_TENANT: "/tenants/:id",
  },
  CONFIG_TENANT: {
    GET_CONFIG_TENANT:"/configuraciones-tenant",
    POST_CONFIG_TENANT:"/configuraciones-tenant",
    GET_CONFIG_TENANT_BY_ID:"/configuraciones-tenant/:id",
    UPDATE_CONFIG_TENANT:"/configuraciones-tenant/:id",
    DELETE_CONFIG_TENANT:"/configuraciones-tenant/:id",
  },
};
