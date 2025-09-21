@echo off
echo 🚀 Iniciando despliegue de E-Learning Platform...

REM Verificar que Docker esté instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker no está instalado. Por favor instala Docker primero.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose no está instalado. Por favor instala Docker Compose primero.
    pause
    exit /b 1
)

REM Crear archivo .env si no existe
if not exist .env (
    echo 📝 Creando archivo .env...
    (
        echo # Configuración de la aplicación
        echo JWT_SECRET_KEY=4c6fb40397598dd8c1dbb3155fba3ca208a16fe8d5d90162b74f1874a4dc12b6
        echo JWT_EXPIRATION_TIME=86400000
        echo APP_BASE_URL=http://localhost:8080
        echo CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
        echo.
        echo # Configuración de base de datos
        echo POSTGRES_DB=elearning_platform
        echo POSTGRES_USER=elearning_user
        echo POSTGRES_PASSWORD=elearning_password
        echo.
        echo # Configuración de email (opcional)
        echo MAIL_HOST=smtp.gmail.com
        echo MAIL_PORT=587
        echo MAIL_USERNAME=
        echo MAIL_PASSWORD=
    ) > .env
    echo ✅ Archivo .env creado
)

REM Detener contenedores existentes
echo 🛑 Deteniendo contenedores existentes...
docker-compose down

REM Construir y levantar contenedores
echo 🔨 Construyendo y levantando contenedores...
docker-compose up --build -d

REM Esperar a que los servicios estén listos
echo ⏳ Esperando a que los servicios estén listos...
timeout /t 30 /nobreak > nul

REM Verificar que los servicios estén funcionando
echo 🔍 Verificando servicios...

REM Verificar Backend
curl -f http://localhost:8080/actuator/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend está funcionando
) else (
    echo ❌ Backend no está funcionando
)

REM Verificar Frontend
curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend está funcionando
) else (
    echo ❌ Frontend no está funcionando
)

echo.
echo 🎉 ¡Despliegue completado!
echo.
echo 📱 URLs de acceso:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8080
echo    API Docs: http://localhost:8080/swagger-ui.html
echo.
echo 👥 Usuarios de prueba:
echo    Admin:      admin@elearning.com / Admin123
echo    Instructor: instructor@elearning.com / Instructor123
echo    Estudiante: student@elearning.com / Student123
echo.
echo 🛠️ Comandos útiles:
echo    Ver logs:     docker-compose logs -f
echo    Detener:      docker-compose down
echo    Reiniciar:    docker-compose restart
echo    Limpiar:      docker-compose down -v
echo.
pause
