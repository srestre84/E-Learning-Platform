package com.Dev_learning_Platform.Dev_learning_Platform.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment.EnrollmentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentWithCourseDto {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private String courseDescription;
    private String courseThumbnailUrl;
    private Integer courseEstimatedHours;
    private String courseLevel;
    private Boolean courseIsPremium;
    private BigDecimal coursePrice;
    private EnrollmentStatus status;
    private Integer progressPercentage;
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;
    
    public EnrollmentWithCourseDto(com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment enrollment) {
        this.id = enrollment.getId();
        this.courseId = enrollment.getCourse().getId();
        this.courseTitle = enrollment.getCourse().getTitle();
        this.courseDescription = enrollment.getCourse().getDescription();
        this.courseThumbnailUrl = enrollment.getCourse().getThumbnailUrl();
        this.courseEstimatedHours = enrollment.getCourse().getEstimatedHours();
        this.courseLevel = enrollment.getCourse().getLevel();
        this.courseIsPremium = enrollment.getCourse().getIsPremium();
        this.coursePrice = enrollment.getCourse().getPrice();
        this.status = enrollment.getStatus();
        this.progressPercentage = enrollment.getProgressPercentage();
        this.enrolledAt = enrollment.getEnrolledAt();
        this.completedAt = enrollment.getCompletedAt();
    }
    
    public static EnrollmentWithCourseDto fromEnrollment(com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment enrollment) {
        return new EnrollmentWithCourseDto(enrollment);
    }
}
