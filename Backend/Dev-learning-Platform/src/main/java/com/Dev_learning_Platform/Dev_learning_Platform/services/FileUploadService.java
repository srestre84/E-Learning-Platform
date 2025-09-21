package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Dev_learning_Platform.Dev_learning_Platform.config.FileUploadConfig;
import com.Dev_learning_Platform.Dev_learning_Platform.config.StorageProperties;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FileUploadService {
    
    private final FileUploadConfig fileUploadConfig;
    private final StorageProperties storageProperties;
    
    @Value("${spring.profiles.active:}")
    private String activeProfile;
    
    public FileUploadService(FileUploadConfig fileUploadConfig, StorageProperties storageProperties) {
        this.fileUploadConfig = fileUploadConfig;
        this.storageProperties = storageProperties;
    }

    /**
     * Sube una imagen de perfil y retorna la URL de acceso.
     * 
     * @param file Archivo de imagen a subir
     * @param userId ID del usuario propietario
     * @return URL completa de la imagen subida
     * @throws IOException Si hay error en la subida
     * @throws IllegalArgumentException Si el archivo no es válido
     */
    public String uploadProfileImage(MultipartFile file, Long userId) throws IOException {
        log.info("Iniciando subida de imagen de perfil para usuario: {}", userId);
        
        validateFile(file);
        
        String imageUrl;

        if ("test".equals(activeProfile)) {
            log.info("Perfil de test detectado, simulando subida de imagen");
            imageUrl = generateMockImageUrl(userId);
        } else {
            log.info("Subiendo imagen a almacenamiento local");
            imageUrl = uploadToLocalStorage(file, "profiles", "user_" + userId);
        }
        
        log.info("Imagen de perfil subida exitosamente: {}", imageUrl);
        return imageUrl;
    }

    /**
     * Sube una imagen de portada de curso y retorna la URL de acceso.
     * @param file Archivo de imagen a subir
     * @param username Nombre de usuario (para trazabilidad)
     * @return URL completa de la imagen subida
     * @throws IOException Si hay error en la subida
     * @throws IllegalArgumentException Si el archivo no es válido
     */
    public String uploadCourseImage(MultipartFile file, String username) throws IOException {
        log.info("Iniciando subida de imagen de portada de curso para usuario: {}", username);
        validateFile(file);

        String imageUrl;
        if ("test".equals(activeProfile)) {
            log.info("Perfil de test detectado, simulando subida de imagen de curso");
            imageUrl = String.format("https://mock-storage.example.com/course-thumbnails/%s_%s.jpg", username, UUID.randomUUID());
        } else {
            log.info("Subiendo imagen de portada de curso a almacenamiento local");
            imageUrl = uploadToLocalStorage(file, "courses", "course_" + username);
        }
        
        log.info("Imagen de portada de curso subida exitosamente: {}", imageUrl);
        return imageUrl;
    }

    /**
     * Sube un archivo al almacenamiento local
     */
    private String uploadToLocalStorage(MultipartFile file, String folder, String prefix) throws IOException {
        try {
            // Crear directorio si no existe
            Path uploadDir = Paths.get(storageProperties.getPath(), folder);
            Files.createDirectories(uploadDir);
            
            // Generar nombre único para el archivo
            String extension = getFileExtension(file.getOriginalFilename());
            String fileName = String.format("%s_%s.%s", prefix, UUID.randomUUID().toString(), extension);
            
            // Guardar archivo
            Path filePath = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
            
            // Construir URL pública
            return storageProperties.buildPublicUrl(folder + "/" + fileName);
            
        } catch (IOException e) {
            log.error("Error al subir archivo: {}", e.getMessage());
            throw new IOException("Error al subir archivo: " + e.getMessage(), e);
        }
    }

    public void deleteProfileImage(String imageUrl) {
        if (imageUrl == null) {
            log.warn("URL nula para eliminación");
            return;
        }

        if ("test".equals(activeProfile)) {
            log.info("Perfil de test detectado, simulando eliminación de imagen: {}", imageUrl);
            return;
        }

        try {
            // Extraer ruta del archivo de la URL
            String relativePath = extractRelativePathFromUrl(imageUrl);
            if (relativePath != null) {
                Path filePath = Paths.get(storageProperties.getPath(), relativePath);
                Files.deleteIfExists(filePath);
                log.info("Imagen eliminada: {}", filePath);
            }
        } catch (IOException e) {
            log.warn("Error al eliminar imagen: {}", e.getMessage());
        }
    }

    private String extractRelativePathFromUrl(String imageUrl) {
        try {
            // Extraer la parte después de /uploads/
            String baseUrl = storageProperties.getBaseUrl();
            if (imageUrl.startsWith(baseUrl)) {
                return imageUrl.substring(baseUrl.length() + 1); // +1 para el /
            }
        } catch (Exception e) {
            log.warn("Error al extraer ruta de URL: {}", e.getMessage());
        }
        return null;
    }

    private String generateMockImageUrl(Long userId) {
        return String.format("https://mock-storage.example.com/profile-images/user_%d_%s.jpg", 
            userId, UUID.randomUUID().toString());
    }

    private void validateFile(MultipartFile file) {
        var config = fileUploadConfig.getProfileImages();

        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }

        if (file.getSize() > config.getMaxFileSize()) {
            throw new IllegalArgumentException(
                String.format("El archivo excede el tamaño máximo permitido (%d MB)", 
                config.getMaxFileSize() / (1024 * 1024))
            );
        }

        String filename = file.getOriginalFilename();
        if (filename == null || filename.trim().isEmpty()) {
            throw new IllegalArgumentException("Nombre de archivo inválido");
        }

        String extension = getFileExtension(filename).toLowerCase();
        if (!Arrays.asList(config.getAllowedExtensions()).contains(extension)) {
            throw new IllegalArgumentException(
                "Tipo de archivo no permitido. Extensiones válidas: " + 
                Arrays.toString(config.getAllowedExtensions())
            );
        }

        String contentType = file.getContentType();
        if (contentType == null || !Arrays.asList(config.getAllowedMimeTypes()).contains(contentType)) {
            throw new IllegalArgumentException(
                "Tipo de contenido no permitido. Tipos válidos: " + 
                Arrays.toString(config.getAllowedMimeTypes())
            );
        }
    }
    
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            throw new IllegalArgumentException("El archivo debe tener una extensión");
        }
        return filename.substring(lastDotIndex + 1);
    }
}