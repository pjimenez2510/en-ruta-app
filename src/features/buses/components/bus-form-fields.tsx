import { Control } from "react-hook-form";
import { BusFormValues } from "../interfaces/form-schema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBusModels } from "../hooks/use-bus-models";
import { useTipoRutaBus } from "../hooks/use-tipo-ruta-bus";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FormFieldsProps {
  control: Control<BusFormValues>;
  onImageChange?: (file: File | null) => void;
  initialImageUrl?: string;
  isEdit?: boolean;
}

export const FormFields = ({ control, onImageChange, initialImageUrl, isEdit }: FormFieldsProps) => {
    const { busModels, loading } = useBusModels();
    const { tiposRuta, loading: loadingTiposRuta } = useTipoRutaBus();
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            onImageChange?.(file);
            onChange(url);
        }
    };

    const handleRemoveImage = (onChange: (value: string) => void) => {
        setPreviewUrl(null);
        onImageChange?.(null);
        onChange("");
    };

    return (
        <div className="space-y-6">
            {/* Sección de imagen */}
            <div className="space-y-2">
                <FormField
                    control={control}
                    name="fotoUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Foto del Bus <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-[200px] transition-colors hover:bg-primary/10 focus:ring-2 focus:ring-primary"
                                            onClick={() => document.getElementById('bus-image')?.click()}
                                        >
                                            <ImageIcon className="w-4 h-4 mr-2" />
                                            Seleccionar Imagen
                                        </Button>
                                        <Input
                                            id="bus-image"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageChange(e, field.onChange)}
                                        />
                                    </div>
                                    {previewUrl ? (
                                        <div className="relative w-[200px] h-[150px] border rounded-lg shadow-md overflow-hidden bg-white">
                                            <Image
                                                src={previewUrl}
                                                alt="Vista previa"
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute -top-2 -right-2 h-6 w-6 shadow-lg"
                                                            onClick={() => handleRemoveImage(field.onChange)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Eliminar imagen</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    ) : (
                                        <div className="w-[200px] h-[150px] flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground bg-white">
                                            <span className="w-full text-center">No hay imagen seleccionada</span>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <Separator className="my-6" />
            {/* Título de sección */}
            <h3 className="text-lg font-semibold mb-2">Datos del Bus</h3>
            {/* Campos principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!isEdit && (
                    <FormField
                        control={control}
                        name="modeloBusId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Modelo de Bus <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Select 
                                        onValueChange={(value) => field.onChange(parseInt(value))} 
                                        value={field.value ? field.value.toString() : undefined}
                                        disabled={loading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione el modelo del bus" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {busModels.length > 0 ? (
                                                busModels.map((model) => (
                                                    <SelectItem key={model.id} value={model.id.toString()}>
                                                        {model.marca} - {model.modelo} ({model.numeroPisos} piso(s))
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="0">
                                                    No hay modelos disponibles
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={control}
                    name="tipoRutaBusId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Tipo de Ruta <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Select 
                                    onValueChange={(value) => field.onChange(parseInt(value))} 
                                    value={field.value ? field.value.toString() : undefined}
                                    disabled={loadingTiposRuta}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione el tipo de ruta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tiposRuta.length > 0 ? (
                                            tiposRuta.map((tipo) => (
                                                <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                                    {tipo.nombre}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="0" disabled>
                                                No existen tipos de ruta
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="numero"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Número <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input 
                                    type="number" 
                                    placeholder="Número de Bus" 
                                    value={field.value || ''}
                                    onChange={event => {
                                        const value = event.target.value ? parseInt(event.target.value) : undefined;
                                        field.onChange(value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="placa"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Placa <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="Ejemplo: ABC-1234" 
                                    {...field} 
                                    value={field.value?.toUpperCase()}
                                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                />
                            </FormControl>
                            <p className="text-xs text-muted-foreground mt-1">Formato: ABC-1234</p>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="anioFabricacion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Año de Fabricación <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Ejemplo: 2024"
                                    value={field.value || ''}
                                    onChange={event => {
                                        const value = event.target.value ? parseInt(event.target.value) : undefined;
                                        field.onChange(value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="tipoCombustible"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Tipo de Combustible <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione el tipo de combustible" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Diésel">Diésel</SelectItem>
                                        <SelectItem value="Gasolina">Gasolina</SelectItem>
                                        <SelectItem value="GNV">Gas Natural Vehicular</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}; 