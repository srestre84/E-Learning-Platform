package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModuleDto {
    
    private Long id;
    
    @NotBlank(message = "El título del módulo es obligatorio")
    @Size(max = 200, message = "El título no puede exceder 200 caracteres")
    private String title;
    
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String description;
    
    @NotNull(message = "El índice de orden es obligatorio")
    @Positive(message = "El índice de orden debe ser un número positivo")
    private Integer orderIndex;
    
    private Boolean isActive = true;
    
    private Long courseId;
    
    private List<LessonDto> lessons;
}
