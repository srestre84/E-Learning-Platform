package com.Dev_learning_Platform.Dev_learning_Platform.middlewares;

/**
 * Clase base para middlewares personalizados de la aplicación.
 * 
 * Esta clase está preparada para ser extendida por middlewares específicos
 * que requieran funcionalidad común o configuración base.
 * 
 * Características:
 * - Clase base para middlewares personalizados
 * - Configuración común para filtros HTTP
 * - Integración con Spring Security
 * 
 * Uso:
 * - Extender esta clase para crear middlewares específicos
 * - Implementar lógica común de filtrado
 * - Configurar comportamiento base para middlewares
 * 
 * Ejemplos de uso:
 * - Filtros de logging
 * - Filtros de autenticación
 * - Filtros de autorización
 * - Filtros de auditoría
 * 
 * Nota: Esta clase está actualmente vacía y está preparada para
 * futuras implementaciones de middlewares específicos.
 */
public class Middleware {
    
    /**
     * Constructor por defecto.
     * Inicializa el middleware base.
     */
    public Middleware() {
        // Configuración base del middleware
    }
    
    /**
     * Método base para procesamiento de requests.
     * 
     * Este método puede ser sobrescrito por clases hijas
     * para implementar lógica específica de filtrado.
     * 
     * @param request La request HTTP a procesar
     * @return true si la request debe continuar, false si debe ser bloqueada
     */
    public boolean processRequest(Object request) {
        // Implementación base - permite todas las requests
        return true;
    }
}
