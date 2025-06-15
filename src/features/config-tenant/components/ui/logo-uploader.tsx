import { ImageUploader } from "@/components/ui/image-uploader";

interface LogoUploaderProps {
  logoPreview: string | null;
  onImageChange: (url: string) => void;
}

export const LogoUploader = ({
  logoPreview,
  onImageChange,
}: LogoUploaderProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Logo</h3>
      <ImageUploader
        imageUrl={logoPreview}
        onImageUpload={onImageChange}
        aspectRatio={1}
        width={80}
        height={80}
        buttonText="Cambiar Logo"
        folder="en-ruta/logos"
      />
    </div>
  );
};
