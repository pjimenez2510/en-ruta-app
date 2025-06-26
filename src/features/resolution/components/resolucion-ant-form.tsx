"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useResolucionAntForm } from "../hooks/use-resolucion-ant-form";
import type { ResolucionAnt } from "../interfaces/resolucion-ant.interface";
import RequiredLabel from "@/shared/components/RequiredLabel";
import type { ResolucionAntSchema } from "../schemas/resolucion-ant.schema";

interface ResolucionAntFormProps {
  resolucion?: ResolucionAnt;
}

export function ResolucionAntForm({ resolucion }: ResolucionAntFormProps) {
  const { form, onSubmit, isSubmitting, isEditing } = useResolucionAntForm(resolucion);

  // Helper para mostrar asterisco si el campo está vacío o tiene error
  const showAsterisk = (name: keyof ResolucionAntSchema) => {
    const field = form.getFieldState(name, form.formState);
    const value = form.watch(name);
    return !value || !!field.error;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="numeroResolucion"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel htmlFor="numeroResolucion" required showAsterisk={showAsterisk("numeroResolucion" as keyof ResolucionAntSchema)}>Número de Resolución</RequiredLabel>
                <FormControl>
                  <Input 
                    placeholder="ANT-2025-001" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Formato: ANT-YYYY-XXX (ej: ANT-2025-001)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="documentoUrl"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel htmlFor="documentoUrl" required showAsterisk={showAsterisk("documentoUrl" as keyof ResolucionAntSchema)}>URL del Documento</RequiredLabel>
                <FormControl>
                  <Input 
                    type="url"
                    placeholder="https://www.ant.gob.ec/..."
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fechaEmision"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <RequiredLabel htmlFor="fechaEmision" required showAsterisk={showAsterisk("fechaEmision" as keyof ResolucionAntSchema)}>Fecha de Emisión</RequiredLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                      }}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Fecha en la que se emitió la resolución
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fechaVigencia"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <RequiredLabel htmlFor="fechaVigencia" required showAsterisk={showAsterisk("fechaVigencia" as keyof ResolucionAntSchema)}>Fecha de Vigencia</RequiredLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Fecha hasta la cual la resolución es válida
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel htmlFor="descripcion" required showAsterisk={showAsterisk("descripcion" as keyof ResolucionAntSchema)}>Descripción</RequiredLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción de la resolución ANT..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Descripción detallada de la resolución (máximo 500 caracteres)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Resolución Activa
                </FormLabel>
                <FormDescription>
                  Marque esta opción si la resolución está actualmente vigente
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Actualizar Resolución" : "Crear Resolución"}
          </Button>
        </div>
      </form>
    </Form>
  );
}