package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import java.time.LocalDateTime;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment.EnrollmentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para inscripciones que incluye datos del curso
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentWithCourseDto {
    
    private Long id;
    private Long courseId;
    private String courseTitle;
    private String courseDescription;
    private String courseThumbnailUrl;
    private Double coursePrice;
    private Boolean courseIsPremium;
    private String instructorName;
    private String instructorLastName;
    private EnrollmentStatus status;
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;
    private Integer progressPercentage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructor para crear desde Enrollment
    public static EnrollmentWithCourseDto fromEnrollment(com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment enrollment) {
        EnrollmentWithCourseDto dto = new EnrollmentWithCourseDto();
        
        dto.setId(enrollment.getId());
        dto.setStatus(enrollment.getStatus());
        dto.setEnrolledAt(enrollment.getEnrolledAt());
        dto.setCompletedAt(enrollment.getCompletedAt());
        dto.setProgressPercentage(enrollment.getProgressPercentage());
        dto.setCreatedAt(enrollment.getCreatedAt());
        dto.setUpdatedAt(enrollment.getUpdatedAt());
        
        // Datos del curso
        if (enrollment.getCourse() != null) {
            dto.setCourseId(enrollment.getCourse().getId());
            dto.setCourseTitle(enrollment.getCourse().getTitle());
            dto.setCourseDescription(enrollment.getCourse().getDescription());
            dto.setCourseThumbnailUrl(enrollment.getCourse().getThumbnailUrl());
            dto.setCoursePrice(enrollment.getCourse().getPrice().doubleValue());
            dto.setCourseIsPremium(enrollment.getCourse().getIsPremium());
            
            // Datos del instructor
            if (enrollment.getCourse().getInstructor() != null) {
                dto.setInstructorName(enrollment.getCourse().getInstructor().getUserName());
                dto.setInstructorLastName(enrollment.getCourse().getInstructor().getLastName());
            }
        }
        
        return dto;
    }
}
