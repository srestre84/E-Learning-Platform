# Object Storage API

## Subir Imagen de Perfil

**Endpoint:** `POST /api/users/profile/upload-image`

**Autenticación:** JWT Token requerido

### Datos requeridos:
- `file`: Archivo de imagen (JPG, PNG, WEBP, máx. 5MB)

### Ejemplo con cURL:

```bash
# 1. Obtener token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@test.com","password":"password123"}'

# 2. Subir imagen
curl -X POST http://localhost:8080/api/users/profile/upload-image \
  -H "Authorization: Bearer TU_JWT_TOKEN_AQUI" \
  -F "file=@ruta/a/tu/imagen.jpg"
```

### Respuesta exitosa (200):
```json
{
  "id": 1,
  "userName": "Juan",
  "lastName": "Pérez", 
  "email": "juan.perez@email.com",
  "role": "STUDENT",
  "profileImageUrl": "https://objectstorage.sa-bogota-1.oraclecloud.com/n/axxillutcfyk/b/bucket-images/o/profile-images/user_1_a1b2c3d4.jpg",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T14:45:00"
}
```

### Respuesta de error (400):
```json
{
  "error": "El archivo excede el tamaño máximo permitido (5MB)"
}
```