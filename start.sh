#!/bin/bash

# E-Learning Platform v2.0 - Start Script for Railway
echo "🚀 Starting E-Learning Platform Backend..."

# Navigate to backend directory
cd Backend/Dev-learning-Platform

# Build the application
echo "📦 Building application..."
./mvnw clean package -DskipTests

# Start the application
echo "🎯 Starting Spring Boot application..."
java -jar target/Dev_learning_Platform-0.0.1-SNAPSHOT.jar
