/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales de marca
        primary: {
          50: '#FEF2F2',   // red-50
          100: '#FEE2E2',  // red-100
          200: '#FECACA',  // red-200
          300: '#FCA5A5',  // red-300
          400: '#F87171',  // red-400
          500: '#EF4444',  // red-500 - Color principal
          600: '#DC2626',  // red-600 - Hover
          700: '#B91C1C',  // red-700
          800: '#991B1B',  // red-800
          900: '#7F1D1D',  // red-900
        },

        // Escala de grises personalizada
        neutral: {
          50: '#F9FAFB',   // gray-50
          100: '#F3F4F6',  // gray-100
          200: '#E5E7EB',  // gray-200
          300: '#D1D5DB',  // gray-300
          400: '#9CA3AF',  // gray-400
          500: '#6B7280',  // gray-500
          600: '#4B5563',  // gray-600
          700: '#374151',  // gray-700
          800: '#1F2937',  // gray-800
          900: '#111827',  // gray-900
        },

        // Colores de estado
        success: {
          50: '#ECFDF5',   // green-50
          100: '#D1FAE5',  // green-100
          200: '#A7F3D0',  // green-200
          300: '#6EE7B7',  // green-300
          400: '#34D399',  // green-400
          500: '#10B981',  // green-500
          600: '#059669',  // green-600
          700: '#047857',  // green-700
          800: '#065F46',  // green-800
          900: '#064E3B',  // green-900
        },

        warning: {
          50: '#FFFBEB',   // yellow-50
          100: '#FEF3C7',  // yellow-100
          200: '#FDE68A',  // yellow-200
          300: '#FCD34D',  // yellow-300
          400: '#FBBF24',  // yellow-400
          500: '#F59E0B',  // yellow-500
          600: '#D97706',  // yellow-600
          700: '#B45309',  // yellow-700
          800: '#92400E',  // yellow-800
          900: '#78350F',  // yellow-900
        },

        info: {
          50: '#EFF6FF',   // blue-50
          100: '#DBEAFE',  // blue-100
          200: '#BFDBFE',  // blue-200
          300: '#93C5FD',  // blue-300
          400: '#60A5FA',  // blue-400
          500: '#3B82F6',  // blue-500
          600: '#2563EB',  // blue-600
          700: '#1D4ED8',  // blue-700
          800: '#1E40AF',  // blue-800
          900: '#1E3A8A',  // blue-900
        },

        // Colores semánticos
        brand: {
          primary: '#EF4444',    // red-500
          secondary: '#DC2626',  // red-600
          accent: '#10B981',     // green-500
          highlight: '#F59E0B',  // yellow-500
        },

        // Fondos especiales
        background: {
          primary: '#FFFFFF',    // white
          secondary: '#F9FAFB',  // gray-50
          tertiary: '#F3F4F6',  // gray-100
          dark: '#000000',       // black
          'dark-gradient': '#111827', // gray-900
        },

        // Textos
        text: {
          primary: '#111827',    // gray-900
          secondary: '#374151',  // gray-700
          tertiary: '#6B7280',  // gray-600
          muted: '#9CA3AF',     // gray-400
          inverse: '#FFFFFF',    // white
        },

        // Bordes
        border: {
          light: '#E5E7EB',      // gray-200
          medium: '#D1D5DB',     // gray-300
          dark: '#9CA3AF',       // gray-400
        }
      },

      // Gradientes personalizados
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 50%, #F3F4F6 100%)',
        'cta-gradient': 'linear-gradient(90deg, #111827 0%, #000000 50%, #111827 100%)',
      },

      // Sombras personalizadas
      boxShadow: {
        'brand': '0 10px 25px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -2px rgba(239, 68, 68, 0.05)',
        'brand-lg': '0 20px 25px -5px rgba(239, 68, 68, 0.1), 0 10px 10px -5px rgba(239, 68, 68, 0.04)',
      }
    },
  },
  plugins: [],
}