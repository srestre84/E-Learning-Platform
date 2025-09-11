package com.Dev_learning_Platform.Dev_learning_Platform;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseCreateDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.EnrollmentRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CategoryService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.SubcategoryService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;

/**
 * Tests unitarios para CourseService con mocks apropiados
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Course Service Tests")
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserService userService;

    @Mock
    private CategoryService categoryService;

    @Mock
    private SubcategoryService subcategoryService;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @InjectMocks
    private CourseService courseService;

    private CourseCreateDto courseCreateDto;
    private Category mockCategory;
    private Subcategory mockSubcategory;
    private User mockInstructor;
    private Course mockCourse;
    private String uniqueTimestamp;

    @BeforeEach
    void setUp() {
        uniqueTimestamp = String.valueOf(Instant.now().toEpochMilli());

        // Setup mock category
        mockCategory = new Category();
        mockCategory.setId(1L);
        mockCategory.setName("Programming");

        // Setup mock subcategory
        mockSubcategory = new Subcategory();
        mockSubcategory.setId(10L);
        mockSubcategory.setName("Java");
        mockSubcategory.setCategory(mockCategory);

        // Setup mock instructor
        mockInstructor = new User();
        mockInstructor.setId(1L);
        mockInstructor.setUserName("instructor" + uniqueTimestamp);
        mockInstructor.setEmail("instructor" + uniqueTimestamp + "@example.com");
        mockInstructor.setRole(User.Role.INSTRUCTOR);

        // Setup DTO
        courseCreateDto = new CourseCreateDto();
        courseCreateDto.setTitle("Java Fundamentals " + uniqueTimestamp);
        courseCreateDto.setDescription("Learn Java basics");
        courseCreateDto.setShortDescription("Short desc");
        courseCreateDto.setPrice(BigDecimal.valueOf(99.99));
        courseCreateDto.setCategoryId(mockCategory.getId());
        courseCreateDto.setSubcategoryId(mockSubcategory.getId());
        courseCreateDto.setInstructorId(mockInstructor.getId());
        courseCreateDto.setIsPremium(false);
        courseCreateDto.setIsPublished(true);
        courseCreateDto.setIsActive(true);
        courseCreateDto.setEstimatedHours(10);

        // Setup mock course
        mockCourse = new Course();
        mockCourse.setId(1L);
        mockCourse.setTitle(courseCreateDto.getTitle());
        mockCourse.setDescription(courseCreateDto.getDescription());
        mockCourse.setShortDescription(courseCreateDto.getShortDescription());
        mockCourse.setPrice(courseCreateDto.getPrice());
        mockCourse.setCategory(mockCategory);
        mockCourse.setSubcategory(mockSubcategory);
        mockCourse.setInstructor(mockInstructor);
        mockCourse.setIsPremium(courseCreateDto.getIsPremium());
        mockCourse.setIsPublished(courseCreateDto.getIsPublished());
        mockCourse.setIsActive(courseCreateDto.getIsActive());
        mockCourse.setEstimatedHours(courseCreateDto.getEstimatedHours());
    }

    @Test
    @DisplayName("Debe crear curso exitosamente con instructor válido")
    void createCourse_withValidInstructor_shouldCreateSuccessfully() {
        // Given
        when(userService.findById(mockInstructor.getId())).thenReturn(mockInstructor);
        when(categoryService.getCategoryById(mockCategory.getId())).thenReturn(Optional.of(mockCategory));
        when(subcategoryService.getSubcategoryById(mockSubcategory.getId())).thenReturn(Optional.of(mockSubcategory));
        when(courseRepository.save(any(Course.class))).thenReturn(mockCourse);

        // When
        Course result = courseService.createCourse(courseCreateDto);

        // Then
        assertNotNull(result);
        assertEquals(courseCreateDto.getTitle(), result.getTitle());
        assertEquals(courseCreateDto.getDescription(), result.getDescription());
        assertEquals(courseCreateDto.getPrice(), result.getPrice());
        assertEquals(mockCategory, result.getCategory());
        assertEquals(mockSubcategory, result.getSubcategory());
        assertEquals(mockInstructor, result.getInstructor());

        // Verify interactions
        verify(userService).findById(mockInstructor.getId());
        verify(categoryService).getCategoryById(mockCategory.getId());
        verify(subcategoryService).getSubcategoryById(mockSubcategory.getId());
        verify(courseRepository).save(any(Course.class));

        System.out.println("✅ Curso creado exitosamente: " + result.getTitle());
    }

    @Test
    @DisplayName("Debe fallar cuando la categoría no existe")
    void createCourse_withInvalidCategory_shouldThrowException() {
        // Given
        when(userService.findById(mockInstructor.getId())).thenReturn(mockInstructor);
        when(categoryService.getCategoryById(mockCategory.getId())).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
            courseService.createCourse(courseCreateDto)
        );
        assertNotNull(exception.getMessage());

        verify(categoryService).getCategoryById(mockCategory.getId());
        verify(subcategoryService, never()).getSubcategoryById(any());
        verify(courseRepository, never()).save(any());

        System.out.println("✅ Validación correcta de categoría inexistente");
    }

    @Test
    @DisplayName("Debe fallar cuando la subcategoría no existe")
    void createCourse_withInvalidSubcategory_shouldThrowException() {
        // Given
        when(userService.findById(mockInstructor.getId())).thenReturn(mockInstructor);
        when(categoryService.getCategoryById(mockCategory.getId())).thenReturn(Optional.of(mockCategory));
        when(subcategoryService.getSubcategoryById(mockSubcategory.getId())).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
            courseService.createCourse(courseCreateDto)
        );
        assertNotNull(exception.getMessage());

        verify(subcategoryService).getSubcategoryById(mockSubcategory.getId());
        verify(courseRepository, never()).save(any());

        System.out.println("✅ Validación correcta de subcategoría inexistente");
    }

    @Test
    @DisplayName("Debe fallar cuando la subcategoría no pertenece a la categoría")
    void createCourse_withSubcategoryNotBelongingToCategory_shouldThrowException() {
        // Given
        Category anotherCategory = new Category();
        anotherCategory.setId(2L);
        mockSubcategory.setCategory(anotherCategory);

        when(userService.findById(mockInstructor.getId())).thenReturn(mockInstructor);
        when(categoryService.getCategoryById(mockCategory.getId())).thenReturn(Optional.of(mockCategory));
        when(subcategoryService.getSubcategoryById(mockSubcategory.getId())).thenReturn(Optional.of(mockSubcategory));

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
            courseService.createCourse(courseCreateDto)
        );
        assertNotNull(exception.getMessage());

        System.out.println("✅ Validación correcta de subcategoría fuera de categoría");
    }

    @Test
    @DisplayName("Debe fallar cuando el instructor no existe")
    void createCourse_withInvalidInstructor_shouldThrowException() {
        // Given
        when(userService.findById(mockInstructor.getId())).thenReturn(null);

        // When & Then
        NullPointerException exception = assertThrows(NullPointerException.class, () ->
            courseService.createCourse(courseCreateDto)
        );
        assertNotNull(exception.getMessage());

        verify(userService).findById(mockInstructor.getId());
        verify(categoryService, never()).getCategoryById(any());
        verify(subcategoryService, never()).getSubcategoryById(any());
        verify(courseRepository, never()).save(any());

        System.out.println("✅ Validación correcta de instructor inexistente");
    }

    @Test
    @DisplayName("Debe validar datos de entrada")
    void createCourse_withNullDto_shouldThrowException() {
        // Given
        CourseCreateDto nullDto = null;

        // When & Then
        NullPointerException exception = assertThrows(NullPointerException.class, () ->
            courseService.createCourse(nullDto)
        );
        assertNotNull(exception.getMessage());

        System.out.println("✅ Validación correcta de DTO null");
    }
}