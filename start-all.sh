#!/bin/bash

echo "========================================"
echo "    INICIANDO E-LEARNING PLATFORM"
echo "========================================"

echo ""
echo "Iniciando Backend y Frontend en paralelo..."
echo ""

echo "[1/2] Iniciando Backend..."
gnome-terminal --title="Backend" -- bash -c "./start-backend.sh; exec bash" &

echo "Esperando 10 segundos para que el backend inicie..."
sleep 10

echo "[2/2] Iniciando Frontend..."
gnome-terminal --title="Frontend" -- bash -c "./start-frontend.sh; exec bash" &

echo ""
echo "========================================"
echo "    SERVICIOS INICIADOS"
echo "========================================"
echo "Backend:  http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo "H2 Console: http://localhost:8080/h2-console"
echo ""
echo "Presiona Enter para cerrar esta ventana..."
read
