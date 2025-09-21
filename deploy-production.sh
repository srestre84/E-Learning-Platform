#!/bin/bash

# 🚀 E-Learning Platform v2.0 - Production Deployment Script
# Deploy Backend to Railway + Frontend to Vercel

echo "🎯 E-Learning Platform v2.0 - Production Deployment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        print_warning "pnpm not found, installing..."
        npm install -g pnpm
    fi
    
    print_success "All requirements satisfied"
}

# Deploy Backend to Railway
deploy_backend() {
    print_status "🚀 Deploying Backend to Railway..."
    
    cd Backend/Dev-learning-Platform
    
    # Build the application
    print_status "Building backend..."
    ./mvnw clean package -DskipTests
    
    if [ $? -eq 0 ]; then
        print_success "Backend build successful"
    else
        print_error "Backend build failed"
        exit 1
    fi
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Please install it:"
        echo "npm install -g @railway/cli"
        echo "railway login"
        echo "railway link"
        echo "railway up"
    else
        print_status "Deploying to Railway..."
        railway up
    fi
    
    cd ../..
}

# Deploy Frontend to Vercel
deploy_frontend() {
    print_status "🎨 Deploying Frontend to Vercel..."
    
    cd Frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    pnpm install
    
    # Build the application
    print_status "Building frontend..."
    pnpm run build
    
    if [ $? -eq 0 ]; then
        print_success "Frontend build successful"
    else
        print_error "Frontend build failed"
        exit 1
    fi
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Please install it:"
        echo "npm install -g vercel"
        echo "vercel login"
        echo "vercel --prod"
    else
        print_status "Deploying to Vercel..."
        vercel --prod
    fi
    
    cd ..
}

# Main deployment function
main() {
    echo "Starting deployment process..."
    
    check_requirements
    
    # Deploy backend first
    deploy_backend
    
    # Wait a bit for backend to be ready
    print_status "Waiting for backend to be ready..."
    sleep 10
    
    # Deploy frontend
    deploy_frontend
    
    print_success "🎉 Deployment completed successfully!"
    print_status "Backend: https://e-learning-platform-backend.railway.app"
    print_status "Frontend: https://e-learning-platform-v2.vercel.app"
}

# Run main function
main "$@"
