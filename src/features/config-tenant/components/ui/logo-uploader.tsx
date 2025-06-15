import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoUploaderProps {
  logoPreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LogoUploader = ({ logoPreview, onImageChange }: LogoUploaderProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Logo</h3>
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-gray-50 overflow-hidden">
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Logo de la cooperativa"
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <div className="relative">
          <Button variant="outline" size="sm" type="button" asChild>
            <label className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Cambiar Logo
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={onImageChange}
              />
            </label>
          </Button>
        </div>
      </div>
    </div>
  );
};
