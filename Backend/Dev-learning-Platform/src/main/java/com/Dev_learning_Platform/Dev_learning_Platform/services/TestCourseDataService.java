package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseCreateDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.LessonDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.ModuleDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Lesson;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Module;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CategoryRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.LessonRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.ModuleRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.SubcategoryRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.UserRepository;

@Service
@Transactional
public class TestCourseDataService {

    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private ModuleRepository moduleRepository;
    
    @Autowired
    private LessonRepository lessonRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private SubcategoryRepository subcategoryRepository;

    public void createTestCourses() {
        // Crear instructor de prueba si no existe
        User instructor = createTestInstructor();
        
        // Crear categorías y subcategorías si no existen
        Category programmingCategory = createTestCategory("Programación", 1L);
        Category designCategory = createTestCategory("Diseño", 2L);
        
        Subcategory webDevSubcategory = createTestSubcategory("Desarrollo Web", 1L, programmingCategory);
        Subcategory uiUxSubcategory = createTestSubcategory("UI/UX", 2L, designCategory);
        
        // Crear cursos de prueba
        createTestCourse1(instructor, programmingCategory, webDevSubcategory);
        createTestCourse2(instructor, designCategory, uiUxSubcategory);
        createTestCourse3(instructor, programmingCategory, webDevSubcategory);
    }
    
    private User createTestInstructor() {
        User instructor = userRepository.findByEmail("instructor@test.com");
        if (instructor == null) {
            instructor = new User();
            instructor.setEmail("instructor@test.com");
            instructor.setPassword("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi"); // password: 123456
            instructor.setUserName("Juan");
            instructor.setLastName("Pérez");
            instructor.setRole(User.Role.INSTRUCTOR);
            instructor.setActive(true);
            instructor = userRepository.save(instructor);
        }
        return instructor;
    }
    
    private Category createTestCategory(String name, Long id) {
        Category category = categoryRepository.findById(id).orElse(null);
        if (category == null) {
            category = new Category();
            category.setId(id);
            category.setName(name);
            category.setDescription("Categoría de " + name);
            category.setIsActive(true);
            category = categoryRepository.save(category);
        }
        return category;
    }
    
    private Subcategory createTestSubcategory(String name, Long id, Category category) {
        Subcategory subcategory = subcategoryRepository.findById(id).orElse(null);
        if (subcategory == null) {
            subcategory = new Subcategory();
            subcategory.setId(id);
            subcategory.setName(name);
            subcategory.setDescription("Subcategoría de " + name);
            subcategory.setCategory(category);
            subcategory.setIsActive(true);
            subcategory = subcategoryRepository.save(subcategory);
        }
        return subcategory;
    }
    
    private void createTestCourse1(User instructor, Category category, Subcategory subcategory) {
        Course course = new Course();
        course.setTitle("Aprende React desde Cero");
        course.setDescription("Curso completo de React para principiantes. Aprenderás los conceptos fundamentales de React, hooks, estado, props y mucho más.");
        course.setShortDescription("Curso completo de React para principiantes");
        course.setInstructor(instructor);
        course.setCategory(category);
        course.setSubcategory(subcategory);
        course.setPrice(new BigDecimal("49.99"));
        course.setIsPremium(true);
        course.setIsPublished(true);
        course.setIsActive(true);
        course.setEstimatedHours(20);
        course.setThumbnailUrl("https://via.placeholder.com/400x300/61dafb/ffffff?text=React+Course");
        
        course = courseRepository.save(course);
        
        // Crear módulos y lecciones
        createModule1(course);
        createModule2(course);
    }
    
    private void createTestCourse2(User instructor, Category category, Subcategory subcategory) {
        Course course = new Course();
        course.setTitle("Diseño UI/UX con Figma");
        course.setDescription("Aprende a diseñar interfaces de usuario modernas y atractivas usando Figma. Desde conceptos básicos hasta prototipos interactivos.");
        course.setShortDescription("Diseño de interfaces con Figma");
        course.setInstructor(instructor);
        course.setCategory(category);
        course.setSubcategory(subcategory);
        course.setPrice(new BigDecimal("39.99"));
        course.setIsPremium(true);
        course.setIsPublished(true);
        course.setIsActive(true);
        course.setEstimatedHours(15);
        course.setThumbnailUrl("https://via.placeholder.com/400x300/00d2ff/ffffff?text=Figma+Course");
        
        course = courseRepository.save(course);
        
        // Crear módulos y lecciones
        createModule3(course);
        createModule4(course);
    }
    
    private void createTestCourse3(User instructor, Category category, Subcategory subcategory) {
        Course course = new Course();
        course.setTitle("JavaScript Avanzado");
        course.setDescription("Domina JavaScript moderno con ES6+, async/await, promesas, closures y patrones avanzados de programación.");
        course.setShortDescription("JavaScript moderno y avanzado");
        course.setInstructor(instructor);
        course.setCategory(category);
        course.setSubcategory(subcategory);
        course.setPrice(new BigDecimal("59.99"));
        course.setIsPremium(true);
        course.setIsPublished(true);
        course.setIsActive(true);
        course.setEstimatedHours(25);
        course.setThumbnailUrl("https://via.placeholder.com/400x300/f7df1e/000000?text=JavaScript+Course");
        
        course = courseRepository.save(course);
        
        // Crear módulos y lecciones
        createModule5(course);
        createModule6(course);
    }
    
    private void createModule1(Course course) {
        Module module = new Module();
        module.setTitle("Introducción a React");
        module.setDescription("Conceptos básicos y configuración del entorno de desarrollo");
        module.setOrderIndex(1);
        module.setIsActive(true);
        module.setCourse(course);
        module = moduleRepository.save(module);
        
        // Lecciones del módulo 1
        createLesson(module, "¿Qué es React?", "Introducción a la librería de React", "video", 
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 180, 1);
        createLesson(module, "Configuración del entorno", "Instalación de Node.js y creación del primer proyecto", "video", 
            "https://www.youtube.com/watch?v=y8Kyi0WNg40", 240, 2);
        createLesson(module, "Componentes básicos", "Creando tu primer componente de React", "video", 
            "https://www.youtube.com/watch?v=kfF40g-y_1A", 300, 3);
    }
    
    private void createModule2(Course course) {
        Module module = new Module();
        module.setTitle("Hooks y Estado");
        module.setDescription("Manejo de estado con hooks modernos de React");
        module.setOrderIndex(2);
        module.setIsActive(true);
        module.setCourse(course);
        module = moduleRepository.save(module);
        
        // Lecciones del módulo 2
        createLesson(module, "useState Hook", "Manejo de estado local con useState", "video", 
            "https://www.youtube.com/watch?v=o-YBDTqX_ZU", 280, 1);
        createLesson(module, "useEffect Hook", "Efectos secundarios y ciclo de vida", "video", 
            "https://www.youtube.com/watch?v=M_x_h_0_1_A", 320, 2);
        createLesson(module, "Custom Hooks", "Creando tus propios hooks personalizados", "video", 
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 250, 3);
    }
    
    private void createModule3(Course course) {
        Module module = new Module();
        module.setTitle("Fundamentos de UI/UX");
        module.setDescription("Principios básicos del diseño de interfaces");
        module.setOrderIndex(1);
        module.setIsActive(true);
        module.setCourse(course);
        module = moduleRepository.save(module);
        
        // Lecciones del módulo 3
        createLesson(module, "Introducción al diseño UI/UX", "Conceptos fundamentales del diseño", "video", 
            "https://www.youtube.com/watch?v=y8Kyi0WNg40", 200, 1);
        createLesson(module, "Principios de diseño", "Ley de proximidad, alineación y contraste", "video", 
            "https://www.youtube.com/watch?v=kfF40g-y_1A", 280, 2);
    }
    
    private void createModule4(Course course) {
        Module module = new Module();
        module.setTitle("Trabajando con Figma");
        module.setDescription("Herramientas y técnicas avanzadas de Figma");
        module.setOrderIndex(2);
        module.setIsActive(true);
        module.setCourse(course);
        module = moduleRepository.save(module);
        
        // Lecciones del módulo 4
        createLesson(module, "Interfaz de Figma", "Navegando por la interfaz de Figma", "video", 
            "https://www.youtube.com/watch?v=o-YBDTqX_ZU", 220, 1);
        createLesson(module, "Creando componentes", "Diseño de componentes reutilizables", "video", 
            "https://www.youtube.com/watch?v=M_x_h_0_1_A", 300, 2);
    }
    
    private void createModule5(Course course) {
        Module module = new Module();
        module.setTitle("ES6+ y Funciones Modernas");
        module.setDescription("Características modernas de JavaScript");
        module.setOrderIndex(1);
        module.setIsActive(true);
        module.setCourse(course);
        module = moduleRepository.save(module);
        
        // Lecciones del módulo 5
        createLesson(module, "Arrow Functions", "Sintaxis moderna de funciones", "video", 
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 180, 1);
        createLesson(module, "Destructuring", "Desestructuración de objetos y arrays", "video", 
            "https://www.youtube.com/watch?v=y8Kyi0WNg40", 240, 2);
        createLesson(module, "Template Literals", "Strings modernos con template literals", "video", 
            "https://www.youtube.com/watch?v=kfF40g-y_1A", 200, 3);
    }
    
    private void createModule6(Course course) {
        Module module = new Module();
        module.setTitle("Programación Asíncrona");
        module.setDescription("Promesas, async/await y manejo de asincronía");
        module.setOrderIndex(2);
        module.setIsActive(true);
        module.setCourse(course);
        module = moduleRepository.save(module);
        
        // Lecciones del módulo 6
        createLesson(module, "Promesas", "Manejo de operaciones asíncronas con promesas", "video", 
            "https://www.youtube.com/watch?v=o-YBDTqX_ZU", 300, 1);
        createLesson(module, "Async/Await", "Sintaxis moderna para operaciones asíncronas", "video", 
            "https://www.youtube.com/watch?v=M_x_h_0_1_A", 280, 2);
    }
    
    private void createLesson(Module module, String title, String description, String type, 
                            String youtubeUrl, Integer durationSeconds, Integer orderIndex) {
        Lesson lesson = new Lesson();
        lesson.setTitle(title);
        lesson.setDescription(description);
        lesson.setType(type);
        lesson.setYoutubeUrl(youtubeUrl);
        lesson.setYoutubeVideoId(Lesson.extractVideoId(youtubeUrl));
        lesson.setOrderIndex(orderIndex);
        lesson.setDurationSeconds(durationSeconds);
        lesson.setIsActive(true);
        lesson.setModule(module);
        lessonRepository.save(lesson);
    }
}

