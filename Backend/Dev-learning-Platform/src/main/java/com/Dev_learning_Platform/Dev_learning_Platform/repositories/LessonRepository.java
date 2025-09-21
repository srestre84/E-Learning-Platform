package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Lesson;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    
    List<Lesson> findByModuleIdOrderByOrderIndexAsc(Long moduleId);
    
    @Query("SELECT l FROM Lesson l WHERE l.module.id = :moduleId AND l.isActive = true ORDER BY l.orderIndex ASC")
    List<Lesson> findActiveLessonsByModuleId(@Param("moduleId") Long moduleId);
    
    @Query("SELECT l FROM Lesson l JOIN l.module m WHERE m.course.id = :courseId AND l.isActive = true ORDER BY m.orderIndex ASC, l.orderIndex ASC")
    List<Lesson> findActiveLessonsByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.module.id = :moduleId")
    Long countByModuleId(@Param("moduleId") Long moduleId);
}
