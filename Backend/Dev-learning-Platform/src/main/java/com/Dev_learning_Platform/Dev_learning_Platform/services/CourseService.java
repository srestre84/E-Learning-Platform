package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseCreateDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.ModuleDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.LessonDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Module;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Lesson;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.EnrollmentRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.ModuleRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.LessonRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserService userService;
    private final CategoryService categoryService;
    private final SubcategoryService subcategoryService;
    private final EnrollmentRepository enrollmentRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;

    @Autowired
    @Lazy
    private EnrollmentService enrollmentService;


    @Transactional
    public Course createCourse(CourseCreateDto courseDto) {
        User instructor = userService.findById(courseDto.getInstructorId());

        // Validar que la categoría y subcategoría existan
        Category category = categoryService.getCategoryById(courseDto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Categoría no encontrada con ID: " + courseDto.getCategoryId()));

        Subcategory subcategory = subcategoryService
                .getSubcategoryById(courseDto.getSubcategoryId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Subcategoría no encontrada con ID: " + courseDto.getSubcategoryId()));

        // Validar que la subcategoría pertenezca a la categoría
        if (!subcategory.getCategory().getId().equals(category.getId())) {
            throw new IllegalArgumentException(
                    "La subcategoría no pertenece a la categoría especificada");
        }

        Course course = mapDtoToEntity(courseDto, instructor, category, subcategory);
        course = courseRepository.save(course);
        
        // Crear módulos y lecciones si existen
        if (courseDto.getModules() != null && !courseDto.getModules().isEmpty()) {
            createModulesAndLessons(course, courseDto.getModules());
        }
        
        return course;
    }

    public List<Course> getPublicCourses() {
        return courseRepository.findByIsActiveAndIsPublished(true, true);
    }

    public Page<Course> getPublicCourses(Pageable pageable) {
        return courseRepository.findByIsActiveAndIsPublished(true, true, pageable);
    }

    public Course findById(Long courseId) {
        return courseRepository.findById(courseId).orElseThrow(
                () -> new IllegalArgumentException("Curso no encontrado con ID: " + courseId));
    }
    
    public Course findByIdWithModules(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(
                () -> new IllegalArgumentException("Curso no encontrado con ID: " + courseId));
        
        // Cargar módulos y lecciones
        List<Module> modules = moduleRepository.findActiveModulesByCourseId(courseId);
        course.setModules(modules);
        
        return course;
    }


    public List<Course> getCoursesByInstructor(Long instructorId) {
        User instructor = userService.findById(instructorId);
        return courseRepository.findByInstructorAndIsActive(instructor, true);
    }

    public List<Course> getAllActiveCourses() {
        return courseRepository.findByIsActive(true);
    }

    public List<Course> getCoursesByCategory(Long categoryId) {
        Category category = categoryService.getCategoryById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Categoría no encontrada con ID: " + categoryId));
        return courseRepository.findByCategoryAndIsActiveAndIsPublished(category, true, true);
    }

    public List<Course> getCoursesBySubcategory(Long subcategoryId) {
        Subcategory subcategory = subcategoryService.getSubcategoryById(subcategoryId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Subcategoría no encontrada con ID: " + subcategoryId));
        return courseRepository.findBySubcategoryAndIsActiveAndIsPublished(subcategory, true, true);
    }

    public List<Course> getCoursesByCategoryAndSubcategory(Long categoryId, Long subcategoryId) {
        Category category = categoryService.getCategoryById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Categoría no encontrada con ID: " + categoryId));

        Subcategory subcategory = subcategoryService.getSubcategoryById(subcategoryId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Subcategoría no encontrada con ID: " + subcategoryId));

        // Validar que la subcategoría pertenezca a la categoría
        if (!subcategory.getCategory().getId().equals(category.getId())) {
            throw new IllegalArgumentException(
                    "La subcategoría no pertenece a la categoría especificada");
        }

        return courseRepository.findByCategoryAndSubcategoryAndIsActiveAndIsPublished(category,
                subcategory, true, true);
    }

    public boolean canCreateCourses(Long userId) {
        User user = userService.findById(userId);
        return user.getRole() == User.Role.INSTRUCTOR || user.getRole() == User.Role.ADMIN;
    }


    private Course mapDtoToEntity(CourseCreateDto dto, User instructor, Category category,
            Subcategory subcategory) {
        Course course = new Course();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setShortDescription(dto.getShortDescription());
        course.setInstructor(instructor);
        course.setCategory(category);
        course.setSubcategory(subcategory);
        course.setYoutubeUrls(dto.getYoutubeUrls());
        course.setThumbnailUrl(dto.getThumbnailUrl());
        course.setPrice(dto.getPrice());
        course.setIsPremium(dto.getIsPremium());
        course.setIsPublished(dto.getIsPublished());
        course.setIsActive(dto.getIsActive());
        course.setEstimatedHours(dto.getEstimatedHours());
        course.setLevel(dto.getLevel());

        return course;
    }

    @Transactional
    public Course updateCourse(Long courseId, CourseCreateDto courseDto) {
        Course existingCourse = findById(courseId);

        User authenticatedUser = userService.getAuthenticatedUser();
        boolean isAdmin = authenticatedUser.getRole() == User.Role.ADMIN;
        boolean isOwner = existingCourse.getInstructor() != null && 
                         existingCourse.getInstructor().getId().equals(authenticatedUser.getId());
        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("No tienes permisos para editar este curso.");
        }

        User instructor = userService.findById(courseDto.getInstructorId());
        Category category = categoryService.getCategoryById(courseDto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Categoría no encontrada con ID: " + courseDto.getCategoryId()));
        Subcategory subcategory = subcategoryService
                .getSubcategoryById(courseDto.getSubcategoryId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Subcategoría no encontrada con ID: " + courseDto.getSubcategoryId()));
        if (!subcategory.getCategory().getId().equals(category.getId())) {
            throw new IllegalArgumentException(
                    "La subcategoría no pertenece a la categoría especificada");
        }

        // Actualizar los campos del curso existente
        existingCourse.setTitle(courseDto.getTitle());
        existingCourse.setDescription(courseDto.getDescription());
        existingCourse.setShortDescription(courseDto.getShortDescription());
        existingCourse.setInstructor(instructor);
        existingCourse.setCategory(category);
        existingCourse.setSubcategory(subcategory);
        existingCourse.setYoutubeUrls(courseDto.getYoutubeUrls());
        existingCourse.setThumbnailUrl(courseDto.getThumbnailUrl());
        existingCourse.setPrice(courseDto.getPrice());
        existingCourse.setIsPremium(courseDto.getIsPremium());
        existingCourse.setIsPublished(courseDto.getIsPublished());
        existingCourse.setIsActive(courseDto.getIsActive());
        existingCourse.setEstimatedHours(courseDto.getEstimatedHours());
        existingCourse.setLevel(courseDto.getLevel());

        return courseRepository.save(existingCourse);
    }

    @Transactional
    public void deleteCourse(Long courseId) {
        Course existingCourse = findById(courseId);

        User authenticatedUser = userService.getAuthenticatedUser();
        boolean isAdmin = authenticatedUser.getRole() == User.Role.ADMIN;
        boolean isOwner = existingCourse.getInstructor() != null && 
                         existingCourse.getInstructor().getId().equals(authenticatedUser.getId());
        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("No tienes permisos para eliminar este curso.");
        }

        // Desactivar el curso
        existingCourse.setIsActive(false);
        courseRepository.save(existingCourse);

        // Desactivar inscripciones asociadas
        List<Enrollment> enrollments = enrollmentRepository.findByCourse(existingCourse);
        for (Enrollment enrollment : enrollments) {
            enrollment.setStatus(Enrollment.EnrollmentStatus.SUSPENDED);
            enrollmentRepository.save(enrollment);
        }
    }

    /**
     * Obtiene el contenido completo de un curso Este método es utilizado por el endpoint protegido
     * para obtener el contenido del curso
     * 
     * @param courseId ID del curso
     * @return Curso con todo su contenido
     */
    public Course getCourseContent(Long courseId) {
        return findById(courseId);
    }

    /**
     * Actualiza un curso existente. Valida que el usuario que realiza la acción sea el instructor
     * propietario o un administrador.
     *
     * @param courseId ID del curso a actualizar.
     * @param courseDto DTO con la nueva información.
     * @param userId ID del usuario que realiza la acción.
     * @return El curso actualizado.
     */
    @Transactional
    public Course updateCourse(Long courseId, CourseCreateDto courseDto, Long userId) {
        Course course = courseRepository.findById(courseId).orElseThrow(
                () -> new IllegalArgumentException("Curso no encontrado con ID: " + courseId));

        User user = userService.findById(userId);

        // Validación de permisos: solo el admin o el instructor propietario pueden editar.
        boolean isAdmin = user.getRole() == User.Role.ADMIN;
        boolean isOwner = user.getRole() == User.Role.INSTRUCTOR
                && course.getInstructor().getId().equals(userId);

        if (!isAdmin && !isOwner) {
            throw new SecurityException("No tienes permiso para editar este curso");
        }

        // Validar que la categoría y subcategoría existan
        Category category = categoryService.getCategoryById(courseDto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Categoría no encontrada con ID: " + courseDto.getCategoryId()));

        Subcategory subcategory = subcategoryService
                .getSubcategoryById(courseDto.getSubcategoryId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Subcategoría no encontrada con ID: " + courseDto.getSubcategoryId()));

        // Validar que la subcategoría pertenezca a la categoría
        if (!subcategory.getCategory().getId().equals(category.getId())) {
            throw new IllegalArgumentException(
                    "La subcategoría no pertenece a la categoría especificada");
        }

        // Actualizar los campos del curso desde el DTO
        course.setTitle(courseDto.getTitle());
        course.setDescription(courseDto.getDescription());
        course.setShortDescription(courseDto.getShortDescription());
        course.setInstructor(userService.findById(courseDto.getInstructorId()));
        course.setCategory(category);
        course.setSubcategory(subcategory);
        course.setPrice(courseDto.getPrice());
        course.setIsPremium(courseDto.getIsPremium());
        course.setIsPublished(courseDto.getIsPublished());
        course.setIsActive(courseDto.getIsActive());
        course.setEstimatedHours(courseDto.getEstimatedHours());
        course.setThumbnailUrl(courseDto.getThumbnailUrl());
        course.setYoutubeUrls(courseDto.getYoutubeUrls());

        return courseRepository.save(course);
    }

    /**
     * Elimina un curso. Valida que el usuario sea el propietario y que el curso no tenga
     * inscripciones activas.
     *
     * @param courseId ID del curso a eliminar.
     * @param userId ID del usuario que realiza la acción.
     */
    @Transactional
    public void deleteCourse(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId).orElseThrow(
                () -> new IllegalArgumentException("Curso no encontrado con ID: " + courseId));

        User user = userService.findById(userId);

        // Validación de permisos: solo el admin o el instructor propietario pueden eliminar.
        boolean isAdmin = user.getRole() == User.Role.ADMIN;
        boolean isOwner = user.getRole() == User.Role.INSTRUCTOR
                && course.getInstructor().getId().equals(userId);

        if (!isAdmin && !isOwner) {
            throw new SecurityException("No tienes permiso para eliminar este curso");
        }

        // Validar que no haya estudiantes inscritos.
        long activeEnrollments = enrollmentService.countActiveEnrollmentsByCourse(courseId);
        if (activeEnrollments > 0) {
            throw new IllegalStateException(
                    "No se puede eliminar un curso con estudiantes inscritos. Hay "
                            + activeEnrollments + " inscripciones activas.");
        }

        courseRepository.delete(course);
    }

    @Transactional
    public Course togglePublishStatus(Long courseId) {
        Course course = findById(courseId);
        
        User authenticatedUser = userService.getAuthenticatedUser();
        boolean isAdmin = authenticatedUser.getRole() == User.Role.ADMIN;
        boolean isOwner = course.getInstructor() != null && 
                         course.getInstructor().getId().equals(authenticatedUser.getId());
        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("No tienes permisos para modificar este curso.");
        }
        
        course.setIsPublished(!course.getIsPublished());
        return courseRepository.save(course);
    }
    
    @Transactional
    private void createModulesAndLessons(Course course, List<ModuleDto> moduleDtos) {
        for (ModuleDto moduleDto : moduleDtos) {
            Module module = new Module();
            module.setTitle(moduleDto.getTitle());
            module.setDescription(moduleDto.getDescription());
            module.setOrderIndex(moduleDto.getOrderIndex());
            module.setIsActive(moduleDto.getIsActive() != null ? moduleDto.getIsActive() : true);
            module.setCourse(course);
            
            module = moduleRepository.save(module);
            
            // Crear lecciones del módulo
            if (moduleDto.getLessons() != null && !moduleDto.getLessons().isEmpty()) {
                for (LessonDto lessonDto : moduleDto.getLessons()) {
                    Lesson lesson = new Lesson();
                    lesson.setTitle(lessonDto.getTitle());
                    lesson.setDescription(lessonDto.getDescription());
                    lesson.setType(lessonDto.getType());
                    lesson.setYoutubeUrl(lessonDto.getYoutubeUrl());
                    lesson.setYoutubeVideoId(Lesson.extractVideoId(lessonDto.getYoutubeUrl()));
                    lesson.setContent(lessonDto.getContent());
                    lesson.setOrderIndex(lessonDto.getOrderIndex());
                    lesson.setDurationSeconds(lessonDto.getDurationSeconds());
                    lesson.setIsActive(lessonDto.getIsActive() != null ? lessonDto.getIsActive() : true);
                    lesson.setModule(module);
                    
                    lessonRepository.save(lesson);
                }
            }
        }
    }

    public List<Course> getCoursesByLevel(String level) {
        return courseRepository.findByLevelAndIsActiveAndIsPublished(level, true, true);
    }
}
