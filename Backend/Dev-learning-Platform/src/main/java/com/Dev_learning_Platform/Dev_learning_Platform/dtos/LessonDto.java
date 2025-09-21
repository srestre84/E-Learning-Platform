package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LessonDto {
    
    private Long id;
    
    @NotBlank(message = "El título de la lección es obligatorio")
    @Size(max = 200, message = "El título no puede exceder 200 caracteres")
    private String title;
    
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String description;
    
    @NotBlank(message = "El tipo de lección es obligatorio")
    @Pattern(regexp = "^(video|text|quiz)$", message = "El tipo debe ser video, text o quiz")
    private String type;
    
    @Pattern(regexp = "^https://(?:www\\.)?youtube\\.com/watch\\?v=[a-zA-Z0-9_-]+$", 
             message = "URL de YouTube inválida")
    private String youtubeUrl;
    
    private String youtubeVideoId;
    
    private String content;
    
    @NotNull(message = "El índice de orden es obligatorio")
    @Positive(message = "El índice de orden debe ser un número positivo")
    private Integer orderIndex;
    
    @Positive(message = "La duración debe ser un número positivo")
    private Integer durationSeconds;
    
    private Boolean isActive = true;
    
    private Long moduleId;
}
