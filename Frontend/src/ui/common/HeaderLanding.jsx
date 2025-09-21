import React, { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { toast } from "sonner";
import logo from '@/assets/logo.svg';
import { useScrollToSection } from '@/shared/hooks/useScrollToSection';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollToSection } = useScrollToSection();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      toast.loading("Cerrando sesión...", {
        id: "logout-loading",
        duration: 0,
      });

      await logout({ redirect: false });
      
      toast.dismiss("logout-loading");
      toast.success("Sesión cerrada exitosamente", {
        duration: 2000,
        position: "top-center",
      });

      // Recargar la página para actualizar el estado
      window.location.reload();
      
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.dismiss("logout-loading");
      toast.error("Error al cerrar sesión", {
        description: "Por favor, intenta nuevamente",
        duration: 3000,
        position: "top-center",
      });
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "Usuario";
    if (user.firstName && user.lastName)
      return `${user.firstName} ${user.lastName}`;
    if (user.name) return user.name;
    return user.email || "Usuario";
  };

  return (
    <header
      className="text-text-inverse
        bg-gray-100 shadow-md sticky top-0 z-50 border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className=" hover:bg-background-dark-gradient transition-shadow  cursor-pointer rounded-lg mr-3">
              <img src={logo} alt="Logo" className="w-10 h-10" />
              
            </div>
            <a href="/"
            
            >
               <span className="text-2xl font-bold text-gray-900">
              EduPlatform
            </span>
            </a>

          </div>

          <div className="hidden md:flex items-center space-x-8">
          <Link to="cursos"
              className="block px-3 py-2 text-gray-700 font-medium cursor-pointer hover:text-red-500 transition-colors"
              >
              Cursos
              </Link>
            <Link
              to="/precios"
              className="text-gray-700 hover:text-red-500 font-medium transition-colors"
            >
              Precios
            </Link>
            <a
              href="#instructores"
              className="text-gray-700 hover:text-red-500 font-medium transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("instructores");
                setIsMenuOpen(false);
              }}
            >
              Instructores
            </a>
            <div className="flex items-center space-x-4">
              <a
                href="#testimonios"
                className="text-gray-700 hover:text-red-500 font-medium transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("testimonios");
                  setIsMenuOpen(false);
                }}
              >
                Testimonios
              </a>
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700 font-medium">
                    ¡Hola, {getUserDisplayName()}!
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/authentication"
                  className="bg-red-500 text-white px-6 py-2.5 rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-lg hover:shadow-xl">
                  Empezar ahora
                </Link>
              )}
            </div>
          </div>
          
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="cursos"
              className="block px-3 py-2 text-gray-700 font-medium cursor-pointer"
              >
              Cursos
              </Link>
              <a
                href="#precios"
                className="block px-3 py-2 text-gray-700 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("precios");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                  setIsMenuOpen(false);
                }}>

                Precios
              </a>
              <a
                href="#instructores"
                className="block px-3 py-2 text-gray-700 font-medium cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("instructores");
                  setIsMenuOpen(false);
                }}
              >
                Instructores
              </a>
              <div className="px-3 py-2 space-y-2">
                <a
                  href="#testimonios"
                  className="block text-gray-700 font-medium cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("testimonios");
                    setIsMenuOpen(false);
                  }}>
                  Testimonios
                </a>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-700 font-medium">
                      ¡Hola, {getUserDisplayName()}!
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors">
                      <div className="flex items-center justify-center space-x-2">
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar sesión</span>
                      </div>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="authentication"
                    className="block bg-red-500 text-white px-2 py-1 cursor-pointer rounded-lg text-center font-semibold">
                    Empezar ahora
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
