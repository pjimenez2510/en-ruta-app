"use client";

import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Facebook, Instagram, Twitter, Upload, Youtube } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTenant } from "../hooks/use_tenant";

const generalFormSchema = z.object({
  nombreCooperativa: z.string().min(1, {
    message: "El nombre de la cooperativa es requerido.",
  }),
  direccion: z.string().min(1, {
    message: "La dirección es requerida.",
  }),
  telefono: z.string().min(1, {
    message: "El teléfono es requerido.",
  }),
  email: z.string().email({
    message: "Ingrese un correo electrónico válido.",
  }),
  ruc: z.string().min(1, {
    message: "El RUC es requerido.",
  }),
});

const socialFormSchema = z.object({
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
});

const soporteFormSchema = z.object({
  emailSoporte: z.string().email({
    message: "Ingrese un correo electrónico válido.",
  }),
  telefonoSoporte: z.string().min(1, {
    message: "El teléfono de soporte es requerido.",
  }),
  horarioAtencion: z.string().min(1, {
    message: "El horario de atención es requerido.",
  }),
});

export const ConfiguracionForm = () => {
  // 1. Primero todos los hooks de estado
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [colors, setColors] = useState({
    primario: '#0D9488',
    secundario: '#0284C7'
  });
  const [showColorPicker, setShowColorPicker] = useState({
    primario: false,
    secundario: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Luego los hooks de contexto y personalizados
  const { data: session } = useSession();
  const tenantId = session?.user?.tenantId ?? 0;
  const { data: tenantData, isLoading: isLoadingTenant } = useTenant(tenantId);

  // 3. Inicializar formularios con valores por defecto
  const generalForm = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      nombreCooperativa: '',
      direccion: '',
      telefono: '',
      email: '',
      ruc: ''
    },
  });

  const socialForm = useForm<z.infer<typeof socialFormSchema>>({
    resolver: zodResolver(socialFormSchema),
    defaultValues: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: ''
    },
  });
  
  // Reset social form when tenant data is available
  /*
  useEffect(() => {
    if (tenantData?.data?.redesSociales) {
      socialForm.reset({
        facebook: tenantData.data.redesSociales.facebook || '',
        twitter: tenantData.data.redesSociales.twitter || '',
        instagram: tenantData.data.redesSociales.instagram || '',
        youtube: tenantData.data.redesSociales.youtube || ''
      });
    }
  }, [tenantData]);
*/
  const soporteForm = useForm<z.infer<typeof soporteFormSchema>>({
    resolver: zodResolver(soporteFormSchema),
    defaultValues: {
      emailSoporte: '',
      telefonoSoporte: '',
      horarioAtencion: 'Lunes a Viernes: 8:00 - 17:00, Sábados: 8:00 - 12:00'
    },
  });
  
  // 4. Efectos secundarios para actualizar formularios cuando hay datos
  useEffect(() => {
    if (tenantData?.data) {
      // Actualizar colores
      setColors({
        primario: tenantData.data.colorPrimario || '#0D9488',
        secundario: tenantData.data.colorSecundario || '#0284C7'
      });
      
      // Actualizar logo
      if (tenantData.data.logoUrl) {
        setLogoPreview(tenantData.data.logoUrl);
      }

      // Actualizar formulario general con las propiedades existentes en Tenant
      generalForm.reset({
        nombreCooperativa: tenantData.data.nombre || '',
        telefono: tenantData.data.telefono || '',
        email: tenantData.data.emailContacto || '',
        // No incluir direccion y ruc ya que no existen en el tipo Tenant
        direccion: '',
        ruc: ''
      });

      // Actualizar formulario de soporte
      soporteForm.reset({
        emailSoporte: tenantData.data.emailContacto || '',
        telefonoSoporte: tenantData.data.telefono || '',
        // Usar valor por defecto para horarioAtencion ya que no existe en Tenant
        horarioAtencion: 'Lunes a Viernes: 8:00 - 17:00, Sábados: 8:00 - 12:00'
      });
    }
  }, [tenantData]);
  
  // Manejador para actualizar colores
  const handleColorChange = (type: 'primario' | 'secundario', color: string) => {
    setColors(prev => ({
      ...prev,
      [type]: color
    }));
    
    // Aquí podrías agregar la lógica para guardar el color en el servidor
    console.log(`Color ${type} actualizado a:`, color);
  };

  // Manejador para la carga de imágenes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        // Aquí podrías agregar la lógica para subir la imagen al servidor
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejador para el envío del formulario general
  function onSubmitGeneral(values: z.infer<typeof generalFormSchema>) {
    setIsLoading(true);
    
    // Simulación de envío de datos
    setTimeout(() => {
      console.log('Datos generales actualizados:', values);
      setIsLoading(false);
      toast.success("La información general ha sido actualizada.");
    }, 1000);
  }

  // Mostrar loading mientras se cargan los datos
  if (isLoadingTenant) {
    return <div>Cargando configuración del tenant...</div>;
  }

  function onSubmitSocial(values: z.infer<typeof socialFormSchema>) {
    setIsLoading(true);

    // Simulación de envío de datos
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
      toast.success("Las redes sociales han sido actualizadas.");
    }, 1000);
  }

  function onSubmitSoporte(values: z.infer<typeof soporteFormSchema>) {
    setIsLoading(true);

    // Simulación de envío de datos
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
      toast.success("La información de soporte ha sido actualizada.");
    }, 1000);
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
        <TabsTrigger value="social">Redes Sociales</TabsTrigger>
        <TabsTrigger value="soporte">Soporte</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>
              Actualice la información general de su cooperativa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...generalForm}>
              <form
                onSubmit={generalForm.handleSubmit(onSubmitGeneral)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={generalForm.control}
                    name="nombreCooperativa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la Cooperativa</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="ruc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RUC</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="direccion"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="apariencia">
        <Card>
          <CardHeader>
            <CardTitle>Apariencia</CardTitle>
            <CardDescription>
              Personalice la apariencia de su aplicación.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Logo</h3>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-gray-50 overflow-hidden">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo de la cooperativa"
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="relative">
                  <Button variant="outline" size="sm" type="button" asChild>
                    <label className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Cambiar Logo
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                      />
                    </label>
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Colores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="text-xs text-muted-foreground block mb-1">
                    Color Principal
                  </label>
                  <div className="flex gap-2">
                    <div 
                      className="h-10 w-10 rounded-md border cursor-pointer flex-shrink-0"
                      style={{ backgroundColor: colors.primario }}
                      onClick={() => setShowColorPicker(prev => ({ ...prev, primario: !prev.primario }))}
                    />
                    <div className="flex-1">
                      <Input
                        value={colors.primario}
                        onChange={(e) => handleColorChange('primario', e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                  {showColorPicker.primario && (
                    <div className="absolute z-10 mt-2">
                      <HexColorPicker 
                        color={colors.primario} 
                        onChange={(color) => handleColorChange('primario', color)} 
                      />
                      <div className="mt-2 flex justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowColorPicker(prev => ({ ...prev, primario: false }))}
                        >
                          Cerrar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="text-xs text-muted-foreground block mb-1">
                    Color Secundario
                  </label>
                  <div className="flex gap-2">
                    <div 
                      className="h-10 w-10 rounded-md border cursor-pointer flex-shrink-0"
                      style={{ backgroundColor: colors.secundario }}
                      onClick={() => setShowColorPicker(prev => ({ ...prev, secundario: !prev.secundario }))}
                    />
                    <div className="flex-1">
                      <Input
                        value={colors.secundario}
                        onChange={(e) => handleColorChange('secundario', e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                  {showColorPicker.secundario && (
                    <div className="absolute z-10 mt-2">
                      <HexColorPicker 
                        color={colors.secundario} 
                        onChange={(color) => handleColorChange('secundario', color)} 
                      />
                      <div className="mt-2 flex justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowColorPicker(prev => ({ ...prev, secundario: false }))}
                        >
                          Cerrar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                setColors({
                  primario: tenantData?.data?.colorPrimario || '#0D9488',
                  secundario: tenantData?.data?.colorSecundario || '#0284C7'
                });
                setShowColorPicker({ primario: false, secundario: false });
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={async () => {
                try {
                  // Aquí iría la lógica para guardar los colores en el servidor
                  // Por ejemplo:
                  // await tenantService.updateColors({
                  //   colorPrimario: colors.primario,
                  //   colorSecundario: colors.secundario
                  // });
                  toast.success("Colores actualizados correctamente");
                  setShowColorPicker({ primario: false, secundario: false });
                } catch (error) {
                  console.error("Error al guardar los colores:", error);
                  toast.error("Error al actualizar los colores");
                }
              }}
            >
              Guardar Cambios
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="social">
        <Card>
          <CardHeader>
            <CardTitle>Redes Sociales</CardTitle>
            <CardDescription>
              Configure los enlaces a sus redes sociales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...socialForm}>
              <form
                onSubmit={socialForm.handleSubmit(onSubmitSocial)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={socialForm.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <div className="flex items-center justify-center h-10 w-10 rounded-l-md border border-r-0 bg-gray-50">
                              <Facebook className="h-5 w-5 text-blue-600" />
                            </div>
                            <Input className="rounded-l-none" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={socialForm.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <div className="flex items-center justify-center h-10 w-10 rounded-l-md border border-r-0 bg-gray-50">
                              <Twitter className="h-5 w-5 text-sky-500" />
                            </div>
                            <Input className="rounded-l-none" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={socialForm.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <div className="flex items-center justify-center h-10 w-10 rounded-l-md border border-r-0 bg-gray-50">
                              <Instagram className="h-5 w-5 text-pink-600" />
                            </div>
                            <Input className="rounded-l-none" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={socialForm.control}
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <div className="flex items-center justify-center h-10 w-10 rounded-l-md border border-r-0 bg-gray-50">
                              <Youtube className="h-5 w-5 text-red-600" />
                            </div>
                            <Input className="rounded-l-none" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="soporte">
        <Card>
          <CardHeader>
            <CardTitle>Soporte</CardTitle>
            <CardDescription>
              Configure la información de soporte para sus usuarios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...soporteForm}>
              <form
                onSubmit={soporteForm.handleSubmit(onSubmitSoporte)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={soporteForm.control}
                    name="emailSoporte"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo de Soporte</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={soporteForm.control}
                    name="telefonoSoporte"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono de Soporte</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={soporteForm.control}
                    name="horarioAtencion"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Horario de Atención</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
