import { ImageUploader } from "@/components/ui/image-uploader";
import { useTenantColors } from "@/core/context/tenant-context";
import { useState, useEffect } from "react";

interface LogoUploaderProps {
  logoPreview: string | null;
  onImageChange: (url: string) => void;
}

export const LogoUploader = ({
  logoPreview,
  onImageChange,
}: LogoUploaderProps) => {
  const { logoUrl, setLogoUrl } = useTenantColors();
  const [previousLogoUrl, setPreviousLogoUrl] = useState<string | null>(
    logoUrl
  );

  useEffect(() => {
    setPreviousLogoUrl(logoUrl);
  }, [logoUrl]);

  const handleImageChange = (url: string) => {
    console.log("Logo changed:", url);
    setLogoUrl(url);
    onImageChange(url);
  };

  const handleCancel = () => {
    console.log("Logo upload cancelled, reverting to:", previousLogoUrl);
    setLogoUrl(previousLogoUrl);
    onImageChange(previousLogoUrl || "");
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Logo</h3>
      <ImageUploader
        imageUrl={logoUrl || logoPreview}
        onImageUpload={handleImageChange}
        onCancel={handleCancel}
        aspectRatio={1}
        width={80}
        height={80}
        buttonText="Cambiar Logo"
        folder="en-ruta/logos"
      />
    </div>
  );
};
