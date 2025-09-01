# API Documentation - E-Learning Platform Backend

## 📋 Información General

**Base URL:** `http://localhost:8080`  
**Versión:** 1.0  
**Tipo de Autenticación:** JWT (JSON Web Tokens)  
**Content-Type:** `application/json`  

## Comando para ejecutar backend en entorno de desarrollo
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

## 🔐 Endpoints de Autenticación

### 1. Login de Usuario
**Endpoint:** `POST /auth/login`  
**Descripción:** Autentica usuario y retorna token JWT  
**Acceso:** Público  

#### Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Validaciones:
- **email:** Requerido, formato email válido, máximo 100 caracteres
- **password:** Requerido, mínimo 6 caracteres, máximo 100 caracteres

#### Response Exitoso (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": 1,
  "userName": "Juan",
  "email": "user@example.com",
  "role": "STUDENT",
  "isActive": true
}
```

#### Response de Error (401 Unauthorized):
```json
{
  "message": "Las credenciales proporcionadas son incorrectas",
  "error": "INVALID_CREDENTIALS",
  "status": 401,
  "timestamp": "2025-01-01T10:00:00",
  "path": "/auth/login"
}
```

#### Response de Usuario Inactivo (403 Forbidden):
```json
{
  "message": "Tu cuenta está temporalmente inactiva",
  "error": "USER_INACTIVE",
  "status": 403,
  "timestamp": "2025-01-01T10:00:00",
  "path": "/auth/login"
}
```

### 2. Validación de Token
**Endpoint:** `GET /auth/validate?token={jwt_token}`  
**Descripción:** Valida si un token JWT es válido  
**Acceso:** Público  

#### Query Parameters:
- **token** (requerido): Token JWT a validar

#### Response Token Válido (200 OK):
```json
{
  "valid": true,
  "username": "user@example.com"
}
```

#### Response Token Inválido (401 Unauthorized):
```json
{
  "valid": false,
  "message": "Token inválido o expirado"
}
```

## 👥 Endpoints de Usuarios

### 3. Registro de Usuario
**Endpoint:** `POST /api/users/register`  
**Descripción:** Registra un nuevo usuario en el sistema  
**Acceso:** Público  

#### Request Body:
```json
{
  "userName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

#### Campos:
- **userName:** Nombre del usuario (requerido)
- **lastName:** Apellido del usuario (requerido)
- **email:** Email único (requerido, formato email)
- **password:** Contraseña (requerido, se encripta automáticamente)
- **role:** Rol del usuario - `STUDENT`, `INSTRUCTOR`, `ADMIN`

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "userName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "role": "STUDENT",
  "isActive": true,
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T10:00:00.000+00:00"
}
```

#### Nota Importante:
Si el email ya existe, retorna el usuario existente (200 OK) en lugar de crear uno nuevo.

## 🔒 Autenticación JWT

### Headers Requeridos para Endpoints Protegidos
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Configuración de Token
- **Algoritmo:** HMAC-SHA256
- **Expiración:** 24 horas (86400000 ms)
- **Tipo:** Bearer Token
- **Header:** `Authorization: Bearer <token>`

## 🗂️ Modelos de Datos

### Usuario (User)
```json
{
  "id": "number",
  "userName": "string",
  "lastName": "string", 
  "email": "string (unique)",
  "password": "string (encrypted)",
  "role": "STUDENT | INSTRUCTOR | ADMIN",
  "isActive": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Roles Disponibles
- **STUDENT:** Estudiante de la plataforma
- **INSTRUCTOR:** Instructor que puede crear cursos
- **ADMIN:** Administrador con acceso completo

## 🚨 Códigos de Estado HTTP

### Códigos de Éxito
- **200 OK:** Operación exitosa
- **201 Created:** Recurso creado exitosamente

### Códigos de Error del Cliente
- **400 Bad Request:** Datos de entrada inválidos
- **401 Unauthorized:** Token ausente, inválido o expirado
- **403 Forbidden:** Usuario inactivo o sin permisos
- **404 Not Found:** Recurso no encontrado
- **409 Conflict:** Conflicto de datos (ej: email duplicado)

### Códigos de Error del Servidor
- **500 Internal Server Error:** Error interno del servidor

## 🔧 Configuración de Desarrollo

### Base de Datos H2 (Desarrollo)
- **URL:** `http://localhost:8080/h2-console`
- **JDBC URL:** `jdbc:h2:mem:testdb`
- **Username:** `sa`
- **Password:** `password`

### Variables de Entorno
```properties
JWT_SECRET_KEY=your-secret-key-here
JWT_EXPIRATION_TIME=86400000
```

## 🧪 Ejemplos de Testing

### 1. Prueba de Login (cURL)
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 2. Prueba de Registro (cURL)
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Juan",
    "lastName": "Pérez", 
    "email": "juan.perez@example.com",
    "password": "password123",
    "role": "STUDENT"
  }'
```

### 3. Acceso a Endpoint Protegido (cURL)
```bash
curl -X GET http://localhost:8080/api/protected-endpoint \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Validación de Token (cURL)
```bash
curl -X GET "http://localhost:8080/auth/validate?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📱 Integración con Frontend

### Flujo de Autenticación Recomendado
1. **Login:** Usuario ingresa credenciales
2. **Almacenar Token:** Guardar JWT en localStorage/sessionStorage
3. **Requests:** Incluir token en header Authorization
4. **Validación:** Verificar token antes de operaciones sensibles
5. **Logout:** Eliminar token del storage

### Ejemplo JavaScript (React)
```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('token', data.token);
    return data;
  } else {
    throw new Error(data.message);
  }
};

// Request autenticado
const fetchProtectedData = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8080/api/protected-endpoint', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.json();
};
```

## 🛡️ Seguridad y Validaciones

### Validaciones de Backend
- **Email:** Formato válido, único en sistema
- **Password:** Mínimo 6 caracteres, encriptación BCrypt
- **Token JWT:** Validación de firma y expiración
- **CORS:** Configurado para aceptar todos los orígenes (desarrollo)

### Recomendaciones de Seguridad
- **HTTPS:** Usar en producción
- **Token Storage:** Evitar localStorage en producción, usar httpOnly cookies
- **Rate Limiting:** Implementar límites de requests
- **Validation:** Validar siempre datos de entrada
- **Error Handling:** No exponer información sensible en errores

## 🔄 Estados de Endpoints

### Endpoints Públicos (No requieren autenticación)
- `POST /auth/login` - Login de usuario
- `GET /auth/validate` - Validación de token
- `POST /api/users/register` - Registro de usuario
- `GET /h2-console/**` - Consola H2 (solo desarrollo)
- `GET /actuator/health` - Health check

### Endpoints Protegidos (Requieren JWT)
- Todos los demás endpoints bajo `/api/**`
- Cualquier endpoint no listado como público

## 📊 Monitoreo y Logging

### Health Check
**Endpoint:** `GET /actuator/health`  
**Descripción:** Verifica el estado del servidor  
**Acceso:** Público  

#### Response:
```json
{
  "status": "UP"
}
```

### Logs Disponibles
- **Login attempts:** Intentos de autenticación
- **Token validation:** Validación de tokens
- **Security events:** Eventos de seguridad
- **Error tracking:** Seguimiento de errores

## 🚀 Despliegue

### Entornos
- **Desarrollo:** H2 Database, CORS abierto
- **Producción:** MySQL Database, CORS restringido

### Variables de Producción
```properties
# Database
SPRING_DATASOURCE_URL=jdbc:mysql://host:port/database
SPRING_DATASOURCE_USERNAME=username
SPRING_DATASOURCE_PASSWORD=password

# JWT
JWT_SECRET_KEY=production-secret-key-256-bits
JWT_EXPIRATION_TIME=86400000

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

---

*Documentación de API actualizada: Septiembre 2025*  
*Versión: 1.0*  
*Backend: Java 21 + Spring Boot 3.x*  
*Mantenida por: E-Learning Platform Team*
