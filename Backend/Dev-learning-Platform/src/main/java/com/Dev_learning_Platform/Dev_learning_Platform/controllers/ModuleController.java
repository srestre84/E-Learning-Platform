package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Module;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.ModuleRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.LessonRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseDetailDto.ModuleDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseDetailDto.LessonDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ModuleDto>> getModulesByCourse(@PathVariable Long courseId) {
        List<Module> modules = moduleRepository.findActiveModulesByCourseId(courseId);
        List<ModuleDto> moduleDtos = modules.stream()
            .map(ModuleDto::fromModule)
            .toList();
        return ResponseEntity.ok(moduleDtos);
    }

    @GetMapping("/{moduleId}/lessons")
    public ResponseEntity<List<LessonDto>> getLessonsByModule(@PathVariable Long moduleId) {
        List<com.Dev_learning_Platform.Dev_learning_Platform.models.Lesson> lessons = lessonRepository.findActiveLessonsByModuleId(moduleId);
        List<LessonDto> lessonDtos = lessons.stream()
            .map(LessonDto::fromLesson)
            .toList();
        return ResponseEntity.ok(lessonDtos);
    }

    @GetMapping("/course/{courseId}/lessons")
    public ResponseEntity<List<LessonDto>> getLessonsByCourse(@PathVariable Long courseId) {
        List<com.Dev_learning_Platform.Dev_learning_Platform.models.Lesson> lessons = lessonRepository.findActiveLessonsByCourseId(courseId);
        List<LessonDto> lessonDtos = lessons.stream()
            .map(LessonDto::fromLesson)
            .toList();
        return ResponseEntity.ok(lessonDtos);
    }
}
