# 🚀 E-Learning Platform v2.0 - Deploy en Producción

## 📋 Resumen del Deploy

Este documento describe cómo desplegar la **E-Learning Platform v2.0** en producción usando:
- **Backend**: Railway (PostgreSQL + Java Spring Boot)
- **Frontend**: Vercel (React + Vite)

## 🎯 URLs de Producción

- **Frontend**: https://e-learning-platform-v2.vercel.app
- **Backend API**: https://e-learning-platform-backend.railway.app
- **Repositorio**: https://github.com/Juan-Valenzuela3/E-Learning-Platform

## 🛠️ Pasos para Deploy

### 1. **Preparación del Backend (Railway)**

#### 1.1 Instalar Railway CLI
```bash
npm install -g @railway/cli
railway login
```

#### 1.2 Configurar el Proyecto
```bash
cd Backend/Dev-learning-Platform
railway init
railway link
```

#### 1.3 Configurar Variables de Entorno en Railway
```bash
# Variables requeridas en Railway Dashboard:
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET_KEY=4c6fb40397598dd8c1dbb3155fba3ca208a16fe8d5d90162b74f1874a4dc12b6
JWT_EXPIRATION_TIME=86400000
FRONTEND_URL=https://e-learning-platform-v2.vercel.app
```

#### 1.4 Deploy del Backend
```bash
railway up
```

### 2. **Preparación del Frontend (Vercel)**

#### 2.1 Instalar Vercel CLI
```bash
npm install -g vercel
vercel login
```

#### 2.2 Configurar el Proyecto
```bash
cd Frontend
vercel init
```

#### 2.3 Configurar Variables de Entorno en Vercel
```bash
# Variables requeridas en Vercel Dashboard:
VITE_API_BASE_URL=https://e-learning-platform-backend.railway.app/api
VITE_APP_NAME=E-Learning Platform v2.0
VITE_APP_VERSION=2.0.0
```

#### 2.4 Deploy del Frontend
```bash
vercel --prod
```

## 🔧 Configuración Automática

### Script de Deploy Completo
```bash
# Ejecutar desde la raíz del proyecto
chmod +x deploy-production.sh
./deploy-production.sh
```

## 📊 Arquitectura de Producción

```mermaid
graph TB
    A[Usuario] --> B[Vercel Frontend]
    B --> C[Railway Backend]
    C --> D[PostgreSQL Database]
    C --> E[File Storage]
    
    subgraph "Frontend (Vercel)"
        B1[React App]
        B2[Static Assets]
        B3[CDN]
    end
    
    subgraph "Backend (Railway)"
        C1[Spring Boot API]
        C2[JWT Authentication]
        C3[File Upload Service]
    end
    
    subgraph "Database (Railway PostgreSQL)"
        D1[Users]
        D2[Courses]
        D3[Enrollments]
        D4[Categories]
    end
```

## 🔐 Seguridad en Producción

### Variables de Entorno Sensibles
- `JWT_SECRET_KEY`: Clave secreta para JWT (cambiar en producción)
- `DATABASE_URL`: URL de conexión a PostgreSQL
- `DB_PASSWORD`: Contraseña de la base de datos

### Configuraciones de Seguridad
- CORS configurado para el dominio de Vercel
- JWT con expiración de 24 horas
- Validación de archivos en uploads
- Health checks configurados

## 📈 Monitoreo y Logs

### Railway (Backend)
- Logs disponibles en Railway Dashboard
- Métricas de CPU y memoria
- Health checks automáticos

### Vercel (Frontend)
- Analytics de Vercel
- Logs de función en Vercel Dashboard
- Métricas de rendimiento

## 🚨 Troubleshooting

### Problemas Comunes

#### Backend no inicia
```bash
# Verificar logs en Railway
railway logs

# Verificar variables de entorno
railway variables
```

#### Frontend no conecta con Backend
```bash
# Verificar CORS en backend
curl -H "Origin: https://e-learning-platform-v2.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://e-learning-platform-backend.railway.app/api/courses
```

#### Base de datos no conecta
```bash
# Verificar DATABASE_URL en Railway
railway variables | grep DATABASE_URL
```

## 🔄 Actualizaciones

### Actualizar Backend
```bash
cd Backend/Dev-learning-Platform
git pull origin feature/v2.0-course-details-enrollment
railway up
```

### Actualizar Frontend
```bash
cd Frontend
git pull origin feature/v2.0-course-details-enrollment
vercel --prod
```

## 📞 Soporte

- **Documentación API**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Guía de Desarrollo**: [README_V2.0.md](./README_V2.0.md)
- **Changelog**: [VERSION_2.0_CHANGELOG.md](./VERSION_2.0_CHANGELOG.md)

## 🎉 ¡Deploy Completado!

Una vez completado el deploy, tendrás:
- ✅ Backend funcionando en Railway
- ✅ Frontend funcionando en Vercel
- ✅ Base de datos PostgreSQL persistente
- ✅ Sistema completo de cursos e inscripciones
- ✅ Autenticación JWT funcionando
- ✅ Upload de archivos funcionando

**¡Tu plataforma E-Learning v2.0 estará lista para usar en producción!** 🚀
