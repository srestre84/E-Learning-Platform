#!/bin/bash

# Railway Build Script for E-Learning Platform Backend

echo "🚀 Building E-Learning Platform Backend for Railway..."

# Set environment variables
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export PATH=$JAVA_HOME/bin:$PATH

# Clean and compile
echo "📦 Cleaning and compiling..."
./mvnw clean package -DskipTests

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 JAR file created: target/Dev_learning_Platform-0.0.1-SNAPSHOT.jar"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Ready for deployment on Railway!"
