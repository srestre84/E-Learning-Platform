# 🚀 Guía de Despliegue - E-Learning Platform

## 📋 Opciones de Despliegue

### 1. 🐳 Docker (Recomendado para desarrollo y testing)

#### Requisitos:
- Docker Desktop
- Docker Compose

#### Pasos:
```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd E-Learning-Platform

# 2. Ejecutar despliegue automático
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

#### URLs:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8080
- **Base de datos:** localhost:5432

---

### 2. ☁️ Despliegue en la Nube

#### Opción A: Heroku (Gratuito)

1. **Crear cuenta en Heroku**
2. **Instalar Heroku CLI**
3. **Configurar PostgreSQL addon**

```bash
# Crear aplicación
heroku create tu-app-elearning

# Agregar PostgreSQL
heroku addons:create heroku-postgresql:mini

# Configurar variables de entorno
heroku config:set JWT_SECRET_KEY=tu-clave-secreta
heroku config:set SPRING_PROFILES_ACTIVE=prod

# Desplegar
git push heroku main
```

#### Opción B: Railway (Gratuito)

1. **Crear cuenta en Railway**
2. **Conectar repositorio**
3. **Configurar variables de entorno**
4. **Desplegar automáticamente**

#### Opción C: Render (Gratuito)

1. **Crear cuenta en Render**
2. **Conectar repositorio**
3. **Configurar build y start commands**
4. **Desplegar**

---

### 3. 🖥️ Despliegue en VPS

#### Requisitos:
- Ubuntu 20.04+ o CentOS 8+
- 2GB RAM mínimo
- 20GB almacenamiento

#### Pasos:

```bash
# 1. Actualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Clonar repositorio
git clone <repository-url>
cd E-Learning-Platform

# 5. Configurar variables de entorno
nano .env

# 6. Desplegar
./deploy.sh
```

---

## 🔧 Configuración de Variables de Entorno

### Archivo .env
```env
# Configuración de la aplicación
JWT_SECRET_KEY=tu-clave-secreta-muy-larga-y-segura
JWT_EXPIRATION_TIME=86400000
APP_BASE_URL=https://tu-dominio.com
CORS_ALLOWED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com

# Configuración de base de datos
POSTGRES_DB=elearning_platform
POSTGRES_USER=elearning_user
POSTGRES_PASSWORD=tu-password-seguro

# Configuración de email (opcional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password
```

---

## 🗄️ Configuración de Base de Datos

### PostgreSQL (Recomendado)
- **Desarrollo:** H2 (en memoria)
- **Producción:** PostgreSQL
- **Backup:** Automático con Docker volumes

### Migración de Datos
```bash
# Exportar desde H2 (desarrollo)
# Los datos se crean automáticamente en producción

# Verificar datos en PostgreSQL
docker-compose exec postgres psql -U elearning_user -d elearning_platform -c "SELECT COUNT(*) FROM users;"
```

---

## 🔒 Configuración de Seguridad

### 1. Variables de Entorno
- **Nunca** commitees archivos .env
- Usa claves JWT seguras y únicas
- Cambia passwords por defecto

### 2. HTTPS
- Configura SSL/TLS en producción
- Usa Let's Encrypt para certificados gratuitos

### 3. Firewall
- Abre solo puertos necesarios (80, 443, 22)
- Bloquea acceso directo a PostgreSQL

---

## 📊 Monitoreo y Logs

### Ver logs en tiempo real:
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend

# Solo base de datos
docker-compose logs -f postgres
```

### Health checks:
- **Backend:** http://localhost:8080/actuator/health
- **Frontend:** http://localhost:3000

---

## 🔄 Actualizaciones

### Actualizar aplicación:
```bash
# 1. Hacer pull de cambios
git pull origin main

# 2. Reconstruir y reiniciar
docker-compose up --build -d

# 3. Verificar que todo funcione
docker-compose ps
```

### Backup de base de datos:
```bash
# Crear backup
docker-compose exec postgres pg_dump -U elearning_user elearning_platform > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U elearning_user elearning_platform < backup.sql
```

---

## 🆘 Solución de Problemas

### Problema: Backend no inicia
```bash
# Ver logs
docker-compose logs backend

# Verificar variables de entorno
docker-compose exec backend env | grep SPRING
```

### Problema: Base de datos no conecta
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Verificar logs
docker-compose logs postgres
```

### Problema: Frontend no carga
```bash
# Verificar que backend esté funcionando
curl http://localhost:8080/actuator/health

# Verificar logs
docker-compose logs frontend
```

---

## 📞 Soporte

Para problemas de despliegue:
1. Revisa los logs: `docker-compose logs -f`
2. Verifica las variables de entorno
3. Asegúrate de que todos los puertos estén libres
4. Revisa la documentación de la API

---

**¡Tu plataforma E-Learning está lista para el mundo! 🌍✨**
