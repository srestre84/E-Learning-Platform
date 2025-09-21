# 📚 E-Learning Platform - API Documentation

## 🌐 Información General

**Base URL:** `http://localhost:8081`  
**Versión:** 1.0  
**Autenticación:** JWT (JSON Web Tokens)  
**Content-Type:** `application/json`  

---

## 🔐 Autenticación

### POST /auth/login
**Descripción:** Iniciar sesión de usuario  
**Autenticación:** No requerida  
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "userId": 1,
  "userName": "Juan",
  "email": "user@example.com",
  "role": "STUDENT",
  "active": true
}
```

### GET /auth/validate
**Descripción:** Validar token JWT  
**Autenticación:** No requerida  
**Parámetros:** `token` (query parameter)  
**Respuesta exitosa (200):**
```json
{
  "valid": true,
  "username": "user@example.com"
}
```

---

## 👥 Usuarios

### POST /api/users/register
**Descripción:** Registrar nuevo usuario  
**Autenticación:** No requerida  
**Body:**
```json
{
  "userName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "Password123",
  "role": "STUDENT"
}
```

### GET /api/users/{id}
**Descripción:** Obtener usuario por ID  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### GET /api/users/role/{role}
**Descripción:** Obtener usuarios por rol  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### GET /api/users/all
**Descripción:** Obtener todos los usuarios  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### GET /api/users/profile
**Descripción:** Obtener perfil del usuario autenticado  
**Autenticación:** Requerida  
**Headers:** `Authorization: Bearer {token}`

### PUT /api/users/profile
**Descripción:** Actualizar perfil del usuario autenticado  
**Autenticación:** Requerida  
**Headers:** `Authorization: Bearer {token}`

### POST /api/users/profile/upload-image
**Descripción:** Subir imagen de perfil  
**Autenticación:** Requerida  
**Headers:** `Authorization: Bearer {token}`  
**Content-Type:** `multipart/form-data`  
**Body:** `file` (imagen JPG/PNG, máx. 5MB)

---

## 📚 Cursos

### POST /api/courses
**Descripción:** Crear nuevo curso  
**Autenticación:** INSTRUCTOR o ADMIN  
**Headers:** `Authorization: Bearer {token}`  
**Body:**
```json
{
  "title": "Curso de React",
  "description": "Aprende React desde cero",
  "shortDescription": "Curso completo de React",
  "price": 99.99,
  "isPremium": true,
  "estimatedHours": 20,
  "level": "INTERMEDIATE",
  "categoryId": 1,
  "subcategoryId": 1
}
```

### GET /api/courses
**Descripción:** Obtener catálogo público de cursos (paginado)  
**Autenticación:** No requerida  
**Parámetros:**
- `page` (default: 0)
- `size` (default: 20, máx: 100)
- `sortBy` (default: "createdAt")
- `sortDir` (default: "desc")

### GET /api/courses/{id}
**Descripción:** Obtener detalle de curso  
**Autenticación:** No requerida

### GET /api/courses/instructor/{instructorId}
**Descripción:** Obtener cursos por instructor  
**Autenticación:** INSTRUCTOR o ADMIN  
**Headers:** `Authorization: Bearer {token}`

### GET /api/courses/admin/active
**Descripción:** Obtener todos los cursos activos (administración)  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### GET /api/courses/category/{categoryId}
**Descripción:** Obtener cursos por categoría  
**Autenticación:** No requerida

### GET /api/courses/subcategory/{subcategoryId}
**Descripción:** Obtener cursos por subcategoría  
**Autenticación:** No requerida

### GET /api/courses/category/{categoryId}/subcategory/{subcategoryId}
**Descripción:** Obtener cursos por categoría y subcategoría  
**Autenticación:** No requerida

### GET /api/courses/level/{level}
**Descripción:** Obtener cursos por nivel  
**Autenticación:** No requerida  
**Niveles:** BEGINNER, INTERMEDIATE, ADVANCED

### PUT /api/courses/{courseId}
**Descripción:** Actualizar curso  
**Autenticación:** INSTRUCTOR o ADMIN  
**Headers:** `Authorization: Bearer {token}`

### DELETE /api/courses/{courseId}
**Descripción:** Eliminar curso  
**Autenticación:** INSTRUCTOR o ADMIN  
**Headers:** `Authorization: Bearer {token}`

### PATCH /api/courses/{courseId}/publish
**Descripción:** Cambiar estado de publicación del curso  
**Autenticación:** INSTRUCTOR o ADMIN  
**Headers:** `Authorization: Bearer {token}`

### POST /api/courses/upload-image
**Descripción:** Subir imagen de portada del curso  
**Autenticación:** INSTRUCTOR o ADMIN  
**Headers:** `Authorization: Bearer {token}`  
**Content-Type:** `multipart/form-data`  
**Body:** `file` (imagen JPG/PNG, máx. 5MB)

---

## 🏷️ Categorías

### GET /api/categories
**Descripción:** Obtener todas las categorías activas  
**Autenticación:** No requerida

### GET /api/categories/all
**Descripción:** Obtener todas las categorías (activas e inactivas)  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### GET /api/categories/{id}
**Descripción:** Obtener categoría por ID  
**Autenticación:** No requerida

### GET /api/categories/search
**Descripción:** Buscar categorías  
**Autenticación:** No requerida  
**Parámetros:** `q` (query de búsqueda)

### POST /api/categories
**Descripción:** Crear nueva categoría  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### PUT /api/categories/{id}
**Descripción:** Actualizar categoría  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### DELETE /api/categories/{id}
**Descripción:** Eliminar categoría (soft delete)  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### DELETE /api/categories/{id}/permanent
**Descripción:** Eliminar categoría permanentemente  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### PUT /api/categories/{id}/activate
**Descripción:** Activar categoría  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### PUT /api/categories/{id}/deactivate
**Descripción:** Desactivar categoría  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

---

## 🏷️ Subcategorías

### GET /api/subcategories
**Descripción:** Obtener todas las subcategorías activas  
**Autenticación:** No requerida

### GET /api/subcategories/all
**Descripción:** Obtener todas las subcategorías (activas e inactivas)  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### GET /api/subcategories/{id}
**Descripción:** Obtener subcategoría por ID  
**Autenticación:** No requerida

### GET /api/subcategories/category/{categoryId}
**Descripción:** Obtener subcategorías por categoría  
**Autenticación:** No requerida

### GET /api/subcategories/search
**Descripción:** Buscar subcategorías  
**Autenticación:** No requerida  
**Parámetros:** `q` (query de búsqueda)

### POST /api/subcategories
**Descripción:** Crear nueva subcategoría  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### PUT /api/subcategories/{id}
**Descripción:** Actualizar subcategoría  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### DELETE /api/subcategories/{id}
**Descripción:** Eliminar subcategoría (soft delete)  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### DELETE /api/subcategories/{id}/permanent
**Descripción:** Eliminar subcategoría permanentemente  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### PUT /api/subcategories/{id}/activate
**Descripción:** Activar subcategoría  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### PUT /api/subcategories/{id}/deactivate
**Descripción:** Desactivar subcategoría  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

---

## 🎓 Inscripciones

### POST /api/enrollments
**Descripción:** Inscribirse en un curso  
**Autenticación:** Requerida  
**Headers:** `Authorization: Bearer {token}`  
**Body:**
```json
{
  "courseId": 1
}
```

### GET /api/enrollments/my-courses
**Descripción:** Obtener cursos del estudiante autenticado  
**Autenticación:** Requerida  
**Headers:** `Authorization: Bearer {token}`

### GET /api/enrollments/stats
**Descripción:** Obtener estadísticas de inscripciones  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

### GET /api/enrollments/recent
**Descripción:** Obtener inscripciones recientes  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

---

## 📊 Estadísticas Administrativas

### GET /api/admin/stats
**Descripción:** Obtener estadísticas generales del sistema  
**Autenticación:** ADMIN  
**Headers:** `Authorization: Bearer {token}`

---

## 🎥 Videos de Curso

### POST /api/course-videos
**Descripción:** Agregar video a curso  
**Autenticación:** INSTRUCTOR  
**Headers:** `Authorization: Bearer {token}`

### GET /api/course-videos/course/{courseId}
**Descripción:** Obtener videos de un curso  
**Autenticación:** No requerida

### GET /api/course-videos/{videoId}
**Descripción:** Obtener detalle de video  
**Autenticación:** No requerida

---

## 🔧 Endpoints de Sistema

### GET /h2-console/**
**Descripción:** Consola de base de datos H2 (solo desarrollo)  
**Autenticación:** No requerida

### GET /actuator/health
**Descripción:** Health check del sistema  
**Autenticación:** No requerida

---

## 📝 Códigos de Estado HTTP

- **200 OK:** Solicitud exitosa
- **201 Created:** Recurso creado exitosamente
- **400 Bad Request:** Solicitud malformada
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** Sin permisos
- **404 Not Found:** Recurso no encontrado
- **409 Conflict:** Conflicto (ej: email duplicado)
- **500 Internal Server Error:** Error interno del servidor

---

## 🔑 Roles de Usuario

- **STUDENT:** Estudiante (puede inscribirse en cursos)
- **INSTRUCTOR:** Instructor (puede crear y gestionar cursos)
- **ADMIN:** Administrador (acceso completo al sistema)

---

## 📋 Ejemplos de Uso

### 1. Login y obtener token
```bash
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"instructor@test.com","password":"Password123"}'
```

### 2. Obtener cursos públicos
```bash
curl http://localhost:8081/api/courses
```

### 3. Crear curso (requiere autenticación)
```bash
curl -X POST http://localhost:8081/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Mi Curso",
    "description": "Descripción del curso",
    "price": 99.99,
    "categoryId": 1,
    "subcategoryId": 1
  }'
```

### 4. Inscribirse en curso
```bash
curl -X POST http://localhost:8081/api/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"courseId": 1}'
```
