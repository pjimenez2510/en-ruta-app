import { Control } from "react-hook-form";
import { SeatTypeFormValues } from "../interfaces/form-schema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormFieldsProps {
  control: Control<SeatTypeFormValues>;
}

export const FormFields = ({ control }: FormFieldsProps) => (
    <>
        <FormField
            control={control}
            name="nombre"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nombre</FormLabel>
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
                <FormLabel>Descripción</FormLabel>
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
                <FormLabel>Factor de Precio</FormLabel>
                <FormControl>
                    <Input
                    type="number"
                    step="0.1"
                    {...field}
                    onChange={event => {
                        const value = parseFloat(event.target.value);
                        field.onChange(isNaN(value) ? 0 : value);
                    }}
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
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                    <Input
                        type="color"
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={control}
                name="icono"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Icono</FormLabel>
                    <FormControl>
                    <Input
                        type="text"
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
    </>
);