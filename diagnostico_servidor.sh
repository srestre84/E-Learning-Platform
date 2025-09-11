#!/bin/bash

echo "=== DIAGNÓSTICO DEL SERVIDOR - PROBLEMA 403 ==="
echo ""

# Variables
SERVER_IP="149.130.176.157"
APP_DIR="/home/opc"

echo "--- 1. Verificando conectividad SSH ---"
ssh -o ConnectTimeout=5 opc@$SERVER_IP "echo 'Conexión SSH exitosa'" || {
    echo "❌ Error: No se puede conectar por SSH"
    exit 1
}

echo "--- 2. Verificando estructura de directorios ---"
ssh opc@$SERVER_IP "ls -la $APP_DIR/"

echo "--- 3. Verificando directorio uploads ---"
ssh opc@$SERVER_IP "ls -la $APP_DIR/uploads/ 2>/dev/null || echo 'Directorio uploads no existe'"

echo "--- 4. Verificando directorio profiles ---"
ssh opc@$SERVER_IP "ls -la $APP_DIR/uploads/profiles/ 2>/dev/null || echo 'Directorio profiles no existe'"

echo "--- 5. Verificando archivos de imagen ---"
ssh opc@$SERVER_IP "find $APP_DIR/uploads -name '*.jpg' -ls 2>/dev/null || echo 'No se encontraron archivos JPG'"

echo "--- 6. Verificando proceso Java ---"
ssh opc@$SERVER_IP "ps aux | grep java | grep -v grep"

echo "--- 7. Verificando puertos abiertos ---"
ssh opc@$SERVER_IP "netstat -tlnp | grep :8080"

echo "--- 8. Verificando logs recientes ---"
ssh opc@$SERVER_IP "journalctl -u elearning-backend --no-pager -n 10"

echo "--- 9. Verificando variables de entorno ---"
ssh opc@$SERVER_IP "env | grep -E '(SERVER_URL|SPRING_PROFILES_ACTIVE)'"

echo ""
echo "=== FIN DEL DIAGNÓSTICO ==="
