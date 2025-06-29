import { Control } from "react-hook-form";
import { SeatTypeFormValues } from "../interfaces/form-schema";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AVAILABLE_ICONS, IconName } from "../constants/available-icons";
import React from "react";
import RequiredLabel from "@/shared/components/RequiredLabel";
import { useFormContext } from "react-hook-form";

interface FormFieldsProps {
  control: Control<SeatTypeFormValues>;
}

export const FormFields = ({ control }: FormFieldsProps) => {
  const { formState, getFieldState, watch } = useFormContext<SeatTypeFormValues>();

  // Helper para saber si mostrar asterisco: si el campo está vacío o tiene error
  const showAsterisk = (name: keyof SeatTypeFormValues) => {
    const field = getFieldState(name, formState);
    const value = watch(name);
    // Mostrar asterisco si el campo está vacío o tiene error
    return !value || !!field.error;
  };

  return (
    <>
      <FormField
        control={control}
        name="nombre"
        render={({ field }) => (
          <FormItem>
            <RequiredLabel htmlFor="nombre" required showAsterisk={showAsterisk("nombre")}>Nombre</RequiredLabel>
            <FormControl>
              <Input placeholder="Nombre del tipo de asiento" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="descripcion"
        render={({ field }) => (
          <FormItem>
            <RequiredLabel htmlFor="descripcion" required showAsterisk={showAsterisk("descripcion")}>Descripción</RequiredLabel>
            <FormControl>
              <Textarea placeholder="Descripción del tipo de asiento" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="factorPrecio"
        render={({ field }) => (
          <FormItem>
            <RequiredLabel htmlFor="factorPrecio" required showAsterisk={showAsterisk("factorPrecio")}>Factor de Precio</RequiredLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                {...field}
                onChange={(event) => {
                  const value = parseFloat(event.target.value);
                  field.onChange(isNaN(value) ? 0.01 : value);
                }}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel htmlFor="color" required showAsterisk={showAsterisk("color")}>Color</RequiredLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="icono"
          render={({ field }) => {
            const selectedIcon = field.value ? AVAILABLE_ICONS[field.value as IconName] : null;
            return (
              <FormItem>
                <RequiredLabel htmlFor="icono" required showAsterisk={showAsterisk("icono")}>Icono</RequiredLabel>
                <FormControl>
                  <Select
                    onValueChange={(value: IconName) => field.onChange(value)}
                    value={field.value}
                    defaultValue="Armchair"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un icono">
                        {selectedIcon && (
                          <div className="flex items-center gap-2">
                            {React.createElement(selectedIcon, { className: "h-4 w-4" })}
                            <span>{field.value}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(AVAILABLE_ICONS).map(([name, Icon]) => (
                        <SelectItem key={name} value={name}>
                          <div className="flex items-center gap-2">
                            {React.createElement(Icon, { className: "h-4 w-4" })}
                            <span>{name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    </>
  );
};