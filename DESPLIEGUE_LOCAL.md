# 🚀 Despliegue Local - E-Learning Platform

Esta guía te ayudará a desplegar la plataforma E-Learning en tu máquina local de manera sencilla, sin complicaciones con OCI.

## 📋 Prerrequisitos

### Backend (Java/Spring Boot)
- **Java 21** o superior
- **Maven 3.6+**
- **Git**

### Frontend (React/Vite)
- **Node.js 18+**
- **pnpm** (se instala automáticamente si no lo tienes)

## 🛠️ Instalación Rápida

### Opción 1: Scripts Automáticos (Recomendado)

#### Windows:
```bash
# Iniciar todo de una vez
start-all.bat

# O iniciar por separado
start-backend.bat    # Terminal 1
start-frontend.bat   # Terminal 2
```

#### Linux/Mac:
```bash
# Hacer ejecutables los scripts
chmod +x *.sh

# Iniciar todo de una vez
./start-all.sh

# O iniciar por separado
./start-backend.sh    # Terminal 1
./start-frontend.sh   # Terminal 2
```

### Opción 2: Manual

#### 1. Backend
```bash
cd Backend/Dev-learning-Platform

# Compilar
mvn clean compile

# Iniciar servidor
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

#### 2. Frontend
```bash
cd Frontend

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

## 🌐 URLs de Acceso

Una vez iniciados los servicios:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **H2 Database Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: `password`

## ⚙️ Configuración

### Variables de Entorno

Copia el archivo `env.local.example` y renómbralo a `.env.local`:

```bash
cp env.local.example .env.local
```

Edita las variables según necesites:

```env
# JWT (ya configurado para desarrollo)
JWT_SECRET_KEY=mySecretKey123456789012345678901234567890
JWT_EXPIRATION_TIME=86400000

# Stripe (opcional para desarrollo)
STRIPE_API_KEY=sk_test_your_stripe_secret_key_here
STRIPE_API_PUBLIC_KEY=pk_test_your_stripe_public_key_here

# Frontend URL
VITE_API_BASE_URL=http://localhost:8080
```

### Base de Datos

El proyecto está configurado para usar **H2 Database** en memoria para desarrollo local:

- ✅ **No necesitas instalar MySQL**
- ✅ **No necesitas configurar OCI**
- ✅ **Los datos se crean automáticamente**
- ✅ **Se reinician en cada inicio**

## 🔧 Perfiles de Spring Boot

El proyecto usa diferentes perfiles:

- **dev** (por defecto): H2 Database, sin OCI
- **test**: Para pruebas unitarias
- **prod**: MySQL + OCI (para producción)

## 📁 Estructura del Proyecto

```
E-Learning-Platform/
├── Backend/
│   └── Dev-learning-Platform/     # Spring Boot API
├── Frontend/                      # React + Vite
├── start-backend.bat/.sh         # Script backend
├── start-frontend.bat/.sh        # Script frontend
├── start-all.bat/.sh             # Script maestro
└── env.local.example             # Variables de entorno
```

## 🐛 Solución de Problemas

### Backend no inicia
1. Verifica que Java 21+ esté instalado: `java -version`
2. Verifica que Maven esté instalado: `mvn -version`
3. Limpia y recompila: `mvn clean compile`

### Frontend no inicia
1. Verifica que Node.js 18+ esté instalado: `node --version`
2. Instala pnpm: `npm install -g pnpm`
3. Limpia node_modules: `rm -rf node_modules && pnpm install`

### Error de CORS
- El backend ya está configurado para aceptar requests desde `http://localhost:5173`
- Si cambias el puerto del frontend, actualiza `app.frontend.url` en `application-dev.properties`

### Base de datos no conecta
- H2 está configurado para iniciar automáticamente
- Verifica que no haya otro proceso usando el puerto 8080
- Accede a http://localhost:8080/h2-console para verificar

## 🎯 Características Disponibles

### ✅ Funcionalidades Implementadas
- **Autenticación JWT**
- **Gestión de cursos y videos**
- **Sistema de inscripciones**
- **Preview de videos al hover**
- **Organización por módulos**
- **Pagos con Stripe** (opcional)
- **Subida de archivos local**

### 🔄 Datos de Prueba
- Los datos se crean automáticamente al iniciar
- Usa la consola H2 para ver/modificar datos
- Los datos se reinician en cada inicio (desarrollo)

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs** en las terminales
2. **Verifica los prerrequisitos**
3. **Revisa que los puertos estén libres**
4. **Consulta la consola H2** para verificar datos

## 🚀 Próximos Pasos

Una vez que tengas todo funcionando:

1. **Explora la API** en http://localhost:8080
2. **Prueba el frontend** en http://localhost:5173
3. **Revisa la base de datos** en http://localhost:8080/h2-console
4. **Desarrolla nuevas funcionalidades**

---

¡Listo! Ahora tienes la plataforma E-Learning funcionando localmente sin complicaciones. 🎉
