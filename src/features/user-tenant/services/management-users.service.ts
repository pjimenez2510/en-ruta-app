import { createAuthApi } from "@/core/infrastructure/auth-axios";
import { API_ROUTES } from "@/core/constants/api-routes";
import type {
  UserTenant,
  UserTenantResponse,
  CreateUserTenantDto,
  UpdateUserTenantDto,
  SRIResponse,
  BaseInfoPersonal,
  ConductorInfoPersonal,
} from "@/features/user-tenant/interfaces/management-users.interface";

const SRI_API_URL =
  "https://srienlinea.sri.gob.ec/movil-servicios/api/v1.0/deudas/porIdentificacion";

// Función auxiliar para reemplazar parámetros en la URL
const buildUrl = (
  path: string,
  params: Record<string, string | number> = {}
): string => {
  let url = path;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });
  return url;
};

export const managementUsersService = {
  // Obtener todos los usuarios
  getAllUsers: async (): Promise<UserTenant[]> => {
    try {
      const api = await createAuthApi();
      const { data } = await api.get<UserTenantResponse>(
        API_ROUTES.USER_TENANT.GET_ALL
      );
      return data.data;
    } catch (error) {
      console.error("Error en managementUsersService.getAllUsers:", error);
      throw error;
    }
  },

  // Crear un nuevo usuario
  createUser: async (userData: CreateUserTenantDto): Promise<UserTenant> => {
    try {
      const api = await createAuthApi();

      // Limpiar los datos antes de enviarlos
      const cleanedData = {
        ...userData,
        infoPersonal:
          userData.rol === "CONDUCTOR"
            ? userData.infoPersonal
            : {
                nombres: userData.infoPersonal.nombres,
                apellidos: userData.infoPersonal.apellidos,
                tipoDocumento: userData.infoPersonal.tipoDocumento,
                numeroDocumento: userData.infoPersonal.numeroDocumento,
                telefono: userData.infoPersonal.telefono || "",
                email: userData.infoPersonal.email || "",
                fechaNacimiento: userData.infoPersonal.fechaNacimiento || "",
                direccion: userData.infoPersonal.direccion || "",
                ciudadResidencia: userData.infoPersonal.ciudadResidencia || "",
                genero: userData.infoPersonal.genero || "M",
                fotoPerfil: userData.infoPersonal.fotoPerfil || "",
                fechaContratacion:
                  userData.infoPersonal.fechaContratacion || "",
              },
      };

      const { data } = await api.post<UserTenantResponse>(
        API_ROUTES.USER_TENANT.POST,
        cleanedData
      );
      return data.data[0];
    } catch (error: unknown) {
      console.error("Error en managementUsersService.createUser:", error);
      // Re-throw the error to be handled by the hook
      throw error;
    }
  },

  // Obtener un usuario por ID
  getUserById: async (id: number): Promise<UserTenant> => {
    try {
      const api = await createAuthApi();
      const url = buildUrl(API_ROUTES.USER_TENANT.GET_BY_ID, { id });
      const { data } = await api.get<UserTenantResponse>(url);
      return data.data[0];
    } catch (error) {
      console.error("Error en managementUsersService.getUserById:", error);
      throw error;
    }
  },

  // Actualizar un usuario
  updateUser: async (
    id: number,
    userData: UpdateUserTenantDto
  ): Promise<UserTenant> => {
    try {
      const api = await createAuthApi();

      // Limpiar los datos antes de enviarlos
      const cleanedData = {
        ...userData,
        usuario: {
          username: userData.usuario.username,
          ...(userData.usuario.password && {
            password: userData.usuario.password,
          }),
        },
        infoPersonal:
          userData.rol === "CONDUCTOR"
            ? userData.infoPersonal
            : {
                nombres: userData.infoPersonal.nombres,
                apellidos: userData.infoPersonal.apellidos,
                tipoDocumento: userData.infoPersonal.tipoDocumento,
                numeroDocumento: userData.infoPersonal.numeroDocumento,
                telefono: userData.infoPersonal.telefono || "",
                email: userData.infoPersonal.email || "",
                fechaNacimiento: userData.infoPersonal.fechaNacimiento || "",
                direccion: userData.infoPersonal.direccion || "",
                ciudadResidencia: userData.infoPersonal.ciudadResidencia || "",
                genero: userData.infoPersonal.genero || "M",
                fotoPerfil: userData.infoPersonal.fotoPerfil || "",
                fechaContratacion:
                  userData.infoPersonal.fechaContratacion || "",
              },
      };

      const url = buildUrl(API_ROUTES.USER_TENANT.UPDATE, { id });
      const { data } = await api.put<UserTenantResponse>(url, cleanedData);
      return data.data[0];
    } catch (error: unknown) {
      console.error("Error en managementUsersService.updateUser:", error);
      // Re-throw the error to be handled by the hook
      throw error;
    }
  },

  // Eliminar un usuario
  deleteUser: async (id: number): Promise<void> => {
    try {
      const api = await createAuthApi();
      const url = buildUrl(API_ROUTES.USER_TENANT.DELETE, { id });
      await api.delete(url);
    } catch (error: unknown) {
      console.error("Error en managementUsersService.deleteUser:", error);
      // Re-throw the error to be handled by the hook
      throw error;
    }
  },

  // Asignar información personal a un usuario
  assignPersonalInfo: async (
    id: number,
    personalInfo: BaseInfoPersonal | ConductorInfoPersonal
  ): Promise<UserTenant> => {
    try {
      const api = await createAuthApi();
      const url = buildUrl(API_ROUTES.USER_TENANT.POST_PERSONAL_INFO, { id });
      const { data } = await api.post(url, personalInfo);
      return data.data[0];
    } catch (error) {
      console.error(
        "Error en managementUsersService.assignPersonalInfo:",
        error
      );
      throw error;
    }
  },

  // Obtener información del SRI
  fetchSRIData: async (cedula: string): Promise<string> => {
    try {
      const response = await fetch(`${SRI_API_URL}/${cedula}`);
      const data: SRIResponse = await response.json();

      if (!data.contribuyente?.nombreComercial) {
        throw new Error("No se encontró información para esta cédula");
      }

      return data.contribuyente.nombreComercial;
    } catch (error) {
      throw new Error("Error al buscar la información: " + error);
    }
  },
};
