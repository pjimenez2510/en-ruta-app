import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_ASSETS } from "@/core/constants/app-assets";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardContent className="flex flex-col items-center py-12">
          <Image
            src={APP_ASSETS.IMAGES.LOGO}
            alt="EnRuta Logo"
            width={120}
            height={60}
            className="mb-6"
            priority
          />
          <h1 className="text-6xl font-extrabold text-primary mb-2">404</h1>
          <h2 className="text-2xl font-semibold mb-2 text-center">Página no encontrada</h2>
          <p className="mb-6 text-center text-gray-600 max-w-xs">
            Lo sentimos, la página que buscas no existe, fue movida o eliminada.<br />
            Si crees que esto es un error, por favor revisa la URL o vuelve al inicio.
          </p>
          <a href="/main/admin/dashboard" className="w-full">
            <Button className="w-full">Volver al inicio</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
} 