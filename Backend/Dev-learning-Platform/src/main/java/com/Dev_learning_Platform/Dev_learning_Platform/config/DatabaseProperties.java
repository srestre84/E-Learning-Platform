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
        
        // Convertir postgresql:// a jdbc:postgresql:// con formato correcto
        String jdbcUrl = convertToJdbcUrl(databaseUrl);
        
        System.out.println("Original DATABASE_URL: " + databaseUrl);
        System.out.println("Converted JDBC URL: " + jdbcUrl);
        
        config.setJdbcUrl(jdbcUrl);
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(5);
        config.setMinimumIdle(1);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        
        return new HikariDataSource(config);
    }
    
    private String convertToJdbcUrl(String databaseUrl) {
        if (databaseUrl == null || !databaseUrl.startsWith("postgresql://")) {
            return databaseUrl;
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
            
            // Construir la URL JDBC correcta con puerto por defecto
            return String.format("jdbc:postgresql://%s:5432/%s?user=%s&password=%s", 
                host, database, username, password);
                
        } catch (Exception e) {
            // Si hay error en el parsing, usar la conversión simple
            return "jdbc:" + databaseUrl;
        }
    }
}
