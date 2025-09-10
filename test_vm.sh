#!/bin/bash

API_URL="http://149.130.176.157:8080"
REGISTER_EMAIL="esteban.perez1@example.com"
REGISTER_USER="Esteban"
REGISTER_LASTNAME="Pérez"
REGISTER_PASSWORD="password123"
REGISTER_ROLE="STUDENT"
PROFILE_IMAGE_PATH="/home/farid/Descargas/profile.jpg" # Cambia la ruta si tu imagen está en otro lugar

curl -X POST http://149.130.176.157:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "esteban.perez1@example.com",
    "password": "password123"
  }'

curl -X POST http://149.130.176.157:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Esteban",
    "lastName": "Pérez", 
    "email": "esteban.pere2@example.com",
    "password": "password123",
    "role": "STUDENT"
  }'

curl -X GET http://149.130.176.157:8080/api/courses \
  -H "Content-Type: application/json"
  
echo "--- Upload imagen de perfil ---"
UPLOAD_RESPONSE=$(curl -s -X POST "$API_URL/api/users/profile/upload-image" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@$PROFILE_IMAGE_PATH")
echo "$UPLOAD_RESPONSE"

echo "--- Fin de prueba ---"

