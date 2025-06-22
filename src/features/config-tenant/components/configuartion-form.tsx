"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTenant } from "../hooks/use_tenant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { GeneralForm, AppearanceForm, SocialForm, SupportForm } from "./forms";
import {
  GeneralFormValues,
  SocialFormValues,
  SupportFormValues,
  Colors,
} from "@/features/config-tenant/schemas/tenant.schemas";
import { Tenant } from "../interfaces/tenant.interface";
import { tenantService } from "../services/tenant.service";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useTenantColors } from "@/core/context/tenant-context";
import { configTenantService } from "../services/config-tenant.service";

interface ConfigData {
  direccion: string;
  ruc: string;
  emailSoporte: string;
  telefonoSoporte: string;
  horarioAtencion: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  direccionId?: number;
  rucId?: number;
  emailSoporteId?: number;
  telefonoSoporteId?: number;
  horarioAtencionId?: number;
  facebookId?: number;
  twitterId?: number;
  instagramId?: number;
  youtubeId?: number;
}

export const ConfiguracionForm = () => {
  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [colors, setColors] = useState<Colors>({
    primario: "#0D9488",
    secundario: "#0284C7",
  });

  // Hooks de contexto y personalizados
  const { data: session, status } = useSession();
  const tenantId =
    status === "authenticated" ? session?.user?.tenantId : undefined;
  const { data: tenantData, isLoading: isLoadingTenant } = useTenant(tenantId, {
    enabled: status === "authenticated",
  });
  const queryClient = useQueryClient();
  const { setColors: setTenantColors } = useTenantColors();

  // Query para obtener todas las configuraciones
  const { data: configData, isLoading: isLoadingConfig } = useQuery<ConfigData>(
    {
      queryKey: ["config-tenant", tenantId],
      queryFn: async () => {
        if (!tenantId) throw new Error("Tenant ID is required");
        const configs = await configTenantService.getAllConfigTenants(tenantId);

        // Extraer valores de las configuraciones
        const getConfigValue = (clave: string) =>
          configs.find((config) => config.clave === clave)?.valor || "";

        const getConfigId = (clave: string) =>
          configs.find((config) => config.clave === clave)?.id;

        return {
          // Valores
          direccion: getConfigValue("DIRECCION"),
          ruc: getConfigValue("RUC"),
          emailSoporte: getConfigValue("EMAIL_SOPORTE"),
          telefonoSoporte: getConfigValue("TELEFONO_SOPORTE"),
          horarioAtencion: getConfigValue("HORARIO_ATENCION"),
          facebook: getConfigValue("FACEBOOK"),
          twitter: getConfigValue("TWITTER"),
          instagram: getConfigValue("INSTAGRAM"),
          youtube: getConfigValue("YOUTUBE"),
          // IDs
          direccionId: getConfigId("DIRECCION"),
          rucId: getConfigId("RUC"),
          emailSoporteId: getConfigId("EMAIL_SOPORTE"),
          telefonoSoporteId: getConfigId("TELEFONO_SOPORTE"),
          horarioAtencionId: getConfigId("HORARIO_ATENCION"),
          facebookId: getConfigId("FACEBOOK"),
          twitterId: getConfigId("TWITTER"),
          instagramId: getConfigId("INSTAGRAM"),
          youtubeId: getConfigId("YOUTUBE"),
        };
      },
      enabled: !!tenantId,
      staleTime: 0, // Forzar a que siempre se recarguen los datos
      gcTime: 0, // No cachear los datos
    }
  );

  // Efectos para cargar datos iniciales
  useEffect(() => {
    if (tenantData?.data) {
      // Actualizar colores
      setColors({
        primario: tenantData.data.colorPrimario || "#0D9488",
        secundario: tenantData.data.colorSecundario || "#0284C7",
      });

      // Actualizar logo
      if (tenantData.data.logoUrl) {
        setLogoPreview(tenantData.data.logoUrl);
      }
    }
  }, [tenantData]);

  // Manejadores de eventos
  const handleGeneralSubmit = async (values: GeneralFormValues) => {
    setIsLoading(true);
    try {
      // Actualizar datos generales del tenant
      const updateData: Partial<Tenant> = {};
      if (values.nombreCooperativa) {
        updateData.nombre = values.nombreCooperativa;
      }
      if (values.telefono) {
        updateData.telefono = values.telefono;
      }
      if (values.email) {
        updateData.emailContacto = values.email;
      }
      if (values.sitioWeb) {
        updateData.sitioWeb = values.sitioWeb;
      }

      await tenantService.updateTenant(tenantData?.data?.id || 0, updateData);

      // Manejar la configuración de dirección y RUC
      const configUpdates = [
        {
          clave: "DIRECCION",
          valor: values.direccion,
          id: configData?.direccionId,
          descripcion: "Dirección de la cooperativa",
        },
        {
          clave: "RUC",
          valor: values.ruc,
          id: configData?.rucId,
          descripcion: "RUC de la cooperativa",
        },
      ];

      for (const config of configUpdates) {
        if (config.valor) {
          if (config.id) {
            await configTenantService.updateConfigTenant(config.id, {
              valor: config.valor,
              tipo: "TEXTO",
              descripcion: config.descripcion,
            });
          } else {
            await configTenantService.createConfigTenant({
              clave: config.clave,
              valor: config.valor,
              tipo: "TEXTO",
              descripcion: config.descripcion,
            });
          }
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["tenant", tenantId] });
      await queryClient.invalidateQueries({
        queryKey: ["config-tenant", tenantId],
      });

      toast.success("La información general ha sido actualizada.");
    } catch (error) {
      console.error("Error al guardar los datos generales:", error);
      toast.error("Ocurrió un error al guardar los cambios");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppearanceSave = async (newColors: Colors, logoUrl?: string) => {
    setIsLoading(true);
    try {
      const updateData: Partial<Tenant> = {};

      if (newColors.primario !== colors.primario) {
        updateData.colorPrimario = newColors.primario;
      }
      if (newColors.secundario !== colors.secundario) {
        updateData.colorSecundario = newColors.secundario;
      }
      if (logoUrl) {
        updateData.logoUrl = logoUrl;
      }

      if (Object.keys(updateData).length > 0) {
        await tenantService.updateTenant(tenantData?.data?.id || 0, updateData);
        await queryClient.invalidateQueries({ queryKey: ["tenant", tenantId] });

        // Actualizamos el estado local
        setColors(newColors);
        if (logoUrl) {
          setLogoPreview(logoUrl);
        }

        // Actualizamos los colores en el contexto
        setTenantColors({
          primary: newColors.primario,
          secondary: newColors.secundario,
        });

        toast.success("La apariencia ha sido actualizada.");
      }
    } catch (error) {
      console.error("Error al guardar la apariencia:", error);
      toast.error("Ocurrió un error al guardar los cambios");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppearanceReset = () => {
    if (tenantData?.data) {
      setColors({
        primario: tenantData.data.colorPrimario || "#ffffff",
        secundario: tenantData.data.colorSecundario || "#ffffff",
      });
      setLogoPreview(tenantData.data.logoUrl || null);
    }
  };

  const handleSocialSubmit = async (values: SocialFormValues) => {
    setIsLoading(true);
    try {
      const configUpdates = [
        {
          clave: "FACEBOOK",
          valor: values.facebook,
          id: configData?.facebookId,
          descripcion: "Facebook de la cooperativa",
        },
        {
          clave: "TWITTER",
          valor: values.twitter,
          id: configData?.twitterId,
          descripcion: "Twitter de la cooperativa",
        },
        {
          clave: "INSTAGRAM",
          valor: values.instagram,
          id: configData?.instagramId,
          descripcion: "Instagram de la cooperativa",
        },
        {
          clave: "YOUTUBE",
          valor: values.youtube,
          id: configData?.youtubeId,
          descripcion: "YouTube de la cooperativa",
        },
      ];

      for (const config of configUpdates) {
        if (config.valor) {
          if (config.id) {
            await configTenantService.updateConfigTenant(config.id, {
              valor: config.valor,
              tipo: "TEXTO",
              descripcion: config.descripcion,
            });
          } else {
            await configTenantService.createConfigTenant({
              clave: config.clave,
              valor: config.valor,
              tipo: "TEXTO",
              descripcion: config.descripcion,
            });
          }
        }
      }

      await queryClient.invalidateQueries({
        queryKey: ["config-tenant", tenantId],
      });
      toast.success("Las redes sociales han sido actualizadas.");
    } catch (error) {
      console.error("Error al guardar las redes sociales:", error);
      toast.error("Ocurrió un error al guardar los cambios");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupportSubmit = async (values: SupportFormValues) => {
    setIsLoading(true);
    try {
      const configUpdates = [
        {
          clave: "EMAIL_SOPORTE",
          valor: values.emailSoporte,
          id: configData?.emailSoporteId,
          descripcion: "Email de soporte",
        },
        {
          clave: "TELEFONO_SOPORTE",
          valor: values.telefonoSoporte,
          id: configData?.telefonoSoporteId,
          descripcion: "Teléfono de soporte",
        },
        {
          clave: "HORARIO_ATENCION",
          valor: values.horarioAtencion,
          id: configData?.horarioAtencionId,
          descripcion: "Horario de atención",
        },
      ];

      for (const config of configUpdates) {
        if (config.valor) {
          if (config.id) {
            await configTenantService.updateConfigTenant(config.id, {
              valor: config.valor,
              tipo: "TEXTO",
              descripcion: config.descripcion,
            });
          } else {
            await configTenantService.createConfigTenant({
              clave: config.clave,
              valor: config.valor,
              tipo: "TEXTO",
              descripcion: config.descripcion,
            });
          }
        }
      }

      await queryClient.invalidateQueries({
        queryKey: ["config-tenant", tenantId],
      });
      toast.success("La información de soporte ha sido actualizada.");
    } catch (error) {
      console.error("Error al guardar la información de soporte:", error);
      toast.error("Ocurrió un error al guardar los cambios");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras se cargan los datos
  if (isLoadingTenant) {
    return (
      <div className="flex items-center justify-center p-8">
        Cargando configuración del tenant...
      </div>
    );
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
        <TabsTrigger value="social">Redes Sociales</TabsTrigger>
        <TabsTrigger value="soporte">Soporte</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        {isLoadingTenant || isLoadingConfig ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <GeneralForm
            initialData={{
              nombreCooperativa: tenantData?.data?.nombre || "",
              telefono: tenantData?.data?.telefono || "",
              email: tenantData?.data?.emailContacto || "",
              direccion: configData?.direccion || "",
              ruc: configData?.ruc || "",
              sitioWeb: tenantData?.data?.sitioWeb || "",
            }}
            onSubmit={handleGeneralSubmit}
            isLoading={isLoading}
          />
        )}
      </TabsContent>

      <TabsContent value="apariencia">
        <AppearanceForm
          initialColors={colors}
          initialLogoUrl={logoPreview}
          onSave={handleAppearanceSave}
          onReset={handleAppearanceReset}
        />
      </TabsContent>

      <TabsContent value="social">
        <SocialForm
          initialData={{
            facebook: configData?.facebook || "",
            twitter: configData?.twitter || "",
            instagram: configData?.instagram || "",
            youtube: configData?.youtube || "",
          }}
          onSubmit={handleSocialSubmit}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="soporte">
        <SupportForm
          initialData={{
            emailSoporte: configData?.emailSoporte || "",
            telefonoSoporte: configData?.telefonoSoporte || "",
            horarioAtencion: configData?.horarioAtencion || "",
          }}
          onSubmit={handleSupportSubmit}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
};
