package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseVideoDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.VideoDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.CourseVideo;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Module;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Lesson;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseVideoRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.ModuleRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.LessonRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseVideoService {

    private final CourseVideoRepository courseVideoRepository;
    private final CourseRepository courseRepository;
    private final CourseService courseService;
    private final EnrollmentService enrollmentService;
    private final UserService userService;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;

    @Transactional
    public CourseVideo addVideoToCourse(CourseVideoDto videoDto, Long instructorId) {
        Course course = courseService.findById(videoDto.getCourseId());
        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new SecurityException("Solo el instructor del curso puede agregar videos");
        }

        String videoId = CourseVideo.extractVideoId(videoDto.getYoutubeUrl());
        if (videoId == null) {
            throw new IllegalArgumentException("URL de YouTube inválida");
        }

        if (videoDto.getDurationSeconds() != null) {
            if (videoDto.getDurationSeconds() > 1800) {
                throw new IllegalArgumentException("La duración del video no puede exceder 30 minutos");
            }
        }

        CourseVideo video = new CourseVideo();
        video.setTitle(videoDto.getTitle());
        video.setDescription(videoDto.getDescription());
        video.setYoutubeUrl(videoDto.getYoutubeUrl());
        video.setYoutubeVideoId(videoId);
        video.setOrderIndex(videoDto.getOrderIndex());
        video.setDurationSeconds(videoDto.getDurationSeconds());
        video.setCourse(course);
        
        video.setThumbnailUrl("https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg");

        return courseVideoRepository.save(video);
    }

    public List<CourseVideo> getVideosByCourse(Long courseId, Long studentId) {

        if (studentId != null) {
            User user = userService.findById(studentId);
            
            Course course = courseService.findById(courseId);
            if (course.getInstructor().getId().equals(studentId)) {
                return courseVideoRepository.findByCourseIdAndIsActiveOrderByOrderIndexAsc(courseId, true);
            }

            if (user.getRole() == User.Role.STUDENT) {
                if (!enrollmentService.isStudentEnrolled(studentId, courseId)) {
                    throw new SecurityException("Debes estar inscrito en el curso para acceder a los videos");
                }
            }
        }
        
        // Obtener videos de la tabla course_videos
        List<CourseVideo> courseVideos = courseVideoRepository.findByCourseIdAndIsActiveOrderByOrderIndexAsc(courseId, true);
        
        // También obtener lecciones de tipo "video" de los módulos
        // TODO: Implementar conversión de Lesson a CourseVideo para mantener compatibilidad
        
        return courseVideos;
    }

    public List<CourseVideo> getVideosByCourse(Long courseId) {
        return courseVideoRepository.findByCourseIdAndIsActiveOrderByOrderIndexAsc(courseId, true);
    }

    /**
     * Obtiene las lecciones de tipo "video" de un curso como VideoDto para evitar referencias circulares
     */
    public List<VideoDto> getCourseLessonsAsVideos(Long courseId, Long studentId) {
        // Verificar que el curso existe
        if (!courseRepository.existsById(courseId)) {
            throw new IllegalArgumentException("Curso no encontrado con ID: " + courseId);
        }
        
        // Si hay un usuario autenticado, verificar permisos completos
        if (studentId != null) {
            User user = userService.findById(studentId);
            
            // Verificar permisos de instructor
            boolean isInstructor = courseRepository.findInstructorIdByCourseId(courseId)
                .map(instructorId -> instructorId.equals(studentId))
                .orElse(false);
            
            if (!isInstructor) {
                if (user.getRole() == User.Role.STUDENT) {
                    if (!enrollmentService.isStudentEnrolled(studentId, courseId)) {
                        // Para usuarios no inscritos, devolver solo videos de preview
                        return getPreviewVideos(courseId);
                    }
                }
            }
        } else {
            // Para usuarios no autenticados, devolver solo videos de preview
            return getPreviewVideos(courseId);
        }

        // Obtener todos los módulos activos del curso
        List<Module> modules = moduleRepository.findActiveModulesByCourseId(courseId);
        
        // Convertir lecciones de tipo "video" a VideoDto
        List<VideoDto> videos = new java.util.ArrayList<>();
        
        for (Module module : modules) {
            List<Lesson> lessons = lessonRepository.findActiveLessonsByModuleId(module.getId());
            
            for (Lesson lesson : lessons) {
                if ("video".equalsIgnoreCase(lesson.getType()) && lesson.getYoutubeUrl() != null) {
                    VideoDto video = new VideoDto();
                    video.setId(lesson.getId()); // Usar el ID de la lección
                    video.setTitle(lesson.getTitle());
                    video.setDescription(lesson.getDescription());
                    video.setType(lesson.getType());
                    video.setYoutubeUrl(lesson.getYoutubeUrl());
                    video.setYoutubeVideoId(lesson.getYoutubeVideoId());
                    video.setContent(lesson.getContent());
                    video.setOrderIndex(lesson.getOrderIndex());
                    video.setDurationSeconds(lesson.getDurationSeconds());
                    video.setIsActive(lesson.getIsActive());
                    
                    // Información del módulo
                    video.setModuleId(module.getId());
                    video.setModuleTitle(module.getTitle());
                    video.setModuleDescription(module.getDescription());
                    video.setModuleOrderIndex(module.getOrderIndex());
                    
                    videos.add(video);
                }
            }
        }
        
        return videos;
    }

    public CourseVideo getVideoById(Long videoId) {
        return courseVideoRepository.findById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("Video no encontrado con ID: " + videoId));
    }

    @Transactional
    public CourseVideo updateVideo(Long videoId, CourseVideoDto videoDto, Long instructorId) {
        CourseVideo existingVideo = getVideoById(videoId);
        
        if (!existingVideo.getCourse().getInstructor().getId().equals(instructorId)) {
            throw new SecurityException("Solo el instructor del curso puede editar videos");
        }

        if (videoDto.getTitle() != null) {
            existingVideo.setTitle(videoDto.getTitle());
        }
        if (videoDto.getDescription() != null) {
            existingVideo.setDescription(videoDto.getDescription());
        }
        if (videoDto.getOrderIndex() != null) {
            existingVideo.setOrderIndex(videoDto.getOrderIndex());
        }
        if (videoDto.getYoutubeUrl() != null) {
            String newVideoId = CourseVideo.extractVideoId(videoDto.getYoutubeUrl());
            if (newVideoId == null) {
                throw new IllegalArgumentException("URL de YouTube inválida");
            }
            existingVideo.setYoutubeUrl(videoDto.getYoutubeUrl());
            existingVideo.setYoutubeVideoId(newVideoId);
            existingVideo.setThumbnailUrl("https://img.youtube.com/vi/" + newVideoId + "/maxresdefault.jpg");
        }
        
        if (videoDto.getDurationSeconds() != null) {
            if (videoDto.getDurationSeconds() > 1800) {
                throw new IllegalArgumentException("La duración del video no puede exceder 30 minutos");
            }
            existingVideo.setDurationSeconds(videoDto.getDurationSeconds());
        }

        return courseVideoRepository.save(existingVideo);
    }

    @Transactional
    public void deleteVideo(Long videoId, Long instructorId) {
        CourseVideo video = getVideoById(videoId);
        
        if (!video.getCourse().getInstructor().getId().equals(instructorId)) {
            throw new SecurityException("Solo el instructor del curso puede eliminar videos");
        }

        video.setIsActive(false);
        courseVideoRepository.save(video);
    }

    @Transactional
    public void reorderVideos(Long courseId, List<Long> videoIds, Long instructorId) {
        Course course = courseService.findById(courseId);
        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new SecurityException("Solo el instructor del curso puede reordenar videos");
        }

        for (int i = 0; i < videoIds.size(); i++) {
            Optional<CourseVideo> videoOpt = courseVideoRepository.findById(videoIds.get(i));
            if (videoOpt.isPresent()) {
                CourseVideo video = videoOpt.get();
                if (video.getCourse().getId().equals(courseId)) {
                    video.setOrderIndex(i + 1);
                    courseVideoRepository.save(video);
                }
            }
        }
    }

    public boolean canManageVideos(Long courseId, Long userId) {
        try {
            Course course = courseService.findById(courseId);
            return course.getInstructor().getId().equals(userId);
        } catch (Exception e) {
            return false;
        }
    }

    public static int getMaxVideoDuration() {
        return 1800;
    }

    public static int getRecommendedVideoDuration() {
        return 900;
    }

    public static boolean isOptimalDuration(int durationSeconds) {
        return durationSeconds >= 300 && durationSeconds <= 1200;
    }

    /**
     * Obtiene solo las primeras lecciones de video de cada módulo como preview
     * para usuarios no autenticados o no inscritos
     */
    private List<VideoDto> getPreviewVideos(Long courseId) {
        // Obtener todos los módulos activos del curso
        List<Module> modules = moduleRepository.findActiveModulesByCourseId(courseId);
        
        // Convertir solo la primera lección de video de cada módulo a VideoDto
        List<VideoDto> previewVideos = new java.util.ArrayList<>();
        
        for (Module module : modules) {
            List<Lesson> lessons = lessonRepository.findActiveLessonsByModuleId(module.getId());
            
            // Buscar la primera lección de video en el módulo
            for (Lesson lesson : lessons) {
                if ("video".equalsIgnoreCase(lesson.getType()) && lesson.getYoutubeUrl() != null) {
                    VideoDto video = new VideoDto();
                    video.setId(lesson.getId());
                    video.setTitle(lesson.getTitle());
                    video.setDescription(lesson.getDescription());
                    video.setYoutubeUrl(lesson.getYoutubeUrl());
                    video.setYoutubeVideoId(extractVideoId(lesson.getYoutubeUrl()));
                    video.setThumbnailUrl("https://img.youtube.com/vi/" + extractVideoId(lesson.getYoutubeUrl()) + "/maxresdefault.jpg");
                    video.setOrderIndex(lesson.getOrderIndex());
                    video.setDurationSeconds(lesson.getDurationSeconds());
                    video.setIsActive(lesson.getIsActive());
                    video.setIsPreview(true); // Marcar como preview
                    
                    // Información del módulo
                    video.setModuleId(module.getId());
                    video.setModuleTitle(module.getTitle());
                    video.setModuleDescription(module.getDescription());
                    video.setModuleOrderIndex(module.getOrderIndex());
                    
                    previewVideos.add(video);
                    break; // Solo tomar la primera lección de video del módulo
                }
            }
        }
        
        return previewVideos;
    }

    /**
     * Extrae el ID del video de YouTube desde la URL
     */
    private String extractVideoId(String youtubeUrl) {
        if (youtubeUrl == null || youtubeUrl.trim().isEmpty()) {
            return null;
        }
        
        String videoId = null;
        if (youtubeUrl.contains("watch?v=")) {
            videoId = youtubeUrl.substring(youtubeUrl.indexOf("watch?v=") + 8);
            if (videoId.contains("&")) {
                videoId = videoId.substring(0, videoId.indexOf("&"));
            }
        } else if (youtubeUrl.contains("youtu.be/")) {
            videoId = youtubeUrl.substring(youtubeUrl.indexOf("youtu.be/") + 9);
            if (videoId.contains("?")) {
                videoId = videoId.substring(0, videoId.indexOf("?"));
            }
        }
        
        return videoId;
    }
}
