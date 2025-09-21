# Multi-stage build para optimizar el tamaño de la imagen
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de Maven
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Descargar dependencias (capa de cache)
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src ./src

    # Construir la aplicación
    RUN mvn clean package -DskipTests -Dmaven.test.skip=true

# Imagen de runtime
FROM eclipse-temurin:17-jre

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Crear usuario no-root
RUN groupadd -r elearning && useradd -r -g elearning elearning

# Establecer directorio de trabajo
WORKDIR /app

# Crear directorio para uploads
RUN mkdir -p /app/uploads && chown -R elearning:elearning /app

# Copiar JAR desde la etapa de build
COPY --from=build /app/target/*.jar app.jar

# Cambiar propietario de los archivos
RUN chown -R elearning:elearning /app

# Cambiar a usuario no-root
USER elearning

# Exponer puerto
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Comando de inicio
ENTRYPOINT ["java", "-jar", "app.jar"]
