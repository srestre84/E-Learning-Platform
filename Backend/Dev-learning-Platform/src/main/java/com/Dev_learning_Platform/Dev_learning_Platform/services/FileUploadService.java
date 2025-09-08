package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.oracle.bmc.objectstorage.ObjectStorageClient;
import com.oracle.bmc.objectstorage.requests.DeleteObjectRequest;
import com.oracle.bmc.objectstorage.requests.PutObjectRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final ObjectStorageClient objectStorageClient;

    @Value("${oci.objectstorage.namespace}")
    private String namespace;

    @Value("${oci.objectstorage.bucket-name}")
    private String bucketName;

    @Value("${oci.objectstorage.public-url-base}")
    private String publicUrlBase;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/webp"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final int MAX_IMAGE_WIDTH = 800;
    private static final int MAX_IMAGE_HEIGHT = 800;

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

        // Procesar imagen: redimensionar y optimizar
        byte[] processedImageData = processImage(file);

        // Generar nombre único para el archivo
        String fileName = generateFileName(userId, getFileExtension(file.getOriginalFilename()));

        // Subir a OCI Object Storage
        String objectName = "profile-images/" + fileName;
        uploadToOci(objectName, processedImageData, file.getContentType());

        // Retornar URL pública
        String publicUrl = publicUrlBase + "/" + objectName;
        log.info("Imagen subida exitosamente: {}", publicUrl);

        return publicUrl;
    }

    /**
     * Elimina una imagen de perfil del sistema de archivos.
     */
    public void deleteProfileImage(String imageUrl) {
        try {
            // Extraer el nombre del objeto de la URL
            String objectName = extractObjectNameFromUrl(imageUrl);

            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .namespaceName(namespace)
                    .bucketName(bucketName)
                    .objectName(objectName)
                    .build();

            objectStorageClient.deleteObject(deleteRequest);
            log.info("Imagen eliminada exitosamente: {}", objectName);

        } catch (Exception e) {
            log.warn("Error al eliminar imagen: {}", e.getMessage());
            // No fallar si no se puede eliminar la imagen anterior
        }
    }

    /**
     * Valida que el archivo sea una imagen válida según las configuraciones.
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("El archivo excede el tamaño máximo permitido (5MB)");
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Tipo de archivo no permitido. Use JPG, PNG o WEBP");
        }
    }

    /**
     * Procesa la imagen: redimensiona y convierte a un formato adecuado.
     */
    private byte[] processImage(MultipartFile file) throws IOException {
        try (InputStream inputStream = file.getInputStream()) {
            BufferedImage originalImage = ImageIO.read(inputStream);

            if (originalImage == null) {
                throw new IllegalArgumentException("Archivo de imagen corrupto o no válido");
            }

            // Redimensionar si es necesario
            BufferedImage resizedImage = resizeImage(originalImage);

            // Convertir a byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            String formatName = getImageFormat(file.getContentType());
            ImageIO.write(resizedImage, formatName, outputStream);

            return outputStream.toByteArray();
        }
    }

    /**
     * Redimensiona la imagen manteniendo la relación de aspecto.
     */
    private BufferedImage resizeImage(BufferedImage originalImage) {
        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();

        // Calcular nuevas dimensiones manteniendo proporción
        double ratio = Math.min(
                (double) MAX_IMAGE_WIDTH / originalWidth,
                (double) MAX_IMAGE_HEIGHT / originalHeight
        );

        if (ratio >= 1.0) {
            return originalImage; // No necesita redimensionarse
        }

        int newWidth = (int) (originalWidth * ratio);
        int newHeight = (int) (originalHeight * ratio);

        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resizedImage.createGraphics();

        // Configurar para mejor calidad
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        g2d.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
        g2d.dispose();

        return resizedImage;
    }

    /**
     * Sube el archivo procesado a Oracle Cloud Infrastructure Object Storage.
     */
    private void uploadToOci(String objectName, byte[] data, String contentType) {
        try (InputStream inputStream = new ByteArrayInputStream(data)) {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .namespaceName(namespace)
                    .bucketName(bucketName)
                    .objectName(objectName)
                    .contentType(contentType)
                    .contentLength((long) data.length)
                    .putObjectBody(inputStream)
                    .build();

            objectStorageClient.putObject(putObjectRequest);

        } catch (Exception e) {
            log.error("Error subiendo archivo a OCI: {}", e.getMessage());
            throw new RuntimeException("Error subiendo archivo a OCI Object Storage", e);
        }
    }

    /**
     * Genera un nombre de archivo único para el usuario.
     */
    private String generateFileName(Long userId, String extension) {
        return String.format("user_%d_%s.%s",
                userId,
                UUID.randomUUID().toString().substring(0, 8),
                extension);
    }

    /**
     * Extrae la extensión del archivo de forma segura.
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "jpg";
        }
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    /**
     * Obtiene el formato de imagen correspondiente al tipo de contenido.
     */
    private String getImageFormat(String contentType) {
        return switch (contentType) {
            case "image/jpeg", "image/jpg" -> "jpg";
            case "image/png" -> "png";
            case "image/webp" -> "webp";
            default -> "jpg";
        };
    }

    /**
     * Extrae el nombre del objeto de la URL pública.
     */
    private String extractObjectNameFromUrl(String url) {
        return url.substring(url.indexOf("profile-images/"));
    }
}