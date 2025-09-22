# Use OpenJDK 17 as base image
FROM openjdk:17-jdk-slim

# Force rebuild

# Set working directory
WORKDIR /app

# Copy pom.xml first for better caching
COPY pom.xml ./

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Expose port
EXPOSE 8080

# List files to debug
RUN ls -la target/

# Run the application
CMD ["java", "-jar", "target/elearning-platform-0.0.1-SNAPSHOT.jar"]