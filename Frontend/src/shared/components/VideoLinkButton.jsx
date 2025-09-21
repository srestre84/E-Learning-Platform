import React from 'react';
import { ExternalLink, Play, Eye } from 'lucide-react';
import PropTypes from 'prop-types';

const VideoLinkButton = ({ 
  videoUrl, 
  title, 
  variant = 'default',
  size = 'sm',
  className = "" 
}) => {
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const isYouTube = getYouTubeVideoId(videoUrl);
  const isVimeo = videoUrl.includes('vimeo.com');
  const isOtherVideo = !isYouTube && !isVimeo && (videoUrl.includes('video') || videoUrl.includes('.mp4') || videoUrl.includes('.webm'));

  const handleOpenVideo = () => {
    if (isYouTube) {
      // Abrir YouTube en nueva pestaña
      window.open(videoUrl, '_blank', 'noopener,noreferrer');
    } else if (isVimeo) {
      // Abrir Vimeo en nueva pestaña
      window.open(videoUrl, '_blank', 'noopener,noreferrer');
    } else if (isOtherVideo) {
      // Para videos directos, abrir en nueva pestaña
      window.open(videoUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Para otros tipos de enlaces
      window.open(videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getButtonText = () => {
    if (isYouTube) return 'Ver en YouTube';
    if (isVimeo) return 'Ver en Vimeo';
    if (isOtherVideo) return 'Ver Video';
    return 'Abrir Enlace';
  };

  const getIcon = () => {
    if (variant === 'preview') return <Eye className="w-4 h-4" />;
    return <ExternalLink className="w-4 h-4" />;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'px-2 py-1 text-xs';
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700';
      case 'outline':
        return 'border border-gray-300 text-gray-700 hover:bg-gray-50';
      case 'preview':
        return 'bg-green-600 text-white hover:bg-green-700';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  if (!videoUrl) {
    return (
      <span className={`inline-flex items-center ${getSizeClasses()} text-gray-400 cursor-not-allowed ${className}`}>
        <Play className="w-4 h-4 mr-1" />
        Sin enlace
      </span>
    );
  }

  return (
    <button
      onClick={handleOpenVideo}
      className={`
        inline-flex items-center justify-center
        ${getSizeClasses()}
        ${getVariantClasses()}
        rounded-md font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title={`${getButtonText()}: ${title || 'Video'}`}
    >
      {getIcon()}
      <span className="ml-1">{getButtonText()}</span>
    </button>
  );
};

VideoLinkButton.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'outline', 'preview', 'danger']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  className: PropTypes.string
};

export default VideoLinkButton;
