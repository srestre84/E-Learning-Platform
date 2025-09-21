import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/shared/constants/roles';
import { User, GraduationCap, Shield, Crown } from 'lucide-react';

const UserStatus = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case ROLES.STUDENT:
        return <GraduationCap className="w-4 h-4" />;
      case ROLES.TEACHER:
        return <User className="w-4 h-4" />;
      case ROLES.ADMIN:
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.STUDENT:
        return 'text-blue-600 bg-blue-100';
      case ROLES.TEACHER:
        return 'text-purple-600 bg-purple-100';
      case ROLES.ADMIN:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case ROLES.STUDENT:
        return 'Estudiante';
      case ROLES.TEACHER:
        return 'Profesor';
      case ROLES.ADMIN:
        return 'Administrador';
      default:
        return 'Usuario';
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
        {getRoleIcon(user.role)}
        <span className="font-medium">{getRoleName(user.role)}</span>
      </div>
      <span className="text-gray-600">
        {user.userName || user.firstName || user.email}
      </span>
    </div>
  );
};

export default UserStatus;
