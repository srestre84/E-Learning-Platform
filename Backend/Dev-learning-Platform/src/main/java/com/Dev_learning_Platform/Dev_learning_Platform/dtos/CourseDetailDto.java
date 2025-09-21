package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Module;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para detalles del curso sin referencias circulares
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDetailDto {
    
    private Long id;
    private String title;
    private String description;
    private String shortDescription;
    private String thumbnailUrl;
    private BigDecimal price;
    private Boolean isPremium;
    private Boolean isPublished;
    private Boolean isActive;
    private Integer estimatedHours;
    private String level;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Datos del instructor
    private InstructorDto instructor;
    
    // Datos de categoría
    private CategoryDto category;
    private SubcategoryDto subcategory;
    
    // Módulos del curso
    private List<ModuleDto> modules;
    
    // Constructor para crear desde Course
    public static CourseDetailDto fromCourse(Course course) {
        CourseDetailDto dto = new CourseDetailDto();
        
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setShortDescription(course.getShortDescription());
        dto.setThumbnailUrl(course.getThumbnailUrl());
        dto.setPrice(course.getPrice());
        dto.setIsPremium(course.getIsPremium());
        dto.setIsPublished(course.getIsPublished());
        dto.setIsActive(course.getIsActive());
        dto.setEstimatedHours(course.getEstimatedHours());
        dto.setLevel(course.getLevel());
        dto.setCreatedAt(course.getCreatedAt());
        dto.setUpdatedAt(course.getUpdatedAt());
        
        // Datos del instructor
        if (course.getInstructor() != null) {
            dto.setInstructor(InstructorDto.fromUser(course.getInstructor()));
        }
        
        // Datos de categoría
        if (course.getCategory() != null) {
            dto.setCategory(CategoryDto.fromCategory(course.getCategory()));
        }
        
        if (course.getSubcategory() != null) {
            dto.setSubcategory(SubcategoryDto.fromSubcategory(course.getSubcategory()));
        }
        
        // Módulos del curso
        if (course.getModules() != null) {
            dto.setModules(course.getModules().stream()
                .map(ModuleDto::fromModule)
                .toList());
        }
        
        return dto;
    }
    
    // DTOs internos
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InstructorDto {
        private Long id;
        private String userName;
        private String lastName;
        private String email;
        private String profileImageUrl;
        
        public static InstructorDto fromUser(com.Dev_learning_Platform.Dev_learning_Platform.models.User user) {
            InstructorDto dto = new InstructorDto();
            dto.setId(user.getId());
            dto.setUserName(user.getUserName());
            dto.setLastName(user.getLastName());
            dto.setEmail(user.getEmail());
            dto.setProfileImageUrl(user.getProfileImageUrl());
            return dto;
        }
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDto {
        private Long id;
        private String name;
        private String description;
        private String icon;
        private String color;
        
        public static CategoryDto fromCategory(com.Dev_learning_Platform.Dev_learning_Platform.models.Category category) {
            CategoryDto dto = new CategoryDto();
            dto.setId(category.getId());
            dto.setName(category.getName());
            dto.setDescription(category.getDescription());
            dto.setIcon(category.getIcon());
            dto.setColor(category.getColor());
            return dto;
        }
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubcategoryDto {
        private Long id;
        private String name;
        private String description;
        private String icon;
        private String color;
        
        public static SubcategoryDto fromSubcategory(com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory subcategory) {
            SubcategoryDto dto = new SubcategoryDto();
            dto.setId(subcategory.getId());
            dto.setName(subcategory.getName());
            dto.setDescription(subcategory.getDescription());
            dto.setIcon(subcategory.getIcon());
            dto.setColor(subcategory.getColor());
            return dto;
        }
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModuleDto {
        private Long id;
        private String title;
        private String description;
        private Integer orderIndex;
        private Boolean isActive;
        private List<LessonDto> lessons;
        
        public static ModuleDto fromModule(Module module) {
            ModuleDto dto = new ModuleDto();
            dto.setId(module.getId());
            dto.setTitle(module.getTitle());
            dto.setDescription(module.getDescription());
            dto.setOrderIndex(module.getOrderIndex());
            dto.setIsActive(module.getIsActive());
            
            // Lecciones del módulo
            if (module.getLessons() != null) {
                dto.setLessons(module.getLessons().stream()
                    .map(LessonDto::fromLesson)
                    .toList());
            }
            
            return dto;
        }
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LessonDto {
        private Long id;
        private String title;
        private String description;
        private String type;
        private String youtubeUrl;
        private String youtubeVideoId;
        private String content;
        private Integer orderIndex;
        private Integer durationSeconds;
        private Boolean isActive;
        
        public static LessonDto fromLesson(com.Dev_learning_Platform.Dev_learning_Platform.models.Lesson lesson) {
            LessonDto dto = new LessonDto();
            dto.setId(lesson.getId());
            dto.setTitle(lesson.getTitle());
            dto.setDescription(lesson.getDescription());
            dto.setType(lesson.getType());
            dto.setYoutubeUrl(lesson.getYoutubeUrl());
            dto.setYoutubeVideoId(lesson.getYoutubeVideoId());
            dto.setContent(lesson.getContent());
            dto.setOrderIndex(lesson.getOrderIndex());
            dto.setDurationSeconds(lesson.getDurationSeconds());
            dto.setIsActive(lesson.getIsActive());
            return dto;
        }
    }
}
