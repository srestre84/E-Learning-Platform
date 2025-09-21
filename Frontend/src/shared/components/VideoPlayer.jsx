import React, { useState, useRef, useEffect } from 'react';
import { Play, Volume2, VolumeX, Maximize2, Clock, Lock, CheckCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const VideoPlayer = ({ 
  videoUrl, 
  title, 
  description,
  duration,
  isEnrolled = false,
  isCompleted = false,
  onVideoComplete,
  className = "" 
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  // Extraer video ID de YouTube URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&controls=1&showinfo=0&rel=0` : null;

  useEffect(() => {
    if (videoRef.current) {
      setVideoDuration(duration || 0);
    }
  }, [duration]);

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e) => {
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const clickTime = (clickX / width) * videoDuration;
      videoRef.current.currentTime = clickTime;
      setCurrentTime(clickTime);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!embedUrl) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">URL de video no válida</p>
      </div>
    );
  }

  return (
    <div className={`bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Video Container */}
      <div className="relative aspect-video bg-black">
        <iframe
          ref={videoRef}
          src={embedUrl}
          title={title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        
        {/* Overlay de control para videos no inscritos */}
        {!isEnrolled && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-xl font-semibold mb-2">Contenido Restringido</h3>
              <p className="text-gray-300 mb-4">Debes estar inscrito para ver este video</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                Inscribirse al Curso
              </button>
            </div>
          </div>
        )}

        {/* Indicador de completado */}
        {isCompleted && (
          <div className="absolute top-4 right-4">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Completado</span>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4 bg-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleMuteToggle}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
        <div
          ref={progressRef}
          className="w-full bg-gray-200 rounded-full h-2 cursor-pointer"
          onClick={handleProgressClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleProgressClick(e);
            }
          }}
          role="progressbar"
          tabIndex={0}
          aria-label="Barra de progreso del video"
        >
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{formatTime(videoDuration)}</span>
              </div>
              <div className="flex items-center">
                <Play className="w-4 h-4 mr-1" />
                <span>{isEnrolled ? 'Disponible' : 'Restringido'}</span>
              </div>
            </div>
            <div className="text-xs">
              {isEnrolled ? 'Haz clic para reproducir' : 'Inscríbete para acceder'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  duration: PropTypes.number,
  isEnrolled: PropTypes.bool,
  isCompleted: PropTypes.bool,
  onVideoComplete: PropTypes.func,
  className: PropTypes.string
};

export default VideoPlayer;
