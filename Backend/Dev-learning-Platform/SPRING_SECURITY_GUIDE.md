# Guía de Spring Security con JWT - E-Learning Platform

## Configuración Implementada

### 1. Dependencias
- Spring Security incluido en `pom.xml`
- JWT (JSON Web Tokens) para autenticación stateless
- BCrypt para encriptación de contraseñas
- CORS configurado para desarrollo

### 2. Componentes Principales

#### SecurityConfig.java
- Configuración principal de seguridad
- Rutas públicas y protegidas definidas
- CORS habilitado
- CSRF deshabilitado para APIs REST
- Filtros JWT configurados

#### JwtTokenProvider.java
- Generación y validación de tokens JWT
- Configuración de expiración y firma
- Extracción de información del token

#### JwtAuthenticationFilter.java
- Middleware de autenticación JWT
- Intercepta requests y valida tokens
- Establece contexto de seguridad

#### RequestLoggingMiddleware.java
- Middleware de logging y auditoría
- Registra requests y responses
- Filtra información sensible

#### CustomUserDetailsService.java
- Servicio personalizado para cargar usuarios desde la base de datos
- Convierte usuarios de la aplicación a UserDetails de Spring Security

#### AuthController.java
- Endpoints de autenticación (`/api/auth/**`)
- Login y registro de usuarios
- Generación de tokens JWT
- Validación de tokens

### 3. Endpoints Disponibles

#### Públicos (sin autenticación)
```
GET  /api/public/hello
GET  /api/public/info
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/test
POST /api/auth/validate
```

#### Autenticación y Refresh Tokens
```
POST /api/auth/refresh          # Renovar access token
POST /api/auth/logout           # Logout (revocar refresh token)
POST /api/auth/logout-all       # Logout de todos los dispositivos
GET  /api/refresh-tokens/my-tokens    # Ver tokens activos
DELETE /api/refresh-tokens/revoke/{tokenId}  # Revocar token específico
DELETE /api/refresh-tokens/revoke-all        # Revocar todos los tokens
GET  /api/refresh-tokens/stats               # Estadísticas de tokens
```

#### Protegidos (requieren autenticación JWT)
```
GET  /api/users/me
GET  /api/users/profile
GET  /api/protected/profile
GET  /api/protected/dashboard
POST /api/protected/update
GET  /api/jwt-test/info
GET  /api/jwt-test/protected-data
POST /api/jwt-test/refresh-token
```

### 4. Flujo de Autenticación

1. **Registro**: `POST /api/auth/register`
   ```json
   {
     "userName": "Juan",
     "lastName": "Pérez",
     "email": "juan@example.com",
     "password": "123456"
   }
   ```

2. **Login**: `POST /api/auth/login`
   ```json
   {
     "email": "juan@example.com",
     "password": "123456"
   }
   ```

3. **Respuesta de login**:
   ```json
   {
     "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqdWFuQGV4YW1wbGUuY29tIiwiaWF0IjoxNjM5NzQ5NjAwLCJleHAiOjE2Mzk4MzYwMDB9.signature",
     "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
     "email": "juan@example.com",
     "role": "STUDENT",
     "message": "Login exitoso",
     "tokenType": "Bearer",
     "expiresIn": 3600000
   }
   ```

4. **Renovar access token**:
   ```json
   POST /api/auth/refresh
   {
     "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
   }
   ```

5. **Respuesta de refresh**:
   ```json
   {
     "accessToken": "eyJhbGciOiJIUzUxMiJ9.newTokenSignature",
     "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
     "tokenType": "Bearer",
     "expiresIn": 3600000,
     "message": "Token renovado exitosamente"
   }
   ```

### 5. Roles de Usuario
- `STUDENT`: Estudiante (por defecto)
- `INSTRUCTOR`: Instructor
- `ADMIN`: Administrador

### 6. Características JWT y Refresh Tokens Implementadas

#### Funcionalidades JWT
- ✅ Generación de tokens JWT seguros
- ✅ Validación automática de tokens
- ✅ Middleware de autenticación JWT
- ✅ Refresh tokens con expiración extendida
- ✅ Logging y auditoría de requests
- ✅ Configuración de expiración personalizable

#### Funcionalidades Refresh Tokens
- ✅ Generación automática de refresh tokens
- ✅ Límite de tokens activos por usuario (5 por defecto)
- ✅ Revocación individual y masiva de tokens
- ✅ Limpieza automática de tokens expirados
- ✅ Tracking de IP y User-Agent
- ✅ Estadísticas de uso de tokens

#### Seguridad Implementada
- ✅ Tokens firmados con HMAC-SHA512
- ✅ Validación de expiración automática
- ✅ Filtrado de información sensible en logs
- ✅ Headers de autorización Bearer
- ✅ Manejo de errores de autenticación
- ✅ Rotación automática de tokens antiguos

### 7. Próximos Pasos Recomendados

#### Mejorar Seguridad
1. Implementar rate limiting
2. Agregar validación de contraseñas más robusta
3. Implementar blacklist de tokens
4. Agregar auditoría de acciones específicas

#### Funcionalidades Adicionales
1. Recuperación de contraseña
2. Verificación de email
3. Roles más granulares con permisos
4. Multi-factor authentication (MFA)

### 8. Pruebas JWT

#### Con cURL
```bash
# 1. Registrar usuario
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"userName":"Test","lastName":"User","email":"test@example.com","password":"123456"}'

# 2. Login y obtener token JWT
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# 3. Validar token
curl -X POST http://localhost:8080/api/auth/validate \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"

# 4. Acceder a endpoint protegido con JWT
curl -X GET http://localhost:8080/api/protected/profile \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"

# 5. Obtener información del token
curl -X GET http://localhost:8080/api/jwt-test/info \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"

# 6. Renovar access token con refresh token
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"TU_REFRESH_TOKEN_AQUI"}'

# 7. Logout (revocar refresh token)
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"TU_REFRESH_TOKEN_AQUI"}'

# 8. Ver tokens activos
curl -X GET http://localhost:8080/api/refresh-tokens/my-tokens \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI"

# 9. Revocar token específico
curl -X DELETE http://localhost:8080/api/refresh-tokens/revoke/TOKEN_ID \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI"

#### Ejemplo de Flujo Completo
```bash
# 1. Login
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}')

# 2. Extraer tokens
ACCESS_TOKEN=$(echo $RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
REFRESH_TOKEN=$(echo $RESPONSE | grep -o '"refreshToken":"[^"]*"' | cut -d'"' -f4)

# 3. Usar access token
curl -X GET http://localhost:8080/api/protected/profile \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# 4. Renovar access token cuando expire
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"

### 9. Configuración de Base de Datos

Asegúrate de que tu `application.properties` tenga la configuración correcta de la base de datos y que las tablas se creen automáticamente:

```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 10. Configuración JWT y Refresh Tokens

Las propiedades JWT están configuradas en `application.properties`:

```properties
# JWT Configuration
jwt.secret=tuClaveSecretaMuyLargaYSeguraParaJWTEnProduccionCambiarla
jwt.expiration=3600000        # 1 hora en milisegundos (access token)
jwt.refresh-expiration=604800000  # 7 días en milisegundos (refresh token)
jwt.max-refresh-tokens-per-user=5  # Máximo 5 tokens activos por usuario
```

### 11. Notas Importantes

- Las contraseñas se encriptan automáticamente con BCrypt
- Los access tokens JWT tienen expiración de 1 hora por defecto
- Los refresh tokens tienen expiración de 7 días por defecto
- Máximo 5 refresh tokens activos por usuario (rotación automática)
- Los endpoints de autenticación están en `/api/auth/**`
- Los endpoints públicos están en `/api/public/**`
- Todos los demás endpoints requieren autenticación JWT
- CORS está configurado para permitir todas las origenes en desarrollo
- El middleware de logging registra todas las requests (excepto recursos estáticos)
- Los tokens JWT se firman con HMAC-SHA512 para máxima seguridad
- Limpieza automática de tokens expirados cada 24 horas
- Tracking de IP y User-Agent para auditoría de seguridad
