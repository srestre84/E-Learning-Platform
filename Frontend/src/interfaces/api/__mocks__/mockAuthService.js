// src/services/mockAuthService.js

import { ROLES } from "@/shared/constants/roles";

// Simula la base de datos de usuarios
const mockUsers = [
  {
    email: "test@example.com",
    password: "password123",
    userName: "TestTeacher",
    lastName: "Teacher",
    token: "mock-jwt-token-teacher-12345",
    role: "teacher",
    occupation: "Instructor de Programación",
    avatar: "",
  },
  {
    email: "estudiante@example.com",
    password: "password123",
    userName: "Test",
    lastName: "Student",
    token: "mock-jwt-token-student-67890",
    role: "student",
    occupation: "Estudiante",
    avatar: "",
  },
  {
    email: "testadmin@example.com",
    password: "password123",
    userName: "TestAdmin",
    lastName: "Admin",
    token: "mock-jwt-token-admin-54321",
    role: "admin",
    occupation: "Administrador",
    avatar: "",
  }
];

const mockTokenKey = "mockToken";

// Simula una demora de red
const networkDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Safe localStorage access
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    } catch (e) {
      console.warn('Error accessing localStorage:', e);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Error setting localStorage:', e);
      return false;
    }
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('Error removing from localStorage:', e);
    }
  }
};

const mockAuthService = {
  // Función delogin simulada
  login: async (email, password) => {
    await networkDelay(500); // Simula 500ms de latencia

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      console.log("LOGIN MOCK: Autenticación exitosa. Guardando token...");
      safeLocalStorage.setItem(mockTokenKey, user.token);
      return {
        token: user.token,
        userName: user.userName,
        role: user.role,
        name: user.userName // Asegurarse de que el nombre esté incluido
      };
    } else {
      console.error("LOGIN MOCK: Credenciales incorrectas.");
      return Promise.reject({
        response: { status: 401, data: { message: "Credenciales inválidas" } },
      });
    }
  },

  // Registro simulado
  register: async ({ firstName, lastName, email, password, role = 'student'  }) => {
    await networkDelay(600);

    const exists = mockUsers.some(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (exists) {
      return Promise.reject({
        response: { status: 409, data: { message: 'El correo ya está registrado' } }
      });
    }

    const userName = `${firstName} ${lastName}`.trim() || email.split('@')[0];
    const token = `mock-jwt-token-${Date.now()}`;

    const newUser = { email, password, userName, token, role, occupation: '', avatar: '' };
    mockUsers.push(newUser);

    // No inicia sesión automáticamente para permitir redirigir al login
    return {
      userName,
      lastName,
      email,
      role,
    };
  },

  // Obtener perfil del usuario autenticado
  getProfile: async () => {
    await networkDelay(300);
    const token = safeLocalStorage.getItem(mockTokenKey);
    if (!token) return Promise.reject({ response: { status: 401, data: { message: 'No autenticado' } } });
    const user = mockUsers.find(u => u.token === token);
    if (!user) return Promise.reject({ response: { status: 401, data: { message: 'Token inválido' } } });
    const { userName, lastName, email, role, occupation = '', avatar = '' } = user;
    return { name: userName, lastName, email, role, occupation, avatar };
  },

  // Actualizar perfil del usuario autenticado
  updateProfile: async (updates) => {
    await networkDelay(500);
    const token = safeLocalStorage.getItem(mockTokenKey);
    if (!token) return Promise.reject({ response: { status: 401, data: { message: 'No autenticado' } } });
    const idx = mockUsers.findIndex(u => u.token === token);
    if (idx === -1) return Promise.reject({ response: { status: 401, data: { message: 'Token inválido' } } });

    const current = mockUsers[idx];

    // Validar cambio de email único
    if (updates?.email && updates.email !== current.email) {
      const exists = mockUsers.some(u => u.email.toLowerCase() === String(updates.email).toLowerCase());
      if (exists) return Promise.reject({ response: { status: 409, data: { message: 'El correo ya está en uso' } } });
    }

    const newUser = {
      ...current,
      userName: updates?.name ?? current.userName,
      lastName: updates?.lastName ?? current.lastName,
      email: updates?.email ?? current.email,
      occupation: updates?.occupation ?? current.occupation,
      avatar: updates?.avatar ?? current.avatar,
    };

    mockUsers[idx] = newUser;

    // Si se cambió el username, devolvemos los datos actualizados
    return {
      name: newUser.userName,
      email: newUser.email,
      lastName: newUser.lastName,
      role: newUser.role,
      occupation: newUser.occupation,
      avatar: newUser.avatar,
    };
  },

  // Función de logout simulada
  logout: () => {
    safeLocalStorage.removeItem(mockTokenKey);
    console.log("LOGOUT MOCK: Sesión cerrada");
  },

  // Función para verificar si hay un token simulado
  isAuthenticated: () => {
    return !!safeLocalStorage.getItem(mockTokenKey);
  },

  // Función para obtener el token simulado
  getToken: () => {
    return safeLocalStorage.getItem(mockTokenKey);
  },

  // Función para obtener los datos del usuario actual
  getCurrentUser: () => {
    const token = safeLocalStorage.getItem(mockTokenKey);
    console.log('Getting current user with token:', token);
    if (!token) {
      console.log('No token found');
      return null;
    }

    const user = mockUsers.find(u => u.token === token);
    if (!user) {
      console.log('No user found for token, clearing invalid token');
      safeLocalStorage.removeItem(mockTokenKey); // Token inválido, limpiar
      return null;
    }

    console.log('Found user:', { 
      userName: user.userName, 
      role: user.role,
      email: user.email 
    });

    return {
      userName: user.userName,
      email: user.email,
      lastName: user.lastName,
      role: user.role,
      name: user.userName,
      avatar: user.avatar
    };
  },
};

export { mockUsers };
export default mockAuthService;
