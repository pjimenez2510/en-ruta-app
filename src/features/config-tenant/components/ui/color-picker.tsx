import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Colors, ColorPickerState } from "@/features/config-tenant/schemas/tenant.schemas";

interface ColorPickerProps {
  type: 'primario' | 'secundario';
  colors: Colors;
  showColorPicker: ColorPickerState;
  onColorChange: (type: 'primario' | 'secundario', color: string) => void;
  onTogglePicker: (type: 'primario' | 'secundario') => void;
  label: string;
}

export const ColorPicker = ({
  type,
  colors,
  showColorPicker,
  onColorChange,
  onTogglePicker,
  label
}: ColorPickerProps) => {
  return (
    <div className="relative">
      <label className="text-xs text-muted-foreground block mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <div 
          className="h-10 w-10 rounded-md border cursor-pointer flex-shrink-0"
          style={{ backgroundColor: colors[type] }}
          onClick={() => onTogglePicker(type)}
        />
        <div className="flex-1">
          <Input
            value={colors[type]}
            onChange={(e) => onColorChange(type, e.target.value)}
            className="font-mono text-sm"
          />
        </div>
      </div>
      {showColorPicker[type] && (
        <div className="absolute z-10 mt-2">
          <HexColorPicker 
            color={colors[type]}
            onChange={(color) => onColorChange(type, color)} 
          />
          <div className="mt-2 flex justify-end">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onTogglePicker(type)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
