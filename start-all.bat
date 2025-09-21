@echo off
echo Iniciando E-Learning Platform completa...
echo.

echo ========================================
echo    E-LEARNING PLATFORM
echo ========================================
echo.

echo 1. Iniciando Backend...
start "Backend" cmd /k "cd Backend\Dev-learning-Platform && set JWT_SECRET_KEY=4c6fb40397598dd8c1dbb3155fba3ca208a16fe8d5d90162b74f1874a4dc12b6 && set JWT_EXPIRATION_TIME=86400000 && mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local"

echo Esperando 30 segundos para que el backend inicie...
timeout /t 30 /nobreak > nul

echo.
echo 2. Iniciando Frontend...
start "Frontend" cmd /k "cd Frontend && pnpm dev"

echo.
echo ========================================
echo    PLATAFORMA INICIADA
echo ========================================
echo.
echo Backend:  http://localhost:8081
echo Frontend: http://localhost:5173
echo.
echo Usuarios de prueba:
echo - Admin: admin@elearning.com / Admin123
echo - Instructor: instructor@elearning.com / Instructor123
echo - Estudiante: student@elearning.com / Student123
echo.
echo Presiona cualquier tecla para cerrar...
pause > nul