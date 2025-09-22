#!/bin/bash

# CORS Test Script for E-Learning Platform
# This script tests CORS configuration for your deployed backend

echo "🔍 Testing CORS Configuration..."
echo "=================================="

# Backend URL (update this with your actual Render URL)
BACKEND_URL="https://e-learning-platform-1-oupq.onrender.com"
FRONTEND_URL="https://e-learning-platform-v2.netlify.app"

echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Test 1: Preflight request (OPTIONS)
echo "1. Testing OPTIONS preflight request..."
curl -X OPTIONS \
  -H "Origin: $FRONTEND_URL" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v \
  "$BACKEND_URL/api/courses" 2>&1 | grep -E "(Access-Control|HTTP|Origin)"

echo ""
echo "2. Testing actual GET request..."
curl -X GET \
  -H "Origin: $FRONTEND_URL" \
  -H "Content-Type: application/json" \
  -v \
  "$BACKEND_URL/api/courses" 2>&1 | grep -E "(Access-Control|HTTP|Origin)"

echo ""
echo "3. Testing login endpoint..."
curl -X POST \
  -H "Origin: $FRONTEND_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -v \
  "$BACKEND_URL/api/auth/login" 2>&1 | grep -E "(Access-Control|HTTP|Origin)"

echo ""
echo "✅ CORS test completed!"
echo ""
echo "Expected results:"
echo "- Access-Control-Allow-Origin should include your Netlify URL"
echo "- Access-Control-Allow-Methods should include GET,POST,PUT,DELETE,OPTIONS"
echo "- Access-Control-Allow-Headers should include * or specific headers"
echo "- Access-Control-Allow-Credentials should be true"