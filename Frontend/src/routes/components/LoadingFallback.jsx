import { Loader2 } from 'lucide-react';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-red-500" />
      <p className="text-gray-600">Cargando contenido...</p>
    </div>
  </div>
);

export default LoadingFallback;
