import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Pencil, Save, X, User, Mail, Briefcase, BookOpen, GraduationCap, Link as LinkIcon, Twitter, Linkedin, Github } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/profileService';

const TeacherProfileEditor = () => {
  const { user, updateProfile } = useAuth();
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    specialty: '',
    website: '',
    socialMedia: {
      twitter: '',
      linkedin: '',
      github: ''
    },
    avatar: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Validar nombre
    if (!profileData.firstName?.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    } else if (profileData.firstName.trim().length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    } else if (profileData.firstName.trim().length > 50) {
      newErrors.firstName = 'El nombre no puede tener más de 50 caracteres';
    }
    
    // Validar apellido
    if (!profileData.lastName?.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    } else if (profileData.lastName.trim().length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    } else if (profileData.lastName.trim().length > 50) {
      newErrors.lastName = 'El apellido no puede tener más de 50 caracteres';
    }
    
    // Validar correo electrónico
    if (!profileData.email?.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido';
    } else if (profileData.email.length > 100) {
      newErrors.email = 'El correo electrónico no puede tener más de 100 caracteres';
    }
    
    // Validar biografía
    if (profileData.bio && profileData.bio.length > 1000) {
      newErrors.bio = 'La biografía no puede tener más de 1000 caracteres';
    }
    
    // Validar sitio web
    if (profileData.website && profileData.website.length > 500) {
      newErrors.website = 'La URL del sitio web no puede tener más de 500 caracteres';
    }
    
    // Validar URL de la imagen de perfil
    if (profileData.avatar && profileData.avatar.length > 500) {
      newErrors.avatar = 'La URL de la imagen no puede tener más de 500 caracteres';
    }
    
    // Validar redes sociales
    const socialMedia = profileData.socialMedia || {};
    if (socialMedia.twitter && socialMedia.twitter.length > 100) {
      newErrors['socialMedia.twitter'] = 'El usuario de Twitter no puede tener más de 100 caracteres';
    }
    if (socialMedia.linkedin && socialMedia.linkedin.length > 255) {
      newErrors['socialMedia.linkedin'] = 'El enlace de LinkedIn no puede tener más de 255 caracteres';
    }
    if (socialMedia.github && socialMedia.github.length > 100) {
      newErrors['socialMedia.github'] = 'El usuario de GitHub no puede tener más de 100 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      const dataToSend = {
        userName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        email: profileData.email.trim(),
        bio: profileData.bio.trim(),
        specialty: profileData.specialty.trim(),
        website: profileData.website.trim(),
        twitter: profileData.socialMedia.twitter.trim(),
        linkedin: profileData.socialMedia.linkedin.trim(),
        github: profileData.socialMedia.github.trim(),
        profileImageUrl: profileData.avatar.trim()
      };
      
      const response = await api.put('/users/profile', dataToSend);
      const updatedUser = response.data;
      
      // Actualizar los datos del usuario en el contexto de autenticación
      if (user) {
        updateProfile({
          ...user,
          name: `${updatedUser.userName} ${updatedUser.lastName}`.trim(),
          photoURL: updatedUser.profileImageUrl || user.photoURL
        });
      }
      
      // Actualizar los datos del perfil con la respuesta del servidor
      const updatedProfile = {
        ...profileData,
        firstName: updatedUser.userName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        bio: updatedUser.bio || '',
        specialty: updatedUser.specialty || '',
        website: updatedUser.website || '',
        socialMedia: {
          twitter: updatedUser.twitter || '',
          linkedin: updatedUser.linkedin || '',
          github: updatedUser.github || ''
        },
        avatar: updatedUser.profileImageUrl || ''
      };
      
      setProfileData(updatedProfile);
      setOriginalData(updatedProfile);
      
      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Manejar errores de validación del servidor
      if (error.response?.data?.errors) {
        const validationErrors = {};
        error.response.data.errors.forEach(err => {
          // Mapear campos de la API a los nombres de los campos del formulario
          const fieldMap = {
            'userName': 'firstName',
            'lastName': 'lastName',
            'email': 'email',
            'bio': 'bio',
            'specialty': 'specialty',
            'website': 'website',
            'twitter': 'socialMedia.twitter',
            'linkedin': 'socialMedia.linkedin',
            'github': 'socialMedia.github',
            'profileImageUrl': 'avatar'
          };
          
          const fieldName = fieldMap[err.field] || err.field;
          validationErrors[fieldName] = err.message;
        });
        
        setErrors(validationErrors);
        toast.error('Por favor, corrige los errores en el formulario');
      } else {
        toast.error(error.response?.data?.message || 'Error al actualizar el perfil');
      }
    }
  };

  const [originalData, setOriginalData] = useState(null);

  // Cargar los datos cuando el componente se monta
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        const userData = response.data;
        
        // Mapear los datos de la API al formato del estado
        const profileData = {
          firstName: userData.userName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          bio: userData.bio || '',
          specialty: userData.specialty || '',
          website: userData.website || '',
          socialMedia: {
            twitter: userData.twitter || '',
            linkedin: userData.linkedin || '',
            github: userData.github || ''
          },
          avatar: userData.profileImageUrl || ''
        };
        
        setProfileData(profileData);
        setOriginalData(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error(error.response?.data?.message || 'No se pudo cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [user]);

  const handleCancel = () => {
    // Restaurar los datos originales
    if (originalData) {
      setProfileData({...originalData});
    }
    setIsEditing(false);
    setErrors({});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
          <p className="text-gray-600 text-sm">
            Gestiona la información de tu perfil de docente
          </p>
        </div>
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        )}
      </div>

      <Card className="overflow-hidden shadow-sm border border-gray-200">
        <CardHeader className="bg-gray-50 border-b p-4">
          <CardTitle className="text-base font-semibold text-gray-800">
            Información Personal
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Actualiza tu información personal y de contacto.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
              <div className="relative group">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-gray-100">
                  <AvatarImage src={profileData.avatar} alt={`${profileData.firstName} ${profileData.lastName}`} />
                  <AvatarFallback className="bg-gray-100 text-gray-600">
                    {profileData.firstName?.[0]}{profileData.lastName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label 
                      className="p-2 bg-white bg-opacity-80 rounded-full cursor-pointer"
                      title="Cambiar foto"
                    >
                      <Pencil className="h-4 w-4 text-gray-800" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setProfileData(prev => ({
                                ...prev,
                                avatar: reader.result
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-semibold text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h3>
                <p className="text-gray-600 text-sm">{profileData.specialty || 'Sin especialidad'}</p>
                <div className="flex justify-center sm:justify-start gap-3 mt-3">
                  <a 
                    href={`mailto:${profileData.email}`} 
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Enviar correo"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                  {profileData.socialMedia?.twitter && (
                    <a 
                      href={`https://twitter.com/${profileData.socialMedia.twitter.replace('@', '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-500"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  )}
                  {profileData.socialMedia?.linkedin && (
                    <a 
                      href={profileData.socialMedia.linkedin.startsWith('http') 
                        ? profileData.socialMedia.linkedin 
                        : `https://${profileData.socialMedia.linkedin}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="mb-4">
                <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </Label>
                {isEditing ? (
                  <div>
                    <div className="relative">
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName || ''}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500`}
                        placeholder="Ingresa tu nombre"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                    {profileData.firstName || 'No especificado'}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellidos
                </Label>
                {isEditing ? (
                  <div>
                    <div className="relative">
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName || ''}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500`}
                        placeholder="Ingresa tus apellidos"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                    {profileData.lastName || 'No especificado'}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </Label>
                {isEditing ? (
                  <div>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email || ''}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500`}
                        placeholder="ejemplo@correo.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                    {profileData.email || 'No especificado'}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <Label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidad
                </Label>
                {isEditing ? (
                  <div>
                    <div className="relative">
                      <Input
                        id="specialty"
                        name="specialty"
                        value={profileData.specialty || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        placeholder="Ej: Desarrollo Web, Diseño UX/UI, etc."
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                    {profileData.specialty || 'No especificado'}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 mb-4">
                <Label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Biografía
                </Label>
                {isEditing ? (
                  <div>
                    <div className="relative">
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={profileData.bio || ''}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
                        placeholder="Cuéntanos sobre ti y tu experiencia como docente..."
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-900 whitespace-pre-line py-2 px-3 bg-gray-50 rounded-md border border-gray-200 min-h-[100px]">
                    {profileData.bio || 'No hay biografía disponible'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg font-semibold">
            Información Profesional
          </CardTitle>
          <CardDescription>
            Detalles sobre tu experiencia y especialización.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                Sitio Web Personal
              </Label>
              {isEditing ? (
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={profileData.website}
                  onChange={handleChange}
                  placeholder="https://tusitio.com"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">
                  {profileData.website ? (
                    <a 
                      href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline"
                    >
                      {profileData.website}
                    </a>
                  ) : (
                    <span className="text-gray-500">No especificado</span>
                  )}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Redes Sociales
              </Label>
              <div className="mt-1 space-y-2">
                {isEditing ? (
                  <>
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        @
                      </span>
                      <Input
                        name="socialMedia.twitter"
                        value={profileData.socialMedia?.twitter || ''}
                        onChange={handleChange}
                        placeholder="usuario"
                        className="flex-1 rounded-l-none"
                        prefix="@"
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        in/
                      </span>
                      <Input
                        name="socialMedia.linkedin"
                        value={profileData.socialMedia?.linkedin || ''}
                        onChange={handleChange}
                        placeholder="usuario"
                        className="flex-1 rounded-l-none"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex space-x-4">
                    {profileData.socialMedia?.twitter && (
                      <a 
                        href={`https://twitter.com/${profileData.socialMedia.twitter.replace('@', '')}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-500"
                        title="Twitter"
                      >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    )}
                    {profileData.socialMedia?.linkedin && (
                      <a 
                        href={profileData.socialMedia.linkedin.startsWith('http') 
                          ? profileData.socialMedia.linkedin 
                          : `https://linkedin.com/in/${profileData.socialMedia.linkedin}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                        title="LinkedIn"
                      >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                    {!profileData.socialMedia?.twitter && !profileData.socialMedia?.linkedin && (
                      <p className="text-sm text-gray-500">No hay redes sociales agregadas</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sección de estadísticas (solo visualización) */}
          {!isEditing && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">12</div>
                  <div className="text-sm text-gray-500">Cursos</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">1.2K</div>
                  <div className="text-sm text-gray-500">Estudiantes</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">4.8</div>
                  <div className="text-sm text-gray-500">Valoración</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">98%</div>
                  <div className="text-sm text-gray-500">Completación</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex justify-end space-x-3 mt-6">
          <Button 
            variant="outline" 
            onClick={handleCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-red-600 hover:bg-red-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeacherProfileEditor;
