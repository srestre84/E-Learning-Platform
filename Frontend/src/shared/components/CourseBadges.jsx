import React from 'react';
import PropTypes from 'prop-types';
import { 
  getCourseStatusInfo, 
  getCourseTypeInfo, 
  getCourseLevelInfo,
  isCourseFree,
  COURSE_TYPES
} from '@/shared/constants/courseConstants';

const CourseBadges = ({ 
  course, 
  showStatus = true, 
  showType = true, 
  showLevel = false,
  showPrice = true,
  className = ""
}) => {
  if (!course) return null;

  // Determinar el estado basándose en isPublished
  const courseStatus = course.isPublished ? 'PUBLISHED' : 'DRAFT';
  const statusInfo = getCourseStatusInfo(courseStatus);
  const typeInfo = getCourseTypeInfo(course.courseType || (isCourseFree(course) ? COURSE_TYPES.FREE : COURSE_TYPES.PREMIUM));
  const levelInfo = getCourseLevelInfo(course.level || 'BEGINNER');

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Badge de Estado */}
      {showStatus && (
        <span 
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
          title={`Estado: ${statusInfo.label}`}
        >
          <span className="mr-1">{statusInfo.icon}</span>
          {statusInfo.label}
        </span>
      )}

      {/* Badge de Tipo */}
      {showType && (
        <span 
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}
          title={`Tipo: ${typeInfo.label}`}
        >
          <span className="mr-1">{typeInfo.icon}</span>
          {typeInfo.label}
        </span>
      )}

      {/* Badge de Nivel */}
      {showLevel && (
        <span 
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${levelInfo.color}`}
          title={`Nivel: ${levelInfo.label}`}
        >
          {levelInfo.label}
        </span>
      )}

      {/* Badge de Precio */}
      {showPrice && (
        <span 
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isCourseFree(course) 
              ? 'bg-green-100 text-green-800' 
              : 'bg-purple-100 text-purple-800'
          }`}
          title={isCourseFree(course) ? 'Precio: Gratis' : 'Precio: $' + String(course.price || 0)}
        >
          <span className="mr-1">{isCourseFree(course) ? '🆓' : '💎'}</span>
          {isCourseFree(course) ? 'Gratis' : `$${String(course.price || 0)}`}
        </span>
      )}
    </div>
  );
};

CourseBadges.propTypes = {
  course: PropTypes.shape({
    status: PropTypes.string,
    courseType: PropTypes.string,
    level: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
  showStatus: PropTypes.bool,
  showType: PropTypes.bool,
  showLevel: PropTypes.bool,
  showPrice: PropTypes.bool,
  className: PropTypes.string,
};

export default CourseBadges;
