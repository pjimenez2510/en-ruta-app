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
import { useQueryClient } from "@tanstack/react-query";
import { useTenantColors } from "@/core/context/tenant-context";

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

      await tenantService.updateTenant(tenantData?.data?.id || 0, updateData);

      // Invalidamos la caché para forzar una nueva carga de datos
      await queryClient.invalidateQueries({ queryKey: ["tenant", tenantId] });

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
      // Aquí iría la lógica para guardar en el servidor
      console.log("Redes sociales actualizadas:", values);
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
      // Aquí iría la lógica para guardar en el servidor
      console.log("Datos de soporte actualizados:", values);
      toast.success("La información de soporte ha sido actualizada.");
    } catch (error) {
      console.error("Error al guardar los datos de soporte:", error);
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
        <GeneralForm
          initialData={{
            nombreCooperativa: tenantData?.data?.nombre || "",
            telefono: tenantData?.data?.telefono || "",
            email: tenantData?.data?.emailContacto || "",
            direccion: "",
            ruc: "",
          }}
          onSubmit={handleGeneralSubmit}
          isLoading={isLoading}
        />
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
          initialData={{}}
          onSubmit={handleSocialSubmit}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="soporte">
        <SupportForm
          initialData={{
            emailSoporte: tenantData?.data?.emailContacto || "",
            telefonoSoporte: tenantData?.data?.telefono || "",
            horarioAtencion:
              "Lunes a Viernes: 8:00 - 17:00, Sábados: 8:00 - 12:00",
          }}
          onSubmit={handleSupportSubmit}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
};
