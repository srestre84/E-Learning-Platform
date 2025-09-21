#!/bin/bash

echo "🚀 Building for Vercel deployment..."

# Set production environment
export NODE_ENV=production
export VITE_ENV=production
export VITE_API_BASE_URL=https://e-learning-backend.onrender.com/api

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Build output: dist/"
