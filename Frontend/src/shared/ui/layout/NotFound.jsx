import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Ups! Página no encontrada</h1>
        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver atrás
          </Button>
          <Button 
            onClick={() => navigate('/')} 
            className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Ir al inicio
          </Button>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-500">
            ¿Buscas algo en particular? Prueba a buscar o
            <a 
              href="/contacto" 
              className="text-blue-600 hover:underline ml-1"
            >
              contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
