#!/bin/bash

# Script de despliegue para E-Learning Platform
echo "🚀 Iniciando despliegue de E-Learning Platform..."

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cat > .env << EOF
# Configuración de la aplicación
JWT_SECRET_KEY=4c6fb40397598dd8c1dbb3155fba3ca208a16fe8d5d90162b74f1874a4dc12b6
JWT_EXPIRATION_TIME=86400000
APP_BASE_URL=http://localhost:8080
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Configuración de base de datos
POSTGRES_DB=elearning_platform
POSTGRES_USER=elearning_user
POSTGRES_PASSWORD=elearning_password

# Configuración de email (opcional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
EOF
    echo "✅ Archivo .env creado"
fi

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down

# Construir y levantar contenedores
echo "🔨 Construyendo y levantando contenedores..."
docker-compose up --build -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar que los servicios estén funcionando
echo "🔍 Verificando servicios..."

# Verificar PostgreSQL
if docker-compose exec postgres pg_isready -U elearning_user -d elearning_platform; then
    echo "✅ PostgreSQL está funcionando"
else
    echo "❌ PostgreSQL no está funcionando"
fi

# Verificar Backend
if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ Backend está funcionando"
else
    echo "❌ Backend no está funcionando"
fi

# Verificar Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend está funcionando"
else
    echo "❌ Frontend no está funcionando"
fi

echo ""
echo "🎉 ¡Despliegue completado!"
echo ""
echo "📱 URLs de acceso:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080"
echo "   API Docs: http://localhost:8080/swagger-ui.html"
echo ""
echo "👥 Usuarios de prueba:"
echo "   Admin:      admin@elearning.com / Admin123"
echo "   Instructor: instructor@elearning.com / Instructor123"
echo "   Estudiante: student@elearning.com / Student123"
echo ""
echo "🛠️ Comandos útiles:"
echo "   Ver logs:     docker-compose logs -f"
echo "   Detener:      docker-compose down"
echo "   Reiniciar:    docker-compose restart"
echo "   Limpiar:      docker-compose down -v"
echo ""
