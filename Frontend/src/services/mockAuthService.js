// src/services/mockAuthService.js

import { ROLES } from "@/constants/roles";

// Simula la base de datos de usuarios
const mockUsers = [
  {
    email: "test@example.com",
    password: "password123",
    username: "TestUser",
    token: "mock-jwt-token-12345",
    role:"student"
  },
];

const mockTokenKey = "mockToken";

// Simula una demora de red (2 segundos)
const networkDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockAuthService = {
  // Función de login simulada
  login: async (email, password) => {
    await networkDelay(1000); // Simula 1 segundo de latencia

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user == ROLES ) {
      console.log("LOGIN MOCK: Autenticación exitosa. Guardando token...");
      localStorage.setItem(mockTokenKey, user.token);
      return { token: user.token, username: user.username, role: user.role };
    } else {
      console.error("LOGIN MOCK: Credenciales incorrectas.");
      // Rechaza la promesa con un error, como lo haría axios con un 401
      return Promise.reject({
        response: { status: 401, data: { message: "Invalid credentials" } },
      });
    }
  },

  // Función de logout simulada
  logout: () => {
    console.log("LOGOUT MOCK: Token eliminado.");
    localStorage.removeItem(mockTokenKey);
  },

  // Función para verificar si hay un token simulado
  isAuthenticated: () => {
    return !!localStorage.getItem(mockTokenKey);
  },

  // Función para obtener el token simulado
  getToken: () => {
    return localStorage.getItem(mockTokenKey);
  },
};

export default mockAuthService;