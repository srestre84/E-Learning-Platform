import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { useNotification } from "@/contexts/NotificationContext";
import { useAsync } from "@/shared/hooks/useAsync";
import Button from "@/components/Button";
import FormInput from "@/ui/FormInput";
import api from '@/services/apiService';

// Función para manejar el login con la API real
async function loginUser({ email, password }) {
  try {
    console.log('Iniciando sesión con:', { email });
    const response = await api.login(email, password);
    console.log('Respuesta del servidor (login):', response);
    
    // Si el login es exitoso, devolvemos los datos del usuario
    if (response && response.user) {
      return response.user;
    }
    
    throw new Error('No se pudo iniciar sesión. Por favor, verifica tus credenciales.');
  } catch (error) {
    console.error('Error en loginUser:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
}

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showNotification } = useNotification();
  const { login, isAuthenticated, role } = useAuth();

  // Usamos useAsync para manejar el estado de la petición
  const { 
    execute: handleLogin, 
    isLoading, 
    error 
  } = useAsync(loginUser, {
    onSuccess: async (userData) => {
      try {
        // Usar la función de login del contexto de autenticación
        await login(userData.email, userData.password);
        showNotification('Inicio de sesión exitoso', 'success');
        
        // La redirección se manejará automáticamente por el efecto que verifica isAuthenticated
      } catch (err) {
        console.error('Error en login:', err);
        showNotification(err.response?.data?.message || err.message || 'Error al iniciar sesión', 'error');
      }
    },
    onError: (error) => {
      console.error('Error en autenticación:', error);
      showNotification(error.response?.data?.message || error.message || 'Error al iniciar sesión', 'error');
    }
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
        return;
      }
      // Redirige según el rol
      switch (role) {
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'teacher':
          navigate('/teacher/dashboard', { replace: true });
          break;
        case 'student':
        default:
          navigate('/dashboard', { replace: true });
          break;
      }
    }
  }, [isAuthenticated, role, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showNotification('Por favor ingresa tu correo y contraseña', 'error');
      return;
    }
    
    try {
      const response = await handleLogin({ email, password });
      console.log('Login response:', response);
    } catch (error) {
      // Los errores ya se manejan en el onError de useAsync
      console.error('Error en el formulario:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormInput
          label="Correo electrónico"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          required
          disabled={isLoading}
        />
        <FormInput
          label="Contraseña"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          disabled={isLoading}
        />

        <Button
          type="submit"
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 mt-4"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>
    </>
  );
}