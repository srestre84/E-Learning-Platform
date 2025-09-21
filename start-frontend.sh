#!/bin/bash

echo "========================================"
echo "    INICIANDO FRONTEND - E-LEARNING"
echo "========================================"

cd Frontend

echo ""
echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no está instalado o no está en el PATH"
    echo "Por favor instala Node.js 18 o superior"
    exit 1
fi

node --version

echo ""
echo "Verificando pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "ERROR: pnpm no está instalado"
    echo "Instalando pnpm..."
    npm install -g pnpm
fi

pnpm --version

echo ""
echo "Instalando dependencias..."
pnpm install

echo ""
echo "Iniciando servidor de desarrollo..."
echo "Frontend estará disponible en: http://localhost:5173"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

pnpm dev
