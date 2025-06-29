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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useDescuentoForm } from "../hooks/use-descuento-form";
import type { Descuento } from "../interfaces/descuento.interface";

interface DescuentoFormProps {
  descuento?: Descuento;
}

export function DescuentoForm({ descuento }: DescuentoFormProps) {
  const { form, onSubmit, isSubmitting, isEditing } = useDescuentoForm(descuento);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Descuento</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de descuento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MENOR_EDAD">
                    <span className="flex items-center">
                      <span className="mr-2">👶</span>
                      Menor de Edad
                    </span>
                  </SelectItem>
                  <SelectItem value="TERCERA_EDAD">
                    <span className="flex items-center">
                      <span className="mr-2">👴</span>
                      Tercera Edad
                    </span>
                  </SelectItem>
                  <SelectItem value="DISCAPACIDAD">
                    <span className="flex items-center">
                      <span className="mr-2">♿</span>
                      Discapacidad
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Seleccione el tipo de descuento que desea configurar
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="porcentaje"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Porcentaje de Descuento</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: 15.5"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Ingrese el porcentaje de descuento (ej: 15.5 para 15.5%)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requiereValidacion"
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
                  Requiere Validación Manual
                </FormLabel>
                <FormDescription>
                  Marque esta opción si el descuento requiere validación por parte del personal autorizado
                </FormDescription>
              </div>
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
                  Descuento Activo
                </FormLabel>
                <FormDescription>
                  Marque esta opción si el descuento está disponible para ser aplicado
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
            {isEditing ? "Actualizar Descuento" : "Crear Descuento"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 