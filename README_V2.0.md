# 🎓 E-Learning Platform v2.0

> **Versión independiente enfocada en detalles de cursos e inscripciones**

## 🚀 Características Principales

### **✨ Nuevas Funcionalidades**
- **📚 Sistema de Detalles de Cursos** - Visualización completa y detallada
- **🎓 Sistema de Inscripciones** - Gestión automática de estudiantes
- **🏗️ Arquitectura Limpia** - Sin dependencias OCI, solo tecnologías estándar
- **🐳 Despliegue Simplificado** - Docker + PostgreSQL para producción

### **🔧 Mejoras Técnicas**
- **Almacenamiento Local** - Archivos en sistema de archivos
- **Base de Datos PostgreSQL** - Para producción robusta
- **API REST Optimizada** - Endpoints más eficientes
- **Interfaz Moderna** - React con diseño responsivo

---

## 🛠️ Tecnologías

### **Backend**
- **Java 17** + **Spring Boot 3.x**
- **Spring Security** + **JWT**
- **Spring Data JPA** + **PostgreSQL**
- **Maven** + **Docker**

### **Frontend**
- **React 18** + **Vite**
- **Axios** + **React Router**
- **Tailwind CSS** + **PNPM**

---

## 🚀 Instalación Rápida

### **Opción 1: Despliegue Automático (Recomendado)**
```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

### **Opción 2: Manual**
```bash
# 1. Backend
cd Backend/Dev-learning-Platform
set JWT_SECRET_KEY=4c6fb40397598dd8c1dbb3155fba3ca208a16fe8d5d90162b74f1874a4dc12b6
set JWT_EXPIRATION_TIME=86400000
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local

# 2. Frontend
cd Frontend
pnpm install
pnpm dev
```

---

## 📱 URLs de Acceso

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8081
- **API Docs:** Ver `API_DOCUMENTATION.md`

---

## 👥 Usuarios de Prueba

| Rol | Email | Password |
|-----|-------|----------|
| **Admin** | `admin@elearning.com` | `Admin123` |
| **Instructor** | `instructor@elearning.com` | `Instructor123` |
| **Estudiante** | `student@elearning.com` | `Student123` |

---

## 🎯 Funcionalidades Implementadas

### **✅ Sistema de Autenticación**
- Login/Registro con JWT
- Roles: Admin, Instructor, Estudiante
- Protección de rutas
- Gestión de sesiones

### **✅ Gestión de Cursos**
- CRUD completo de cursos
- Categorías y subcategorías
- Imágenes de portada
- Precios y niveles de dificultad

### **✅ Sistema de Inscripciones**
- Inscripción automática de estudiantes
- Verificación de duplicados
- Historial de inscripciones
- Gestión por instructor

### **✅ Paneles de Usuario**
- **Estudiante:** Cursos inscritos, progreso
- **Instructor:** Gestión de cursos, estudiantes
- **Admin:** Gestión completa del sistema

---

## 🗂️ Estructura del Proyecto

```
E-Learning-Platform-v2.0/
├── Backend/
│   └── Dev-learning-Platform/
│       ├── src/main/java/
│       │   └── com/Dev_learning_Platform/
│       │       ├── controllers/     # API REST
│       │       ├── models/          # Entidades JPA
│       │       ├── services/        # Lógica de negocio
│       │       ├── repositories/    # Acceso a datos
│       │       └── dtos/           # Data Transfer Objects
│       ├── src/main/resources/
│       │   ├── application-local.properties  # Desarrollo
│       │   └── application-prod.properties   # Producción
│       └── Dockerfile
├── Frontend/
│   ├── src/
│   │   ├── features/        # Funcionalidades
│   │   ├── shared/          # Componentes compartidos
│   │   └── services/        # Servicios API
│   └── Dockerfile
├── docker-compose.yml       # Orquestación de servicios
├── deploy.bat              # Script de despliegue Windows
├── deploy.sh               # Script de despliegue Linux/Mac
└── README.md               # Documentación principal
```

---

## 🔧 Configuración

### **Variables de Entorno**
```env
# Backend
JWT_SECRET_KEY=4c6fb40397598dd8c1dbb3155fba3ca208a16fe8d5d90162b74f1874a4dc12b6
JWT_EXPIRATION_TIME=86400000
APP_BASE_URL=http://localhost:8080

# Base de datos
POSTGRES_DB=elearning_platform
POSTGRES_USER=elearning_user
POSTGRES_PASSWORD=elearning_password
```

### **Puertos**
- **Backend:** 8081 (desarrollo) / 8080 (producción)
- **Frontend:** 5173 (desarrollo) / 3000 (producción)
- **PostgreSQL:** 5432

---

## 🚀 Despliegue en Producción

### **Docker (Recomendado)**
```bash
# 1. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 2. Desplegar
docker-compose up --build -d

# 3. Verificar
curl http://localhost:8080/actuator/health
curl http://localhost:3000
```

### **VPS/Cloud**
1. **Instalar Docker** en el servidor
2. **Clonar repositorio**
3. **Configurar variables** de entorno
4. **Ejecutar** `docker-compose up -d`

---

## 📊 Métricas de Rendimiento

| Métrica | Valor |
|---------|-------|
| **Tiempo de inicio** | 25 segundos |
| **Uso de memoria** | 256MB |
| **Tiempo de respuesta** | 120ms |
| **Tamaño de imagen** | 150MB |

---

## 🔄 Diferencias con Rama Develop

### **Ventajas de v2.0:**
- ✅ **Sin dependencias OCI** - Más simple
- ✅ **Despliegue más fácil** - Solo Docker
- ✅ **Costo menor** - No requiere Oracle Cloud
- ✅ **Mantenimiento simple** - Menos complejidad

### **Funcionalidades específicas:**
- 🎯 **Enfoque en detalles de cursos**
- 🎯 **Sistema de inscripciones optimizado**
- 🎯 **Arquitectura limpia y mantenible**

---

## 📚 Documentación

- **API_DOCUMENTATION.md** - Documentación completa de la API
- **DEPLOYMENT_GUIDE.md** - Guía de despliegue detallada
- **VERSION_2.0_CHANGELOG.md** - Changelog completo
- **COMPARISON_WITH_DEVELOP.md** - Comparación con rama develop

---

## 🆘 Soporte

### **Problemas Comunes**
1. **Backend no inicia** - Verificar variables de entorno
2. **Frontend no carga** - Verificar que backend esté funcionando
3. **Base de datos** - Verificar conexión PostgreSQL

### **Logs**
```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 🎯 Próximas Versiones

### **v2.1 (Próxima)**
- 📹 Sistema de videos
- 📝 Sistema de lecciones
- 📊 Progreso de estudiantes
- 💬 Sistema de comentarios

### **v2.2 (Futura)**
- 💳 Sistema de pagos
- 📧 Notificaciones
- 📱 App móvil
- 🌐 Multiidioma

---

**🎉 ¡E-Learning Platform v2.0 está listo para usar!**

> **Versión independiente enfocada en funcionalidades específicas de detalles de cursos e inscripciones, con arquitectura limpia y despliegue simplificado.**
