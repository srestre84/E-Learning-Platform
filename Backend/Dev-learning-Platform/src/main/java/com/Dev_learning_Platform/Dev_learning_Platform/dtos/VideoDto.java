package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoDto {
    private Long id;
    private String title;
    private String description;
    private String type;
    private String youtubeUrl;
    private String youtubeVideoId;
    private String thumbnailUrl;
    private String content;
    private Integer orderIndex;
    private Integer durationSeconds;
    private Boolean isActive;
    private Boolean isPreview;
    private Long moduleId;
    private String moduleTitle;
    private String moduleDescription;
    private Integer moduleOrderIndex;
}
