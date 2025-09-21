@echo off
echo Iniciando Backend E-Learning Platform...
echo.

cd Backend\Dev-learning-Platform

echo Configurando variables de entorno...
set JWT_SECRET_KEY=4c6fb40397598dd8c1dbb3155fba3ca208a16fe8d5d90162b74f1874a4dc12b6
set JWT_EXPIRATION_TIME=86400000

echo.
echo Ejecutando backend en puerto 8081...
echo.
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local

pause