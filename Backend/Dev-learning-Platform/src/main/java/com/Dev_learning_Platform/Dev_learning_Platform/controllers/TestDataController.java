package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Module;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Lesson;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.UserRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.EnrollmentRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CategoryRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseService;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseCreateDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.ModuleDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.LessonDto;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.SubcategoryRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.ModuleRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.LessonRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.PaymentRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Payment;
import com.Dev_learning_Platform.Dev_learning_Platform.services.TestCourseDataService;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/test")
public class TestDataController {

    @Autowired
    private TestCourseDataService testCourseDataService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private ModuleRepository moduleRepository;
    
    @Autowired
    private LessonRepository lessonRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private CourseService courseService;

    @PostMapping("/create-courses")
    public ResponseEntity<String> createTestCourses() {
        try {
            testCourseDataService.createTestCourses();
            return ResponseEntity.ok("Cursos de prueba creados exitosamente");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error al crear cursos de prueba: " + e.getMessage());
        }
    }

    @PostMapping("/create-test-users")
    public ResponseEntity<String> createTestUsers() {
        try {
            // Verificar si ya existen usuarios de prueba
            if (userRepository.count() > 0) {
                return ResponseEntity.ok("Los usuarios de prueba ya existen");
            }

            final String testPassword = "Password123";

            // Crear usuario administrador
            User admin = new User();
            admin.setUserName("Admin");
            admin.setLastName("Sistema");
            admin.setEmail("admin@test.com");
            admin.setPassword(passwordEncoder.encode(testPassword));
            admin.setRole(User.Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);

            // Crear instructor de prueba
            User instructor = new User();
            instructor.setUserName("Juan");
            instructor.setLastName("Pérez");
            instructor.setEmail("instructor@test.com");
            instructor.setPassword(passwordEncoder.encode(testPassword));
            instructor.setRole(User.Role.INSTRUCTOR);
            instructor.setActive(true);
            userRepository.save(instructor);

            // Crear estudiante de prueba
            User student = new User();
            student.setUserName("Ana");
            student.setLastName("Martínez");
            student.setEmail("student@test.com");
            student.setPassword(passwordEncoder.encode(testPassword));
            student.setRole(User.Role.STUDENT);
            student.setActive(true);
            userRepository.save(student);

            return ResponseEntity.ok("Usuarios creados: admin@test.com, instructor@test.com, student@test.com - Password: " + testPassword);
        } catch (Exception e) {
            e.printStackTrace(); // Agregar log del error
            return ResponseEntity.internalServerError()
                .body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/create-sample-students")
    public ResponseEntity<String> createSampleStudents() {
        try {
            final String testPassword = "Password123";

            // Lista de estudiantes de ejemplo
            List<String[]> students = Arrays.asList(
                new String[]{"María", "González", "maria.gonzalez@example.com"},
                new String[]{"Carlos", "Rodríguez", "carlos.rodriguez@example.com"},
                new String[]{"Laura", "Fernández", "laura.fernandez@example.com"},
                new String[]{"Pedro", "López", "pedro.lopez@example.com"},
                new String[]{"Sofía", "Martín", "sofia.martin@example.com"},
                new String[]{"Diego", "Sánchez", "diego.sanchez@example.com"},
                new String[]{"Valentina", "Pérez", "valentina.perez@example.com"},
                new String[]{"Andrés", "García", "andres.garcia@example.com"},
                new String[]{"Camila", "Hernández", "camila.hernandez@example.com"},
                new String[]{"Sebastián", "Martínez", "sebastian.martinez@example.com"}
            );

            int createdStudents = 0;
            for (String[] studentData : students) {
                // Verificar si el estudiante ya existe
                if (userRepository.existsByEmail(studentData[2])) {
                    continue; // Saltar si ya existe
                }

                User student = new User();
                student.setUserName(studentData[0]);
                student.setLastName(studentData[1]);
                student.setEmail(studentData[2]);
                student.setPassword(passwordEncoder.encode(testPassword));
                student.setRole(User.Role.STUDENT);
                student.setActive(true);
                userRepository.save(student);
                createdStudents++;
            }

            // Crear inscripciones de ejemplo para algunos estudiantes
            createSampleEnrollments();

            return ResponseEntity.ok(String.format(
                "Se crearon %d estudiantes de ejemplo. Password para todos: %s. " +
                "Se crearon inscripciones de ejemplo en varios cursos.", 
                createdStudents, testPassword
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Error al crear estudiantes de ejemplo: " + e.getMessage());
        }
    }

    private void createSampleEnrollments() {
        try {
            // Obtener algunos cursos existentes
            List<Course> courses = courseRepository.findAll();
            if (courses.isEmpty()) {
                return;
            }

            // Obtener estudiantes creados
            List<User> students = userRepository.findByRole(User.Role.STUDENT);
            if (students.isEmpty()) {
                return;
            }

            // Crear inscripciones de ejemplo
            int enrollmentsCreated = 0;
            for (User student : students) {
                // Cada estudiante se inscribe en 2-4 cursos aleatorios
                int numCourses = (int) (Math.random() * 3) + 2; // 2-4 cursos
                
                for (int i = 0; i < numCourses && i < courses.size(); i++) {
                    Course course = courses.get(i);
                    
                    // Verificar si ya está inscrito
                    if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
                        continue;
                    }

                    Enrollment enrollment = new Enrollment();
                    enrollment.setStudent(student);
                    enrollment.setCourse(course);
                    enrollment.setEnrolledAt(java.time.LocalDateTime.now());
                    enrollment.setStatus(Enrollment.EnrollmentStatus.ACTIVE);
                    enrollmentRepository.save(enrollment);
                    enrollmentsCreated++;
                }
            }

            System.out.println("Se crearon " + enrollmentsCreated + " inscripciones de ejemplo");
        } catch (Exception e) {
            System.err.println("Error al crear inscripciones de ejemplo: " + e.getMessage());
        }
    }

    @GetMapping("/verify-students")
    public ResponseEntity<String> verifyStudents() {
        try {
            List<User> students = userRepository.findByRole(User.Role.STUDENT);
            List<Course> courses = courseRepository.findAll();
            List<Enrollment> enrollments = enrollmentRepository.findAll();

            StringBuilder result = new StringBuilder();
            result.append("=== ESTUDIANTES CREADOS ===\n");
            result.append("Total estudiantes: ").append(students.size()).append("\n\n");
            
            result.append("=== LISTA DE ESTUDIANTES ===\n");
            for (User student : students) {
                result.append("- ").append(student.getUserName()).append(" ").append(student.getLastName())
                      .append(" (").append(student.getEmail()).append(")\n");
            }
            
            result.append("\n=== CURSOS DISPONIBLES ===\n");
            result.append("Total cursos: ").append(courses.size()).append("\n");
            for (Course course : courses) {
                result.append("- ").append(course.getTitle()).append(" (ID: ").append(course.getId()).append(")\n");
            }
            
            result.append("\n=== INSCRIPCIONES CREADAS ===\n");
            result.append("Total inscripciones: ").append(enrollments.size()).append("\n");
            for (Enrollment enrollment : enrollments) {
                result.append("- ").append(enrollment.getStudent().getUserName())
                      .append(" inscrito en ").append(enrollment.getCourse().getTitle())
                      .append(" (Estado: ").append(enrollment.getStatus()).append(")\n");
            }

            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Error al verificar estudiantes: " + e.getMessage());
        }
    }

    @PostMapping("/create-new-sample-students")
    public ResponseEntity<String> createNewSampleStudents() {
        try {
            final String testPassword = "Password123";

            // Lista de estudiantes de ejemplo nuevos
            List<String[]> newStudents = Arrays.asList(
                new String[]{"María", "González", "maria.gonzalez@example.com"},
                new String[]{"Carlos", "Rodríguez", "carlos.rodriguez@example.com"},
                new String[]{"Laura", "Fernández", "laura.fernandez@example.com"},
                new String[]{"Pedro", "López", "pedro.lopez@example.com"},
                new String[]{"Sofía", "Martín", "sofia.martin@example.com"},
                new String[]{"Diego", "Sánchez", "diego.sanchez@example.com"},
                new String[]{"Valentina", "Pérez", "valentina.perez@example.com"},
                new String[]{"Andrés", "García", "andres.garcia@example.com"},
                new String[]{"Camila", "Hernández", "camila.hernandez@example.com"},
                new String[]{"Sebastián", "Martínez", "sebastian.martinez@example.com"}
            );

            int createdStudents = 0;
            for (String[] studentData : newStudents) {
                // Verificar si el estudiante ya existe
                if (userRepository.existsByEmail(studentData[2])) {
                    continue; // Saltar si ya existe
                }

                User student = new User();
                student.setUserName(studentData[0]);
                student.setLastName(studentData[1]);
                student.setEmail(studentData[2]);
                student.setPassword(passwordEncoder.encode(testPassword));
                student.setRole(User.Role.STUDENT);
                student.setActive(true);
                userRepository.save(student);
                createdStudents++;
            }

            // Crear inscripciones de ejemplo para los nuevos estudiantes
            createNewSampleEnrollments();

            return ResponseEntity.ok(String.format(
                "Se crearon %d estudiantes de ejemplo nuevos. Password para todos: %s. " +
                "Se crearon inscripciones de ejemplo en varios cursos.", 
                createdStudents, testPassword
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Error al crear estudiantes de ejemplo: " + e.getMessage());
        }
    }

    private void createNewSampleEnrollments() {
        try {
            // Obtener algunos cursos existentes
            List<Course> courses = courseRepository.findAll();
            if (courses.isEmpty()) {
                return;
            }

            // Obtener solo los estudiantes nuevos (los que tienen @example.com)
            List<User> newStudents = userRepository.findByRole(User.Role.STUDENT)
                .stream()
                .filter(student -> student.getEmail().endsWith("@example.com"))
                .collect(java.util.stream.Collectors.toList());
            
            if (newStudents.isEmpty()) {
                return;
            }

            // Crear inscripciones de ejemplo
            int enrollmentsCreated = 0;
            for (User student : newStudents) {
                // Cada estudiante se inscribe en 2-4 cursos aleatorios
                int numCourses = (int) (Math.random() * 3) + 2; // 2-4 cursos
                
                for (int i = 0; i < numCourses && i < courses.size(); i++) {
                    Course course = courses.get(i);
                    
                    // Verificar si ya está inscrito
                    if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
                        continue;
                    }

                    Enrollment enrollment = new Enrollment();
                    enrollment.setStudent(student);
                    enrollment.setCourse(course);
                    enrollment.setEnrolledAt(java.time.LocalDateTime.now());
                    enrollment.setStatus(Enrollment.EnrollmentStatus.ACTIVE);
                    enrollmentRepository.save(enrollment);
                    enrollmentsCreated++;
                }
            }

            System.out.println("Se crearon " + enrollmentsCreated + " inscripciones de ejemplo para nuevos estudiantes");
        } catch (Exception e) {
            System.err.println("Error al crear inscripciones de ejemplo: " + e.getMessage());
        }
    }

    @PostMapping("/enroll-students-in-juan-courses")
    public ResponseEntity<String> enrollStudentsInJuanCourses() {
        try {
            // Buscar a Juan (el instructor)
            User juan = userRepository.findByEmail("instructor@test.com");
            if (juan == null) {
                return ResponseEntity.badRequest().body("Juan no encontrado como instructor");
            }

            // Obtener todos los cursos de Juan
            List<Course> juanCourses = courseRepository.findByInstructor(juan);
            if (juanCourses.isEmpty()) {
                return ResponseEntity.badRequest().body("Juan no tiene cursos asignados");
            }

            // Obtener todos los estudiantes de ejemplo (los que tienen @example.com)
            List<User> exampleStudents = userRepository.findByRole(User.Role.STUDENT)
                .stream()
                .filter(student -> student.getEmail().endsWith("@example.com"))
                .collect(java.util.stream.Collectors.toList());

            if (exampleStudents.isEmpty()) {
                return ResponseEntity.badRequest().body("No se encontraron estudiantes de ejemplo");
            }

            int enrollmentsCreated = 0;
            StringBuilder result = new StringBuilder();
            result.append("=== INSCRIPCIONES EN CURSOS DE JUAN ===\n");
            result.append("Cursos de Juan: ").append(juanCourses.size()).append("\n");
            result.append("Estudiantes de ejemplo: ").append(exampleStudents.size()).append("\n\n");

            // Inscribir cada estudiante en todos los cursos de Juan
            for (User student : exampleStudents) {
                result.append("Inscribiendo a ").append(student.getUserName()).append(" ").append(student.getLastName()).append(":\n");
                
                for (Course course : juanCourses) {
                    // Verificar si ya está inscrito
                    if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
                        result.append("  - Ya inscrito en: ").append(course.getTitle()).append("\n");
                        continue;
                    }

                    Enrollment enrollment = new Enrollment();
                    enrollment.setStudent(student);
                    enrollment.setCourse(course);
                    enrollment.setEnrolledAt(java.time.LocalDateTime.now());
                    enrollment.setStatus(Enrollment.EnrollmentStatus.ACTIVE);
                    enrollmentRepository.save(enrollment);
                    enrollmentsCreated++;
                    result.append("  - Inscrito en: ").append(course.getTitle()).append("\n");
                }
                result.append("\n");
            }

            result.append("Total inscripciones creadas: ").append(enrollmentsCreated);

            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Error al inscribir estudiantes en cursos de Juan: " + e.getMessage());
        }
    }

    @PostMapping("/enroll-existing-students-in-juan-courses")
    public ResponseEntity<String> enrollExistingStudentsInJuanCourses() {
        try {
            // Buscar a Juan (el instructor)
            User juan = userRepository.findByEmail("instructor@test.com");
            if (juan == null) {
                return ResponseEntity.badRequest().body("Juan no encontrado como instructor");
            }

            // Obtener todos los cursos de Juan
            List<Course> juanCourses = courseRepository.findByInstructor(juan);
            if (juanCourses.isEmpty()) {
                return ResponseEntity.badRequest().body("Juan no tiene cursos asignados");
            }

            // Obtener todos los estudiantes existentes (los que tienen @student.com)
            List<User> existingStudents = userRepository.findByRole(User.Role.STUDENT)
                .stream()
                .filter(student -> student.getEmail().endsWith("@student.com"))
                .collect(java.util.stream.Collectors.toList());

            if (existingStudents.isEmpty()) {
                return ResponseEntity.badRequest().body("No se encontraron estudiantes existentes (@student.com)");
            }

            int enrollmentsCreated = 0;
            StringBuilder result = new StringBuilder();
            result.append("=== INSCRIPCIONES DE ESTUDIANTES EXISTENTES EN CURSOS DE JUAN ===\n");
            result.append("Cursos de Juan: ").append(juanCourses.size()).append("\n");
            result.append("Estudiantes existentes: ").append(existingStudents.size()).append("\n\n");

            // Inscribir cada estudiante en todos los cursos de Juan
            for (User student : existingStudents) {
                result.append("Inscribiendo a ").append(student.getUserName()).append(" ").append(student.getLastName()).append(":\n");
                
                for (Course course : juanCourses) {
                    // Verificar si ya está inscrito
                    if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
                        result.append("  - Ya inscrito en: ").append(course.getTitle()).append("\n");
                        continue;
                    }

                    Enrollment enrollment = new Enrollment();
                    enrollment.setStudent(student);
                    enrollment.setCourse(course);
                    enrollment.setEnrolledAt(java.time.LocalDateTime.now());
                    enrollment.setStatus(Enrollment.EnrollmentStatus.ACTIVE);
                    enrollmentRepository.save(enrollment);
                    enrollmentsCreated++;
                    result.append("  - Inscrito en: ").append(course.getTitle()).append("\n");
                }
                result.append("\n");
            }

            result.append("Total inscripciones creadas: ").append(enrollmentsCreated);

            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Error al inscribir estudiantes existentes en cursos de Juan: " + e.getMessage());
        }
    }

    @PostMapping("/fix-thumbnails")
    public ResponseEntity<String> fixThumbnails() {
        try {
            // Obtener todos los cursos sin thumbnail o con placeholder
            List<Course> coursesWithoutThumbnail = courseRepository.findAll().stream()
                .filter(course -> course.getThumbnailUrl() == null || 
                                 course.getThumbnailUrl().isEmpty() || 
                                 course.getThumbnailUrl().contains("via.placeholder.com"))
                .collect(java.util.stream.Collectors.toList());
            
            // URLs de thumbnails por tipo de curso
            Map<String, String> thumbnailMap = new java.util.HashMap<>();
            thumbnailMap.put("Java", "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop");
            thumbnailMap.put("Spring", "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop");
            thumbnailMap.put("React", "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop");
            thumbnailMap.put("JavaScript", "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=225&fit=crop");
            thumbnailMap.put("Diseño", "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop");
            thumbnailMap.put("Figma", "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop");
            
            int updatedCount = 0;
            for (Course course : coursesWithoutThumbnail) {
                String thumbnailUrl = null;
                
                // Buscar thumbnail basado en el título del curso
                for (Map.Entry<String, String> entry : thumbnailMap.entrySet()) {
                    if (course.getTitle().toLowerCase().contains(entry.getKey().toLowerCase())) {
                        thumbnailUrl = entry.getValue();
                        break;
                    }
                }
                
                // Si no se encuentra, usar una imagen genérica
                if (thumbnailUrl == null) {
                    thumbnailUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop";
                }
                
                course.setThumbnailUrl(thumbnailUrl);
                courseRepository.save(course);
                updatedCount++;
            }
            
            return ResponseEntity.ok("Thumbnails actualizados: " + updatedCount + " cursos");
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error actualizando thumbnails: " + e.getMessage());
        }
    }

    @PostMapping("/clean-duplicate-courses")
    public ResponseEntity<String> cleanDuplicateCourses() {
        try {
            System.out.println("=== LIMPIEZA SIMPLE DE CURSOS DUPLICADOS ===");
            
            // Simplemente desactivar los cursos duplicados en lugar de eliminarlos
            Long[] coursesToDeactivate = {2L, 3L, 4L, 8L, 9L, 10L, 11L, 12L, 13L, 14L, 15L, 16L};
            int deactivatedCount = 0;
            
            for (Long courseId : coursesToDeactivate) {
                try {
                    Course course = courseRepository.findById(courseId).orElse(null);
                    if (course != null) {
                        System.out.println("Desactivando: " + course.getTitle() + " (ID: " + courseId + ")");
                        course.setIsActive(false);
                        courseRepository.save(course);
                        deactivatedCount++;
                        System.out.println("  ✅ Curso desactivado exitosamente");
                    } else {
                        System.out.println("Curso ID " + courseId + " no encontrado");
                    }
                } catch (Exception e) {
                    System.err.println("Error al desactivar curso ID " + courseId + ": " + e.getMessage());
                }
            }
            
            return ResponseEntity.ok(String.format(
                "Limpieza completada. Desactivados: %d cursos duplicados", 
                deactivatedCount
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Error al limpiar cursos duplicados: " + e.getMessage());
        }
    }

    @PostMapping("/create-real-students")
    public ResponseEntity<String> createRealStudents() {
        try {
            // Crear estudiantes reales con emails reales
            User ana = userRepository.findByEmail("ana.martinez@gmail.com");
            if (ana == null) {
                ana = new User();
                ana.setUserName("Ana");
                ana.setLastName("Martínez");
                ana.setEmail("ana.martinez@gmail.com");
                ana.setPassword(passwordEncoder.encode("Password123"));
                ana.setRole(User.Role.STUDENT);
                ana.setActive(true);
                userRepository.save(ana);
            }
            
            User luis = userRepository.findByEmail("luis.rodriguez@hotmail.com");
            if (luis == null) {
                luis = new User();
                luis.setUserName("Luis");
                luis.setLastName("Rodríguez");
                luis.setEmail("luis.rodriguez@hotmail.com");
                luis.setPassword(passwordEncoder.encode("Password123"));
                luis.setRole(User.Role.STUDENT);
                luis.setActive(true);
                userRepository.save(luis);
            }
            
            User sofia = userRepository.findByEmail("sofia.hernandez@yahoo.com");
            if (sofia == null) {
                sofia = new User();
                sofia.setUserName("Sofia");
                sofia.setLastName("Hernández");
                sofia.setEmail("sofia.hernandez@yahoo.com");
                sofia.setPassword(passwordEncoder.encode("Password123"));
                sofia.setRole(User.Role.STUDENT);
                sofia.setActive(true);
                userRepository.save(sofia);
            }
            
            // Crear algunos cursos reales para Juan
            User juan = userRepository.findByEmail("instructor@test.com");
            if (juan != null) {
                // Obtener o crear una categoría
                Category category = categoryRepository.findAll().stream().findFirst().orElse(null);
                if (category == null) {
                    // Crear una categoría por defecto
                    category = new Category();
                    category.setName("Programación");
                    category.setDescription("Cursos de programación");
                    category.setIcon("code");
                    category.setColor("#3B82F6");
                    category.setSortOrder(1);
                    category = categoryRepository.save(category);
                }
                
                // Obtener o crear una subcategoría
                com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory subcategory = 
                    category.getSubcategories() != null && !category.getSubcategories().isEmpty() 
                    ? category.getSubcategories().get(0) 
                    : null;
                    
                if (subcategory == null) {
                    subcategory = new com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory();
                    subcategory.setName("Java");
                    subcategory.setDescription("Cursos de programación en Java");
                    subcategory.setIcon("coffee");
                    subcategory.setColor("#F97316");
                    subcategory.setSortOrder(1);
                    subcategory.setCategory(category);
                    subcategory = subcategoryRepository.save(subcategory);
                }
                // Crear curso 1: Java desde Cero usando CourseService
                CourseCreateDto javaCourseDto = createJavaCourseDto(juan.getId(), category.getId(), subcategory.getId());
                Course javaCourse = courseService.createCourse(javaCourseDto);
                
                // Crear curso 2: Spring Boot Avanzado usando CourseService
                CourseCreateDto springCourseDto = createSpringCourseDto(juan.getId(), category.getId(), subcategory.getId());
                Course springCourse = courseService.createCourse(springCourseDto);
                
                // Crear curso 3: React para Principiantes usando CourseService
                CourseCreateDto reactCourseDto = createReactCourseDto(juan.getId(), category.getId(), subcategory.getId());
                Course reactCourse = courseService.createCourse(reactCourseDto);
                
                // Crear inscripciones reales
                // Ana en Java (completado)
                Enrollment anaJava = new Enrollment();
                anaJava.setStudent(ana);
                anaJava.setCourse(javaCourse);
                anaJava.setEnrolledAt(java.time.LocalDateTime.now().minusDays(30));
                anaJava.setStatus(Enrollment.EnrollmentStatus.COMPLETED);
                anaJava.setProgressPercentage(100);
                enrollmentRepository.save(anaJava);
                
                // Ana en Spring Boot (activo)
                Enrollment anaSpring = new Enrollment();
                anaSpring.setStudent(ana);
                anaSpring.setCourse(springCourse);
                anaSpring.setEnrolledAt(java.time.LocalDateTime.now().minusDays(15));
                anaSpring.setStatus(Enrollment.EnrollmentStatus.ACTIVE);
                anaSpring.setProgressPercentage(65);
                enrollmentRepository.save(anaSpring);
                
                // Luis en Java (activo)
                Enrollment luisJava = new Enrollment();
                luisJava.setStudent(luis);
                luisJava.setCourse(javaCourse);
                luisJava.setEnrolledAt(java.time.LocalDateTime.now().minusDays(20));
                luisJava.setStatus(Enrollment.EnrollmentStatus.ACTIVE);
                luisJava.setProgressPercentage(80);
                enrollmentRepository.save(luisJava);
                
                // Sofia en React (completado)
                Enrollment sofiaReact = new Enrollment();
                sofiaReact.setStudent(sofia);
                sofiaReact.setCourse(reactCourse);
                sofiaReact.setEnrolledAt(java.time.LocalDateTime.now().minusDays(10));
                sofiaReact.setStatus(Enrollment.EnrollmentStatus.COMPLETED);
                sofiaReact.setProgressPercentage(100);
                enrollmentRepository.save(sofiaReact);
            }
            
            StringBuilder result = new StringBuilder();
            result.append("=== ESTUDIANTES REALES CREADOS ===\n");
            result.append("Estudiantes creados: 3\n");
            result.append("- Ana Martínez (ana.martinez@gmail.com)\n");
            result.append("- Luis Rodríguez (luis.rodriguez@hotmail.com)\n");
            result.append("- Sofia Hernández (sofia.hernandez@yahoo.com)\n");
            result.append("\n=== CURSOS REALES CREADOS ===\n");
            result.append("Cursos creados: 3\n");
            result.append("- Java desde Cero ($49.99)\n");
            result.append("- Spring Boot Avanzado ($69.99)\n");
            result.append("- React para Principiantes (Gratis)\n");
            result.append("\n=== INSCRIPCIONES REALES CREADAS ===\n");
            result.append("Inscripciones creadas: 4\n");
            result.append("- Ana completó Java (100%)\n");
            result.append("- Ana en Spring Boot (65%)\n");
            result.append("- Luis en Java (80%)\n");
            result.append("- Sofia completó React (100%)\n");
            
            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Error al crear estudiantes reales: " + e.getMessage());
        }
    }

    @PostMapping("/clean-test-data")
    public ResponseEntity<String> cleanTestData() {
        try {
            // Eliminar todas las inscripciones
            enrollmentRepository.deleteAll();
            
            // Eliminar estudiantes de prueba (los que tienen @student.com, @test.com, @example.com)
            List<User> testStudents = userRepository.findByRole(User.Role.STUDENT)
                .stream()
                .filter(student -> student.getEmail().contains("student.com") || 
                                 student.getEmail().contains("test.com") || 
                                 student.getEmail().contains("example.com"))
                .collect(java.util.stream.Collectors.toList());
            
            for (User student : testStudents) {
                userRepository.delete(student);
            }
            
            // Eliminar cursos de prueba (los creados por TestDataService)
            List<Course> testCourses = courseRepository.findAll()
                .stream()
                .filter(course -> course.getTitle().contains("Java desde Cero") ||
                                course.getTitle().contains("Spring Boot Avanzado") ||
                                course.getTitle().contains("React para Principiantes") ||
                                course.getTitle().contains("Diseño UI/UX") ||
                                course.getTitle().contains("Photoshop Avanzado") ||
                                course.getTitle().contains("Marketing Digital") ||
                                course.getTitle().contains("Google Ads") ||
                                course.getTitle().contains("Emprendimiento") ||
                                course.getTitle().contains("Gestión de Proyectos") ||
                                course.getTitle().contains("Python para Data Science"))
                .collect(java.util.stream.Collectors.toList());
            
            for (Course course : testCourses) {
                courseRepository.delete(course);
            }
            
            StringBuilder result = new StringBuilder();
            result.append("=== DATOS DE PRUEBA ELIMINADOS ===\n");
            result.append("Inscripciones eliminadas: TODAS\n");
            result.append("Estudiantes de prueba eliminados: ").append(testStudents.size()).append("\n");
            result.append("Cursos de prueba eliminados: ").append(testCourses.size()).append("\n");
            result.append("\n=== ESTADO ACTUAL ===\n");
            result.append("Total estudiantes: ").append(userRepository.findByRole(User.Role.STUDENT).size()).append("\n");
            result.append("Total cursos: ").append(courseRepository.findAll().size()).append("\n");
            result.append("Total inscripciones: ").append(enrollmentRepository.findAll().size()).append("\n");
            
            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Error al limpiar datos de prueba: " + e.getMessage());
        }
    }

    @GetMapping("/check-juan-courses")
    public ResponseEntity<String> checkJuanCourses() {
        try {
            StringBuilder result = new StringBuilder();
            
            // Buscar a Juan
            User juan = userRepository.findByEmail("instructor@test.com");
            if (juan == null) {
                result.append("❌ Juan no encontrado con email: instructor@test.com\n");
                
                // Buscar todos los instructores
                List<User> instructors = userRepository.findByRole(User.Role.INSTRUCTOR);
                result.append("Instructores disponibles:\n");
                for (User instructor : instructors) {
                    result.append("- ").append(instructor.getUserName()).append(" ").append(instructor.getLastName())
                          .append(" (").append(instructor.getEmail()).append(")\n");
                }
                return ResponseEntity.ok(result.toString());
            }
            
            result.append("✅ Juan encontrado: ").append(juan.getUserName()).append(" ").append(juan.getLastName()).append("\n");
            result.append("Email: ").append(juan.getEmail()).append("\n");
            result.append("Rol: ").append(juan.getRole()).append("\n\n");
            
            // Obtener cursos de Juan
            List<Course> juanCourses = courseRepository.findByInstructor(juan);
            result.append("Cursos de Juan: ").append(juanCourses.size()).append("\n");
            
            if (juanCourses.isEmpty()) {
                result.append("❌ Juan no tiene cursos asignados\n");
                
                // Mostrar todos los cursos disponibles
                List<Course> allCourses = courseRepository.findAll();
                result.append("\nTodos los cursos disponibles:\n");
                for (Course course : allCourses) {
                    result.append("- ").append(course.getTitle()).append(" (ID: ").append(course.getId()).append(")");
                    if (course.getInstructor() != null) {
                        result.append(" - Instructor: ").append(course.getInstructor().getUserName()).append(" ").append(course.getInstructor().getLastName());
                    }
                    result.append("\n");
                }
            } else {
                result.append("✅ Cursos de Juan:\n");
                for (Course course : juanCourses) {
                    result.append("- ").append(course.getTitle()).append(" (ID: ").append(course.getId()).append(")\n");
                }
            }

            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Error al verificar cursos de Juan: " + e.getMessage());
        }
    }

    @GetMapping("/check-example-students")
    public ResponseEntity<String> checkExampleStudents() {
        try {
            StringBuilder result = new StringBuilder();
            
            // Obtener todos los estudiantes
            List<User> allStudents = userRepository.findByRole(User.Role.STUDENT);
            result.append("Total estudiantes: ").append(allStudents.size()).append("\n\n");
            
            // Filtrar estudiantes de ejemplo
            List<User> exampleStudents = allStudents.stream()
                .filter(student -> student.getEmail().endsWith("@example.com"))
                .collect(java.util.stream.Collectors.toList());
            
            result.append("Estudiantes de ejemplo (@example.com): ").append(exampleStudents.size()).append("\n");
            
            if (exampleStudents.isEmpty()) {
                result.append("❌ No se encontraron estudiantes de ejemplo\n\n");
                result.append("Todos los estudiantes disponibles:\n");
                for (User student : allStudents) {
                    result.append("- ").append(student.getUserName()).append(" ").append(student.getLastName())
                          .append(" (").append(student.getEmail()).append(")\n");
                }
            } else {
                result.append("✅ Estudiantes de ejemplo encontrados:\n");
                for (User student : exampleStudents) {
                    result.append("- ").append(student.getUserName()).append(" ").append(student.getLastName())
                          .append(" (").append(student.getEmail()).append(")\n");
                }
            }

            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Error al verificar estudiantes de ejemplo: " + e.getMessage());
        }
    }
    
    // Métodos para crear DTOs de cursos con módulos y lecciones
    private CourseCreateDto createJavaCourseDto(Long instructorId, Long categoryId, Long subcategoryId) {
        CourseCreateDto dto = new CourseCreateDto();
        dto.setTitle("Java desde Cero");
        dto.setDescription("Aprende Java desde los fundamentos hasta conceptos avanzados");
        dto.setShortDescription("Curso completo de Java");
        dto.setPrice(new java.math.BigDecimal("49.99"));
        dto.setInstructorId(instructorId);
        dto.setCategoryId(categoryId);
        dto.setSubcategoryId(subcategoryId);
        dto.setIsPublished(true);
        dto.setIsActive(true);
        dto.setEstimatedHours(40);
        dto.setLevel("BEGINNER");
        dto.setThumbnailUrl("https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop");
        
        // Crear módulos y lecciones
        dto.setModules(java.util.Arrays.asList(
            createJavaModule1(),
            createJavaModule2()
        ));
        
        return dto;
    }
    
    private CourseCreateDto createSpringCourseDto(Long instructorId, Long categoryId, Long subcategoryId) {
        CourseCreateDto dto = new CourseCreateDto();
        dto.setTitle("Spring Boot Avanzado");
        dto.setDescription("Domina Spring Boot con técnicas avanzadas");
        dto.setShortDescription("Spring Boot avanzado");
        dto.setPrice(new java.math.BigDecimal("69.99"));
        dto.setInstructorId(instructorId);
        dto.setCategoryId(categoryId);
        dto.setSubcategoryId(subcategoryId);
        dto.setIsPublished(true);
        dto.setIsActive(true);
        dto.setEstimatedHours(50);
        dto.setLevel("ADVANCED");
        dto.setThumbnailUrl("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop");
        
        // Crear módulos y lecciones
        dto.setModules(java.util.Arrays.asList(
            createSpringModule1(),
            createSpringModule2()
        ));
        
        return dto;
    }
    
    private CourseCreateDto createReactCourseDto(Long instructorId, Long categoryId, Long subcategoryId) {
        CourseCreateDto dto = new CourseCreateDto();
        dto.setTitle("React para Principiantes");
        dto.setDescription("Aprende React desde cero");
        dto.setShortDescription("React básico");
        dto.setPrice(new java.math.BigDecimal("0.0"));
        dto.setInstructorId(instructorId);
        dto.setCategoryId(categoryId);
        dto.setSubcategoryId(subcategoryId);
        dto.setIsPublished(true);
        dto.setIsActive(true);
        dto.setEstimatedHours(30);
        dto.setLevel("INTERMEDIATE");
        dto.setThumbnailUrl("https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop");
        
        // Crear módulos y lecciones
        dto.setModules(java.util.Arrays.asList(
            createReactModule1(),
            createReactModule2()
        ));
        
        return dto;
    }
    
    // Métodos para crear módulos específicos
    private ModuleDto createJavaModule1() {
        ModuleDto module = new ModuleDto();
        module.setTitle("Fundamentos de Java");
        module.setDescription("Aprende los conceptos básicos de Java");
        module.setOrderIndex(1);
        module.setIsActive(true);
        
        module.setLessons(java.util.Arrays.asList(
            createLessonDto("Introducción a Java", "¿Qué es Java y por qué usarlo?", "video", 
                          "https://www.youtube.com/watch?v=eIrMbAQSU34", 1, 600),
            createLessonDto("Variables y Tipos de Datos", "Aprende sobre variables en Java", "video", 
                          "https://www.youtube.com/watch?v=5o3fMLPY7qY", 2, 720),
            createLessonDto("Operadores", "Operadores aritméticos y lógicos", "video", 
                          "https://www.youtube.com/watch?v=GtLJhC2A4Q4", 3, 540)
        ));
        
        return module;
    }
    
    private ModuleDto createJavaModule2() {
        ModuleDto module = new ModuleDto();
        module.setTitle("Estructuras de Control");
        module.setDescription("If, loops y más");
        module.setOrderIndex(2);
        module.setIsActive(true);
        
        module.setLessons(java.util.Arrays.asList(
            createLessonDto("Condicionales If-Else", "Estructuras condicionales en Java", "video", 
                          "https://www.youtube.com/watch?v=Z_9nv3ZU6rU", 1, 480),
            createLessonDto("Bucles For y While", "Iteraciones en Java", "video", 
                          "https://www.youtube.com/watch?v=6djggrlkHY8", 2, 660)
        ));
        
        return module;
    }
    
    private ModuleDto createSpringModule1() {
        ModuleDto module = new ModuleDto();
        module.setTitle("Introducción a Spring Boot");
        module.setDescription("Conceptos básicos de Spring Boot");
        module.setOrderIndex(1);
        module.setIsActive(true);
        
        module.setLessons(java.util.Arrays.asList(
            createLessonDto("¿Qué es Spring Boot?", "Introducción al framework", "video", 
                          "https://www.youtube.com/watch?v=vtPkZShrvXQ", 1, 720),
            createLessonDto("Creando tu primera aplicación", "Spring Initializr y Hello World", "video", 
                          "https://www.youtube.com/watch?v=9SGDpanrc8U", 2, 900)
        ));
        
        return module;
    }
    
    private ModuleDto createSpringModule2() {
        ModuleDto module = new ModuleDto();
        module.setTitle("REST APIs con Spring Boot");
        module.setDescription("Creando APIs RESTful");
        module.setOrderIndex(2);
        module.setIsActive(true);
        
        module.setLessons(java.util.Arrays.asList(
            createLessonDto("Controllers y RequestMapping", "Manejo de requests HTTP", "video", 
                          "https://www.youtube.com/watch?v=TR3kMAhZ0r0", 1, 840),
            createLessonDto("CRUD Operations", "Create, Read, Update, Delete", "video", 
                          "https://www.youtube.com/watch?v=9SGDpanrc8U", 2, 1080)
        ));
        
        return module;
    }
    
    private ModuleDto createReactModule1() {
        ModuleDto module = new ModuleDto();
        module.setTitle("Introducción a React");
        module.setDescription("Conceptos básicos de React");
        module.setOrderIndex(1);
        module.setIsActive(true);
        
        module.setLessons(java.util.Arrays.asList(
            createLessonDto("¿Qué es React?", "Introducción a la librería", "video", 
                          "https://www.youtube.com/watch?v=w7ejDZ8SWv8", 1, 600),
            createLessonDto("JSX y Componentes", "Sintaxis JSX y componentes básicos", "video", 
                          "https://www.youtube.com/watch?v=9hb_0TZ_MVI", 2, 780)
        ));
        
        return module;
    }
    
    private ModuleDto createReactModule2() {
        ModuleDto module = new ModuleDto();
        module.setTitle("Hooks y Estado");
        module.setDescription("useState, useEffect y más");
        module.setOrderIndex(2);
        module.setIsActive(true);
        
        module.setLessons(java.util.Arrays.asList(
            createLessonDto("useState Hook", "Manejo de estado en componentes", "video", 
                          "https://www.youtube.com/watch?v=O6P86uwfdR0", 1, 720),
            createLessonDto("useEffect Hook", "Efectos secundarios en React", "video", 
                          "https://www.youtube.com/watch?v=0ZJgIjI0YBc", 2, 840)
        ));
        
        return module;
    }
    
    private LessonDto createLessonDto(String title, String description, String type, 
                                    String youtubeUrl, int orderIndex, int durationSeconds) {
        LessonDto lesson = new LessonDto();
        lesson.setTitle(title);
        lesson.setDescription(description);
        lesson.setType(type);
        lesson.setYoutubeUrl(youtubeUrl);
        lesson.setOrderIndex(orderIndex);
        lesson.setDurationSeconds(durationSeconds);
        lesson.setIsActive(true);
        return lesson;
    }
}

