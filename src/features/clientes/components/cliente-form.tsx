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
import { useClienteForm } from "../hooks/use-cliente-form";
import type { Cliente } from "../interfaces/cliente.interface";

interface ClienteFormProps {
  cliente?: Cliente;
}

export function ClienteForm({ cliente }: ClienteFormProps) {
  const { form, onSubmit, isSubmitting, isEditing } = useClienteForm(cliente);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="nombres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Juan Carlos"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Ingrese los nombres del cliente
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apellidos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Pérez González"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Ingrese los apellidos del cliente
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: 0990862306"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Ingrese el número de teléfono (10 dígitos)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Ej: cliente@email.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Ingrese el correo electrónico
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="tipoDocumento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Documento</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de documento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CEDULA">Cédula</SelectItem>
                    <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                    <SelectItem value="NIT">NIT</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Seleccione el tipo de documento de identidad
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numeroDocumento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Documento</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: 2101031025"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Ingrese el número de documento de identidad
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="fechaNacimiento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Nacimiento</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Seleccione la fecha de nacimiento
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="esDiscapacitado"
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
                  Cliente con Discapacidad
                </FormLabel>
                <FormDescription>
                  Marque esta opción si el cliente tiene alguna discapacidad
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {form.watch("esDiscapacitado") && (
          <FormField
            control={form.control}
            name="porcentajeDiscapacidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porcentaje de Discapacidad</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Ej: 50"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>
                  Ingrese el porcentaje de discapacidad (0-100)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
            {isEditing ? "Actualizar Cliente" : "Crear Cliente"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 