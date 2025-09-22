import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  ArrowRight,
  Play,
  Clock,
  Award,
  Star,
} from "lucide-react";

export default function HeroSection() {
  // Usar las nuevas variables de entorno configuradas
  const isDevelopment = import.meta.env.DEV === true;
  const appTitle = import.meta.env.VITE_APP_TITLE || "EduPlatform";
  const debugMode = import.meta.env.VITE_DEBUG_MODE === "false";

  // Debug: mostrar en consola
  console.log("🚀 HeroSection - import.meta.env:", import.meta.env);
  console.log("🎯 HeroSection - DEV:", import.meta.env.DEV);
  console.log("📱 HeroSection - isDevelopment:", isDevelopment);
  console.log("🏷️ HeroSection - appTitle:", appTitle);
  console.log("🐛 HeroSection - debugMode:", debugMode);

  const stats = [
    { number: "150+", label: "Cursos" },
    { number: "4.8", label: "Rating" },
    { number: "25k+", label: "Estudiantes" },
    { number: "10+", label: "Instructores" },
  ];

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 spacing-responsive overflow-hidden">
   

      <div className="container-responsive relative">
        {/* Badge de desarrollo */}
        {isDevelopment && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center bg-white rounded-full px-6 py-2 shadow-lg border border-gray-200">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {appTitle} - Modo Desarrollo
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Aprende con los{" "}
              <span className="text-red-500 relative">
                mejores cursos
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-red-200 rounded-full"></div>
              </span>
            </h1>
            <p className="text-responsive-lg text-gray-600 mb-3 sm:mb-4 leading-relaxed">
              paga solo por lo que necesitas
            </p>
            <p className="text-responsive-base text-gray-500 mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0">
              Sin suscripciones. Sin compromisos. Compra el curso que quieras,
              cuando quieras, y accede a él para siempre.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
              <Link
                to="/cursos"
                className="group bg-red-500 text-white btn-responsive rounded-xl font-bold hover:bg-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center">
                Ver cursos disponibles
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/comoFunciona"
                className="group border-2 border-gray-300 text-gray-700 btn-responsive rounded-xl font-bold hover:border-red-500 hover:text-red-500 transition-all duration-300 flex items-center justify-center">
                <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Ver cómo funciona
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:pl-8 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-red-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      Curso destacado
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500">Full Stack Development</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Vista previa
                    </span>
                  </div>

                  {/* Imagen del curso */}
                  <div className="overflow-hidden rounded-xl shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&crop=center"
                      alt="Curso Full Stack"
                      className="w-full h-32 sm:h-40 lg:h-48 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-500 gap-2 sm:gap-0">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">2.5 horas de contenido</span>
                      <span className="sm:hidden">2.5h</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Certificado incluido</span>
                      <span className="sm:hidden">Certificado</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-sm sm:text-lg font-bold text-gray-900">24</div>
                  <div className="text-xs text-gray-500">Lecciones</div>
                </div>
                <div className="text-center">
                  <div className="text-sm sm:text-lg font-bold text-gray-900">4.9</div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-sm sm:text-lg font-bold text-gray-900">1.2k</div>
                  <div className="text-xs text-gray-500">Estudiantes</div>
                </div>
              </div>
            </div>

            {/* Iconos decorativos - ocultos en móvil */}
            <div className="hidden sm:block absolute -top-6 -right-6 bg-green-100 rounded-full p-3 shadow-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="hidden sm:block absolute -bottom-6 -left-6 bg-blue-100 rounded-full p-3 shadow-lg">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
