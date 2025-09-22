package com.Dev_learning_Platform.Dev_learning_Platform.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DatabaseProperties {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Bean
    @Primary
    @ConditionalOnProperty(name = "DATABASE_URL")
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        
        // Parsear la URL de Render y extraer componentes por separado
        DatabaseConnectionInfo connectionInfo = parseDatabaseUrl(databaseUrl);
        
        System.out.println("Original DATABASE_URL: " + databaseUrl);
        System.out.println("Parsed - Host: " + connectionInfo.host);
        System.out.println("Parsed - Port: " + connectionInfo.port);
        System.out.println("Parsed - Database: " + connectionInfo.database);
        System.out.println("Parsed - Username: " + connectionInfo.username);
        
        // Construir URL sin credenciales y usar username/password por separado
        String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", 
            connectionInfo.host, connectionInfo.port, connectionInfo.database);
        
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(connectionInfo.username);
        config.setPassword(connectionInfo.password);
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(5);
        config.setMinimumIdle(1);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        
        return new HikariDataSource(config);
    }
    
    private DatabaseConnectionInfo parseDatabaseUrl(String databaseUrl) {
        if (databaseUrl == null || !databaseUrl.startsWith("postgresql://")) {
            throw new IllegalArgumentException("Invalid DATABASE_URL format: " + databaseUrl);
        }
        
        try {
            // Parsear la URL de Render: postgresql://user:password@host/database
            String urlWithoutProtocol = databaseUrl.substring("postgresql://".length());
            String[] parts = urlWithoutProtocol.split("@");
            
            if (parts.length != 2) {
                throw new IllegalArgumentException("Invalid DATABASE_URL format");
            }
            
            String credentials = parts[0];
            String hostAndDb = parts[1];
            
            // Extraer usuario y contraseña
            String[] credParts = credentials.split(":");
            String username = credParts[0];
            String password = credParts[1];
            
            // Extraer host y base de datos
            String[] hostParts = hostAndDb.split("/");
            String host = hostParts[0];
            String database = hostParts[1];
            
            // Puerto por defecto para PostgreSQL
            int port = 5432;
            
            return new DatabaseConnectionInfo(host, port, database, username, password);
                
        } catch (Exception e) {
            throw new IllegalArgumentException("Error parsing DATABASE_URL: " + e.getMessage(), e);
        }
    }
    
    // Clase interna para almacenar la información de conexión
    private static class DatabaseConnectionInfo {
        final String host;
        final int port;
        final String database;
        final String username;
        final String password;
        
        DatabaseConnectionInfo(String host, int port, String database, String username, String password) {
            this.host = host;
            this.port = port;
            this.database = database;
            this.username = username;
            this.password = password;
        }
    }
}
