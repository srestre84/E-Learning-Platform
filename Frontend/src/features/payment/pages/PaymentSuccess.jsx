import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, ArrowRight, BookOpen, Trophy, Clock } from "lucide-react";
import { Button } from "@/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
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

    // Mostrar mensaje de éxito
    toast.success("¡Pago completado exitosamente! Ya tienes acceso al curso.");
  }, [searchParams]);

  const handleContinueToCourse = () => {
    if (courseId) {
      navigate(`/curso/${courseId}/content`);
    } else {
      navigate("/mis-cursos");
    }
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
          {/* Header de éxito */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Pago Completado Exitosamente!
            </h1>
            <p className="text-lg text-gray-600">
              Tu pago ha sido procesado correctamente y ya tienes acceso al
              curso.
            </p>
          </div>

          {/* Card de confirmación */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Acceso Confirmado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Pago procesado correctamente
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">
                    Acceso al curso activado
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700">Acceso de por vida</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>¿Qué sigue ahora?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-700">
                  • Puedes acceder al curso desde tu panel de estudiante
                </p>
                <p className="text-gray-700">
                  • Recibirás un email de confirmación con los detalles
                </p>
                <p className="text-gray-700">
                  • El curso estará disponible en "Mis Cursos"
                </p>
                <p className="text-gray-700">
                  • Puedes comenzar a estudiar inmediatamente
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            {courseId && (
              <Button
                onClick={handleContinueToCourse}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6">
                <BookOpen className="w-4 h-4 mr-2" />
                Ir al Curso
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            <Button
              onClick={handleGoToDashboard}
              variant="outline"
              className="flex-1">
              Ir al Dashboard
            </Button>
          </div>

          {/* Enlaces adicionales */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              ¿Necesitas ayuda?
              <Link
                to="/contacto"
                className="text-red-500 hover:text-red-600 ml-1">
                Contáctanos
              </Link>
            </p>
            <Link
              to="/mis-cursos"
              className="text-sm text-gray-500 hover:text-gray-700">
              Ver todos mis cursos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
