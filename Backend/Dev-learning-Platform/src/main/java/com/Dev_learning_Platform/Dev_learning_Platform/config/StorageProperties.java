package com.Dev_learning_Platform.Dev_learning_Platform.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Component
@Validated
@ConfigurationProperties(prefix = "app.upload.local")
public class StorageProperties {

    @NotBlank(message = "La ruta de almacenamiento local es requerida")
    private String path = "uploads";

    @NotBlank(message = "La URL base local es requerida")
    private String baseUrl = "http://localhost:8080/uploads";

    public String buildPublicUrl(String objectName) {
        return String.format("%s/%s", baseUrl, objectName);
    }
}