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
import { Loader2 } from "lucide-react";
import { useTipoRutaBusForm } from "../hooks/use-tipo-ruta-bus-form";
import type { TipoRutaBus } from "../interfaces/tipo-ruta-bus.interface";

interface TipoRutaBusFormProps {
  tipoRutaBus?: TipoRutaBus;
}

export function TipoRutaBusForm({ tipoRutaBus }: TipoRutaBusFormProps) {
  const { form, onSubmit, isSubmitting, isEditing } = useTipoRutaBusForm(tipoRutaBus);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Tipo de Ruta</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Interprovincial, Urbano, Rural"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Ingrese el nombre descriptivo del tipo de ruta
              </FormDescription>
              <FormMessage />
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
            {isEditing ? "Actualizar Tipo de Ruta" : "Crear Tipo de Ruta"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 