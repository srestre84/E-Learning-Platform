// src/lib/api.js
import axios from "axios";

const isProd = import.meta.env.MODE === 'production' || import.meta.env.VITE_ENV === 'production';

// 🌐 Base URL según el entorno
const API_URL = isProd
  ? 'https://e-learning-platform-2-dew2.onrender.com'
  : 'http://localhost:8080';


// ✅ Crear instancia de Axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // Aumentar timeout para Render (puede tardar en despertar)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🔑 Helpers para tokens
const STORAGE_KEY = {
  TOKEN: 'token',
  USER: 'user',
}

// 🛠️ Utilidades para validar formato de datos
const validateApiResponse = (data) => {
  if (!data) return null;

  // Si es string, intentar parsear como JSON
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.warn('⚠️ No se pudo parsear respuesta como JSON:', parseError.message);
      return { message: data };
    }
  }

  // Si ya es objeto, devolverlo tal como está
  if (typeof data === 'object') {
    return data;
  }

  return data;
};

// 🧹 Función para limpiar JSON malformado del backend
const cleanMalformedJson = (jsonString) => {
  if (!jsonString || typeof jsonString !== 'string') {
    return jsonString;
  }

  let cleaned = jsonString;
  
  // Patrones específicos de corrupción que hemos observado
  const corruptionPatterns = [
    // Patrones de enrollments corruptos
    /"enrollments":\]\}\}\}\]\}\}\}\]\}\}\}\]/g,
    /"enrollments":\]\}\}\}\]\}\}\}\]/g,
    /"enrollments":\]\}\}\}\]/g,
    /"enrollments":\]\}\}\]/g,
    /"enrollments":\]\}\}/g,
    /"enrollments":\]\}/g,
    /"enrollments":\]/g,
    
    // Patrones de payments corruptos
    /"payments":\]\}\}\}\]\}\}\}\]\}\}\}\]/g,
    /"payments":\]\}\}\}\]\}\}\}\]/g,
    /"payments":\]\}\}\}\]/g,
    /"payments":\]\}\}\]/g,
    /"payments":\]\}\}/g,
    /"payments":\]\}/g,
    /"payments":\]/g,
    
    // Patrones de paymentSessions corruptos
    /"paymentSessions":\]\}\}\}\]\}\}\}\]\}\}\}\]/g,
    /"paymentSessions":\]\}\}\}\]\}\}\}\]/g,
    /"paymentSessions":\]\}\}\}\]/g,
    /"paymentSessions":\]\}\}\]/g,
    /"paymentSessions":\]\}\}/g,
    /"paymentSessions":\]\}/g,
    /"paymentSessions":\]/g,
    
    // Patrones de modules corruptos
    /"modules":\]\}\}\}\]\}\}\}\]\}\}\}\]/g,
    /"modules":\]\}\}\}\]\}\}\}\]/g,
    /"modules":\]\}\}\}\]/g,
    /"modules":\]\}\}\]/g,
    /"modules":\]\}\}/g,
    /"modules":\]\}/g,
    /"modules":\]/g,
    
    // Patrones de youtubeUrls corruptos
    /"youtubeUrls":\]\}\}\}\]\}\}\}\]\}\}\}\]/g,
    /"youtubeUrls":\]\}\}\}\]\}\}\}\]/g,
    /"youtubeUrls":\]\}\}\}\]/g,
    /"youtubeUrls":\]\}\}\]/g,
    /"youtubeUrls":\]\}\}/g,
    /"youtubeUrls":\]\}/g,
    /"youtubeUrls":\]/g,
  ];
  
  // Aplicar cada patrón de corrupción
  corruptionPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '[]');
  });
  
  // Buscar y corregir arrays malformados específicos
  const malformedArrays = [
    { pattern: /"enrollments":\]/g, replacement: '"enrollments":[]' },
    { pattern: /"payments":\]/g, replacement: '"payments":[]' },
    { pattern: /"paymentSessions":\]/g, replacement: '"paymentSessions":[]' },
    { pattern: /"modules":\]/g, replacement: '"modules":[]' },
    { pattern: /"youtubeUrls":\]/g, replacement: '"youtubeUrls":[]' }
  ];
  
  malformedArrays.forEach(({ pattern, replacement }) => {
    cleaned = cleaned.replace(pattern, replacement);
  });
  
  // Buscar el último objeto válido y truncar ahí si es necesario
  const lastValidObject = cleaned.lastIndexOf('}');
  if (lastValidObject !== -1) {
    // Buscar el siguiente carácter después del último }
    let truncatePoint = lastValidObject + 1;
    
    // Si hay caracteres malformados después, truncar ahí
    const remaining = cleaned.substring(truncatePoint);
    if (remaining.includes(']}}]') || remaining.includes(']}}]}}]')) {
      cleaned = cleaned.substring(0, truncatePoint) + '}';
      console.log("🔧 JSON truncado después del último objeto válido");
    }
  }
  
  // Asegurar que el JSON termine correctamente
  if (!cleaned.endsWith('}') && !cleaned.endsWith(']')) {
    cleaned += '}';
  }
  
  return cleaned;
};

const cleanApiData = (data) => {
  // Si ya es un objeto válido, no procesarlo
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => {
      // Solo procesar si el item es string
      if (typeof item === 'string') {
        return validateApiResponse(item);
      }
      return item;
    });
  }

  return validateApiResponse(data);
};

export const getToken = () => localStorage.getItem(STORAGE_KEY.TOKEN);
export const setToken = (token) => {
  localStorage.setItem(STORAGE_KEY.TOKEN, token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEY.TOKEN);
  localStorage.removeItem(STORAGE_KEY.USER);
  delete api.defaults.headers.common["Authorization"];
};

// 🔗 Interceptor para adjuntar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    // ✅ Solo procesar si la respuesta es string (no ya parseada)
    if (response.data && typeof response.data === 'string') {
      try {
        // Intentar limpiar el JSON antes de parsearlo
        const cleanedJson = cleanMalformedJson(response.data);
        response.data = JSON.parse(cleanedJson);
      } catch (error) {
        console.warn('⚠️ Error parsing JSON response:', error.message);
        // Mantener la respuesta original si no se puede parsear
      }
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ⏳ Reintento automático si hubo timeout (especialmente para Render)
    if (error.code === "ECONNABORTED" && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("🔄 Reintentando petición después de timeout...");
      return api(originalRequest);
    }

    // 🔄 Reintento para errores de conexión (Render puede estar despertando)
    if (error.code === "ERR_NETWORK" && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("🔄 Reintentando petición después de error de red...");
      return api(originalRequest);
    }

    // 🌐 Error de red
    if (error.code === "ERR_NETWORK") {
      return Promise.reject(
        new Error("No se pudo conectar con el servidor. Verifica tu conexión a internet.")
      );
    }

    // 🔌 Error de extensiones del navegador
    if (error.message && error.message.includes("message channel closed")) {
      console.warn("⚠️ Error causado por extensiones del navegador. Intenta en modo incógnito.");
      return Promise.reject(
        new Error("Error de comunicación. Intenta deshabilitar extensiones o usar modo incógnito.")
      );
    }

    // ❌ Sin respuesta del servidor
    if (!error.response) {
      return Promise.reject(
        new Error("El servidor no respondió. Intenta más tarde.")
      );
    }

    const { status, data } = error.response;

    // 🔍 Usar datos de error directamente sin procesar
    const errorData = data;

    // 🔑 Error 401 - Diferenciar entre credenciales inválidas y sesión expirada
    if (status === 401) {
      // Si es un endpoint de login, no limpiar auth (es credenciales inválidas)
      if (error.config?.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }
      // Si es otro endpoint, es sesión expirada
      clearAuth();
      return Promise.reject(
        new Error("Tu sesión ha expirado. Inicia sesión nuevamente.")
      );
    }

    // ⚠️ Error 400 - Bad Request (errores de validación)
    if (status === 400) {
      console.log('=== API INTERCEPTOR: Error 400 ===');
      console.log('Data:', errorData);
      console.log('Original Error:', error);

      // Preservar el error original para que el service pueda manejarlo
      return Promise.reject(error);
    }

    // ⚠️ Otros errores comunes
    let errorMessage = errorData?.message || "Ocurrió un error inesperado";
    if (status === 403) errorMessage = "No tienes permiso para esta acción";
    if (status === 404) errorMessage = "Recurso no encontrado";
    if (status === 500)
      errorMessage = "Error interno del servidor. Intenta más tarde.";

    return Promise.reject(new Error(errorMessage));
  }
);



// 📤 Exportar utilidades y API
export { validateApiResponse, cleanApiData };
export default api;
