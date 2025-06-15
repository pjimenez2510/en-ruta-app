import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SocialFormValues, socialFormSchema } from "@/features/config-tenant/schemas/tenant.schemas";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

interface SocialFormProps {
  initialData?: Partial<SocialFormValues>;
  onSubmit: (values: SocialFormValues) => Promise<void>;
  isLoading: boolean;
}

const socialIcons = {
  facebook: { icon: Facebook, color: "text-blue-600" },
  twitter: { icon: Twitter, color: "text-sky-500" },
  instagram: { icon: Instagram, color: "text-pink-600" },
  youtube: { icon: Youtube, color: "text-red-600" },
} as const;

export const SocialForm = ({ initialData, onSubmit, isLoading }: SocialFormProps) => {
  const form = useForm<SocialFormValues>({
    resolver: zodResolver(socialFormSchema),
    defaultValues: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: '',
      ...initialData,
    },
  });

  const handleSubmit = async (values: SocialFormValues) => {
    try {
      await onSubmit(values);
      toast.success("Las redes sociales han sido actualizadas.");
    } catch (error) {
      console.error("Error al guardar las redes sociales:", error);
      toast.error("Ocurrió un error al guardar los cambios");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redes Sociales</CardTitle>
        <CardDescription>
          Configure los enlaces a sus redes sociales.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {Object.entries(socialIcons).map(([key, { icon: Icon, color }]) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={key as keyof SocialFormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">
                        {key === 'youtube' ? 'YouTube' : 
                         key.charAt(0).toUpperCase() + key.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className={`flex items-center justify-center h-10 w-10 rounded-l-md border border-r-0 bg-gray-50 ${color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <Input 
                            className="rounded-l-none" 
                            placeholder={`https://${key}.com/username`} 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SocialForm;
