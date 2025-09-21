import React from 'react';
import { Check, Star, Users, Clock, Award, Zap } from 'lucide-react';

const PricingPage = () => {
  const plans = [
    {
      name: 'Estudiante',
      price: 'Gratis',
      period: 'Para siempre',
      description: 'Acceso básico a cursos gratuitos',
      features: [
        'Acceso a cursos gratuitos',
        'Videos en calidad estándar',
        'Soporte por email',
        'Certificados básicos',
        'Comunidad de estudiantes'
      ],
      popular: false,
      color: 'blue',
      icon: Users
    },
    {
      name: 'Profesor',
      price: '$29',
      period: 'por mes',
      description: 'Herramientas completas para crear y vender cursos',
      features: [
        'Crear cursos ilimitados',
        'Subir videos en HD',
        'Analytics detallados',
        'Soporte prioritario',
        'Herramientas de marketing',
        'Pagos automáticos',
        'Certificados personalizados',
        'Webinars en vivo'
      ],
      popular: true,
      color: 'purple',
      icon: Award
    },
    {
      name: 'Institucional',
      price: '$99',
      period: 'por mes',
      description: 'Solución completa para instituciones educativas',
      features: [
        'Todo lo de Profesor',
        'Múltiples instructores',
        'Gestión de estudiantes',
        'Integración LMS',
        'Soporte 24/7',
        'API personalizada',
        'Branding personalizado',
        'Reportes avanzados'
      ],
      popular: false,
      color: 'green',
      icon: Zap
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Profesora de JavaScript',
      content: 'La plataforma me ha permitido crear cursos profesionales y ganar dinero enseñando lo que amo.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Instructor de Python',
      content: 'Las herramientas de analytics me ayudan a entender mejor a mis estudiantes y mejorar mis cursos.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Ana Martínez',
      role: 'Desarrolladora Full Stack',
      content: 'La facilidad para crear contenido y la calidad de la plataforma superaron mis expectativas.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const getColorClasses = (color, popular) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        button: 'bg-blue-600 hover:bg-blue-700',
        text: 'text-blue-600',
        icon: 'text-blue-500'
      },
      purple: {
        bg: 'bg-purple-50',
        border: popular ? 'border-purple-500' : 'border-purple-200',
        button: 'bg-purple-600 hover:bg-purple-700',
        text: 'text-purple-600',
        icon: 'text-purple-500'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        button: 'bg-green-600 hover:bg-green-700',
        text: 'text-green-600',
        icon: 'text-green-500'
      }
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Precios que se adaptan a ti
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Desde estudiantes que quieren aprender hasta profesores que quieren enseñar, 
              tenemos el plan perfecto para ti.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const colors = getColorClasses(plan.color, plan.popular);
            const IconComponent = plan.icon;
            
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl ${colors.bg} ${colors.border} border-2 p-8 ${
                  plan.popular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Más Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <div className={`inline-flex p-3 rounded-full ${colors.bg} mb-4`}>
                    <IconComponent className={`w-8 h-8 ${colors.icon}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {plan.description}
                  </p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {plan.period}
                    </span>
                  </div>
                  
                  <button
                    className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors ${colors.button}`}
                  >
                    {plan.name === 'Estudiante' ? 'Comenzar Gratis' : 'Comenzar Ahora'}
                  </button>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Incluye:
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-gray-600">
              Miles de profesores y estudiantes confían en nuestra plataforma
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 italic">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Puedo cambiar de plan en cualquier momento?
              </h3>
              <p className="text-gray-600">
                Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se aplicarán 
                en tu próxima facturación.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Hay período de prueba gratuito?
              </h3>
              <p className="text-gray-600">
                Sí, ofrecemos una prueba gratuita de 14 días para todos los planes de pago. 
                No se requiere tarjeta de crédito.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Qué métodos de pago aceptan?
              </h3>
              <p className="text-gray-600">
                Aceptamos todas las tarjetas de crédito principales, PayPal, y transferencias bancarias 
                para planes institucionales.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Puedo cancelar mi suscripción?
              </h3>
              <p className="text-gray-600">
                Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de control. 
                No hay penalizaciones por cancelación.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Únete a miles de profesores y estudiantes que ya están aprendiendo y enseñando en nuestra plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Comenzar Gratis
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
              Ver Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
