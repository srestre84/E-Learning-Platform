#!/bin/bash

echo "🛠️  SCRIPT DE SOLUCIÓN - PROBLEMA 403 ACCESO A IMÁGENES"
echo "==========================================================="
echo ""

# Variables del servidor
SERVER_IP="149.130.176.157"
SERVER_USER="opc"
APP_NAME="elearning-backend"
JAR_NAME="elearning-platform-0.0.1-SNAPSHOT.jar"
APP_DIR="/home/opc"

echo "📦 JAR compilado disponible en:"
echo "   $(ls -la target/$JAR_NAME)"
echo ""

echo "🔄 Pasos para solucionar el problema 403:"
echo ""

echo "1️⃣  Subir el nuevo JAR al servidor"
echo "   scp target/$JAR_NAME $SERVER_USER@$SERVER_IP:~/"
echo ""

echo "2️⃣  Detener la aplicación actual"
echo "   ssh $SERVER_USER@$SERVER_IP 'sudo systemctl stop $APP_NAME'"
echo ""

echo "3️⃣  Crear directorio de uploads con permisos correctos"
echo "   ssh $SERVER_USER@$SERVER_IP 'mkdir -p $APP_DIR/uploads/profiles'"
echo "   ssh $SERVER_USER@$SERVER_IP 'chmod 755 $APP_DIR/uploads'"
echo "   ssh $SERVER_USER@$SERVER_IP 'chmod 755 $APP_DIR/uploads/profiles'"
echo ""

echo "4️⃣  Configurar variables de entorno"
cat << 'EOF'
# En el servidor, editar el archivo de configuración del servicio:
sudo nano /etc/systemd/system/elearning-backend.service

# Agregar estas variables de entorno:
Environment="SERVER_URL=http://149.130.176.157:8080"
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="APP_UPLOAD_PROFILE_IMAGES_PATH=/home/opc/uploads/profiles"
EOF
echo ""

echo "5️⃣  Recargar configuración del sistema"
echo "   ssh $SERVER_USER@$SERVER_IP 'sudo systemctl daemon-reload'"
echo ""

echo "6️⃣  Iniciar la aplicación con el nuevo JAR"
echo "   ssh $SERVER_USER@$SERVER_IP 'sudo systemctl start $APP_NAME'"
echo ""

echo "7️⃣  Verificar el estado del servicio"
echo "   ssh $SERVER_USER@$SERVER_IP 'sudo systemctl status $APP_NAME'"
echo ""

echo "8️⃣  Verificar logs para confirmar configuración"
echo "   ssh $SERVER_USER@$SERVER_IP 'journalctl -u $APP_NAME -f'"
echo ""

echo "🧪 Probar con el script de test:"
echo "   ./test_vm.sh"
echo ""

echo "📋 CHECKLIST DE VERIFICACIÓN:"
echo "   ✅ URL generada contiene IP pública (no localhost)"
echo "   ✅ Directorio uploads/profiles existe"
echo "   ✅ Permisos 755 en directorios"
echo "   ✅ Variables de entorno configuradas"
echo "   ✅ Servicio iniciado correctamente"
echo "   ✅ Acceso HTTP 200 a la imagen"
echo ""

echo "🎯 SOLUCIÓN AUTOMÁTICA (ejecutar paso a paso):"
echo ""
read -p "¿Quieres ejecutar el proceso automáticamente? (y/n): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    echo ""
    echo "🚀 Iniciando proceso automático..."
    
    echo "📤 Subiendo JAR..."
    scp target/$JAR_NAME $SERVER_USER@$SERVER_IP:~/
    
    echo "🛑 Deteniendo servicio..."
    ssh $SERVER_USER@$SERVER_IP "sudo systemctl stop $APP_NAME"
    
    echo "📁 Creando directorios..."
    ssh $SERVER_USER@$SERVER_IP "mkdir -p $APP_DIR/uploads/profiles && chmod 755 $APP_DIR/uploads && chmod 755 $APP_DIR/uploads/profiles"
    
    echo "⚠️  ACCIÓN MANUAL REQUERIDA:"
    echo "   Ahora necesitas configurar manualmente las variables de entorno en el servidor"
    echo "   Ejecuta: ssh $SERVER_USER@$SERVER_IP"
    echo "   Luego: sudo nano /etc/systemd/system/elearning-backend.service"
    echo ""
    echo "   Agrega estas líneas en la sección [Service]:"
    echo "   Environment=\"SERVER_URL=http://149.130.176.157:8080\""
    echo "   Environment=\"SPRING_PROFILES_ACTIVE=prod\""
    echo "   Environment=\"APP_UPLOAD_PROFILE_IMAGES_PATH=/home/opc/uploads/profiles\""
    echo ""
    echo "   Después ejecuta:"
    echo "   sudo systemctl daemon-reload"
    echo "   sudo systemctl start elearning-backend"
    echo ""
else
    echo "ℹ️  Ejecuta los pasos manualmente siguiendo las instrucciones anteriores."
fi

echo ""
echo "🎉 Una vez completado, ejecuta el test: ./test_vm.sh"
