import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseContentNoJS = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  // Datos completamente estáticos sin JavaScript complejo
  const course = {
    title: "Spring Boot Avanzado",
    description: "Domina Spring Boot con técnicas avanzadas y mejores prácticas para el desarrollo de aplicaciones empresariales.",
    price: 69.99,
    instructor: "Juan Pérez",
    duration: "50 horas",
    level: "Avanzado"
  };

  const videos = [
    "Introducción a Spring Boot",
    "Configuración del Entorno",
    "Creando tu Primera Aplicación",
    "Controllers y RequestMapping",
    "CRUD Operations"
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '2rem'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            ← Volver
          </button>
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            {course.title}
          </h1>
          
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#4b5563',
            marginBottom: '1rem'
          }}>
            {course.description}
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '2rem',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            <span>👤 {course.instructor}</span>
            <span>⏰ {course.duration}</span>
            <span>📚 {course.level}</span>
            <span>💰 ${course.price}</span>
          </div>
        </div>

        {/* Contenido */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem'
        }}>
          {/* Videos */}
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Contenido del Curso ({videos.length} videos)
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {videos.map((video, index) => (
                <div key={index} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  backgroundColor: '#f9fafb'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h3 style={{ 
                        fontWeight: '600', 
                        color: '#1f2937',
                        marginBottom: '0.5rem'
                      }}>
                        {index + 1}. {video}
                      </h3>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#6b7280'
                      }}>
                        Video {index + 1} • 15 minutos
                      </p>
                    </div>
                    <button style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      cursor: 'pointer'
                    }}>
                      ▶️ Reproducir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel lateral */}
          <div>
            <div style={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                Información del Curso
              </h3>
              
              <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Categoría:</strong> Backend
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Subcategoría:</strong> Spring Boot
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Tipo:</strong> Gratuito
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Estado:</strong> Publicado
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1.5rem'
            }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                Acciones
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  ▶️ Continuar Curso
                </button>
                
                <button style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}>
                  📚 Ver Contenido
                </button>
                
                <button style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}>
                  ✅ Marcar Completado
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#9ca3af'
        }}>
          <p>Versión Sin JavaScript Complejo - Cargado: {new Date().toLocaleString()}</p>
          <p>Videos: {videos.length} | CourseId: {courseId}</p>
          <p style={{ color: '#10b981', fontWeight: '600' }}>
            ✅ Datos estáticos - Sin carga de API - Sin JavaScript complejo
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseContentNoJS;
