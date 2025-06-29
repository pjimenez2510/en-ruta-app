// features/rutas/components/ruta-form.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useRutaForm } from "../hooks/use-ruta-form";
import { useFindAllResolucionesAntQuery } from "@/features/resolution";
import { useFindAllTiposRutaBusQuery } from "@/features/tipos-ruta-bus";
import type { Ruta } from "../interfaces/ruta.interface";

interface RutaFormProps {
  ruta?: Ruta;
}

export function RutaForm({ ruta }: RutaFormProps) {
  const { form, onSubmit, isSubmitting, isEditing } = useRutaForm(ruta);
  const { data: resoluciones = [], isLoading: isLoadingResoluciones } = useFindAllResolucionesAntQuery();
  const { data: tiposRutaBus = [], isLoading: isLoadingTiposRutaBus } = useFindAllTiposRutaBusQuery();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Ruta</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Pelileo - Ambato - Quito"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Ingrese el nombre descriptivo de la ruta
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resolucionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resolución ANT</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar resolución" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingResoluciones ? (
                    <SelectItem value="loading" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cargando resoluciones...
                    </SelectItem>
                  ) : resoluciones.length === 0 ? (
                    <SelectItem value="no-data" disabled>
                      No hay resoluciones disponibles
                    </SelectItem>
                  ) : (
                    resoluciones.map((resolucion) => (
                      <SelectItem
                        key={resolucion.id}
                        value={resolucion.id.toString()}
                      >
                        {resolucion.numeroResolucion} - {resolucion.descripcion}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Seleccione la resolución ANT que ampara esta ruta
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipoRutaBusId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Ruta Bus</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de ruta bus" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingTiposRutaBus ? (
                    <SelectItem value="loading" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cargando tipos de ruta bus...
                    </SelectItem>
                  ) : tiposRutaBus.length === 0 ? (
                    <SelectItem value="no-data" disabled>
                      No hay tipos de ruta bus disponibles
                    </SelectItem>
                  ) : (
                    tiposRutaBus.map((tipo) => (
                      <SelectItem
                        key={tipo.id}
                        value={tipo.id.toString()}
                      >
                        {tipo.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Seleccione el tipo de ruta bus
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción detallada de la ruta..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Proporcione una descripción detallada de la ruta (máximo 500 caracteres)
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
                  Ruta Activa
                </FormLabel>
                <FormDescription>
                  Marque esta opción si la ruta está actualmente en operación
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
            {isEditing ? "Actualizar Ruta" : "Crear Ruta"}
          </Button>
        </div>
      </form>
    </Form>
  );
}