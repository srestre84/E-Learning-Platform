@echo off
echo Iniciando Frontend E-Learning Platform...
echo.

cd Frontend

echo Instalando dependencias...
pnpm install

echo.
echo Ejecutando frontend en puerto 5173...
echo.
pnpm dev

pause