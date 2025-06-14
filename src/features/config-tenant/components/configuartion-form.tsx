"use client";

import { useState } from "react";
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

export function ConfiguracionForm() {
  const [isLoading, setIsLoading] = useState(false);

  const generalForm = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      nombreCooperativa: "Cooperativa Amazonas",
      direccion: "Av. Principal 123, Ambato",
      telefono: "(03) 2123-456",
      email: "info@cooperativaamazonas.com",
      ruc: "1234567890001",
    },
  });

  const socialForm = useForm<z.infer<typeof socialFormSchema>>({
    resolver: zodResolver(socialFormSchema),
    defaultValues: {
      facebook: "https://facebook.com/cooperativaamazonas",
      twitter: "https://twitter.com/coopAmazonas",
      instagram: "https://instagram.com/cooperativaamazonas",
      youtube: "",
    },
  });

  const soporteForm = useForm<z.infer<typeof soporteFormSchema>>({
    resolver: zodResolver(soporteFormSchema),
    defaultValues: {
      emailSoporte: "soporte@cooperativaamazonas.com",
      telefonoSoporte: "(03) 2123-457",
      horarioAtencion: "Lunes a Viernes: 8:00 - 17:00, Sábados: 8:00 - 12:00",
    },
  });

  function onSubmitGeneral(values: z.infer<typeof generalFormSchema>) {
    setIsLoading(true);

    // Simulación de envío de datos
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
      toast.success("La información general ha sido actualizada.");
    }, 1000);
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
                <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-gray-50">
                  <img
                    src="/placeholder.svg?height=80&width=80"
                    alt="Logo"
                    className="max-h-16 max-w-16"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Cambiar Logo
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Colores</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">
                    Color Principal
                  </label>
                  <div className="flex mt-1">
                    <div className="h-10 w-10 rounded-l-md bg-teal-600"></div>
                    <Input
                      value="#0D9488"
                      className="rounded-l-none w-24"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Color Secundario
                  </label>
                  <div className="flex mt-1">
                    <div className="h-10 w-10 rounded-l-md bg-sky-600"></div>
                    <Input
                      value="#0284C7"
                      className="rounded-l-none w-24"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto">Guardar Cambios</Button>
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
