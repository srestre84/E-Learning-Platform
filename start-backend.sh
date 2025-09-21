#!/bin/bash

echo "========================================"
echo "    INICIANDO BACKEND - E-LEARNING"
echo "========================================"

cd Backend/Dev-learning-Platform

echo ""
echo "Verificando Java..."
if ! command -v java &> /dev/null; then
    echo "ERROR: Java no está instalado o no está en el PATH"
    echo "Por favor instala Java 21 o superior"
    exit 1
fi

java -version

echo ""
echo "Verificando Maven..."
if ! command -v mvn &> /dev/null; then
    echo "ERROR: Maven no está instalado o no está en el PATH"
    echo "Por favor instala Maven"
    exit 1
fi

mvn -version

echo ""
echo "Limpiando y compilando proyecto..."
mvn clean compile

echo ""
echo "Iniciando servidor de desarrollo..."
echo "Backend estará disponible en: http://localhost:8080"
echo "Base de datos H2 console: http://localhost:8080/h2-console"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

mvn spring-boot:run -Dspring-boot.run.profiles=dev
