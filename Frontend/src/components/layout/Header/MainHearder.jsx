import { BookOpen, Menu, X } from 'lucide-react'
import { useState } from 'react'
import React from 'react'
export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
return(
  <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-red-500 p-2 rounded-lg mr-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">EduPlatform</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-red-500 font-medium transition-colors">Cursos</a>
              <a href="#" className="text-gray-700 hover:text-red-500 font-medium transition-colors">Precios</a>
              <a href="#" className="text-gray-700 hover:text-red-500 font-medium transition-colors">Instructores</a>
              <div className="flex items-center space-x-4">
                <a href="/login" className="text-gray-700 hover:text-red-500 font-medium transition-colors">Iniciar sesión</a>
                <a href="/register" className="bg-red-500 text-white px-6 py-2.5 rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-lg hover:shadow-xl">
                  Empezar ahora
                </a>
              </div>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#" className="block px-3 py-2 text-gray-700 font-medium">Cursos</a>
                <a href="#" className="block px-3 py-2 text-gray-700 font-medium">Precios</a>
                <a href="#" className="block px-3 py-2 text-gray-700 font-medium">Instructores</a>
                <div className="px-3 py-2 space-y-2">
                  <a href="/login" className="block text-gray-700 font-medium">Iniciar sesión</a>
                  <a href="/register" className="block bg-red-500 text-white px-4 py-2 rounded-lg text-center font-semibold">
                    Empezar ahora
                  </a>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
)
}
