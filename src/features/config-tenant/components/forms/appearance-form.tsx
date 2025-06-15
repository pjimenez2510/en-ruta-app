import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ColorPicker } from "../ui/color-picker";
import { LogoUploader } from "../ui/logo-uploader";
import { Colors, ColorPickerState } from "@/features/config-tenant/schemas/tenant.schemas";

interface AppearanceFormProps {
  initialColors?: Colors;
  initialLogoUrl?: string | null;
  onSave: (colors: Colors, logoFile?: File) => Promise<void>;
  onReset: () => void;
}

export const AppearanceForm = ({
  initialColors = { primario: '#0D9488', secundario: '#0284C7' },
  initialLogoUrl = null,
  onSave,
  onReset,
}: AppearanceFormProps) => {
  const [colors, setColors] = useState<Colors>(initialColors);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialLogoUrl);
  const [showColorPicker, setShowColorPicker] = useState<ColorPickerState>({
    primario: false,
    secundario: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleColorChange = (type: 'primario' | 'secundario', color: string) => {
    setColors(prev => ({
      ...prev,
      [type]: color
    }));
  };

  const toggleColorPicker = (type: 'primario' | 'secundario') => {
    setShowColorPicker(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setLogoFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await onSave(colors, logoFile || undefined);
      toast.success("Apariencia actualizada correctamente");
    } catch (error) {
      console.error("Error al guardar la apariencia:", error);
      toast.error("Error al actualizar la apariencia");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setColors(initialColors);
    setLogoPreview(initialLogoUrl);
    setLogoFile(null);
    onReset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apariencia</CardTitle>
        <CardDescription>
          Personalice la apariencia de su aplicación.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <LogoUploader 
          logoPreview={logoPreview} 
          onImageChange={handleImageChange} 
        />
        
        <div>
          <h3 className="text-sm font-medium mb-2">Colores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorPicker
              type="primario"
              colors={colors}
              showColorPicker={showColorPicker}
              onColorChange={handleColorChange}
              onTogglePicker={toggleColorPicker}
              label="Color Principal"
            />
            
            <ColorPicker
              type="secundario"
              colors={colors}
              showColorPicker={showColorPicker}
              onColorChange={handleColorChange}
              onTogglePicker={toggleColorPicker}
              label="Color Secundario"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button 
          variant="outline"
          onClick={handleReset}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppearanceForm;
