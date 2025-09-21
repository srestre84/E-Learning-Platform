import { useCallback } from 'react';

export const useScrollToSection = () => {
  const scrollToSection = useCallback((sectionId, fallbackBehavior = 'bottom') => {
    console.log(`Buscando sección: ${sectionId}`);
    
    // Intentar encontrar el elemento
    const element = document.getElementById(sectionId);
    console.log("Elemento encontrado:", element);
    
    if (element) {
      // Elemento encontrado, hacer scroll
      element.scrollIntoView({ 
        behavior: "smooth", 
        block: "start",
        inline: "nearest"
      });
      console.log("Scroll ejecutado correctamente");
      return true;
    } else {
      // Elemento no encontrado, intentar fallback
      console.log("Elemento no encontrado, ejecutando fallback");
      
      if (fallbackBehavior === 'bottom') {
        // Scroll al final de la página
        window.scrollTo({ 
          top: document.body.scrollHeight, 
          behavior: "smooth" 
        });
      } else if (fallbackBehavior === 'top') {
        // Scroll al inicio de la página
        window.scrollTo({ 
          top: 0, 
          behavior: "smooth" 
        });
      }
      
      return false;
    }
  }, []);

  return { scrollToSection };
};
