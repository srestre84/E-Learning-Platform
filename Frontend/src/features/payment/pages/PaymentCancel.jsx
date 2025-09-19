import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  XCircle,
  ArrowLeft,
  RefreshCw,
  BookOpen,
  CreditCard,
} from "lucide-react";
import { Button } from "@/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { toast } from "react-toastify";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const courseIdParam = searchParams.get("courseId");
    if (courseIdParam) {
      setCourseId(courseIdParam);
    }
    setIsLoading(false);

    // Mostrar mensaje informativo
    toast.info(
      "Pago cancelado. Puedes intentar nuevamente cuando estés listo."
    );
  }, [searchParams]);

  const handleRetryPayment = () => {
    if (courseId) {
      navigate(`/curso/${courseId}`);
    } else {
      navigate("/cursos");
    }
  };

  const handleGoToCourses = () => {
    navigate("/cursos");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header de cancelación */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
              <XCircle className="w-10 h-10 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pago Cancelado
            </h1>
            <p className="text-lg text-gray-600">
              No se completó el pago. No te preocupes, puedes intentarlo
              nuevamente.
            </p>
          </div>

          {/* Card de información */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-500" />
                ¿Qué pasó?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  El proceso de pago fue cancelado. Esto puede suceder por
                  varias razones:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Decidiste cancelar el pago</li>
                  <li>Hubo un problema técnico temporal</li>
                  <li>La sesión de pago expiró</li>
                  <li>Problemas de conectividad</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Card de próximos pasos */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>¿Qué puedes hacer ahora?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <RefreshCw className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Intentar el pago nuevamente
                    </p>
                    <p className="text-sm text-gray-600">
                      Regresa al curso y vuelve a intentar el proceso de pago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Explorar otros cursos
                    </p>
                    <p className="text-sm text-gray-600">
                      Descubre más cursos disponibles en nuestra plataforma
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowLeft className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Volver al dashboard
                    </p>
                    <p className="text-sm text-gray-600">
                      Regresa a tu panel principal para continuar aprendiendo
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            {courseId && (
              <Button
                onClick={handleRetryPayment}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6">
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar Pago Nuevamente
              </Button>
            )}

            <Button
              onClick={handleGoToCourses}
              variant="outline"
              className="flex-1">
              <BookOpen className="w-4 h-4 mr-2" />
              Ver Cursos
            </Button>
          </div>

          {/* Botón secundario */}
          <div className="mt-4">
            <Button
              onClick={handleGoToDashboard}
              variant="ghost"
              className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>

          {/* Información de soporte */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              ¿Tienes problemas con el pago?
              <Link
                to="/contacto"
                className="text-red-500 hover:text-red-600 ml-1">
                Contáctanos para obtener ayuda
              </Link>
            </p>
            <div className="text-sm text-gray-500">
              <p>💡 Tip: Asegúrate de tener una conexión estable a internet</p>
              <p>
                🔒 Todos los pagos son procesados de forma segura con Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
