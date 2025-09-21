package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Module;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    
    List<Module> findByCourseIdOrderByOrderIndexAsc(Long courseId);
    
    @Query("SELECT m FROM Module m WHERE m.course.id = :courseId AND m.isActive = true ORDER BY m.orderIndex ASC")
    List<Module> findActiveModulesByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(m) FROM Module m WHERE m.course.id = :courseId")
    Long countByCourseId(@Param("courseId") Long courseId);
}
