// src/features/test/TestConnection.jsx
import { useEffect, useState } from 'react';
import api from '@/services/apiConnection';

const TestConnection = () => {
  const [message, setMessage] = useState('Probando conexión...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/');
        setMessage(`Conexión exitosa: ${response.data.message}`);
      } catch (error) {
        setMessage(`lo sentimos: ${error.message}`);
        console.error('Error:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4">
      <h2>Prueba de conexión al backend</h2>
      <p>URL del backend: {import.meta.env.VITE_API_URL}</p>
      <p>Estado: {message}</p>
    </div>
  );
};

export default TestConnection;