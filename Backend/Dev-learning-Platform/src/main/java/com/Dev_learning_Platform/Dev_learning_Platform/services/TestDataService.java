package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Module;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Lesson;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CategoryRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.SubcategoryRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.UserRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.ModuleRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.LessonRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servicio para crear datos iniciales mínimos del sistema
 * Se ejecuta en perfiles de desarrollo, test, local y default
 */
@Service
@Profile({"dev", "test", "local", "default"})
@RequiredArgsConstructor
@Slf4j
public class TestDataService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Iniciando creación de datos iniciales...");
        
        // Solo crear datos si no existen
        if (userRepository.count() == 0) {
            createInitialData();
        } else {
            log.info("Datos ya existen, saltando creación inicial");
        }
    }

    private void createInitialData() {
        log.info("Creando datos iniciales del sistema...");

        // Crear usuario administrador (coincide con frontend)
        User admin = getOrCreateUser("Admin", "Sistema", "admin@test.com", "Password123", User.Role.ADMIN, true);
        
        // Crear instructor demo (coincide con frontend)
        User instructor = getOrCreateUser("Profesor", "Demo", "instructor@test.com", "Password123", User.Role.INSTRUCTOR, true);
        
        // Crear estudiante demo (coincide con frontend)
        User student = getOrCreateUser("Estudiante", "Demo", "student@test.com", "Password123", User.Role.STUDENT, true);

        // Crear categorías principales
        Category frontend = getOrCreateCategory("Frontend", "Desarrollo de interfaces de usuario", 1, true);
        Category backend = getOrCreateCategory("Backend", "Desarrollo de servidores y APIs", 2, true);
        Category dataScience = getOrCreateCategory("Data Science", "Ciencia de datos y análisis", 3, true);
        Category ai = getOrCreateCategory("Inteligencia Artificial", "IA y Machine Learning", 4, true);

        // Crear subcategorías
        Subcategory react = getOrCreateSubcategory("React", "Biblioteca de JavaScript para interfaces", frontend, 1, true);
        Subcategory vue = getOrCreateSubcategory("Vue.js", "Framework progresivo de JavaScript", frontend, 2, true);
        Subcategory angular = getOrCreateSubcategory("Angular", "Framework de TypeScript", frontend, 3, true);
        Subcategory javascript = getOrCreateSubcategory("JavaScript", "Lenguaje de programación web", frontend, 4, true);

        Subcategory springBoot = getOrCreateSubcategory("Spring Boot", "Framework de Java", backend, 1, true);
        Subcategory python = getOrCreateSubcategory("Python", "Lenguaje de programación", backend, 2, true);
        Subcategory django = getOrCreateSubcategory("Django", "Framework web de Python", backend, 3, true);

        Subcategory pythonDS = getOrCreateSubcategory("Python DS", "Python para ciencia de datos", dataScience, 1, true);
        Subcategory analytics = getOrCreateSubcategory("Analytics", "Análisis de datos", dataScience, 2, true);

        Subcategory machineLearning = getOrCreateSubcategory("Machine Learning", "Aprendizaje automático", ai, 1, true);
        Subcategory tensorflow = getOrCreateSubcategory("TensorFlow", "Framework de deep learning", ai, 2, true);

        // Crear algunos cursos de ejemplo
        createCourse("Introducción a React", 
                    "Aprende los fundamentos de React desde cero. Incluye componentes, estado, props y hooks básicos.", 
                    instructor, frontend, react, 
                    BigDecimal.valueOf(49.99), false, true, true, 
                    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop", 15);

        createCourse("Spring Boot Básico", 
                    "Desarrollo de aplicaciones web con Spring Boot. Incluye REST APIs, JPA y autenticación.", 
                    instructor, backend, springBoot, 
                    BigDecimal.valueOf(79.99), true, true, true, 
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop", 25);

        createCourse("Python para Data Science", 
                    "Introducción al análisis de datos con Python. Incluye pandas, numpy y visualizaciones.", 
                    instructor, dataScience, pythonDS, 
                    BigDecimal.valueOf(89.99), true, true, true, 
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop", 20);

        createCourse("Machine Learning con Python", 
                    "Aprende machine learning desde cero con scikit-learn y proyectos prácticos.", 
                    instructor, ai, machineLearning, 
                    BigDecimal.valueOf(149.99), true, true, true, 
                    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop", 35);

        // Crear módulos y lecciones para los cursos
        createModulesAndLessons();

        log.info("Datos iniciales creados exitosamente");
    }

    private User getOrCreateUser(String userName, String lastName, String email, String password, User.Role role, boolean isActive) {
        User existingUser = userRepository.findByEmail(email);
        if (existingUser != null) {
            log.info("Usuario '{}' ya existe, usando existente", email);
            return existingUser;
        } else {
            log.info("Usuario '{}' no existe, creando nuevo", email);
            return createUser(userName, lastName, email, password, role, isActive);
        }
    }

    private User createUser(String userName, String lastName, String email, String password, User.Role role, boolean isActive) {
        User user = new User();
        user.setUserName(userName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setActive(isActive);
        return userRepository.save(user);
    }

    private Category getOrCreateCategory(String name, String description, int sortOrder, boolean isActive) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> {
                    log.info("Categoría '{}' no existe, creando nueva", name);
                    return createCategory(name, description, sortOrder, isActive);
                });
    }

    private Category createCategory(String name, String description, int sortOrder, boolean isActive) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setSortOrder(sortOrder);
        category.setIsActive(isActive);
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }

    private Subcategory getOrCreateSubcategory(String name, String description, Category category, int sortOrder, boolean isActive) {
        return subcategoryRepository.findByNameAndCategoryId(name, category.getId())
                .orElseGet(() -> {
                    log.info("Subcategoría '{}' no existe en categoría '{}', creando nueva", name, category.getName());
                    return createSubcategory(name, description, category, sortOrder, isActive);
                });
    }

    private Subcategory createSubcategory(String name, String description, Category category, int sortOrder, boolean isActive) {
        Subcategory subcategory = new Subcategory();
        subcategory.setName(name);
        subcategory.setDescription(description);
        subcategory.setCategory(category);
        subcategory.setSortOrder(sortOrder);
        subcategory.setIsActive(isActive);
        subcategory.setCreatedAt(LocalDateTime.now());
        subcategory.setUpdatedAt(LocalDateTime.now());
        return subcategoryRepository.save(subcategory);
    }

    private Course createCourse(String title, String description, User instructor, Category category, Subcategory subcategory, 
                               BigDecimal price, boolean isPremium, boolean isPublished, boolean isActive, String thumbnailUrl, int estimatedHours) {
        Course course = new Course();
        course.setTitle(title);
        course.setDescription(description);
        course.setShortDescription(description.length() > 100 ? description.substring(0, 100) + "..." : description);
        course.setInstructor(instructor);
        course.setCategory(category);
        course.setSubcategory(subcategory);
        course.setPrice(price);
        course.setIsPremium(isPremium);
        course.setIsPublished(isPublished);
        course.setIsActive(isActive);
        course.setThumbnailUrl(thumbnailUrl);
        course.setEstimatedHours(estimatedHours);
        course.setLevel("INTERMEDIATE");
        return courseRepository.save(course);
    }

    private void createModulesAndLessons() {
        log.info("Creando módulos y lecciones para los cursos...");
        
        // Obtener todos los cursos creados
        List<Course> courses = courseRepository.findAll();
        
        for (Course course : courses) {
            // Crear módulos para cada curso
            Module module1 = createModule(course, 1, "Introducción", "Conceptos básicos del curso");
            Module module2 = createModule(course, 2, "Desarrollo Práctico", "Ejercicios y proyectos");
            Module module3 = createModule(course, 3, "Avanzado", "Temas avanzados y mejores prácticas");
            
            // Crear lecciones para cada módulo
            createLesson(module1, 1, "Bienvenida al curso", "video", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 180);
            createLesson(module1, 2, "¿Qué aprenderás?", "video", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 240);
            createLesson(module1, 3, "Configuración del entorno", "video", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 300);
            
            createLesson(module2, 1, "Primer ejercicio", "video", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 420);
            createLesson(module2, 2, "Segundo ejercicio", "video", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 360);
            
            createLesson(module3, 1, "Temas avanzados", "video", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 480);
            createLesson(module3, 2, "Proyecto final", "video", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 600);
        }
        
        log.info("Módulos y lecciones creados exitosamente");
    }

    private Module createModule(Course course, int orderIndex, String title, String description) {
        Module module = new Module();
        module.setTitle(title);
        module.setDescription(description);
        module.setCourse(course);
        module.setOrderIndex(orderIndex);
        module.setIsActive(true);
        return moduleRepository.save(module);
    }

    private Lesson createLesson(Module module, int orderIndex, String title, String type, String youtubeUrl, int durationSeconds) {
        Lesson lesson = new Lesson();
        lesson.setTitle(title);
        lesson.setDescription("Descripción de la lección: " + title);
        lesson.setType(type);
        lesson.setContent("Contenido adicional de la lección");
        lesson.setModule(module);
        lesson.setOrderIndex(orderIndex);
        lesson.setYoutubeUrl(youtubeUrl);
        lesson.setYoutubeVideoId(extractVideoId(youtubeUrl));
        lesson.setDurationSeconds(durationSeconds);
        lesson.setIsActive(true);
        return lessonRepository.save(lesson);
    }

    private String extractVideoId(String youtubeUrl) {
        if (youtubeUrl == null || !youtubeUrl.contains("youtube.com/watch?v=")) {
            return "dQw4w9WgXcQ"; // Video ID por defecto
        }
        String[] parts = youtubeUrl.split("v=");
        if (parts.length > 1) {
            String videoId = parts[1].split("&")[0];
            return videoId;
        }
        return "dQw4w9WgXcQ";
    }
}
