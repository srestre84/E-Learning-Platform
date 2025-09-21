import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseContentAccessible = () => {
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

  const handleBackClick = () => {
    navigate(-1);
  };

  const handlePlayClick = (videoIndex) => {
    console.log(`Reproducir video: ${videoIndex + 1}`);
    // Aquí se podría implementar la lógica de reproducción
  };

  const handleContinueCourse = () => {
    console.log("Continuar curso");
    // Aquí se podría implementar la lógica de continuar curso
  };

  const handleViewContent = () => {
    console.log("Ver contenido");
    // Aquí se podría implementar la lógica de ver contenido
  };

  const handleMarkComplete = () => {
    console.log("Marcar como completado");
    // Aquí se podría implementar la lógica de marcar como completado
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f3f4f6', 
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem'
      }}>
        {/* Header */}
        <header style={{ marginBottom: '2rem' }}>
          <button 
            onClick={handleBackClick}
            aria-label="Volver a la página anterior"
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '1rem',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            ← Volver
          </button>
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            {course.title}
          </h1>
          
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#4b5563',
            marginBottom: '1rem',
            lineHeight: '1.6'
          }}>
            {course.description}
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '2rem',
            fontSize: '0.875rem',
            color: '#6b7280',
            flexWrap: 'wrap'
          }}>
            <span aria-label={`Instructor: ${course.instructor}`}>
              👤 {course.instructor}
            </span>
            <span aria-label={`Duración: ${course.duration}`}>
              ⏰ {course.duration}
            </span>
            <span aria-label={`Nivel: ${course.level}`}>
              📚 {course.level}
            </span>
            <span aria-label={`Precio: ${course.price} dólares`}>
              💰 ${course.price}
            </span>
          </div>
        </header>

        {/* Contenido principal */}
        <main>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr',
            gap: '2rem'
          }}>
            {/* Videos */}
            <section aria-labelledby="videos-heading">
              <h2 
                id="videos-heading"
                style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#1f2937',
                  marginBottom: '1rem'
                }}
              >
                Contenido del Curso ({videos.length} videos)
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {videos.map((video, index) => (
                  <article 
                    key={index}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '1rem',
                      backgroundColor: '#f9fafb'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <h3 style={{ 
                          fontWeight: '600', 
                          color: '#1f2937',
                          marginBottom: '0.5rem',
                          fontSize: '1.125rem'
                        }}>
                          {index + 1}. {video}
                        </h3>
                        <p style={{ 
                          fontSize: '0.875rem', 
                          color: '#6b7280',
                          margin: '0'
                        }}>
                          Video {index + 1} • 15 minutos
                        </p>
                      </div>
                      <button 
                        onClick={() => handlePlayClick(index)}
                        aria-label={`Reproducir video: ${video}`}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          minWidth: '120px'
                        }}
                      >
                        ▶️ Reproducir
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Panel lateral */}
            <aside>
              <section 
                aria-labelledby="course-info-heading"
                style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginBottom: '1rem'
                }}
              >
                <h3 
                  id="course-info-heading"
                  style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    color: '#1f2937',
                    marginBottom: '1rem'
                  }}
                >
                  Información del Curso
                </h3>
                
                <dl style={{ fontSize: '0.875rem', color: '#4b5563', margin: '0' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <dt style={{ fontWeight: '600', display: 'inline' }}>Categoría:</dt>
                    <dd style={{ display: 'inline', marginLeft: '0.5rem' }}>Backend</dd>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <dt style={{ fontWeight: '600', display: 'inline' }}>Subcategoría:</dt>
                    <dd style={{ display: 'inline', marginLeft: '0.5rem' }}>Spring Boot</dd>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <dt style={{ fontWeight: '600', display: 'inline' }}>Tipo:</dt>
                    <dd style={{ display: 'inline', marginLeft: '0.5rem' }}>Gratuito</dd>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <dt style={{ fontWeight: '600', display: 'inline' }}>Estado:</dt>
                    <dd style={{ display: 'inline', marginLeft: '0.5rem' }}>Publicado</dd>
                  </div>
                </dl>
              </section>

              <section 
                aria-labelledby="actions-heading"
                style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1.5rem'
                }}
              >
                <h3 
                  id="actions-heading"
                  style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    color: '#1f2937',
                    marginBottom: '1rem'
                  }}
                >
                  Acciones
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button 
                    onClick={handleContinueCourse}
                    aria-label="Continuar con el curso"
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '1rem'
                    }}
                  >
                    ▶️ Continuar Curso
                  </button>
                  
                  <button 
                    onClick={handleViewContent}
                    aria-label="Ver contenido del curso"
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    📚 Ver Contenido
                  </button>
                  
                  <button 
                    onClick={handleMarkComplete}
                    aria-label="Marcar curso como completado"
                    style={{
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    ✅ Marcar Completado
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </main>

        {/* Footer */}
        <footer style={{ 
          marginTop: '2rem', 
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#9ca3af',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '1rem'
        }}>
          <p>Versión Accesible - Cargado: {new Date().toLocaleString()}</p>
          <p>Videos: {videos.length} | CourseId: {courseId}</p>
          <p style={{ color: '#10b981', fontWeight: '600' }}>
            ✅ Datos estáticos - Sin carga de API - Accesible y compatible
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CourseContentAccessible;
